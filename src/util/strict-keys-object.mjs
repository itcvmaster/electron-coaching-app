/**
 * This is to catch early on any maintenance issues arising from
 * object keys being changed or removed.
 */
const strictKeyTrap = (target, key, receiver) => {
  if (typeof key === "string" && !target.hasOwnProperty(key))
    throw new Error(`Key "${key}" does not exist.`);

  return Reflect.get(target, key, receiver);
};

export default function makeStrictKeysObject(target = {}) {
  return new Proxy(target, { get: strictKeyTrap });
}
