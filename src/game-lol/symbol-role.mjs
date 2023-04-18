import { ROLE_MAP } from "@/game-lol/constants.mjs";

/**
 * Cast strings to symbols, used for data model transformation.
 */
export default function SymbolRole(value) {
  if (typeof value === "symbol") return value;
  return ROLE_MAP[`${value}`.toLowerCase()];
}
