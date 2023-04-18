const isTrueObject = (x) => typeof x === "object" && x !== null;

// returns the difference between two objects
export default function diff(left, right) {
  if (!isTrueObject(left) || !isTrueObject(right)) {
    if (left === right) return undefined;
    return right;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const lengthDiff = left.length - right.length;
    if (lengthDiff !== 0) return right;
    for (let l = 0; l < left.length; l++) {
      const leftEntry = left[l];
      const rightEntry = right[l];
      if (isTrueObject(leftEntry) && isTrueObject(rightEntry)) {
        const result = diff(leftEntry, rightEntry);
        if (result !== undefined) return right;
      } else if (leftEntry !== rightEntry) {
        return right;
      }
    }
    return undefined;
  } else if (Array.isArray(left) || Array.isArray(right)) {
    return right;
    // eslint-disable-next-line no-else-return
  } else {
    const finalDiff = {};
    for (const rightHash of Object.keys(right)) {
      if (left[rightHash] === undefined) {
        finalDiff[rightHash] = right[rightHash];
      } else if (
        isTrueObject(left[rightHash]) &&
        isTrueObject(right[rightHash])
      ) {
        const result = diff(left[rightHash], right[rightHash]);
        if (result !== undefined) finalDiff[rightHash] = result;
      } else if (left[rightHash] !== right[rightHash]) {
        finalDiff[rightHash] = right[rightHash];
      }
    }
    for (const leftHash of Object.keys(left))
      if (right[leftHash] === undefined) finalDiff[leftHash] = null;

    if (Object.keys(finalDiff).length === 0) return undefined;
    return finalDiff;
  }
}
