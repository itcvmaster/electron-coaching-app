// TODO: wtf? remove...

import get from "@/util/get.mjs";
import mapArray from "@/util/map-array.mjs";

const invoke = function (collection, functionOrKey, args, restProps, other) {
  //invoke when provided a method name
  if (typeof functionOrKey === "string") {
    return mapArray(collection, function (val) {
      return val[functionOrKey](args);
    })[0];
  }
  //invoke when provided a function reference
  return mapArray(collection, function () {
    const computedMethod = get(collection, functionOrKey);
    return computedMethod(args, restProps, other);
  })[0];
};

export default invoke;
