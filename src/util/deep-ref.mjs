import { ref } from "valtio";

/**
 * This function marks all nested objects as refs for valtio to completely
 * neuter reactivity. The main reason to do this is to prevent mutations
 * on objects we have persisted in the DB to reflect in any UI.
 */
export default function deepRef(obj) {
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === "object") {
      obj[key] = deepRef(value);
    }
  }
  return ref(obj);
}
