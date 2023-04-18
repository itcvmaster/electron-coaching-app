import React, { useCallback, useMemo } from "react";
import { css, styled } from "goober";

import { readState } from "@/__main__/app-state.mjs";
import { MIN_STRING_DISTANCE } from "@/app/constants.mjs";
import { ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import Static from "@/game-lol/static.mjs";
import { getStaticData, getWinRateColor } from "@/game-lol/util.mjs";
import { calcKDA, calcRate } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";
import stringCompare from "@/util/string-compare.mjs";

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
};
const kdaOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
const amountOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const WinRate = styled("span")`
  color: ${(props) => props.color || "var(--shade0)"};
`;

const CommonColumnCss = `
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: var(--shade1);
  font-size: var(--sp-3_5);
`;
const CssChampionRank = () => css`
  ${CommonColumnCss}
`;
const CssChampionRole = () => css`
  ${CommonColumnCss}

  svg {
    stroke-width: 0;
    fill: currentcolor;
    stroke: currentcolor;
    width: 1.5em;
    height: 1.5em;
  }
`;
const CssChampionName = () => css`
  ${CommonColumnCss}
  justify-content: flex-start;
  color: var(--shade0);

  img {
    width: var(--sp-9);
    height: var(--sp-9);
    margin-right: var(--sp-6);
    border-radius: 50%;
  }

  span {
    color: var(--shade0);
  }
`;
const CssChampionWinRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionKDA = () => css`
  ${CommonColumnCss}
`;
const CssChampionDmgDealt = () => css`
  ${CommonColumnCss}
`;
const CssChampionDmgMitigated = () => css`
  ${CommonColumnCss}
`;
const CssChampionHeals = () => css`
  ${CommonColumnCss}
`;
const CssChampionMatches = () => css`
  ${CommonColumnCss}
`;

// Rank, Role, Champion, WinRate, KDA, Damage Dealt, Dmg Mitigated, Heals, Matches
const cols = [
  {
    label: "Rank",
    i18nKey: "lol:rank",
    dataKey: "rank",
    width: 6,
    className: CssChampionRank,
    sortable: false,
  },
  {
    label: "Role",
    i18nKey: "lol:role",
    dataKey: "role",
    width: 9,
    className: CssChampionRole,
    sortable: true,
  },
  {
    label: "Champion",
    i18nKey: "lol:champion",
    dataKey: "championKey",
    width: 20,
    className: CssChampionName,
    sortable: true,
  },
  {
    label: "Win Rate",
    i18nKey: "lol:winRate",
    dataKey: "winRate",
    width: 12,
    className: CssChampionWinRate,
    sortable: true,
  },
  {
    label: "KDA",
    i18nKey: "lol:kda",
    dataKey: "kda",
    width: 8,
    className: CssChampionKDA,
    sortable: true,
  },
  {
    label: "Dmg/min.",
    i18nKey: "lol:dmgPerMin",
    dataKey: "dmgDealt",
    width: 12,
    className: CssChampionDmgDealt,
    sortable: true,
  },
  {
    label: "Dmg Mitigated",
    i18nKey: "lol:dmgMitigated",
    dataKey: "dmgMitigated",
    width: 11,
    className: CssChampionDmgMitigated,
    sortable: true,
  },
  {
    label: "Heals",
    i18nKey: "lol:heals",
    dataKey: "heals",
    width: 11,
    className: CssChampionHeals,
    sortable: true,
  },
  {
    label: "Matches",
    i18nKey: "lol:matches",
    dataKey: "matches",
    width: 11,
    className: CssChampionMatches,
    sortable: true,
  },
];

const useChampionsCombat = ({ filterParams, searchParams }) => {
  const { searchText, role } = filterParams;
  const champions = getStaticData("champions");

  const tableData = useMemo(() => {
    const championsStats =
      readState.lol.championStats?.[btoa(searchParams)] || [];
    if (readState.lol.championStats instanceof Error) {
      return [];
    }

    return championsStats.map((champStats, i) => {
      const championKey = champions.keys[champStats.championId];
      const champion = champions[championKey];
      const championName = champion.name;

      // when the new champion released, we have some trouble which is not synced with static champions and champion stats.
      // to prevent this trouble, following comparison is required.
      if (!champion || !championKey) {
        return null;
      }

      return {
        rank: i + 1,
        role: champStats.role,
        championKey,
        championName,
        champion,
        winRate: calcRate(champStats.wins, champStats.games),
        kda: calcKDA(champStats.kills, champStats.deaths, champStats.assists),
        dmgDealt: calcRate(
          champStats.totalDamageDealtToChampions,
          champStats.timePlayed / 60
        ),
        dmgMitigated: calcRate(
          champStats.damageSelfMitigated,
          champStats.games
        ),
        heals: calcRate(champStats.totalHeal, champStats.games),
        matches: champStats.games,
      };
    });
  }, [champions, searchParams]);

  const filteredData = useMemo(() => {
    // the data is what fetched by all roles.
    // so if empty s search string or all roles, then return it.
    if (!searchText && !role) return tableData;

    return tableData?.filter(
      (v) =>
        (!searchText ||
          stringCompare(searchText, v.championName) > MIN_STRING_DISTANCE) &&
        (ROLE_SYMBOL_TO_STR[v.role]?.key === role || role === "all")
    );
  }, [tableData, searchText, role]);

  const colRenderer = useCallback(
    ({ dataKey, rowData, rowIndex }) => {
      const cellData = rowData?.[dataKey];
      switch (dataKey) {
        case "rank":
          return rowIndex + 1;
        case "role": {
          const roleData = ROLE_SYMBOL_TO_STR[cellData];
          const Icon = getRoleIcon(roleData?.key);
          return roleData && <Icon width="20" />;
        }
        case "championKey":
          return (
            <>
              <img
                className="champion-image"
                src={Static.getChampionImage(cellData)}
                loading={rowIndex > 20 ? "lazy" : "eager"}
              />
              <a href={`/lol/champions/${cellData}`} className="champion-name">
                {champions[cellData].name}
              </a>
            </>
          );
        case "winRate":
          return (
            <WinRate color={getWinRateColor(cellData * 100)}>
              {getLocaleString(cellData, percentOptions)}
            </WinRate>
          );
        case "kda":
          return getLocaleString(cellData, kdaOptions);
        case "dmgDealt":
          return getLocaleString(cellData, amountOptions);
        case "dmgMitigated":
          return getLocaleString(cellData, amountOptions);
        case "heals":
          return getLocaleString(cellData, amountOptions);
        case "matches":
          return getLocaleString(cellData);
      }
    },
    [champions]
  );

  return {
    data: filteredData,
    cols,
    colRenderer,
    options: {
      sortBy: "winRate",
      sortDirection: "ASC",
    },
  };
};

export default useChampionsCombat;
