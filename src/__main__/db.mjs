import EventEmitter from "event-lite";
import {
  createStore,
  delMany,
  get,
  getMany,
  set,
  setMany,
  values,
} from "idb-keyval";

import { isPersistent } from "@/__main__/constants.mjs";
import createQueue from "@/util/create-queue.mjs";
import { devDebug, devError, IS_DEV, IS_NODE_HEADLESS } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import { symbolMap } from "@/util/symbol-name.mjs";
import initLZ4, { compress, decompress } from "@/vendor/lz4_wasm.mjs";

const store = !IS_NODE_HEADLESS ? createStore("blitz", "blitz-app") : null;

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");
const wasmInit = IS_NODE_HEADLESS
  ? Promise.resolve(false)
  : // Careful: this import string must be static, so that esbuild can
    // automatically resolve the path as an entry point.
    import("@/vendor/lz4_wasm_bg.wasm")
      .then(({ default: wasmbin }) => initLZ4(wasmbin))
      .then(() => {
        // Now usable: compress, decompress
        return true;
      })
      .catch((error) => {
        devError(`Failed to load WASM module: ${error}`);
        return false;
      });

const writeQueue = createQueue();
let debounceExpiryTimer;

export function wrapDBMethod(fn, returnValue) {
  if (IS_NODE_HEADLESS && !fn.override) {
    return () => Promise.resolve(returnValue);
  }
  return function wrappedMethod() {
    return fn(...arguments).catch((error) => {
      devError("DB FAILED", error);
      return returnValue;
    });
  };
}

const DID_INIT = "DID_INIT";
const EXPIRY_KEY = "$$expiry";

// This is a lower level module that you shouldn't use directly,
// use writeState instead.
const db = {
  // A good heuristic for this is how long renders are expected to take. Writes
  // should occur after renders and not block rendering.
  // This is also the duration of time during which calls can be batched together.
  WRITE_DEBOUNCE_TIME: 250,

  // max 7 days until eviction by default
  // 3 hrs for devs :^)
  RECORD_LIFETIME: IS_DEV ? 1000 * 60 * 60 * 3 : 1000 * 60 * 60 * 24 * 7,
  EXPIRY_KEY,
  DID_INIT,
  excludeFromExpiry: {
    [EXPIRY_KEY]: true,
    settings: true,
  },

  _init: init,
  _get: wrapDBMethod(get),
  _getMany: wrapDBMethod(getMany, []),
  _set: wrapDBMethod(set),
  _setMany: wrapDBMethod(setMany),
  _delMany: wrapDBMethod(delMany),
  _values: wrapDBMethod(values),

  _events: new EventEmitter(),
  _isInitializing: false,
  _getManyMap: {},
  _setManyQueue: [],
  _expiryRecord: null,
  _deserializeValue: deserializeValue,
  _serializeValue: serializeValue,

  // This is a semaphore that only allows one of each operation to occur at once.
  _getManyPromise: null,
  _setManyPromise: null,

  async find(ids) {
    const start = Date.now();
    await init();
    if (!Array.isArray(ids)) ids = [ids];
    // extend expiry time of read records
    for (const id of ids) {
      if (!db.excludeFromExpiry.hasOwnProperty(id)) {
        const currentValue = db._expiryRecord[id];
        const expiryTime = Date.now() + db.RECORD_LIFETIME;
        if (!currentValue || currentValue < expiryTime) {
          db._expiryRecord[id] = expiryTime;
        }
      }
      db._getManyMap[id] = null;
    }
    writeExpiry();
    const result = await processGetMany(start);
    return ids.map((id) => {
      let value = result[id];
      if (value instanceof Uint8Array) {
        value = JSON.parse(decoder.decode(decompress(value)));
      }
      const sanitizedValue = deserializeValue(value);
      return sanitizedValue;
    });
  },

  async upsert(entries) {
    const start = Date.now();
    const hasCompression = await init();
    if (!Array.isArray(entries)) entries = [entries];
    if (!Array.isArray(entries[0])) entries[0] = [arguments[0], arguments[1]];

    // O(n^2) time complexity I know, but real world cases it won't matter.
    // There are bigger problems if you have to write a ton of data to disk at once.
    for (const [id, value] of entries) {
      if (!db.excludeFromExpiry.hasOwnProperty(id)) {
        let expiryTime = Date.now() + db.RECORD_LIFETIME;
        if (
          value &&
          typeof value === "object" &&
          typeof value[isPersistent] === "number"
        ) {
          expiryTime = value[isPersistent];
        }
        db._expiryRecord[id] = expiryTime;
      }

      const sanitizedValue = serializeValue(value);
      const finalValue = hasCompression
        ? compress(encoder.encode(JSON.stringify(sanitizedValue)))
        : sanitizedValue;
      const index = db._setManyQueue.findIndex(([entryId]) => entryId === id);
      if (~index) {
        db._setManyQueue[index][1] = finalValue;
      } else {
        db._setManyQueue.push([id, finalValue]);
      }
    }
    // Update/extend expiry of written records.
    writeExpiry();
    return processSetMany(start);
  },

  async getSize() {
    const start = Date.now();
    const values = await db._values(store);
    let cSize = 0;
    let uSize = 0;
    for (const value of values) {
      if (value instanceof Uint8Array) cSize += value.byteLength;
      else uSize += JSON.stringify(value).length;
    }
    devDebug(`db get size (${Date.now() - start} ms)`);
    return (
      `${Math.ceil(cSize / 1024)} KB compressed, ` +
      `${Math.ceil(uSize / 1024)} KB uncompressed`
    );
  },

  async deleteMany(ids) {
    if (!Array.isArray(ids)) ids = [ids];
    await db._delMany(ids, store);
  },
};

