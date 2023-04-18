import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { updateRoute } from "@/__main__/router.mjs";
import FilterModes from "@/game-apex/FilterModes.jsx";
import FilterSeasons from "@/game-apex/FilterSeasons.jsx";
import useApexLegends from "@/game-apex/useApexLegends.jsx";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import InfiniteTable from "@/shared/InfiniteTable.jsx";
import {
  FilterSelectContainer,
  FlexContainer,
  HeaderLabel,
  HeaderWrapper,
  RoundedIcon,
  SortIconWrapper,
  TabContainer,
} from "@/shared/InfiniteTable.style.jsx";
import { getLocaleString } from "@/util/i18n-helper.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const cols = [
  {
    label: "Rank",
    i18nKey: "common:rank",
    dataKey: "rank",
    width: 12,
    sortable: false,
  },
  {
    label: "Legend",
    i18nKey: "common:legend",
    dataKey: "champion_id",
    width: 28,
    sortable: false,
    className: RoundedIcon(),
  },
  {
    label: "Kills",
    i18nKey: "common:kills",
    dataKey: "killsPerMatch",
    width: 12,
    sortable: true,
  },
  {
    label: "Wins",
    i18nKey: "common:wins",
    dataKey: "placements_win",
    width: 12,
    sortable: true,
  },
  {
    label: "Pick Rate",
    i18nKey: "common:pickRate",
    dataKey: "pickRate",
    width: 12,
    sortable: true,
  },
  {
    label: "Dmg/Match",
    i18nKey: "common:dmgPerMatch",
    dataKey: "damagePerMatch",
    width: 12,
    sortable: true,
  },
  {
    label: "Matches",
    i18nKey: "common:matches",
    dataKey: "games_played",
    width: 12,
    sortable: true,
  },
];

const LegendsTable = ({ matchLegends, hiddenFilters }) => {
  const { t } = useTranslation();

  const {
    parameters: [profileId],
    searchParams,
    visibleMatches,
    currentPath,
  } = useRoute();
  const seasonParam = searchParams.get("season") || "all";
  const modeParam = searchParams.get("mode") || "all";
  const typeParam = searchParams.get("type") || "placements_win";
  const state = useSnapshot(readState);

  const legends = state.apex.meta?.legends;
  const isAllStats = currentPath.startsWith("/apex/stats");

  const { legends: aggLegends } = useApexLegends({
    season: seasonParam,
    mode: modeParam,
    profileId,
    isAllStats,
    type: typeParam,
  });

  const curLegends = matchLegends ? matchLegends : aggLegends;

  const updateSeason = (season) => {
    const search = `season=${season}&mode=${modeParam}&type=${typeParam}`;
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const updateMode = (mode) => {
    const search = `season=${seasonParam}&mode=${mode}&type=${typeParam}`;
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const updateType = ({ sortBy }) => {
    const search = `season=${seasonParam}&mode=${modeParam}&type=${sortBy}`;
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const headerRenderer = useCallback(
    ({ dataKey, sortable, sortBy, sortDirection, label }) => {
      const isActive = sortable && dataKey === sortBy;
      return (
        <HeaderWrapper>
          <HeaderLabel active={isActive ? 1 : 0}>{label}</HeaderLabel>
          {isActive && (
            <SortIconWrapper>
              {sortDirection === "ASC" ? <CaretUp /> : <CaretDown />}
            </SortIconWrapper>
          )}
        </HeaderWrapper>
      );
    },
    []
  );

  const colRenderer = useCallback(
    ({ dataKey, rowData, rowIndex }) => {
      const cellData = rowData?.[dataKey];
      switch (dataKey) {
        case "rank":
          return rowIndex + 1;
        case "champion_id": {
          const { imageUrl: legendImgUrl, name: legendName } =
            legends[cellData] || {};
          return (
            <>
              <img src={legendImgUrl} className="champion-image" />
              {legendName}
            </>
          );
        }
        case "kills":
        case "placements_win":
        case "games_played":
          return typeof cellData === "number" ? getLocaleString(cellData) : "-";
        case "killsPerMatch":
        case "damagePerMatch":
          return typeof cellData === "number"
            ? getLocaleString(cellData, {
                maximumFractionDigits: 1,
              })
            : "-";
        case "pickRate":
          return typeof cellData === "number"
            ? t("common:percent", "{{percent, percent}}", {
                percent: cellData,
              })
            : "-";
      }
    },
    [legends, t]
  );

  return (
    <TabContainer>
      {hiddenFilters ? null : (
        <FilterSelectContainer
          padding="var(--sp-3)"
          className="flex align-center gap-sp-3"
        >
          <FilterModes selected={modeParam} onChange={updateMode} />
          <FilterSeasons selected={seasonParam} onChange={updateSeason} />
        </FilterSelectContainer>
      )}
      <FlexContainer>
        <InfiniteTable
          data={curLegends}
          sortBy={typeParam}
          sortDirection={"DESC"}
          sort={updateType}
          rowCount={curLegends.length}
          rowGetter={({ index }) => curLegends[index]}
          colRenderer={colRenderer}
          headerRenderer={headerRenderer}
          cols={cols}
        />
      </FlexContainer>
    </TabContainer>
  );
};

export default LegendsTable;
