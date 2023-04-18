/* eslint-disable no-restricted-properties */
delete globalThis.alert;
delete globalThis.confirm;
delete globalThis.prompt;

// Let our app get a reference to indexedDB first.
queueMicrotask(() => {
  delete globalThis.indexedDB;
});
