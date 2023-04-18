import { useMemo } from "react";

import useMatch from "@/game-tft/use-match.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

function useRoundInvalid(rounds = []) {
  // Hooks
  const {
    parameters: [, name],
  } = useRoute();
  // Memo: Determine the current game if it exists
  const currentMatch = useMatch();
  const isAPI = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return !!currentMatch.data.data;
    return true;
  }, [currentMatch]);
  return useMemo(() => {
    const isInvalidRounds = rounds.some((item) => {
      // Invalid round if there are any gaps. Gaps are represented by a hyphen.
      return typeof item?.round === "undefined" || item?.round === "-";
    });
    let isFirstRoundInvalid = false,
      isLastRoundInvalid = false;
    if (currentMatch && !(currentMatch instanceof Error)) {
      if (isAPI) {
        // Current player in API data
        const currentPlayer = currentMatch.data.data.find((player) =>
          new RegExp(player.name, "i").test(name)
        );
        // The last round if the HP > 0 and the player's placement is -1
        if (typeof rounds[rounds.length - 1]?.hp !== "undefined") {
          if (
            rounds[rounds.length - 1].hp > 0 &&
            currentPlayer?.placement === -1
          ) {
            isLastRoundInvalid = true;
          }
        }
      } else {
        // Current player in DLL data
        const currentPlayer = currentMatch.data.players.find((player) =>
          new RegExp(player.summonerName, "i").test(name)
        );
        // The last round if the HP > 0 and the player's placement is -1
        if (typeof rounds[rounds.length - 1]?.hp !== "undefined") {
          if (rounds[rounds.length - 1].hp > 0 && currentPlayer?.rank === -1) {
            isLastRoundInvalid = true;
          }
        }
      }
    }
    // The first round is not in stage 1 or 2
    if (typeof rounds[0]?.round[0] === "string") {
      isFirstRoundInvalid =
        rounds[0].round[0] !== "1" && rounds[0].round[0] !== "2";
    }
    // Return results
    return isInvalidRounds || isFirstRoundInvalid || isLastRoundInvalid;
  }, [currentMatch, isAPI, name, rounds]);
}

export default useRoundInvalid;
