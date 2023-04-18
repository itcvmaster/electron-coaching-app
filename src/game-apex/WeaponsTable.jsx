import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { updateRoute } from "@/__main__/router.mjs";
import FilterModes from "@/game-apex/FilterModes.jsx";
import FilterSeasons from "@/game-apex/FilterSeasons.jsx";
import useApexWeapons from "@/game-apex/useApexWeapons.jsx";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import InfiniteTable from "@/shared/InfiniteTable.jsx";
import {
  DefaultIcon,
  FilterSelectContainer,
  FlexContainer,
  HeaderLabel,
  HeaderWrapper,
  SortIconWrapper,
  TabContainer,
} from "@/shared/InfiniteTable.style.jsx";
import WeaponHitItem from "@/shared/WeaponHitItem.jsx";
import { convertQueryToWriteStatePath } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const WeaponsTable = ({ matchWeapons, hiddenFilters, hideAccuracy }) => {
  const { t } = useTranslation();

  const {
    parameters: [profileId],
    searchParams,
    visibleMatches,
    currentPath,
  } = useRoute();
  const seasonParam = searchParams.get("season") || "all";
  const modeParam = searchParams.get("mode") || "all";
  const typeParam = searchParams.get("type") || "kills";
  const state = useSnapshot(readState);

  const weapons = state.apex.meta?.weapons;
  const isAllStats = currentPath.startsWith("/apex/stats");

  const { weapons: aggWeapons } = useApexWeapons({
    season: seasonParam,
    mode: modeParam,
    profileId,
    isAllStats,
    type: typeParam,
  });

  const curWeapons = matchWeapons ? matchWeapons : aggWeapons;

  const updateSeason = (season) => {
    const search = convertQueryToWriteStatePath({
      season,
      mode: modeParam,
      type: typeParam,
    });
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const updateMode = (mode) => {
    const search = convertQueryToWriteStatePath({
      season: seasonParam,
      mode,
      type: typeParam,
    });
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const updateType = ({ sortBy }) => {
    const search = convertQueryToWriteStatePath({
      season: seasonParam,
      mode: modeParam,
      type: sortBy,
    });
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
        case "weaponId": {
          const { imageUrl: weaponImgUrl, name: weaponName } =
            weapons[cellData] || {};
          return (
            <>
              <img src={weaponImgUrl} className="champion-image" />
              {weaponName}
            </>
          );
        }
        case "kills":
        case "damage_done":
          return typeof cellData === "number" ? getLocaleString(cellData) : "-";
        case "accuracy":
        case "headshotPercentage":
          return typeof cellData === "number"
            ? t("common:percent", "{{percent, percent}}", {
                percent: cellData,
              })
            : "-";
        case "allShots": {
          const { bodyshots, headshots } = cellData;
          return (
            <WeaponHitItem
              headshots={headshots}
              bodyshots={bodyshots}
              hasLegshots={false}
            />
          );
        }
      }
    },
    [weapons, t]
  );

  const cols = useMemo(
    () => [
      {
        label: "Rank",
        i18nKey: "common:rank",
        dataKey: "rank",
        width: 10,
        sortable: false,
      },
      {
        label: "Weapon",
        i18nKey: "common:weapon",
        dataKey: "weaponId",
        width: hideAccuracy ? 40 : 28,
        sortable: false,
        className: DefaultIcon(),
      },
      {
        label: "Kills",
        i18nKey: "common:kills",
        dataKey: "kills",
        width: 12,
        sortable: true,
      },
      {
        label: "Damage",
        i18nKey: "common:damage",
        dataKey: "damage_done",
        width: 12,
        sortable: true,
      },
      ...(hideAccuracy
        ? []
        : [
            {
              label: "Accuracy",
              i18nKey: "common:accuracy",
              dataKey: "accuracy",
              width: 14,
              sortable: true,
            },
          ]),
      {
        label: "Headshot %",
        i18nKey: "common:headshotPercentage",
        dataKey: "headshotPercentage",
        width: 14,
        sortable: true,
      },
      {
        label: "Hits",
        i18nKey: "common:hits",
        dataKey: "allShots",
        width: 10,
        sortable: false,
      },
    ],
    [hideAccuracy]
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
          data={curWeapons}
          sortBy={typeParam}
          sortDirection={"DESC"}
          sort={updateType}
          rowCount={curWeapons.length}
          rowGetter={({ index }) => curWeapons[index]}
          colRenderer={colRenderer}
          headerRenderer={headerRenderer}
          cols={cols}
        />
      </FlexContainer>
    </TabContainer>
  );
};

export default WeaponsTable;
