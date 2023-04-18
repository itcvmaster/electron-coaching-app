// EXEMPT
import {
  GAME_SYMBOL_APEX,
  GAME_SYMBOL_CSGO,
  GAME_SYMBOL_FN,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_LOR,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_UNKNOWN,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";

export function translateGameNames(t, value) {
  switch (value) {
    case GAME_SYMBOL_LOL:
      return t("common:games.lol.long", "League of Legends");
    case GAME_SYMBOL_TFT:
      return t("common:games.tft.long", "Teamfight Tactics");
    case GAME_SYMBOL_LOR:
      return t("common:games.lor.long", "Legends of Runeterra");
    case GAME_SYMBOL_FN:
      return t("common:games.fn.long", "Fortnite");
    case GAME_SYMBOL_VAL:
      return t("common:games.val.long", "Valorant");
    case GAME_SYMBOL_CSGO:
      return t("common:games.csgo.long", "Counter Strike: Global Offensive");
    case GAME_SYMBOL_APEX:
      return t("common:games.apex.long", "Apex Legends");
    case GAME_SYMBOL_UNKNOWN:
      return t("common:allGames", "All Games");
    default:
      return value;
  }
}
