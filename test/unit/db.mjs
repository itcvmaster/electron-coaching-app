import run from "tapdance";

import {
  appState,
  db,
  symbolName as symbolNameModule,
  wrapDBMethod,
} from "../../www/js/src/test.mjs";
import { deepEqual, mock } from "./util.mjs";

const { isPersistent } = appState;
const { default: symbolName } = symbolNameModule;

run(async (assert, comment) => {
  comment("db: expiry record");
  // This is for internal lookup of expiry record
  const releaseMock = mock(db, "_get", () =>
    Promise.resolve({
      foo: Date.now() - 1000,
      foo2: Date.now() + 1000,
    })
  );
  let count = 0;
  db._events.on(db.DID_INIT, () => {
    count++;
    assert(count === 1, "init should only occur once");
  });
  await Promise.all([db.find([db.EXPIRY_KEY]), db.find([db.EXPIRY_KEY])]);
  assert(Object.keys(db._expiryRecord).length, "key length check");
  assert(!db._expiryRecord.foo, "expired record removed");
  assert(db._expiryRecord.foo2, "non-expired record exists");

  // This is needed to avoid batching subsequent requests.
  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });

  releaseMock();
});

run(async (assert, comment) => {
  comment("db: find");
  const original = db._getMany;

  db._getMany = (ids) => {
    assert(ids.length === 2, "requests are batched");
    return Promise.resolve([]);
  };
  await Promise.all([db.find(["soap"]), db.find(["bar"])]);

  let count = 0;
  db._getMany = (ids) => {
    count++;
    assert(ids.length === 1, "single id requested");
    return Promise.resolve([]);
  };
  db.find(["soap"]);
  // Wait an amount of time greater than how long a single
  // request is expected to take.
  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
  await db.find(["bar"]);

  assert(count === 2, "requests are split by time");
  assert(db._expiryRecord.soap, "expired record added");
  db._getMany = original;
});

run(async (assert, comment) => {
  comment("db: upsert");
  const time = Date.now() + 1337;
  const value = {
    [isPersistent]: time,
  };
  const upsert = db.upsert([
    ["bar1", null],
    ["bar2", null],
    ["bar1", value],
  ]);
  await db._init();
  assert(
    deepEqual(db._setManyQueue, [
      ["bar1", value],
      ["bar2", null],
    ]),
    "correct data in queue"
  );
  await upsert;
  assert(db._expiryRecord["bar1"] === time, "custom expiry time");
  assert(db._setManyQueue.length === 0, "queue cleared");
});

run(async (assert, comment) => {
  comment("db: serialization");
  const testSymbol = symbolName("symbol-testing");
  const obj = { testSymbol };
  assert(
    deepEqual(db._serializeValue(obj), {
      testSymbol: "$$ symbol-testing",
    }),
    "symbol is serialized"
  );
  assert(
    deepEqual(db._deserializeValue({ testSymbol: "$$ symbol-testing" }), obj),
    "symbol is deserialized"
  );
  await db.upsert("testObj", obj);
  const foundObj = await db.find("testObj");
  assert(deepEqual(foundObj, obj), "object passed through db serialization");
});

run(async (assert, comment) => {
  comment("db: error handling");
  const fn = () => Promise.reject(new Error("broken"));
  fn.override = true;
  db._getMany = wrapDBMethod(fn, []);
  await db.find(["wot"]);
  assert(true, "errors do not halt");
});
