// attr can be string or array
// ex:) "key.data", or ["key", "data"]
export default function (obj, attrs) {
  if (!obj) return null;

  let passedAttrs = attrs;
  if (typeof attrs === "string") {
    passedAttrs = attrs.split(".");
  } else if (!Array.isArray(attrs)) {
    throw new Error("attrs in getNestedData should be string or array.");
  }

  return passedAttrs.reduce((v, key) => (v ? v[key] : v), obj);
}
