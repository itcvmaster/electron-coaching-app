import { useMemo } from "react";

import { readState } from "@/__main__/app-state.mjs";
import { MIN_STRING_DISTANCE } from "@/app/constants.mjs";
import {
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import {
  getCurrentPatchForStaticData,
  getStaticData,
} from "@/game-lol/util.mjs";
import { calcRate } from "@/util/helpers.mjs";
import stringCompare from "@/util/string-compare.mjs";

const useChampionsTierlist = ({ filterParams, searchParams }) => {
  const { searchText, role, queue } = filterParams;
  const patch = getCurrentPatchForStaticData();
  const champions = getStaticData("champions", patch);

  const tableData = useMemo(() => {
    const championsStats = readState.lol.championStats?.[btoa(searchParams)];

    if (!champions || !championsStats || championsStats instanceof Error) {
      return [];
    }

    return championsStats.map((champStats) => {
      const championKey = champions.keys[champStats.championId];
      const champion = champions[championKey];
      const championName = champion.name;
      return {
        patch: champStats.patch,
        role: champStats.role,
        championKey,
        championName,
        tier: champStats.tierListTier?.tierRank,
        winRate: calcRate(champStats.wins, champStats.games),
      };
    });
  }, [champions, searchParams]);

  const filteredData = useMemo(() => {
    const aramFilter = queue === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].gql;

    const data =
      !role || aramFilter
        ? tableData
        : tableData.filter(
            (c) =>
              role === ROLE_SYMBOL_TO_STR[c.role].gql ||
              role === ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].gql
          );

    return data
      .filter(
        (c) =>
          c.tier &&
          (!searchText ||
            stringCompare(searchText, c.championName) > MIN_STRING_DISTANCE)
      )
      .sort((a, b) => a.tier - b.tier)
      .reduce((acc, curr) => {
        const grp = curr.tier - 1;

        if (!acc[grp]) acc[grp] = [];
        acc[grp] = [...acc[grp], curr];

        return acc;
      }, []);
  }, [tableData, searchText, role, queue]);

  return filteredData;
};

export default useChampionsTierlist;
