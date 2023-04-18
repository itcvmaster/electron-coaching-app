# App state

We are using [valtio](https://github.com/pmndrs/valtio) as a global state management library.

The `app-state.mjs` module is a thin wrapper around valtio, that does a few things:

- Segregate read and write into two objects. By default, valtio returns one mutable state. This is to implement automatic persistence with the `writeState`.
- Automatically persist state using `writeState`, and enforce a few rules around its usage.

## Least Recently Used (LRU)

Like an [open world game without loading screens between areas](https://www.quora.com/How-do-open-world-games-go-without-interstitial-loading-screens), this is possible by only loading what is _nearby_ to the user and freeing memory of distant locations. In this case, nearby data would be for the current route, and the previous route, and a few routes before that.

We are storing state with arbitrary keys, and automatically cleaning up stale paths by least recently used. For example:

```js
{
  profiles: {
    0: {...},
    1: {...},
    2: {...},
    ...
    n: {...},
  }
}
```

As more paths get written to the state, the oldest ones are cleaned up first (0, 1, 2...). **The number of paths allowed is limited to a finite number, ensuring stable memory usage.**

A more trivial solution to memory management would be to allow only one resource per type active at a time:

```js
{
  profile: {...},
}
```

This guarantees that memory won't leak, but comes with drawbacks:

- Can only keep one profile in memory, so navigating back and forth between different profiles needs DB/network request.
- Makes some views impossible, particularly if more than one profile's data needs to be shown.

## Writing paths

We want to guarantee that the paths we write to are conflict-free. Consider this data structure:

```js
{
  a: {
    b: {
      c: 1,
      d: 2,
      [isPersistent]: true,
    },
  },
}
```

In this example, the object "b" is the only object that is persisted. What could go wrong if we write to an invalid path?

- If object "a" is written, then we have duplicated the data that already exists in object "b".
- If key "c" or "d" is written to directly, then we have mutated data from object "b" without persisting.

Therefore, the only valid path to write to is "a.b".
