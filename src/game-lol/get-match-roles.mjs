import { ROLE_SYMBOL_TO_STR, ROLE_SYMBOLS } from "@/game-lol/constants.mjs";

export default function (role) {
  switch (role?.toLowerCase()) {
    case "top":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.top].key;
    case "jungle":
    case "jungler":
    case "jng":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.jungle].key;
    case "solo":
    case "mid":
    case "middle":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.mid].key;
    case "bot":
    case "bottom":
    case "duo":
    case "duo_carry":
    case "carry":
    case "adc":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.adc].key;
    case "support":
    case "duo_support":
    case "sup":
    case "utility":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.support].key;
    case "specialist":
    case "all":
      return ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].key;
    default:
      return "NONE";
  }
}
