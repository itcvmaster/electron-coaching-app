// TODO: deprecate all usage of this in favor of optional chaining operator!

export const get = (object, keyPath, defaultVal) => {
  const keys = Array.isArray(keyPath) ? keyPath : keyPath.split(".");
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return get(object, keys.slice(1));
  }
  return object === undefined ? defaultVal : object;
};

export default get;
