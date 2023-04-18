// TODO: WTF?? REMOVE in favor of native map

import ArrayReduce from "@/util/reduce.mjs";

const map = (array, mapFn) => {
  return ArrayReduce(
    array,
    (mappedArray, value) => {
      mappedArray.push(mapFn(value));

      return mappedArray;
    },
    []
  );
};

export default map;
