import symbolName from "@/util/symbol-name.mjs";

const stringsToSymbols = (arr) => {
  return arr.reduce((hash, string) => {
    hash[string] = symbolName(
      string.replaceAll(/([A-Z])/g, (_, a) => `-${a.toLowerCase()}`)
    );
    return hash;
  }, {});
};

export default stringsToSymbols;
