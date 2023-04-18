import run from "tapdance";

import { getEventReplay } from "./event-replay-util.mjs";
import setupIntegration from "./setup-integration.mjs";

// Testing with External API (BE)
run(async (assert, comment) => {
  comment("Navigates to lol profile page when lcu connects.");
  const events = await getEventReplay("lol-profile_nav-when-connected");
  assert(!!events, "Imported event replay");

  const { router, waitForFeatureFlags } = await setupIntegration("/");
  const { lolActions } = await import(
    "../../www/js/src/feature-event-replay/mod.mjs"
  );
  await waitForFeatureFlags({ eventReplay: true });
  lolActions.config.skipTimeout = true;

  const success = lolActions.uploadRecording(events);
  assert(success, "Loaded event replay");

  // This could be tricky b/c we are introducing arbitrary-ish wait times into our testing.
  await lolActions.play();

  assert(
    router.route.currentPath.startsWith("/lol/profile"),
    "Moved to lol profile"
  );

  // TODO: test that profile data is actually displayed
});

// Testing w/o External API (CN, Garena)
// TODO: test Navigate to lol profile when lcu connects using lcu as datasource
// TODO: test lol profile gracefully failing loading w/o BE AND w/o lcu
