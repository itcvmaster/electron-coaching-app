import {
  finalizeProviders,
  initializeProviders,
} from "@/feature-analytics/utils.mjs";

const BAIDU_TONGJI =
  "https://hm.baidu.com/hm.js?c9edc00a9942ddd7a0d58f3f8c90c97a";
const BAIDU_TUIGUANG =
  "https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD";

const env = {
  setupPromise: null,
  providers: [
    {
      name: "baidu_tongji",
      url: BAIDU_TONGJI,
      web: true,
      app: true,
      initialize: () => {
        /* eslint-disable no-restricted-properties */
        globalThis._hmt = globalThis._hmt || [];
        /* eslint-enable no-restricted-properties */
      },
    },
    {
      name: "baidu_tuiguang",
      url: BAIDU_TUIGUANG,
      web: true,
      app: true,
      initialize: () => {
        /* eslint-disable no-restricted-properties */
        globalThis._agl = globalThis._agl || [];
        globalThis._agl.push(["production", "_f7L2XwGXjyszb4d1e2oxPybgD"]);
        /* eslint-enable no-restricted-properties */
      },
    },
  ],
};

export function setup() {
  if (!env.setupPromise) {
    env.setupPromise = initializeProviders(env.providers);
  }
  return env.setupPromise;
}

export function teardown() {
  // XXX: do we need to check setupPromise ready?
  finalizeProviders(env.providers);
  env.setupPromise = null;
}
