export function mock(obj, key, value) {
  const original = obj[key];
  obj[key] = value;
  return () => {
    obj[key] = original;
  };
}

export function deepEqual(a, b) {
  if (a === b) return true;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}
