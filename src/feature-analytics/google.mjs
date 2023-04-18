import {
  finalizeProviders,
  initializeProviders,
} from "@/feature-analytics/utils.mjs";
import { IS_APP } from "@/util/dev.mjs";

const SCORECARD_RESEARCH = "https://sb.scorecardresearch.com/beacon.js";
const GOOGLE_ANALYTICS = "https://www.google-analytics.com/analytics.js";
const GOOGLE_TAG = "https://www.googletagmanager.com/gtag/js?id=UA-156428086-4";

const env = {
  setupPromise: null,
  providers: [
    {
      name: "google_analytics",
      url: GOOGLE_ANALYTICS,
      web: true,
      app: true,
      initialize: () => {
        /* eslint-disable no-restricted-properties */
        const ga =
          globalThis.ga ||
          ((...args) => {
            globalThis.ga.q = globalThis.ga.q || [];
            globalThis.ga.q.push(args);
          });
        globalThis.ga = ga;
        /* eslint-enable no-restricted-properties */
        ga.l = +new Date();
        // Since the production app is hosted on blitz.gg, should be no problem with domain;
        // therefore, use "auto"
        ga("create", IS_APP ? "UA-90665732-10" : "UA-90665732-11", "auto");
        ga("set", "transport", "xhr");
        ga("set", "appName", "Blitz");
        // VERY IMPORTANT: disable protocol and storage check for electron since it uses file://
        ga("set", "checkProtocolTask", null);
        ga("set", "checkStorageTask", null);
      },
    },
    {
      name: "google_tag",
      url: GOOGLE_TAG,
      web: true,
      app: true,
      initialize: () => {
        /* eslint-disable no-restricted-properties */
        globalThis.dataLayer = globalThis.dataLayer || [];
        const gtag =
          globalThis.gtag ||
          ((...args) => {
            globalThis.dataLayer.push(args);
          });
        globalThis.gtag = gtag;
        /* eslint-enable no-restricted-properties */
        gtag("js", new Date());
        gtag("config", IS_APP ? "G-XW729NPKHM" : "G-GH56TGS425");
        gtag("config", "UA-156428086-4");
      },
    },
    {
      name: "scorecard_research",
      url: SCORECARD_RESEARCH,
      web: true,
      app: false,
      initialize: () => {
        /* eslint-disable no-restricted-properties */
        const comscore = globalThis._comscore || [];
        globalThis._comscore = comscore;
        /* eslint-enable no-restricted-properties */
        // Comscore for website
        comscore.push({ c1: "2", c2: "28660385" });
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
