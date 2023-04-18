# Router

The router is unique to Blitz, and is what makes native ES modules work seamlessly with no opt-in from any framework or library. It makes a few core assumptions:

- There is a React component or DOM element as the main entry point of a route. This means that all code-splitting is done by route.
- The route has a `fetchData` method, which must use `getData` to get all data that is needed on the route. **This means that data should NOT be loaded from components.**

## URL is the Source of Truth

The URL should serialize everything that is required to render what the user is seeing. What this means is that **one must set the URL to change the view, then the view must follow**.

Examples of anti-patterns:

- Fetching data from a component then updating the URL (WRONG, only fetch data from a route)
- Changing the view significantly without serializing it in the URL, for example, having tabs that don't change the URL.

## useIsLoaded() hook

There is a convenient way to handle loading/error states:

```
const isLoaded = useIsLoaded();
```

Returns `Boolean` or an error which can be checked with `instanceof Error`.

- `false`: loading
- `true`: done (but check for empty)
- Error: show error component or empty

## Routes Array

All routes are stored in a central location, the `routes` array. This array can be modified in runtime.

### Legacy

Historically, routes were defined as a flat array of objects, which contained the path, component, and a method to get data for the route. This has been preserved.
