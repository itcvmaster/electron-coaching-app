import EventEmitter from "event-lite";

import { PATH_DELIMITER } from "@/__main__/constants.mjs";
import { digPath } from "@/__main__/get-data.mjs";
import { devDebug } from "@/util/dev.mjs";

export const MAX_LENGTH = 120;

export const CONFIG = {
  // The lower bound for the max amount of paths to keep is exactly how many
  // paths were written to from any route's fetchData method, plus any actions
  // that write paths.
  //
  // It is potentially unsafe to write too many different keys on the same
  // route, because then data can be cleaned up without calling fetchData again
  // to ensure that keys still exist.
  MAX_LENGTH,

  // This needs to be set externally.
  STATE: null,
};

export const emitter = new EventEmitter();
export const EVENT_ADD_KEY = "EVENT_ADD_KEY";

export const keyPaths = new Set();

export default function writeKeyPath(keyPath, isDelete) {
  const key = keyPath.join(PATH_DELIMITER);

  //this handles the case of manual deletion from writeState
  if (isDelete) {
    keyPaths.delete(key);
    return;
  }

  emitter.emit(EVENT_ADD_KEY, key);

  if (keyPaths.has(key)) {
    keyPaths.delete(key);
    keyPaths.add(key);
    return;
  }

  keyPaths.add(key);

  if (keyPaths.size > CONFIG.MAX_LENGTH) {
    const keys = [...keyPaths];
    const firstKey = keys[0];

    keyPaths.delete(firstKey);

    const [curr, lastKey] = digPath(
      firstKey.split(PATH_DELIMITER),
      CONFIG.STATE
    );

    // This is potentially unsafe.
    if (curr) delete curr[lastKey];

    devDebug(`cleaned up stale key path at ${firstKey}`);
  }
}
