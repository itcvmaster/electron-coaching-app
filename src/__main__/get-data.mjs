import {
  // this is fine because this is an action.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  addRecentlyPersistedPath,
  readState,
} from "@/__main__/app-state.mjs";
import {
  isInitial,
  isPersistent,
  isPopulatedFromDB,
  isVolatile,
  PATH_DELIMITER,
} from "@/__main__/constants.mjs";
import {
  __INTERNAL_VALIDATION_SYMBOL as isValidated,
  isExempt,
  refs as dataModelRefs,
  withAccessValidation,
} from "@/__main__/data-model.mjs";
import db from "@/__main__/db.mjs";
import deepEqual from "@/util/deep-equal.mjs";
import deepRef from "@/util/deep-ref.mjs";
import { devDebug, devLog } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import isObject from "@/util/is-object.mjs";
import optionalMerge from "@/util/optional-merge.mjs";
import writeKeyPath from "@/util/state-cleanup.mjs";

const dbRef = { db };

// This is meant to be an entry point for hooking/testing.
export const fetchRef = {};

// This is giga hacky but is needed because globals.fetch may not be ready yet.
queueMicrotask(() => {
  fetchRef.fetch = globals.fetch;
});

async function fetchJSON(fetch, url, { httpMethod, body, headers }) {
  const req = await fetch(url, { method: httpMethod, body, headers });
  if (!req.ok) {
    const text = await req.text();
    const error = new Error(`SERVER ERROR ${text}`);
    error.statusCode = req.statusCode;
    throw error;
  }
  const json = await req.json();

  // GraphQL is insane
  // Let's figure out if we should legit throw an error or not.
  const keys = Object.keys(json.data ?? {});
  const hasData = json.data?.[keys[0]];

  for (const jsonError of json.errors || []) {
    const error = new Error(`GRAPHQL ERROR ${jsonError?.message} (${url})`);
    error.statusCode = jsonError?.details?.http_code;
    error.errorCode = jsonError?.code;
    if (!hasData) throw error;
    else
      devLog(
        "This error is safe to ignore, and only indicates a partial error while retrieving data.",
        error
      );
  }

  return json;
}

export function digPath(path, state) {
  let curr = state;
  const lastKey = path[path.length - 1];
  for (let i = 0; i < path.length - 1; i++) {
    curr = curr[path[i]];
    if (curr === undefined) break;
  }
  return [curr, lastKey];
}

async function populatePathFromDB(path, initialValue, state) {
  const [record] = await dbRef.db.find([path.join(PATH_DELIMITER)]);
  if (!record) return null;
  let curr = state;
  const keys = path.slice();
  const lastKey = keys.pop();
  for (const key of keys) {
    // if using readStack, it requires additional safety
    // if (!curr.hasOwnProperty(key)) curr[key] = {};
    curr = curr[key];
  }
  let value = record;

  if (isObject(value)) {
    // Assign keys from the initial value to what we got from the DB.
    if (initialValue && isObject(initialValue)) {
      optionalMerge(value, initialValue);
    }
    // https://github.com/pmndrs/valtio#holding-objects-in-state-without-tracking-them
    value = deepRef(value);
    value[isPopulatedFromDB] = true;
  }

  curr[lastKey] = value;

  return value;
}

// This is just a function to hydrate state from DB.
export async function readData(writeStatePath) {
  let currentValue = readFromMemory(writeStatePath);
  if (currentValue === undefined || currentValue?.[isInitial]) {
    // if currentValue[isInitial], currentValue is initialState value.
    // so the following call is merging initialState with DB.
    currentValue = await populatePathFromDB(
      writeStatePath,
      currentValue,
      writeStatePath.root || writeState
    );
    if (currentValue !== undefined) {
      const [r, lKey] = digPath(
        writeStatePath,
        writeStatePath.root || readState
      );
      r[lKey] = currentValue;
    }
  }
  if (currentValue !== undefined && !writeStatePath.root) {
    addRecentlyPersistedPath(writeStatePath);
    writeKeyPath(writeStatePath);
  }
  return currentValue;
}

const recentURLs = new Set();

function shouldReturnCachedValue(
  currentValue,
  url,
  { shouldFetchIfPathExists }
) {
  const result = Boolean(
    currentValue &&
      !currentValue[isInitial] &&
      (!shouldFetchIfPathExists || recentURLs.has(url))
  );
  return result;
}

// Extracting this into a separate function makes the closure containing the
// setTimeout function retain less memory.
function trackURL(url, networkBackOffTime) {
  recentURLs.add(url);
  setTimeout(() => {
    recentURLs.delete(url);
  }, networkBackOffTime);
}

function readFromMemory(writeStatePath) {
  if (!writeStatePath) return undefined;
  const [r, lKey] = digPath(writeStatePath, writeStatePath.root || readState);
  return r && r[lKey];
}

// TODO: prevent concurrent writes to the same path, but only if they happened
// not in the same tick.
// const inFlightPaths = [];

