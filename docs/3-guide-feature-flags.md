# Feature flags

Our implementation of _feature flags_ is entirely custom, but also really simple. It is important to forget any misconceptions you may have about feature flags that may be colored by previous experience:

- Feature flags are a set of booleans that can be toggled on or off at runtime to modify the app. They are actually implemented as native ES modules with a module API contract.
- This is not driven by any backend or server-side implementation. Our implementation is purely client-side. We may additionally toggle feature flags remotely, but this is optional rather than required.

## Similarities to routes

There are actually quite a lot of similarities to routes:

- Both are loaded only upon a runtime trigger (URL or runtime code).
- Both are native ES modules.
- Both have an API contract to fulfill. Routes must export a `default` component, feature flags must implement `setup` and `teardown` functions.

## Adding a feature flag

Adding a feature flag is as easy as creating a `feature-` directory with a `mod.mjs` file. This file must contain:

```js
export function setup() {...}
export function teardown() {...}
```

This file can import from any other file in the `src` directory, code-splitting will handle it intelligently.

The build system will pick up on it automatically, and it can be toggled on/off with:

```js
__BLITZ_DEV__.featureFlags[nameOfFeature] = true || false;
```

Feature flags have their default value set in `feature-flags.mjs`. They can also be toggled programmatically by importing `featureFlags` from that module.

## Runtime modifications

Features have `setup` and `teardown` functions that are runtime only. They can modify existing components, routes, _anything_!

The way that feature flags can add, remove, and modify existing components relies on creating `refs` objects, or entry points in the codebase to hook into. The main `App.jsx` component has a few entry points of its own, which is used by `feature-ads` to modify the entire layout.

To create `refs` in any component that needs to be hooked into is very easy:

```js
const Component = () => {
  return <p>Hello world!</p>;
};

export const refs = {
  Component,
};

export default function Greeting() {
  return <refs.Component />;
}
```

Then in a feature module (`mod.mjs`):

```js
import { refs as greetingRefs } from "...";
import { refs as appRefs } from "@/__main__/App.jsx";

const originals = {};

export function setup() {
  originals.Component = greetingRefs.Component;
  greetingRefs.Component = () => <p>Goodbye cruel world!</p>;
  appRefs.forceRender();
}

export function teardown() {
  greetingRefs.Component = originals.Component;
  appRefs.forceRender();
}
```

This will replace the existing component with one from the feature flag, and force it to be rendered right away. The teardown function does the opposite.

**IMPORTANT**: make sure that the teardown function reverses everything in the setup function.
