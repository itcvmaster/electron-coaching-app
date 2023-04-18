import run from "tapdance";

import { getData as getDataModule } from "../../www/js/src/test.mjs";

const {
  default: getData,
  digPath,
  readData,
  isPopulatedFromDB,
  dbRef,
  isValidated,
} = getDataModule;

run(async (assert, comment) => {
  comment("get data");

  // readData function
  const blank = await readData(["x"]);
  assert(blank === null, "invalid path should return null");

  const filledRoot = {
    a: {
      b: {
        c: 1,
        d: 2,
      },
    },
  };

  let rObj = ["a", "b", "c"];

  rObj.root = filledRoot;
  let [r, lastKey] = digPath(rObj, rObj.root);
  assert(
    r.c === rObj.root.a.b.c && lastKey === "c",
    "should be able to extract path a.b.c"
  );

  rObj.root = {};
  [r, lastKey] = digPath(rObj, rObj.root);
  assert(
    r === undefined && lastKey === "c",
    "should return undefined and c as lastKey"
  );

  // Should not look up DB at all because the data is already in the state (filledRoot)
  rObj.root = filledRoot;
  let rd = await readData(rObj);
  assert(
    rd === rObj.root.a.b.c,
    "readData should read correctly from local state"
  );

  // Should LOOK up DB because the data is NOT in the state
  let calledFind = false;
  const findRes = {
    some: "test",
  };
  dbRef.db.find = () => {
    calledFind = true;
    return [findRes];
  };
  rObj = ["somePath"];
  rObj.root = {};
  rd = await readData(rObj);
  assert(calledFind === true, "readData should have called db.find");
  assert(rd === findRes, "readData should return correct data");
  assert(
    rd[isPopulatedFromDB] === true,
    "readData should have isPopulatedFromDB"
  );

  calledFind = false;
  rd = await readData(rObj);
  assert(
    calledFind === false,
    "calling readData with the same path multiple times should skip DB lookup"
  );

  // Prepare stuff for getData tests
  const wState = ["somePath"];
  wState.root = {};

  let validate = (v) => {
    v[isValidated] = true;
    return v;
  };

  dbRef.db.find = () => {
    return [];
  };

  let fetchCalled = false;
  let fetch = () => {
    fetchCalled = true;
    return {
      ok: true,
      statusCode: 200,
      json() {
        return {
          message: "hi mom!",
        };
      },
    };
  };

  // First call to getData. It should fetch the data from the network.
  let res = await getData("/fake-url", validate, wState, {
    fetch,
  });
  assert(
    res.message === "hi mom!" && fetchCalled === true,
    "should have returned json"
  );
  fetchCalled = false;

  // First call to getData. It should NOT fetch the data from the network.
  // INTENTIONALLY reset wState.root
  res = await getData("/fake-url", validate, wState, {
    fetch,
  });
  assert(
    res.message === "hi mom!" && fetchCalled === false,
    "should not call fetch again"
  );

  assert(res[isValidated] === true, "should return the validated data");

  wState.root = {};
  try {
    await getData("/fake-url", null, wState, {
      fetch,
    });
    assert(false, "should fail if missing validate");
  } catch {
    assert(true, "should fail if missing validate");
  }

  wState.root = {};
  validate = () => {
    return null;
  };

  try {
    await getData("/fake-url", validate, wState, {
      fetch,
    });
    assert(false, "should fail when data fails validation");
  } catch {
    assert(true, "should fail when data fails validation");
  }

  fetchCalled = false;
  validate = (v) => {
    v[isValidated] = true;
    return v;
  };

  fetch = () => {
    fetchCalled = true;
    return {
      ok: false,
      statusCode: 400,
      text() {
        return "";
      },
    };
  };

  try {
    res = await getData("/fake-url", validate, wState, {
      fetch,
    });
    assert(false, "should fail when we pass in an Error");
  } catch (e) {
    assert(e.statusCode === 400, "should fail when we pass in an Error");
  }

  wState.root = {};
  wState.push("someInvalidPath");
  // Should throw because of invalid path
  try {
    await getData("/fake-url", validate, wState, {
      fetch,
    });
    assert(false, "should throw because of invalid path");
  } catch {
    assert(true, "should throw because of invalid path");
  }
});
