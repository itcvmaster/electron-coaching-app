# Initial Decisions

In no particular order, things that were problematic in `blitz-web` that we want to avoid here.

### File naming

There should be only 2 extensions: `.mjs` for ES modules, and `.jsx` for JSX parsing. I would like to keep the folder structure as flat as possible, only 1 level deep, to encourage re-use.

### esbuild

We are opting out of using snowpack, vite, or other build tools that add another layer on top of esbuild. esbuild itself is already a very capable and complex tool. and the configuration complexity of the tools on top may obstruct us more than help us especially when we need something custom.

### Dynamic import

Instead of using Loadable Components or React.lazy, we will use native ES dynamic import. There are a few reasons:

- Dynamic import to do code splitting is well supported by esbuild, and _will_ be well supported by future tools.
- Generic to the programming language (JavaScript), not locked down to one framework (React). It is portable knowledge.

To support code splitting by dynamic import, existing solutions are lacking. We have some specific requirements which require implementing our own router. I think there are pros and cons to this approach. react-router is well supported production ready software with a large community, but ~~does not fit with dynamic imports~~ does not have good support for dynamic imports.

A quote from [React docs](https://reactjs.org/docs/code-splitting.html):

> React.lazy and Suspense are not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend Loadable Components. It has a nice guide for bundle splitting with server-side rendering.

Loadable components is [predicated on very outdated information](https://loadable-components.com/docs/code-splitting/):

> Note: The dynamic import() syntax is a ECMAScript (JavaScript) proposal not currently part of the language standard. It is expected to be accepted in the near future.

[Dynamic import has been implemented since Chrome 63](https://caniuse.com/es6-module-dynamic-import), released in December 2017.

To support all of the below requires a custom router as of the time of writing:

- Native dynamic import
- Server-side rendering
- [Avoid Babel + Webpack](https://loadable-components.com/docs/getting-started/)

### Persistent state

Instead of using redux or react-query or other popular solutions, we will use [valtio](https://github.com/pmndrs/valtio) and indexeddb. High level goals:

- State should be persistent by default. indexeddb is the only option for persistent more than a trivial amount of data, since localStorage has a 5mb quota.
- Least Recently Used (LRU) caching by default, _except_ for data that we want to "pin" (such as static data, own user info). Being able to automatically discard info beyond a certain quota is very important for memory management, to keep RAM and disk usage to a minimum.
- low boilerplate. redux forces devs to write reducers, actions, transducers, confusers, etc. react-query has a large API surface area and forces devs to use hooks which aren't accessible or testable outside of react.
