# Testing

Tests are written in a manner similar to application code. What this means is that we're avoiding the complications of certain test harnesses that add:

- Custom binary or script to run tests (ex. `mocha`, `jest`).
- Global variables (ex. `mocha`, `jest`).
- Global prototype pollution (ex. `jasmine`, any BDD-like test).

This decision is made to keep testing as simple and accessible as possible, so developers do not have to understand the nuances of any particular testing framework.

The actual implementation uses `tapdance`, to emit TAP ([Test Anything Protocol](https://testanything.org/)). Alternatives we can consider are `tape`, `Deno.test`, Node `assert` module, or similar options which keep the API surface area of testing as small as possible.

### Priorities

Modules which affect the entire application should be prioritized for testing, this includes things like routing, state management, database, etc. Then features which are core to the product, which include all game integrations. Everything else must be de-prioritized.

### Goals

- We should be running the unit & integration tests as a pre-commit hook. In order to do this well, the tests should take under 3 seconds to finish. Why 3? Anything longer will slow down the development cycle.
- The full tests should run on CI (adding acceptance testing) before deploying. No hard time limit here, but deployments should fail if tests fail.

## Unit

We are mainly testing the `__main__` modules. Other good candidates are `util` functions, but they are much lower priority.

Modules which we are testing must explicitly expose what needs to be tested on the `test.mjs` object. This is because we can't import directly from the `src` directory from Node.js, we have to import the distributable file, `root.mjs`.

## Integration

Specific features should be integration tested. As of writing, there are no examples yet. LoL drafting is planned.

## Acceptance

The most basic form of acceptance testing for us, is asserting that the server-side rendering works. We mostly have to check if we get a 200 OK HTTP status code for all routes. This alone ensures that a lot of things work, but isn't comprehensive, because it also assumes that something actually rendered. So we should check:

- 200 OK status code
- Did specific content on each page render? For example:
  - LoL profile: do we see the name of the summoner?
  - LoL champion: do we see static text like "Recommended Builds"?
  - ...and so on.

There is another form of acceptance testing which involves loading the actual pages in a browser environment, which we'll get into later.
