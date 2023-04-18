export default function countBy(arr = []) {
  const obj = Object.create(null);
  if (!arr.length) return obj;
  let type;
  for (const i of arr) {
    if (typeof type === "undefined") type = typeof i;
    if (typeof i !== type) break; // Array item type is not consistent
    if (typeof i === "string") {
      if (typeof obj[i] === "number") {
        obj[i] += 1;
      } else {
        obj[i] = 1;
      }
      continue;
    }
    if (typeof i === "number") {
      const result = Math.floor(i);
      if (typeof obj[result] === "number") {
        obj[result] += 1;
      } else {
        obj[result] = 1;
      }
    }
    break; // countBy only accepts strings or numbers
  }
  return obj;
}
