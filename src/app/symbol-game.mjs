// EXEMPT
import {
  GAME_SYMBOL_CSGO,
  GAME_SYMBOL_FN,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_LOR,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_UNKNOWN,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";

const GAME_SYMBOL_MAP = {
  league: GAME_SYMBOL_LOL,
  lol: GAME_SYMBOL_LOL,
  valorant: GAME_SYMBOL_VAL,
  val: GAME_SYMBOL_VAL,
  tft: GAME_SYMBOL_TFT,
  csgo: GAME_SYMBOL_CSGO,
  fortnite: GAME_SYMBOL_FN,
  runeterra: GAME_SYMBOL_LOR,
  lor: GAME_SYMBOL_LOR,
};

export function SymbolGame(value) {
  if (typeof value === "symbol") return value;
  return GAME_SYMBOL_MAP[`${value}`.toLowerCase()] || GAME_SYMBOL_UNKNOWN;
}
