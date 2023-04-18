# Get data

There is a default way to get data and put it into the app state, using the `getData` function. It actually combines a few things which are all required:

- Either a URL, object, or function that returns a promise must be provided.
- A data model validator function.
- The path to write to.
- Options.

For example,

```js
await getData(
  `${appURLs.UNKNOWN_BACKEND}/profile/${id}`,
  UnknownProfileModel,
  ["unknown", "profiles", id],
  { shouldFetchIfPathExists: true }
);
```

The function call must be in a route's `fetchData` method, **not** from a component.

## Data model validation

A data model must be supplied, the purpose is so that we can _force the data into the defined shape to prevent runtime errors_ and also warn on missing data.

## Write state path

**The path to write to should almost always include a primary key.** For example,

```js
["lol", "profiles", derivedId];
```

The only exceptions may be static or aggregate data.

## Options

### `shouldFetchIfPathExists`

There is one rule regarding usage of this option, if the data is not expected to change it should be `false`, otherwise `true`.

Examples of immutable data include past matches, static data (caveat: must have a version).

### `mergeFn`

Used to merge data with the data from the current path if it exists.

### `expiryTime`

Used to set a custom expiry time, useful for data which should last longer than the default expiry time, such as locally generated data.

---

## Post data

There is a `postData` function which wraps `getData`, which mainly changes the method to `POST`.