// This is a wrapper to handle the most common use case of:
// 1) making a http GET req
// 3) validating the response
// 4) write the data to the state
async function getData(dataSource, validate, writeStatePath, options = {}) {
  if (!options.hasOwnProperty("shouldFetchIfPathExists"))
    options.shouldFetchIfPathExists = false;

  if (!options.hasOwnProperty("networkBackOffTime"))
    options.networkBackOffTime = 5 * 60 * 1000; // 5 min

  if (!options.hasOwnProperty("fetch")) options.fetch = fetchRef.fetch;

  if (typeof validate !== "function")
    throw new Error("Validate function required!");

  // Run the validate function once so we get the model data.
  validate({ [isExempt]: true });

  const validateModel = dataModelRefs.lastValidatedModel;

  let currentValue;
  if (writeStatePath) {
    for (const part of writeStatePath) {
      if (/\$/.test(part)) {
        throw new Error(
          `Illegal character "${PATH_DELIMITER}" in path ${writeStatePath}`
        );
      }
    }

    if (!writeStatePath.root) {
      addRecentlyPersistedPath(writeStatePath);
      writeKeyPath(writeStatePath);
    }

    // Check if we actually need to fetch.
    currentValue = readFromMemory(writeStatePath);
    if (shouldReturnCachedValue(currentValue, dataSource, options)) {
      return withAccessValidation(currentValue, validateModel);
    }

    // Second pass: check the DB.
    if (!currentValue)
      currentValue = await populatePathFromDB(
        writeStatePath,
        null,
        writeStatePath.root || writeState
      );
    if (shouldReturnCachedValue(currentValue, dataSource, options)) {
      return withAccessValidation(currentValue, validateModel);
    }
  }

  // When a network attempt is about to be attempted, we care about tracking
  // if it's recent or not so we can avoid frequent recurring requests.
  trackURL(dataSource, options.networkBackOffTime);

  let json, error;
  try {
    switch (typeof dataSource) {
      case "object": {
        json =
          typeof dataSource.then === "function" ? await dataSource : dataSource;
        break;
      }
      case "function": {
        json = await dataSource();
        break;
      }
      case "string": {
        json = await fetchJSON(options.fetch, dataSource, options);
        break;
      }
      default:
        throw new TypeError(
          `dataSource may only be a url, Promise, object, or function.`
        );
    }
  } catch (e) {
    error = e;
  }

  if (json instanceof Error) error = json;

  // Current value may have changed during this time,
  // let's refresh it from memory.
  currentValue = readFromMemory(writeStatePath);

  if (error) {
    // Should qualify if there is not anything cached.
    if (!currentValue) {
      const [w, lastKey] = digPath(
        writeStatePath,
        writeStatePath.root || writeState
      );
      w[lastKey] = error;
    }
    throw error;
  }

  const validationResult = validate(json);

  if (!validationResult || typeof validationResult !== "object")
    throw new Error("Validate function failed!");

  if (!validationResult[isValidated]) {
    devDebug("validation failed", validationResult);
    const error = new Error(
      "A validation function needs to be passed here. See `data-model.mjs`."
    );
    error.data = validationResult;
    throw error;
  }

  if (!validationResult[isVolatile]) {
    validationResult[isPersistent] = options.expiryTime || true;
  }

  // Optimization: if the cached value is deep equal to what we got from
  // network request, don't need to write anything and force re-render.
  if (writeStatePath && !deepEqual(currentValue, validationResult)) {
    const [w, lastKey] = digPath(
      writeStatePath,
      writeStatePath.root || writeState
    );

    if (options.mergeFn && currentValue) {
      const mergeResult = options.mergeFn(currentValue, validationResult);
      if (!mergeResult[isVolatile]) {
        mergeResult[isPersistent] = options.expiryTime || true;
      }
      w[lastKey] = mergeResult;
    } else {
      w[lastKey] = validationResult;
    }
  }

  return withAccessValidation(validationResult, validateModel);
}

// Wrap getData to POST and default to shouldFetchIfPathExists = true
export function postData(request, validate, writeStatePath, options = {}) {
  // To return test data set the url param as before
  if (typeof request === "string")
    throw new Error("Request param must be an object of shape { url, body }.");

  if (!options.hasOwnProperty("httpMethod")) options.httpMethod = "POST";

  if (!options.hasOwnProperty("shouldFetchIfPathExists"))
    options.shouldFetchIfPathExists = true;

  if (!options.hasOwnProperty("networkBackOffTime"))
    options.networkBackOffTime = 0;

  if (!options.hasOwnProperty("headers")) options.headers = {};
  if (!options.headers.hasOwnProperty("content-type"))
    options.headers["content-type"] = "application/json";

  const { url, body } = request;
  options.body = typeof body === "object" ? JSON.stringify(body) : body;

  return getData(url, validate, writeStatePath, options);
}

export default getData;
export { dbRef, isPopulatedFromDB, isValidated };
