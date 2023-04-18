import { proxy, subscribe } from "valtio";
import { subscribeKey } from "valtio/utils";

import {
  isPersistent,
  isPopulatedFromDB,
  isVolatile,
  PATH_DELIMITER,
} from "@/__main__/constants.mjs";
import db from "@/__main__/db.mjs";
import initialState from "@/__main__/initial-state.mjs";
import checkSettings from "@/util/check-settings.mjs";
import deepRef from "@/util/deep-ref.mjs";
import { devDebug, devError, devWarn, IS_DEV } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import isObject from "@/util/is-object.mjs";
import writeKeyPath, { CONFIG, keyPaths } from "@/util/state-cleanup.mjs";

// Used primarily to replace db with a mock for unit testing.
export const dbRef = { db };

// How this module works is there are two objects exported:
//
// - readState
// - writeState (internal, do not use directly)
//
// The names should be self explanatory. One should use `readState` for reading,
// and `writeState` for writing. DO NOT WRITE TO READSTATE, only use writeState.
// There are a few reasons:
// - writeState is completely safe to write on any arbitrary key.
// - writeState keeps track of nesting and persists data at that location.

// This uses valtio proxy for use with the `useSnapshot` hook.
export const readState = proxy(initialState);

// This implementation is short but intricate. This proxy keeps track of
// access to its properties to build a path, then intercepts when it is written.
const readStack = [];
const writerObj = {};
const writeHandler = {
  get(target, key, receiver) {
    readStack.push(key);
    return receiver;
  },
  set: writeProperty,
  deleteProperty: writeProperty,
};

function writeProperty(target, key, value /*, receiver*/) {
  const keys = readStack.slice();
  readStack.splice(0, readStack.length);
  const lastKey = key;
  let curr = readState;
  for (const key of keys) {
    if (!curr.hasOwnProperty(key)) curr[key] = {};
    curr = curr[key];
  }

  const shouldPersist =
    value &&
    value[isPersistent] &&
    !(value && (value[isVolatile] || value[isPopulatedFromDB])) &&
    !(value instanceof Error);

  const keyPath = [...keys, lastKey];

  // Only write the keyPath if it was persistent or a deletion.
  if (value === undefined || value?.[isPersistent]) {
    writeKeyPath(keyPath, value === undefined);
  }

  // Commit the write to readState.
  if (value !== undefined) {
    // https://github.com/pmndrs/valtio#holding-objects-in-state-without-tracking-them
    curr[lastKey] = isObject(value) && shouldPersist ? deepRef(value) : value;
  } else {
    Reflect.deleteProperty(curr, lastKey);
  }

  const isValuePrimitive = value === null || typeof value !== "object";

  const shouldShowWarning =
    value &&
    !value[isPopulatedFromDB] &&
    !value[isPersistent] &&
    !value[isVolatile] &&
    !(value instanceof Error) &&
    !isValuePrimitive;

  if (shouldShowWarning) {
    devWarn(
      `WARNING: the path ${keyPath.join(".")} was written without ` +
        `persisting. Please use the "isPersistent" symbol, or use "isVolatile" ` +
        `to get rid of this warning.`
    );
  }

  // This is only relevant when writing once.
  if (value?.[isPopulatedFromDB]) {
    delete value[isPopulatedFromDB];
  }

  if (shouldPersist) {
    addRecentlyPersistedPath(keyPath);
    (async () => {
      const id = keyPath.join(PATH_DELIMITER);
      await dbRef.db.upsert([[id, value]]);
    })().catch((error) => {
      devError("FAILED TO WRITE", error);
    });
  } else {
    // It should check regardless of whether or not the current keyPath is
    // volatile, to prevent volatile objects from overwriting persistent objects.
    checkRecentlyPersistedPath(keyPath);
  }

  return true;
}

const PATH_EXPLANATION = `
We want to guarantee that the paths we write to are conflict-free. Consider this data structure:

{
  a: {
    b: {
      c: 1,
      d: 2,
      [isPersistent]: true,
    },
  },
}

In this example, the object "b" is the only object that is persisted. What could go wrong if we write to an invalid path?

- If object "a" is written, then we have duplicated the data that already exists in object "b".
- If key "c" or "d" is written to directly, then we have mutated data from object "b" without persisting.

Therefore, the only valid path to write to is "a.b".
`;
export const recentlyPersistedPaths = [];
export const MAX_RECENT_PATHS = 50;
function checkRecentlyPersistedPath(keyPath) {
  let conflictingPath;
  for (
    let i = Math.max(0, recentlyPersistedPaths.length - MAX_RECENT_PATHS);
    i < recentlyPersistedPaths.length;
    i++
  ) {
    const p = recentlyPersistedPaths[i];
    if (!p) continue;

    const hasShallower =
      p.length < keyPath.length && p.every((part, i) => keyPath[i] === part);
    const hasDeeper =
      p.length > keyPath.length && keyPath.every((part, i) => p[i] === part);

    if (hasShallower || hasDeeper) conflictingPath = p;
  }
  if (conflictingPath) {
    const isShallow = conflictingPath.length < keyPath.length;
    throw new Error(
      isShallow
        ? `The path "${keyPath.join(
            PATH_DELIMITER
          )}" was written to, but there was a shallower path ` +
          `"${conflictingPath.join(
            PATH_DELIMITER
          )}" which was written to earlier. Refusing to write ` +
          `inside a nested path.\n${PATH_EXPLANATION}`
        : `The path "${keyPath.join(
            PATH_DELIMITER
          )}" was written to, but there was a deeper path ` +
          `"${conflictingPath.join(
            PATH_DELIMITER
          )}" which was written to earlier. Refusing to write ` +
          `a path that is shallower.\n${PATH_EXPLANATION}`
    );
  }
}

export function addRecentlyPersistedPath(keyPath) {
  checkRecentlyPersistedPath(keyPath);
  recentlyPersistedPaths.push(keyPath);
  if (recentlyPersistedPaths.length > MAX_RECENT_PATHS) {
    delete recentlyPersistedPaths[
      recentlyPersistedPaths.length - MAX_RECENT_PATHS - 1
    ];
  }
}

const writeState = new Proxy(writerObj, writeHandler);

export const __ONLY_WRITE_STATE_FROM_ACTIONS = writeState;

// Configure state cleanup.
CONFIG.STATE = readState;

// DEBUG
globals.__BLITZ_DEV__.readState = readState;
globals.__BLITZ_DEV__.writeState = writeState;
if (IS_DEV) {
  subscribeKey(readState, "settings", checkSettings);
  subscribe(readState, function (changes) {
    for (const change of changes) {
      const [op, path] = change;
      if (op !== "set") continue;
      const keyPath = path.join(PATH_DELIMITER);
      let hasMatch = false;
      for (const k of keyPaths) {
        if (k.startsWith(keyPath)) {
          hasMatch = true;
          break;
        }
      }
      if (!hasMatch) {
        devDebug(`volatile state "${path.join(".")}" was written`);
      }
    }
  });
}

// TESTING
export { isPersistent, isPopulatedFromDB, isVolatile };
