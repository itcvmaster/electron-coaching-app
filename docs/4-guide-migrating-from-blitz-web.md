# Migrating from blitz-web

The goal of this guide is explain how to refactor components and how to address performance and organizational problems with existing components in blitz-web.

## Fetching data

One of the biggest architectural changes is that data-fetching must be exclusive to routing. In blitz-web there was both, loading data from a component using `axios`, `react-query`, and loading data from the route. The decision has been made so that **only routes should fetch data** (side note: [Remix](https://remix.run/) also emphasizes _nested routes_). This means that if there is any data loading from a component, it must be moved to a route:

```js
{
  path: "/example-route",
  component: ...,
  async fetchData() {
    await getData(...);
  },
}
```

Do not use `axios`, `react-query` (these are banned) or even native `fetch`. Only use `getData`, which streamlines fetching data, validating the response, putting it into app-state, and error handling.

## Using app-state

We are using `valtio` instead of `redux`, so usage of `useSelector` must be migrated to `useSnapshot`. **IMPORTANT**: do not do this:

```js
const {
  settings: { key },
} = readState; // WRONG
```

Only use `useSnapshot` to read state from a component:

```js
const {
  settings: { key },
} = useSnapshot(readState); // 😎
```

If this is not used, _the component won't re-render!_ In Redux, this would be equivalent to:

```js
const key = useSelector((state) => state.settings.key);
```

## Links

Since we're no longer using `react-router`, there is no more `<Link>` component. It's been replaced with something better: `<a href="/route">`. Standard hyperlinks work! All links starting with `/` are assumed to be app routes. To programmatically set the URL, use `updateRoute` (common for search queries), or `setRoute` (_only for automated transitions_).

## Loading and error states

As mentioned previously, `getData` also does error handling. Data model validation is also required, but this can use `noopModel` for GraphQL since the model is already in the request.

```js
// Previously, fetching data from a route:
getData(API.getProfile(id), ProfileModel, [[game], "profiles", id], {
  // IMPORTANT: This option is the most important one, it determines if we
  // should re-fetch or not. A decision is required, since it is not guaranteed
  // that we get proper Cache-Control headers to determine how time-sensitive
  // the data is. This defaults to `false`.
  // DO NOT RE-FETCH: historical data such as matches, or any static data.
  // DO RE-FETCH: any temporal data, such as ranks, matchlists, etc.
  shouldFetchIfPathExists: true,
});
```

To display errors in UI, check if the path that was written to was an error:

```js
function Profile() {
  const { [game]: { profiles } } = useSnapshot(readState);
  const profile = profiles[id];

  // The absence of data implies nothing has been returned yet.
  if (!profile) {
    return LoadingState;
  }

  // Careful: check if what you're expecting is an error.
  if (profile instanceof Error) {
    return ErrorState;
  }

  return (...);
}
```

## Utility functions

The only important thing to note here is that **generic utility functions belong in the shared `util` directory**, and that game specific utils belong in the `game-*` directory.

## Meta-information (Helmet)

We are migrating from `Helmet` to a simple named export function, `meta`. The `meta` function accepts the same arguments as `fetchData`. This is a framework-agnostic way of setting meta-information of the current route.

Instead of rendering a Helmet component:

```js
<Helmet {...props} />
```

This should instead be defined at a route module:

```js
export function meta() {
  return { title: ... }; // See examples in codebase
}
```

## i18n

No change! Still using `i18next`. Only use `useTranslation` hook and avoid the HOC.

## Optimizing styled-components

Anything that involves regenerating CSS during render is unnecessary and hurts performance! Here are examples of what NOT to do:

```js
const className = () => css`...`; // Bad, parses CSS per function call.
const Styled = styled.div`
  color: ${(props) => ...};
`; // Bad, re-computes CSS per render.
```

Here is good usage:

```js
const Styled = styled("div")`
  color: var(--red);

  /* Avoid needing too many styled components! */
  .child-element { ... }
`;
```

This is preferred since:

- Static declaration of what the styles are.
- No need to re-compute styles on render.
- Works out of the box with SSR.

## Edge cases

### Proper use of `const` and `let`

One thing that won't work anymore is define-after-use. This is because we're no longer using Babel to transpile to var-hoisted code.

```js
const value = fn(); // returns wtf?
const fn = () => "wtf?";
```

Solution: only define _before_ use.

### Replacement for `formatDistanceStrict`

Use `shared/TimeAgo.jsx` instead!
