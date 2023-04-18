import makeStrictKeysObject from "@/util/strict-keys-object.mjs";

// Working around circular deps.
export default makeStrictKeysObject({
  appInit: null,
});
