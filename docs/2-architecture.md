# Architecture

We are using React as a library, not as a framework, so we are not starting with the defaults provided by `create-react-app`. The app is organized around a build tool, esbuild, that supports ES modules natively, a few core modules and static/runtime enforcement of rules.

**Most of the architectural decisions are based on real-world constraints.**

- We're using React simply because most of the team knows React and hiring is fairly easy.
- We're using `ReactDOMServer.hydrateRoot` instead of using a server-side framework like Next.js because SSR is an afterthought.
- We're using a custom router because it is built specifically with native ES modules and code-splitting in mind, and it supports SSR without buy-in from frameworks.
- We need to support offline really well because our main use case is a desktop app, and some of the data may be user-generated. To support this, we are using an indexeddb wrapper that integrates with our app state seamlessly.

There are really only a few custom core modules that make blitz-app work:

- `app-state.mjs` - thin wrapper around valtio
- `router.mjs` - ES module-based router
- `feature-flags.mjs` - runtime ES modules
- `db.mjs` - indexeddb wrapper using idb-keyval

## State management using Valtio + IndexedDB

[Valtio](https://github.com/pmndrs/valtio) is used for state management. It is chosen over Redux because it results is much less boilerplate: no selectors, actions are optional, no reducers. We have integrated it with idb-keyval, so that individual branches of the state tree are persisted automatically. Data eventually becomes stale and purged if it hasn't been accessed in a while, so it doesn't grow indefinitely.

## ES Module dynamic imports

We are using native dynamic imports to do code-splitting by route (URL). Each route has an entry point defined by its `component` file.

## Standalone router, router hooks

The router is implemented in-house, because of the above constraint. Not only that, the router is built with only React hooks in mind, so using the router is as simple as including the router hooks. Links are implemented as basic HTML `<a href="...">` tags, there are no special components to use.

## Shared component architecture

There are "headless" components in the `shared` directory that provide functionality without dictating what elements may appear. This reduces maintenance costs across the entire app by re-using as much common functionality as possible.

## 1:1 codebase for web/desktop

The entry point for both web and desktop builds are the same. The main difference is that the desktop build will have functioning IPC using `blitzMessage`, and this is a no-op on web.

## SSR with dynamic imports

Due to how the router works, we can await the promise for when a module is dynamically imported, and also for all the data on the route, before rendering to string. There are no open-source solutions at the time of writing that does this.
