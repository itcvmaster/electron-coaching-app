import { QUEUE_SYMBOL_TO_STR, QUEUE_SYMBOLS } from "@/game-lol/constants.mjs";

export default function (queue) {
  switch ((queue || "").toString().toLowerCase()) {
    case "ranked-solo-duo":
    case "ranked solo/duo":
    case "ranked_solo_5x5":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql;
    case "420":
    case 420:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].key);
    case "ranked-flex":
    case "ranked flex":
    case "ranked_flex_sr":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedFlex].gql;
    case "440":
    case 440:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedFlex].key);
    case "normal-draft":
    case "normal draft":
    case "summoners_rift_draft_pick":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.normalDraft].gql;
    case "400":
    case 400:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.normalDraft].key);
    case "normal-blind":
    case "normal blind":
    case "summoners_rift_blind_pick":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.normalBlind].gql;
    case "430":
    case 430:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.normalBlind].key);
    case "urf":
    case "summoner_rift_urf":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.urf].gql;
    case "900":
    case 900:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.urf].key);
    case "aram":
    case "howling_abyss_aram":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].gql;
    case "450":
    case 450:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].key);
    case "3v3-ranked":
    case "3v3 ranked":
    case "ranked_flex_tt":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.ranked3v3].gql;
    case "470":
    case 470:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.ranked3v3].key);
    case "3v3-draft":
    case "3v3 blind":
    case "twisted_treeline_blind_pick":
      return QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.draft3v3].gql;
    case "460":
    case 460:
      return Number(QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.draft3v3].key);
    default:
      return null;
  }
}
