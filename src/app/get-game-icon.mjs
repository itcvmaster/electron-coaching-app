// EXEMPT
import {
  GAME_SYMBOL_CSGO,
  GAME_SYMBOL_FN,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_LOR,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import IconCSGO from "@/inline-assets/csgo.svg";
import IconFortnite from "@/inline-assets/fn.svg";
import IconLoL from "@/inline-assets/lol.svg";
import IconLoR from "@/inline-assets/lor.svg";
import IconTFT from "@/inline-assets/tft.svg";
import IconValorant from "@/inline-assets/valorant.svg";

const map = {
  [GAME_SYMBOL_LOL]: IconLoL,
  [GAME_SYMBOL_TFT]: IconTFT,
  [GAME_SYMBOL_LOR]: IconLoR,
  [GAME_SYMBOL_VAL]: IconValorant,
  [GAME_SYMBOL_FN]: IconFortnite,
  [GAME_SYMBOL_CSGO]: IconCSGO,
};

export default function getGameIcon(symbol) {
  return map[symbol] || null;
}
