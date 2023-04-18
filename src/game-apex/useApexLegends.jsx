import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import orderArrayBy from "@/util/order-array-by.mjs";

function useApexLegends({
  season,
  mode,
  profileId,
  type,
  // isAllStats,
  // skip,
}) {
  const state = useSnapshot(readState);

  const legendsObj =
    state.apex?.playerStats?.[profileId]?.[season]?.[mode]?.characters;

  const { legends, totalGames } = useMemo(() => {
    let totalGames = 0;
    const legends = legendsObj
      ? orderArrayBy(
          Object.entries(legendsObj)
            .map(([champion_id, value]) => ({
              ...value,
              champion_id,
            }))
            .filter((c) => {
              totalGames += c.games_played;
              return c.games_played;
            })
            .map((c) => ({
              ...c,
              killsPerMatch: c.kills / c.games_played,
              damagePerMatch: c.damage_done / c.games_played,
              pickRate: c.games_played / totalGames,
            })),
          [type || "placements_win", "kills"],
          "desc"
        )
      : [];
    return { legends, totalGames };
  }, [legendsObj, type]);

  return {
    legends,
    totalGames,
    // loading: isLoading,
    // error: error,
  };
}

export default useApexLegends;
