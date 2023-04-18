import { waitForFeatureFlags } from "@/__main__/feature-flags.mjs";

const features = ["chinaBackend", "chinaAuth", "chinaWeb"];

const featuresOn = features.reduce((hash, key) => {
  hash[key] = true;
  return hash;
}, {});

const featuresOff = features.reduce((hash, key) => {
  hash[key] = false;
  return hash;
}, {});

// All this does is toggle other China-specific feature flags.
export function setup() {
  return waitForFeatureFlags(featuresOn);
}

export function teardown() {
  return waitForFeatureFlags(featuresOff);
}
