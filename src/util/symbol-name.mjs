import { devWarn } from "@/util/dev.mjs";

// This is a global registry of symbols we create. It is used mainly for
// serializing symbols. We want to differentiate the symbols we create within
// our app, versus any symbols which may be created from third-party libraries.
// Also, `Symbol.for()` method is not guaranteed to return an existing symbol,
// nor does it inform when a new symbol is created instead of returning an
// existing one.
export const symbolMap = {};

// The purpose of naming symbols this way is to discourage devs from casting
// the symbol descriptor to a string, and to easily catch it if it happens.
// Also as a way to enforce symbol descriptions for easier debugging.
export default function symbolName(str) {
  if (!str) throw new Error("Symbol description is required.");

  if (!/^[a-z0-9-]*$/.test(str))
    throw new Error(
      `Symbol description must be all lowercase alpha-numeric and dasherized: ${str}`
    );

  // Adding some string to our symbol description should prevent any potential
  // overlap from other code which may rely on `Symbol.for()`.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for#examples
  const description = `$$ ${str}`;

  if (symbolMap.hasOwnProperty(description)) {
    devWarn(
      `Symbol with description "${str}" already exists. Choose a unique name.`
    );
    return symbolMap[description];
  }
  const symbol = Symbol(description);
  symbolMap[description] = symbol;
  return symbol;
}
