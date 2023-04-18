import run from "tapdance";

import {
  featureDummy,
  featureFlags as featureFlagsModule,
} from "../../www/js/src/test.mjs";

const { default: featureFlags, featurePromises } = featureFlagsModule;

run(async (assert, comment) => {
  comment("feature flag");

  featureFlags.dummy = true;
  await featurePromises.dummy;
  assert(featureDummy.didSetup, "did call setup");
  featureFlags.dummy = false;
  await featurePromises.dummy;
  assert(featureDummy.didTeardown, "did call teardown");

  try {
    const value = featureFlags.dummy; // eslint-disable-line no-unused-vars
    assert(false, "read should result in error");
  } catch (error) {
    assert(true, "read should result in error");
  }
});
