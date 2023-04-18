import run from "tapdance";

import { appState } from "../../www/js/src/test.mjs";

const {
  readState,
  __ONLY_WRITE_STATE_FROM_ACTIONS: writeState,
  dbRef,
  isPersistent,
  isVolatile,
  isPopulatedFromDB,
} = appState;

dbRef.dbInit = Promise.resolve();
dbRef.db = {
  async find() {},
  async upsert() {},
};

run(async (assert, comment) => {
  let didUpsert;
  let promise;

  comment("writing key to writeState should reflect in readState");
  writeState.a.b.c = true;
  assert(readState.a.b.c === true, "readState has new value");

  dbRef.db.find = () => ({ payload: { records: [] } });

  didUpsert = false;
  promise = new Promise((resolve) => {
    dbRef.db.upsert = () => {
      didUpsert = true;
      resolve();
    };
  });

  comment("writing value with isPersistent should upsert");
  writeState.foo = { [isPersistent]: true };
  await promise;
  assert(didUpsert, "db.upsert was called");

  comment("writing inside a nested path should fail");
  try {
    writeState.foo.bar = { [isPersistent]: true };
    assert(false, "invalid write allowed");
  } catch (error) {
    assert(true, "should not write to nested path");
  }

  promise = new Promise((resolve, reject) => {
    dbRef.db.find = () => {
      reject(new Error("should not read"));
    };
    queueMicrotask(resolve);
  });
  comment("writing value with isVolatile should skip persisting");
  writeState.d.e.f = { [isVolatile]: true };
  await promise;
  assert(true, "isVolatile skips db");

  promise = new Promise((resolve, reject) => {
    dbRef.db.upsert = () => {
      reject(new Error("should not write"));
    };
    // kode smell: not rly any better way that i'm aware of
    queueMicrotask(resolve);
  });

  comment("writing value with isPopulatedFromDB should skip persisting");
  writeState.d.e.f = { [isPopulatedFromDB]: true };
  await promise;
  assert(true, "isPopulatedFromDB skips db");

  // kleanup
  delete writeState.a;
  delete writeState.foo;
  delete writeState.d;
  for (const key of ["a", "foo", "d"]) {
    assert(!readState.hasOwnProperty(key), "deleted keys are deleted");
  }
});
