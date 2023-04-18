/**
 * Use this if there is already an object that has too many keys and it's safe
 * to remove old keys.
 */
function pruneKeys(obj, maxKeys = 100) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length - maxKeys; i++) {
    const key = keys[i];
    delete obj[key];
  }
  return obj;
}

export default pruneKeys;
