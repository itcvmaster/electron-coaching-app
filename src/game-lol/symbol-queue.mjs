import { QUEUE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";

const map = {};
for (const symbol of Object.getOwnPropertySymbols(QUEUE_SYMBOL_TO_STR)) {
  for (const k of ["gql", "key", "dashed"]) {
    const v = QUEUE_SYMBOL_TO_STR[symbol][k].toLowerCase();
    map[v] = symbol;
  }
}

/**
 * Cast strings to symbols, used for data model transformation.
 */
export default function SymbolQueue(value) {
  if (typeof value === "symbol") return value;
  return map[`${value}`.toLowerCase()];
}
