import clone from "@/util/clone.mjs";

/**
 * Creates a valtio subscription callback that provides both the
 * previous and next state. The previous state value is cloned and
 * safe to mutate. Every call to this function will result in a copy of
 * the watched state held in memory. State is cloned to protect against
 * unwanted side effects.
 * @param {function} callback - The callback that will receive the previous
 * value and standard arguments for the valtio subscription callback. Example:
 * (prev, next) => {}
 * @param {any} initialValue - An optional initial value for the previous value
 */
export default function subscriptionStateDiff(callback, initialValue) {
  let previous = clone(initialValue);
  return (state, ...args) => {
    try {
      callback(previous, state, ...args);
    } finally {
      previous = state === null ? previous : clone(state);
    }
  };
}
