import run from "tapdance";

import { lruObject } from "../../www/js/src/test.mjs";
import { deepEqual } from "./util.mjs";

run((assert, comment) => {
  comment(
    "lruObject: key added after maxKeys reached should remove first key/value pair"
  );

  const obj1 = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
    key4: "value4",
    key5: "value5",
  };

  const expectedObj1 = {
    key2: "value2",
    key3: "value3",
    key4: "value4",
    key5: "value5",
    key6: "value6",
  };

  // 5 initial keys

  const lruObj1 = lruObject(obj1, 5);

  lruObj1.key6 = "value6";

  assert(
    deepEqual(lruObj1, expectedObj1),
    "new key was added, removing first key/value pair"
  );
});
