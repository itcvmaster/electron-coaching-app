import run from "tapdance";

import { optionalMerge } from "../../www/js/src/test.mjs";
import { deepEqual } from "./util.mjs";

run((assert, comment) => {
  comment("optionalMerge: first object empty, second object populated");

  const obj1 = {};

  const obj2 = {
    key1: "test",
    key2: 123,
    key3: false,
  };

  assert(
    deepEqual(obj2, optionalMerge(obj1, obj2)),
    "check that returned object is equal to second object"
  );

  comment("optionalMerge: second object equal to first with an extra key");

  const obj3 = {
    key1: "o3val1",
    key2: "o3val2",
    key3: "o3val3",
    key4: "o3val4",
  };

  const obj4 = {
    key1: "o4val1",
    key2: "o4val2",
    key3: "o4val3",
    key4: "o4val4",
    key5: "o4val5",
  };

  const expectedResult = {
    key1: "o3val1",
    key2: "o3val2",
    key3: "o3val3",
    key4: "o3val4",
    key5: "o4val5",
  };

  assert(
    deepEqual(expectedResult, optionalMerge(obj3, obj4)),
    "copies key/value from second object if not exist in first"
  );
});