async function processGetMany(start) {
  if (!db._getManyPromise) {
    db._getManyPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const ids = Object.keys(db._getManyMap);
        db._getManyPromise = null;
        db._getManyMap = {};
        db._getMany(ids, store).then((result) => {
          resolve(
            result.reduce((h, v, i) => {
              const id = ids[i];
              h[id] = v;
              return h;
            }, {})
          );
          devDebug(`db get (${Date.now() - start} ms)`, ids);
        }, reject);
      }, 0);
    });
  }
  const result = await db._getManyPromise;
  return result;
}

async function processSetMany(start) {
  if (!db._setManyPromise) {
    db._setManyPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const entries = db._setManyQueue;
        db._setManyPromise = null;
        db._setManyQueue = [];
        db._setMany(entries, store).then((result) => {
          resolve(result);
          devDebug(
            `db set (${Date.now() - start - db.WRITE_DEBOUNCE_TIME} ms)`,
            entries.map(([id]) => id)
          );
        }, reject);
      }, db.WRITE_DEBOUNCE_TIME);
    });
  }
  const result = await db._setManyPromise;
  return result;
}

function writeExpiry() {
  clearTimeout(debounceExpiryTimer);
  debounceExpiryTimer = setTimeout(() => {
    writeQueue.push(() => {
      const start = Date.now();
      db._set(db.EXPIRY_KEY, db._expiryRecord, store);
      devDebug(`db expiry (${Date.now() - start} ms)`, db._expiryRecord);
    });
  }, db.WRITE_DEBOUNCE_TIME);
}

async function init() {
  const hasCompression = await wasmInit;
  if (db._expiryRecord) return hasCompression;
  if (db._isInitializing) {
    return new Promise((resolve) => {
      db._events.once(db.DID_INIT, () => {
        resolve(hasCompression);
      });
    });
  }
  db._isInitializing = true;
  let expiryRecord = await db._get(db.EXPIRY_KEY, store);
  if (!expiryRecord) {
    expiryRecord = {};
    await db._set(db.EXPIRY_KEY, expiryRecord, store);
  }
  await purgeRecords(expiryRecord);

  db._expiryRecord = expiryRecord;
  db._isInitializing = false;
  db._events.emit(db.DID_INIT);
  return hasCompression;
}

async function purgeRecords(expiryRecord) {
  const expiredIds = [];
  const now = Date.now();
  for (const id in expiryRecord) {
    const time = expiryRecord[id];
    if (now > time) {
      expiredIds.push(id);
      delete expiryRecord[id];
    }
  }
  const start = Date.now();
  await db.deleteMany(expiredIds);
  devDebug(`db purge (${Date.now() - start} ms)`, expiredIds);
}

function deserializeValue(value) {
  if (!(value && typeof value === "object")) {
    if (typeof value === "string" && symbolMap.hasOwnProperty(value)) {
      return symbolMap[value];
    }
    return value;
  }

  if (value.type === "Date") return new Date(value.value);

  for (const k in value) {
    value[k] = deserializeValue(value[k]);
  }
  return value;
}

function serializeValue(value) {
  if (!(value && typeof value === "object")) {
    if (
      typeof value === "symbol" &&
      symbolMap.hasOwnProperty(value.description)
    ) {
      return value.description;
    }
    return value;
  }

  if (value instanceof Date) return { type: "Date", value };

  const clone = Array.isArray(value) ? [] : {};
  for (const k in value) {
    clone[k] = serializeValue(value[k]);
  }
  return clone;
}

// TESTING
globals.__BLITZ_DEV__.db = db;

// Attempt to purge every day.
function purge() {
  setTimeout(async () => {
    await purgeRecords(db._expiryRecord);
    purge();
  }, 1000 * 60 * 60 * 24);
}
if (!IS_NODE_HEADLESS) {
  purge();
}

export default db;
