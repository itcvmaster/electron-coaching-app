// Deep clone utility function.
export default function clone(obj) {
  // Note: using the spread operator here copies symbols.
  const c = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === "object") {
      c[key] = clone(value);
    }
  }
  return c;
}
