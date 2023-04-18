import run from "tapdance";

import { clone, dataModel, deepEqual } from "../../www/js/src/test.mjs";

const {
  matchType,
  default: createModel,
  Any,
  __INTERNAL_VALIDATION_SYMBOL: isValidated,
} = dataModel;

run((assert, comment) => {
  comment("data model");

  // matchType
  assert(matchType(null) === null, "should return null");

  assert(
    matchType("some string", String, "some key", true) === "some string",
    "should return some string"
  );

  const dataModel = {
    name: String,
    roles: [String],
    arrayOfObjects: [{ foo: Number }],
    age: Any,
    favoriteNumber: Number,
    preferences: {
      color: String,
    },
  };

  const testData = {
    name: "John",
    roles: ["admin", "user"],
    arrayOfObjects: [{ foo: 1 }],
    age: 23,
    favoriteNumber: 2,
    preferences: {
      color: "red",
    },
  };

  const clonedTestData = clone(testData);
  // Basic test. Should succeed.
  let validate = createModel(dataModel);
  let validated = validate(testData);
  assert(
    validated === testData &&
      validated[isValidated] === true &&
      deepEqual(validated, clonedTestData),
    "should succeed"
  );

  // should return empty validated object
  validate = createModel({});
  validated = validate(null);
  assert(
    !Object.keys(validated).length && validated[isValidated] === true,
    "should return empty validated object"
  );

  // should succeed without optional data
  const optionalTestData = {
    ...testData,
  };

  delete optionalTestData.age;
  validate = createModel(dataModel);
  validated = validate(optionalTestData);
  assert(
    validated === optionalTestData && validated[isValidated] === true,
    "should succeed without optional"
  );

  // should create missing keys
  delete optionalTestData.name;

  validate = createModel(dataModel);
  validated = validate(optionalTestData);
  assert(validated.name === "", "should fill missing keys");

  // Should cast string to number
  testData.favoriteNumber = "23";
  validate = createModel(dataModel);
  validated = validate(testData);
  assert(
    validated[isValidated] === true &&
      typeof validated.favoriteNumber === "number",
    "should be validated and of type number"
  );

  // Should cast array to number
  testData.favoriteNumber = [];
  validate = createModel(dataModel);
  validated = validate(testData);
  assert(
    validated[isValidated] === true &&
      typeof validated.favoriteNumber === "number",
    "should be validated and of type number"
  );

  const cyclicModel = {
    name: String,
    roles: [String],
    age: Any,
    favoriteNumber: Number,
    preferences: {
      color: String,
    },
  };
  cyclicModel.cycle = cyclicModel;

  try {
    createModel(cyclicModel);
    assert(false, "should throw cyclic error");
  } catch (e) {
    assert(
      String(e).includes("Cycle detected in model: MODEL-> cycle-> <CYCLE>"),
      "should throw error with output text showing cycle"
    );
  }
});
