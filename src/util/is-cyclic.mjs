export default function isCyclic(object) {
  const visitedSet = new Set();
  const stack = [];

  function detect(obj, keyStr) {
    stack.push(keyStr);

    if (typeof obj === "object") {
      if (visitedSet.has(obj)) {
        return true;
      }
      visitedSet.add(obj);

      for (const key in obj) {
        const nextObj = obj[key];
        if (detect(nextObj, key)) return true;
      }
      for (const sym of Object.getOwnPropertySymbols(obj)) {
        const nextObj = obj[sym];
        if (detect(nextObj, String(sym))) return true;
      }
    }
    stack.pop();
    visitedSet.delete(obj);
    return false;
  }

  if (detect(object, "MODEL")) {
    const stackTrace = stack.join("-> ");
    return stackTrace;
  }
  return false;
}
