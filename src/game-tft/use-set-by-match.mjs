import StaticTFT from "@/game-tft/static.mjs";
import useMatch from "@/game-tft/use-match.mjs";

/**
 * Gives back the set that corresponds to the current match's date
 * This is normally used in routes that have matches already fetched
 * and stored into tft.matches + any parameter that looks like a match id
 * otherwise the fallback set will be returned
 * @returns {string|*}
 */
export default function useSetByMatch() {
  const currentMatch = useMatch();
  if (currentMatch && !(currentMatch instanceof Error)) {
    return StaticTFT.getMatchSetByDate(currentMatch.data.createdAt);
  }
  return StaticTFT.getMatchSetByDate();
}
