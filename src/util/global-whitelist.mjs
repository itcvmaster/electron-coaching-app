import hookFetch from "@/util/hook-fetch.mjs";

// Purpose: whitelisting access to window, so that we can prevent using
// global variables in app.

const properties = [
  // Injected from blitz-core.
  "__BLITZ__",

  // TEMP USAGE FOR STANDALONE ROOT
  "__BLITZ_MESSAGE__",

  "document",
  "navigator",
  "location",
  "addEventListener",
  "removeEventListener",
  "requestAnimationFrame",
  "open",
  "history",
  "fetch",
  "devicePixelRatio",
];

const __BLITZ_DEV__ = {};

/* eslint-disable no-restricted-properties */
const globals = {
  __BLITZ_DEV__,
  get scrollX() {
    return window.scrollX;
  },
  get scrollY() {
    return window.scrollY;
  },
};

for (const key of properties) {
  Object.defineProperty(globals, key, {
    enumerable: true,
    get() {
      let value = globalThis[key];
      if (key === "fetch") {
        return function () {
          hookFetch(...arguments);
          return value.apply(globalThis, arguments);
        };
      }
      if (typeof value === "function") {
        value = value.bind(globalThis);
      }
      return value;
    },
  });
}
/* eslint-enable no-restricted-properties */

export default globals;
