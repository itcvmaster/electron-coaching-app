import run from "tapdance";

import { isCyclic } from "../../www/js/src/test.mjs";

const noCycleObj = {
  name: String,
  roles: [String],
  age: Number,
  favoriteNumber: Number,
  preferences: {
    color: String,
  },
};

const twoLayersDeep = {
  name: String,
  roles: [String],
  age: Number,
  favoriteNumber: Number,
  preferences: {
    color: String,
  },
};
twoLayersDeep.preferences.a = twoLayersDeep;

run((assert, comment) => {
  comment("data model");

  assert(isCyclic(noCycleObj) === false, "should be false for no cycles");

  assert(isCyclic({}) === false, "should be false for empty object");
  assert(isCyclic(undefined) === false, "undefined returns false");

  const cycle1LayerDeep = {};
  cycle1LayerDeep.a = cycle1LayerDeep;
  assert(!!isCyclic(cycle1LayerDeep), "should detect cycle 1 layer deep");

  assert(!!isCyclic(twoLayersDeep), "detect cycle in obj 2 layers deep");

  const objWithCycleInArray = { a: [] };
  objWithCycleInArray.a.push(objWithCycleInArray);
  assert(!!isCyclic(objWithCycleInArray), "should detect cycle in array");

  const sisters = {
    a: {
      sister: noCycleObj,
    },
    b: {
      sister: noCycleObj,
    },
  };
  assert(
    isCyclic(sisters) === false,
    "should be false for sibling with no cycle"
  );

  sisters.cycle = sisters;
  assert(
    !!isCyclic(sisters),
    "should detect cycle in obj with siblings and 1 cycle"
  );

  comment("stackTrace is returned with correct format if cycle found");

  assert(
    isCyclic(twoLayersDeep) === "MODEL-> preferences-> a",
    "should detect cycle in obj with siblings and 1 cycle"
  );
});
