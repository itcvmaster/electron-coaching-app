import { REGION_MAP } from "@/game-lol/constants.mjs";

/**
 * Cast strings to symbols, used for data model transformation.
 */
export default function SymbolRegion(value) {
  if (typeof value === "symbol") return value;
  return REGION_MAP[`${value}`.toLowerCase()];
}
