import run from "tapdance";

import { stateCleanup } from "../../www/js/src/test.mjs";
import { deepEqual } from "./util.mjs";

const { CONFIG, default: writeKeyPath, keyPaths } = stateCleanup;

const state = {
  a: {
    b: {
      c: {},
    },
  },
};

run((assert, comment) => {
  comment("paths should be pruned when overflowing max length");

  const original = {
    MAX_LENGTH: CONFIG.MAX_LENGTH,
    STATE: CONFIG.STATE,
  };
  CONFIG.MAX_LENGTH = 3;
  CONFIG.STATE = state;

  // Make sure it's in initial state :|
  keyPaths.clear();

  for (let i = 0; i < 5; i++) {
    const value = true;
    state.a.b.c[i] = value;
    writeKeyPath(["a", "b", "c", i]);
  }

  assert(
    deepEqual([...keyPaths], ["a$b$c$2", "a$b$c$3", "a$b$c$4"]),
    "internal keyPaths does not overflow"
  );
  assert(
    deepEqual(state.a.b.c, {
      2: true,
      3: true,
      4: true,
    }),
    "state is correct"
  );

  comment("writing undefined should remove keyPath");

  delete state.a.b.c[2];
  writeKeyPath(["a", "b", "c", 2], true);

  assert(
    deepEqual([...keyPaths], ["a$b$c$3", "a$b$c$4"]),
    "internal hashmap removed keyPath"
  );

  comment("update keyPath should change ordering");
  writeKeyPath(["a", "b", "c", 3]);
  assert(deepEqual([...keyPaths], ["a$b$c$4", "a$b$c$3"]), "ordering changed");

  CONFIG.MAX_LENGTH = original.MAX_LENGTH;
  CONFIG.STATE = original.STATE;
});
