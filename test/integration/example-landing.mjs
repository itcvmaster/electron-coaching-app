import run from "tapdance";

import setupIntegration from "./setup-integration.mjs";

run(async (assert, comment) => {
  comment(
    "example: landing. this is not testing anything for production! for demo purposes only."
  );
  const { screen } = await setupIntegration("/");
  const regExp = /blitz\.gg staff/i;
  const element = screen.getByText(regExp);
  assert(element, "text rendered");
});
