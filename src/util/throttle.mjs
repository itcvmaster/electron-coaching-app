const fns = new Set();

/**
 * Careful: this relies on the identity of the function being called
 * to be equivalent by reference.
 */
export default function throttle(fn, delay = 100) {
  if (fns.has(fn)) return null;

  fns.add(fn);

  return setTimeout(() => {
    fns.delete(fn);
    fn();
  }, delay);
}
