import React, { useCallback, useMemo, useState } from "react";

import { setRoute } from "@/__main__/router.mjs";
import ChampionFilter from "@/game-lol/ChampionFilter.jsx";
import { FILTER_SYMBOLS } from "@/game-lol/constants.mjs";
import {
  getChampionRoleById,
  getDefaultedFiltersForChampion,
  getSearchParamsForChampion,
} from "@/game-lol/util.mjs";
import { useTransientRoute } from "@/util/router-hooks.mjs";

// {matchupChampion, role, rank, region, queue} = filterParams
const navigateToRoute = (championKey, tab, matchupChampionKey, urlParams) => {
  const pathname = `/lol/champions/${championKey}/${tab}/${
    matchupChampionKey || ""
  }`;
  setRoute(pathname, urlParams.toString());
};

const useChampionFilter = (tab, champion, matchupChampion) => {
  // tab is one of "overview" | "probuilds" | "trends" | "counters"
  const {
    // parameters: [championKey],
    searchParams,
  } = useTransientRoute();
  const championKey = champion?.key;
  const defaultRole = getChampionRoleById(champion?.id);
  const defaultFilter = getDefaultedFiltersForChampion(
    searchParams,
    defaultRole
  );
  const [victoryOnly, setVictoryOnly] = useState(false);
  const filter = useMemo(
    () => ({
      tier: defaultFilter.tier,
      region: defaultFilter.region,
      queue: defaultFilter.queue,
      role: defaultFilter.role,
    }),
    [defaultFilter]
  );

  const doFilter = useCallback(
    (filterParams) => {
      const filters = {
        role: filterParams.role,
        tier: filterParams.tier,
        queue: filterParams.queue,
        region: filterParams.region,
      };
      const urlParams = getSearchParamsForChampion(filters);
      navigateToRoute(championKey, tab, filterParams.matchup, urlParams);
    },
    [tab, championKey]
  );

  const setFilter = useCallback(
    (key, val) => {
      switch (key) {
        case FILTER_SYMBOLS.matchup:
          doFilter({ ...filter, matchup: val });
          break;
        case FILTER_SYMBOLS.role:
          doFilter({ ...filter, role: val });
          break;
        case FILTER_SYMBOLS.tier:
          doFilter({ ...filter, tier: val });
          break;
        case FILTER_SYMBOLS.queue:
          doFilter({ ...filter, queue: val });
          break;
        case FILTER_SYMBOLS.region:
          doFilter({ ...filter, region: val });
          break;
        case FILTER_SYMBOLS.victoryOnly:
          setVictoryOnly(val);
          break;
        case FILTER_SYMBOLS.team:
          doFilter({ ...filter, team: val });
          break;
      }
    },
    [filter, doFilter]
  );

  // champions filter bar
  const View = useMemo(() => {
    return (
      <ChampionFilter
        searchText={filter.searchText}
        role={filter.role}
        tier={filter.tier}
        region={filter.region}
        queue={filter.queue}
        team={filter.team}
        victoryOnly={victoryOnly}
        setFilter={setFilter}
        tab={tab}
        matchupChampion={matchupChampion}
      />
    );
  }, [tab, filter, matchupChampion, victoryOnly, setFilter]);

  return {
    FilterBar: View,
    victoryOnly,
    ...filter,
  };
};

export default useChampionFilter;
