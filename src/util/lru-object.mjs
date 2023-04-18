import symbolName from "@/util/symbol-name.mjs";

const maxKeysSymbol = symbolName("max-keys");

const handlers = {
  set: lruSet,
};

function lruSet(target) {
  const maxKeys = target[maxKeysSymbol];
  const keys = Object.keys(target);
  if (keys.length >= maxKeys) {
    // The implicit assumption is that the ordering of keys is based on
    // insertion order.
    delete target[keys[0]];
  }
  return Reflect.set(...arguments);
}

/**
 * Creates a proxy object that aggressively prunes keys if they overflow.
 */
function lruObject(obj = {}, maxKeys = 100) {
  obj[maxKeysSymbol] = maxKeys;
  const proxy = new Proxy(obj, handlers);
  return proxy;
}

export default lruObject;
