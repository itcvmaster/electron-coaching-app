/**
 * A serial execution queue based on Promises.
 *
 * @returns {Queue}
 */
export default function createQueue() {
  const queue = [];
  let isCatching = false;

  queue.head = Promise.resolve();
  queue.push = (fn) => {
    Array.prototype.push.call(queue, fn);
    queue.head = queue.head.finally(async () => {
      // Verify whether or not the function was prematurely removed from the queue.
      if (!queue.includes(fn)) return;

      let error;
      try {
        await fn();
      } catch (e) {
        error = e;
      }

      queue.shift();
      if (error) throw error;
    });

    // This bit of cleverness is to ensure that promises added to the queue
    // are always caught at the very end. The microtask queue is used to ensure
    // that any user-defined catch is executed first before this one.
    if (!isCatching) {
      isCatching = true;
      queueMicrotask(() => {
        isCatching = false;
        queue.head.catch(() => {});
      });
    }

    return queue.head;
  };

  return queue;
}
