import LolColor from "@/game-lol/colors.mjs";
import { RANK_SYMBOL_TO_STR, RANK_SYMBOLS } from "@/game-lol/constants.mjs";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";

// Helper tool to convert TFT data to work with LoL distribution graph data structure
export default function useDistribution(distribution = {}) {
  let highestValue = 0;
  const transformed = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)
    .reverse()
    .map((Symbol) => {
      if (Symbol === RANK_SYMBOLS.platinumPlus) return null;
      const SymbolValues = RANK_SYMBOL_TO_STR[Symbol];
      const RankIcon = getHextechRankIcon(
        SymbolValues.t.fallback.toLowerCase()
      );
      const rankValue = distribution[SymbolValues.capped];
      highestValue = Math.max(highestValue, rankValue);
      return {
        key: SymbolValues.key,
        value: rankValue,
        text: Math.floor(rankValue),
        img: RankIcon,
        fillColor: LolColor.ranks[SymbolValues.key].fill,
      };
    });

  return {
    distribution: transformed,
    highestValue,
  };
}
