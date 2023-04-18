import React, { useCallback, useMemo } from "react";
import { css, styled } from "goober";

import { readState } from "@/__main__/app-state.mjs";
import { MIN_STRING_DISTANCE } from "@/app/constants.mjs";
import { ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import Static from "@/game-lol/static.mjs";
import { getStaticData, getWinRateColor } from "@/game-lol/util.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";
import stringCompare from "@/util/string-compare.mjs";

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
};

const WinRate = styled("span")`
  color: ${(props) => props.color || "var(--shade0)"};
`;
const HalfRow = styled("div")`
  text-align: left;
  height: 30px;
  display: flex;
  align-items: center;
`;
const DuoContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;
const Champion = styled("div")`
  display: flex;
  align-items: center;
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
const CssChampionDuoWinRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionDuoMatches = () => css`
  ${CommonColumnCss}
`;
const CssChampionSoloWinRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionSoloMatches = () => css`
  ${CommonColumnCss}
`;

// Rank, Role, Champion, Duo Win Rate, Duo Matches, Solo Win Rate, Solo Matches
const cols = [
  {
    label: "Rank",
    i18nKey: "lol:rank",
    dataKey: "rank",
    width: 8,
    className: CssChampionRank,
    sortable: false,
  },
  {
    label: "Role",
    i18nKey: "lol:role",
    dataKey: "role",
    width: 10,
    className: CssChampionRole,
    sortable: false,
  },
  {
    label: "Champion",
    i18nKey: "lol:champion",
    dataKey: "championKey",
    width: 30,
    className: CssChampionName,
    sortable: true,
  },
  {
    label: "Duo Win Rate",
    i18nKey: "lol:duoWinRate",
    dataKey: "winrate",
    width: 13,
    className: CssChampionDuoWinRate,
    sortable: true,
  },
  {
    label: "Duo Matches",
    i18nKey: "lol:duoMatches",
    dataKey: "games",
    width: 13,
    className: CssChampionDuoMatches,
    sortable: true,
  },
  {
    label: "Solo Win Rate",
    i18nKey: "lol:soloWinRate",
    dataKey: "champion.champWinrate",
    width: 13,
    className: CssChampionSoloWinRate,
    sortable: true,
  },
  {
    label: "Solo Matches",
    i18nKey: "lol:soloMatches",
    dataKey: "champion.champGames",
    width: 13,
    className: CssChampionSoloMatches,
    sortable: true,
  },
];

const useChampionsSynergies = ({ filterParams, searchParams }) => {
  const { searchText } = filterParams;
  const champions = getStaticData("champions");

  const tableData = useMemo(() => {
    const championSynergies =
      readState.lol.championSynergies[btoa(searchParams)] || [];

    if (!champions || readState.lol.championSynergies instanceof Error) {
      return [];
    }

    return (championSynergies || []).map((champSynergy) => {
      const championKey = champions.keys[champSynergy.championId];
      const duoChampionKey = champions.keys[champSynergy.duoChampionId];
      const champion = champions[championKey];
      const duoChampion = champions[duoChampionKey];

      // when the new champion released, we have some trouble which is not synced with static champions and champion stats.
      // to prevent this trouble, following comparison is required.
      if (!champion || !duoChampion) {
        return null;
      }

      return {
        games: champSynergy.games,
        winrate: champSynergy.wins / champSynergy.games,
        role: champSynergy.role,
        duoRole: champSynergy.duoRole,
        champion: {
          ...champSynergy.champion,
          ...champion,
        },
        duoChampion: {
          ...champSynergy.duoChampion,
          ...duoChampion,
        },
        championKey,
        duoChampionKey,
      };
    });
  }, [champions, searchParams]);

  const filteredData = useMemo(() => {
    // the data is what fetched by all roles.
    // so if empty s search string or all roles, then return it.
    if (!searchText) return tableData;

    return tableData?.filter(
      (v) =>
        !searchText ||
        stringCompare(searchText, v.champion.name) > MIN_STRING_DISTANCE ||
        stringCompare(searchText, v.duoChampion.name) > MIN_STRING_DISTANCE
    );
  }, [tableData, searchText]);

  const colRenderer = useCallback(({ dataKey, rowData, rowIndex }) => {
    const cellData = rowData?.[dataKey];
    switch (dataKey) {
      case "rank":
        return rowIndex + 1;
      case "role": {
        const roleData = ROLE_SYMBOL_TO_STR[rowData.role];
        const duoRoleData = ROLE_SYMBOL_TO_STR[rowData.duoRole];
        const RoleIcon = getRoleIcon(roleData?.key);
        const DuoRoleIcon = getRoleIcon(duoRoleData?.key);
        return (
          <DuoContainer>
            <HalfRow>
              <RoleIcon width="20" />
            </HalfRow>
            <HalfRow>
              <DuoRoleIcon width="20" />
            </HalfRow>
          </DuoContainer>
        );
      }
      case "championKey":
        return (
          <DuoContainer>
            <HalfRow>
              <Champion>
                <img
                  className="champion-image"
                  src={Static.getChampionImage(rowData.championKey)}
                  loading={rowIndex > 15 ? "lazy" : "eager"}
                />
                <a
                  href={`/lol/champions/${rowData.championKey}`}
                  className="champion-name"
                >
                  {rowData.champion?.name}
                </a>
              </Champion>
            </HalfRow>
            <HalfRow>
              <Champion>
                <img
                  className="champion-image"
                  src={Static.getChampionImage(rowData.duoChampionKey)}
                  loading={rowIndex > 15 ? "lazy" : "eager"}
                />
                <a
                  href={`/lol/champions/${rowData.duoChampionKey}`}
                  className="champion-name"
                >
                  {rowData.duoChampion?.name}
                </a>
              </Champion>
            </HalfRow>
          </DuoContainer>
        );
      case "winrate":
        return (
          <WinRate color={getWinRateColor(cellData * 100)}>
            {getLocaleString(cellData, percentOptions)}
          </WinRate>
        );
      case "games":
        return getLocaleString(cellData);
      case "champion.champWinrate":
        return (
          <DuoContainer>
            <HalfRow>
              <WinRate
                color={getWinRateColor(
                  (rowData.champion?.wins / rowData.champion?.games) * 100
                )}
              >
                {getLocaleString(
                  rowData.champion?.wins / rowData.champion?.games,
                  percentOptions
                )}
              </WinRate>
            </HalfRow>
            <HalfRow>
              <WinRate
                color={getWinRateColor(
                  (rowData.duoChampion?.wins / rowData.duoChampion?.games) * 100
                )}
              >
                {getLocaleString(
                  rowData.duoChampion?.wins / rowData.duoChampion?.games,
                  percentOptions
                )}
              </WinRate>
            </HalfRow>
          </DuoContainer>
        );
      case "champion.champGames":
        return (
          <DuoContainer>
            <HalfRow>
              <span>{getLocaleString(rowData.champion?.games)}</span>
            </HalfRow>
            <HalfRow>
              <span>{getLocaleString(rowData.duoChampion?.games)}</span>
            </HalfRow>
          </DuoContainer>
        );
    }
  }, []);

  return {
    data: filteredData,
    cols,
    colRenderer,
    options: {
      rowHeight: 84,
      headerHeight: 30,
      sortBy: "winrate",
      sortDirection: "ASC",
      style: `
        padding: 12px 0;
        box-sizing: border-box;
      `,
    },
  };
};

export default useChampionsSynergies;
