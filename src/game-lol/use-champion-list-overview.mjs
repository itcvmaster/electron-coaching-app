import { useMemo } from "react";

import {
  QUEUE_SYMBOL_TO_STR,
  RANK_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import Static from "@/game-lol/static.mjs";
import {
  getChampionsWithStats,
  getCurrentPatchForStaticData,
  getStaticData,
  mapQueueToSymbol,
  mapRankToSymbol,
} from "@/game-lol/util.mjs";

function useChampionsListOverview({ variables: originalVariables }) {
  const currentPatch = getCurrentPatchForStaticData();
  const championsFull = getStaticData("champions");

  const variables = { ...originalVariables };
  const { role, rank, queue, patch = currentPatch } = variables;
  variables.patch = patch;
  if (rank) {
    const rankSymbol = mapRankToSymbol(rank);
    const tier = RANK_SYMBOL_TO_STR[rankSymbol].capped;

    delete variables.rank;
    if (tier) {
      variables.tier = tier;
    }
  }

  if (
    role?.toLowerCase() === "all" ||
    QUEUE_SYMBOL_TO_STR[mapQueueToSymbol(queue)]?.hideRole
  )
    delete variables.role;

  variables.include_tier_ranks = true;
  variables.include_matchup_stats = true;
  variables.matchup_stats_limit = 4;

  const data = getStaticData("champions", variables.patch);

  const staticChamps = championsFull;
  const championsWithStats = useMemo(() => {
    return getChampionsWithStats(data?.data?.data);
  }, [data?.data?.data]);

  const championsList = useMemo(() => {
    if (championsWithStats && staticChamps) {
      return championsWithStats.map((_champ) => {
        const champ = { ..._champ };
        const staticChamp =
          staticChamps.data[staticChamps.keys[champ.champion_id]];
        const { id, key } = staticChamp;
        champ.champion = {
          ...staticChamp,
          key,
          id,
          avatar: Static.getChampionImage(key),
        };

        champ.matchups = (champ.matchups || []).map(
          ({ win_rate, ...matchup }) => {
            const newMatchup = {
              ...matchup,
            };
            const matchupStaticChamp =
              staticChamps.data[staticChamps.keys[matchup.champion_id]];
            const { id: matchupId, key: matchupKey } = matchupStaticChamp;

            newMatchup.champion = {
              ...matchupStaticChamp,
              key: matchupKey,
              id: matchupId,
              avatar: Static.getChampionImage(matchupKey),
            };
            newMatchup.winRate = Number.parseInt((win_rate || 0) * 100).toFixed(
              1
            );
            return newMatchup;
          }
        );

        return champ;
      });
    }
    return [];
  }, [championsWithStats, staticChamps]);

  return {
    championsList,
  };
}

export default useChampionsListOverview;
