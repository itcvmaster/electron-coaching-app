/**
 * Recursively merge key/values from the second object to the first, but
 * only if the keys do not exist on the first.
 */
export default function optionalMerge(obj1, obj2) {
  for (const key in obj2) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (!obj1.hasOwnProperty(key)) {
      obj1[key] = value2;
    } else if (
      value1 &&
      value2 &&
      typeof value1 === "object" &&
      typeof value2 === "object"
    ) {
      optionalMerge(value1, value2);
    }
  }
  return obj1;
}
