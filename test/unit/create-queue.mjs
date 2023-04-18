import run from "tapdance";

import { createQueue } from "../../www/js/src/test.mjs";
import { deepEqual } from "./util.mjs";

run(async (assert, comment) => {
  const queue1 = createQueue();
  const outs = [];

  comment("createQueue: queue is serial/FIFO");

  const resolveFunc1 = () => {
    outs.push(1);
    return Promise.resolve();
  };

  const resolveFunc2 = () => {
    outs.push(2);
    return Promise.resolve();
  };
  const resolveFunc3 = () => {
    outs.push(3);
    return Promise.resolve();
  };

  const errorFunc = () => {
    return Promise.reject(new Error("error!"));
  };

  queue1.push(resolveFunc1);
  queue1.push(resolveFunc2);

  queue1.push(errorFunc);

  queue1.push(resolveFunc3);

  try {
    await Promise.race([
      queue1.head,
      new Promise((_, reject) => {
        setTimeout(reject, 1000);
      }),
    ]);
  } catch (e) {
    assert(
      e.message === "error!",
      "error tossed in queue is caught and doesn't affect processing of rest of queue"
    );
  }

  // expected output of outs should be [ 1, 2, 3 ] because serial execution/FIFO
  assert(
    deepEqual(outs, [1, 2, 3]),
    "values pushed in order because of serial execution"
  );

  const queue2 = createQueue();

  queue2.push(resolveFunc1);
  queue2.push(resolveFunc2);
  queue2.push(resolveFunc3);

  delete queue2[1];

  try {
    await Promise.race([
      queue2.head,
      new Promise((_, reject) => {
        setTimeout(reject, 1000);
      }),
    ]);
  } catch (e) {
    // ignore the error
  }

  // expected output of outs.slice(3) should be [ 1, 3 ] since we disregard the prior output
  // reusing old outs to have less variables/functions
  assert(
    deepEqual(outs.slice(3), [1, 3]),
    "deletion of function from queue works as intended"
  );
});
