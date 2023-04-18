import { JS_FILE_EXTENSION } from "@/app/constants.mjs";
import { hasMarkup } from "@/util/constants.mjs";
import { devError, devLog, IS_DEV /*IS_NODE_HEADLESS*/ } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import { camelCaseToKebabCase } from "@/util/helpers.mjs";
import importBasePath from "@/util/import-base-path.mjs";
import makeStrictKeysObject from "@/util/strict-keys-object.mjs";

// Feature flags actually do not have to be enumerated, because they are
// dynamically imported.
const featureDefaults = {
  eventReplay: IS_DEV && !hasMarkup,
  auth: true,
  dummy: IS_DEV, // For testing only!
  arena: true,

  // Big performance hit for enabling this right now due to synchronous script init
  // Enable this later.
  analytics: false, // !IS_DEV && !IS_NODE_HEADLESS,

  // Special note for detection here: we can trivially detect if it's the
  // production website by the domain, blitz.cn. What's more interesting is
  // enabling this flag by default for CN developers + CN web server.
  //
  // For example, __BLITZ_CN__ can be provided as a CLI argument to the build
  // script for the server. This wouldn't be runtime, but it may be necessary
  // only for the web server. Same might apply for dev environment.
  china:
    globals.location?.hostname === "blitz.cn" ||
    // This is a meta tag set by SSR.
    globals.document?.querySelector(`meta[itemprop="china"]`) ||
    typeof __BLITZ_CN__ !== "undefined",
};

// But let's enumerate them anyways. This comes from the build script.
try {
  /* eslint-disable no-undef */
  for (const name of __BLITZ_FEATURES__) {
    /* eslint-enable no-undef */
    if (!featureDefaults.hasOwnProperty(name)) {
      featureDefaults[name] = false;
    }
  }
} catch (e) {
  devError("FAILED TO INITIALIZE FEATURE FLAGS", e);
}

const obj = makeStrictKeysObject(featureDefaults);

const featureFlags = new Proxy(obj, {
  get: restrictRead,
  set: featureFlagHandler,
});

export const featurePromises = {};

const teardowns = {};

function restrictRead(target, key) {
  if (typeof key === "string") {
    throw new Error(
      `Attempted to read "${key}" feature flag without writing. ` +
        `Reading the state of feature flags is banned because application ` +
        `code should not be aware of the existence of feature flags.`
    );
  }
  return Reflect.get(...arguments);
}

function featureFlagHandler(target, key, value) {
  if (typeof key !== "string") return true;
  const start = Date.now();
  if (value && !teardowns.hasOwnProperty(key)) {
    // Initialize teardown to something that is valid before the module is loaded.
    teardowns[key] = Promise.resolve();
    const promise = import(
      `${importBasePath(import.meta.url)}src/feature-${camelCaseToKebabCase(
        key
      )}/mod${JS_FILE_EXTENSION}`
    )
      .then(({ isDeferred, setup, teardown }) => {
        teardowns[key] = teardown;

        // isDeferred is used in case a feature flag relies on other feature flags
        // to initialize first.
        if (isDeferred) {
          return new Promise((resolve, reject) => {
            // This is to ensure that other feature promises are initialized first.
            queueMicrotask(async () => {
              try {
                const promises = Object.keys(featurePromises)
                  .filter((k) => k !== key)
                  .map((k) => featurePromises[k]);
                await Promise.all(promises);
                await setup();
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        }

        return setup();
      })
      .then(() => {
        devLog(`feature "${key}" ON (${Date.now() - start}ms)`);
      })
      .catch((error) => {
        devError(`feature "${key}" failed to setup`, error);
      });
    featurePromises[key] = promise;
  } else if (teardowns.hasOwnProperty(key)) {
    const teardown = teardowns[key];
    const promise = Promise.resolve()
      .then(() => {
        return teardown();
      })
      .then(() => {
        devLog(`feature "${key}" OFF (${Date.now() - start}ms)`);
      })
      .catch((error) => {
        devError(`feature "${key}" failed to teardown`, error);
      });
    featurePromises[key] = promise;
    delete teardowns[key];
  }
  return Reflect.set(...arguments);
}

// Initializing
for (const key in featureFlags) {
  featureFlags[key] = obj[key];
}

globals.__BLITZ_DEV__.featureFlags = featureFlags;

// Don't import this directly, this is exposed under `readState.features`.
// Use actions like `writeState.features.dummy = true` to toggle features.
export default featureFlags;

// Utility function to wait for all requested feature flags to setup/teardown.
export function waitForFeatureFlags(flags) {
  const promises = [];
  for (const key in flags) {
    featureFlags[key] = flags[key];
    promises.push(featurePromises[key]);
  }
  return Promise.all(promises);
}
