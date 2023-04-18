import React, { useCallback, useMemo, useState } from "react";

import router, { setRoute } from "@/__main__/router.mjs";
import ChampionsFilter from "@/game-lol/ChampionsFilter.jsx";
import { FILTER_SYMBOLS } from "@/game-lol/constants.mjs";
import {
  getCurrentPatchForChampions,
  getCurrentPatchForStaticData,
  getDefaultedFiltersForChampions,
  getSearchParamsForChampions,
  trimPatchForDisplay,
} from "@/game-lol/util.mjs";
import { useTransientRoute } from "@/util/router-hooks.mjs";

// {searchText, role, rank, region, queue} = filterParams
const navigateToRoute = (urlParams) => {
  const path = router?.route?.currentPath;
  setRoute(path, urlParams);
};

const isStateFilter = (key, isSynergiesFilter) => {
  const stateFilterKeys = isSynergiesFilter
    ? [FILTER_SYMBOLS.searchText]
    : [FILTER_SYMBOLS.searchText, FILTER_SYMBOLS.role];
  return stateFilterKeys.includes(key);
};

const useChampionsFilter = (props) => {
  const { isSynergiesFilter } = props;

  // in champions overview page, we are using searchText, role, rank, region, queue, patch
  // and roles include "all"
  // and if changed rank, region, queue, then navigate. otherwise just setState.
  // in champions synergies page, we are using searchText, role, duoRole, rank, region, queue
  // and roles exclude "all"
  // and if changed role, duoRole, rank, region, queue, then navigate. otherwise just setState.
  const { searchParams } = useTransientRoute();
  const defaultFilter = getDefaultedFiltersForChampions(
    isSynergiesFilter,
    searchParams
  );

  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState(defaultFilter.role);
  const patch = trimPatchForDisplay(
    getCurrentPatchForChampions() || getCurrentPatchForStaticData()
  );

  const filter = useMemo(() => {
    return isSynergiesFilter
      ? {
          role: defaultFilter.role,
          duoRole: defaultFilter.duoRole,
          tier: defaultFilter.tier,
          region: defaultFilter.region,
          queue: defaultFilter.queue,
          searchText, // using state value, this param is not reflected to searchParams
        }
      : {
          role: selectedRole,
          tier: defaultFilter.tier,
          region: defaultFilter.region,
          queue: defaultFilter.queue,
          searchText, // using state value, this param is not reflected to searchParams
        };
  }, [selectedRole, isSynergiesFilter, defaultFilter, searchText]);

  const doFilter = useCallback(
    (filterParams) => {
      const urlParams = getSearchParamsForChampions(
        isSynergiesFilter,
        filterParams
      );
      navigateToRoute(urlParams);
    },
    [isSynergiesFilter]
  );

  const setFilter = useCallback(
    (key, val) => {
      switch (key) {
        case FILTER_SYMBOLS.searchText:
          setSearchText(val);
          break;
        case FILTER_SYMBOLS.role:
          if (isStateFilter(key, isSynergiesFilter)) setSelectedRole(val);
          else doFilter({ ...filter, role: val });
          break;
        case FILTER_SYMBOLS.duoRole:
          doFilter({ ...filter, duoRole: val });
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
      }
    },
    [filter, isSynergiesFilter, doFilter]
  );

  // champions filter bar
  const View = useMemo(
    () => (
      <ChampionsFilter
        searchText={filter.searchText}
        role={filter.role ?? null}
        duoRole={filter.duoRole}
        tier={filter.tier}
        region={filter.region}
        queue={filter.queue}
        patch={patch}
        setFilter={setFilter}
        isSynergiesFilter={isSynergiesFilter}
      />
    ),
    [isSynergiesFilter, patch, filter, setFilter]
  );

  return {
    FilterBar: View,
    ...filter,
  };
};

export default useChampionsFilter;
