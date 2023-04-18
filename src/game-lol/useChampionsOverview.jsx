import React, { useCallback, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { readState } from "@/__main__/app-state.mjs";
import { MIN_STRING_DISTANCE } from "@/app/constants.mjs";
import {
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import { getTierIcon } from "@/game-lol/get-tier-icon.mjs";
import Static from "@/game-lol/static.mjs";
import { TooltipContent } from "@/game-lol/TooltipStyles.jsx";
import {
  commonMatchups,
  getStaticData,
  getWinRateColor,
  losingMatchups,
} from "@/game-lol/util.mjs";
import ArrowRight from "@/inline-assets/arrow-right.svg";
import { calcRate } from "@/util/helpers.mjs";
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
    width: 1.5em;
    height: 1.5em;
  }
`;
const CssChampionName = () => css`
  ${CommonColumnCss}
  justify-content: flex-start;
  color: var(--shade0);

  a {
    display: flex;
    align-items: center;
    gap: var(--sp-6);
  }
  img {
    width: var(--sp-9);
    height: var(--sp-9);
    border-radius: 50%;
  }

  span {
    color: var(--shade0);
  }
`;
const CssChampionTier = () => css`
  ${CommonColumnCss}
  align-self: stretch;

  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
`;
const CssChampionWinRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionBanRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionPickRate = () => css`
  ${CommonColumnCss}
`;
const CssChampionCounters = () => css`
  ${CommonColumnCss}
  font-size: var(--sp-3);

  & > a {
    text-decoration: none;

    & > img {
      width: var(--sp-5);
      height: var(--sp-5);
      margin: 0px 4px 2px;
      border-radius: 50%;
      display: block;
    }
  }
`;
const CssChampionMatches = () => css`
  ${CommonColumnCss}
`;

const TierTooltip = ({ tier, tierPrev }) => {
  const PrevTier = getTierIcon(tierPrev);
  const Tier = getTierIcon(tier);
  return (
    <TooltipContent className="tier-change">
      <PrevTier className="tier-icon" />
      <ArrowRight className="arrow" />
      <Tier className="tier-icon" />
    </TooltipContent>
  );
};

const CounterTooltip = ({ champion, vsText, matchupChampion }) => (
  <TooltipContent className="matchup">
    <div className="matchup-champ">
      <img style={{ borderColor: champion.color }} src={champion.image} />
      <div className="champ-name" style={{ color: champion.color }}>
        {champion.name}
      </div>
      <div className="champ-winrate" style={{ color: champion.color }}>
        {champion.winRate}
      </div>
    </div>
    <div className="vs">
      <span>{vsText}</span>
    </div>
    <div className="matchup-champ">
      <img
        style={{ borderColor: matchupChampion.color }}
        src={matchupChampion.image}
      />
      <div className="champ-name" style={{ color: matchupChampion.color }}>
        {matchupChampion.name}
      </div>
      <div className="champ-winrate" style={{ color: matchupChampion.color }}>
        {matchupChampion.winRate}
      </div>
    </div>
  </TooltipContent>
);

// Rank, Role, Champion, Tier, WinRate, BanRate, PickRate, Counters, Matches
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
    label: "Tier",
    i18nKey: "lol:tier",
    dataKey: "tier",
    width: 8,
    className: CssChampionTier,
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
    label: "Ban Rate",
    i18nKey: "lol:banRate",
    dataKey: "banRate",
    width: 11,
    className: CssChampionBanRate,
    sortable: true,
  },
  {
    label: "Pick Rate",
    i18nKey: "lol:pickRate",
    dataKey: "pickRate",
    width: 10,
    className: CssChampionPickRate,
    sortable: true,
  },
  {
    label: "Countered by",
    i18nKey: "lol:counteredBy",
    dataKey: "counters",
    width: 14,
    className: CssChampionCounters,
    sortable: false,
  },
  {
    label: "Matches",
    i18nKey: "lol:matches",
    dataKey: "matches",
    width: 10,
    className: CssChampionMatches,
    sortable: true,
  },
];

const useChampionsOverview = ({ filterParams, searchParams }) => {
  const { searchText, role, queue } = filterParams;
  const { t } = useTranslation();
  const champions = getStaticData("champions");

  const tableData = useMemo(() => {
    const championsStats =
      readState.lol.championStats?.[btoa(searchParams)] || [];

    if (!champions || championsStats instanceof Error) {
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
        tier: champStats.tierListTier?.tierRank,
        winRate: calcRate(champStats.wins, champStats.games),
        banRate: champStats.banRate,
        pickRate: champStats.pickRate,
        counters: losingMatchups(
          commonMatchups(champStats, champStats.matchups)
        ).slice(0, 4),
        matches: champStats.games,
      };
    });
  }, [champions, searchParams]);

  const filteredData = useMemo(() => {
    // the data is what fetched by all roles.
    // so if empty search string and all roles (or aram queue), then return it.

    if (
      !searchText &&
      (!role || queue === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].key)
    )
      return tableData;

    return tableData?.filter(
      (v) =>
        (!searchText ||
          stringCompare(searchText, v.championName) > MIN_STRING_DISTANCE) &&
        (ROLE_SYMBOL_TO_STR[v.role].gql === role ||
          role === ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].key)
    );
  }, [tableData, searchText, role, queue]);

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
            <a href={`/lol/champions/${cellData}`} className="champion-name">
              <img
                className="champion-image"
                src={Static.getChampionImage(cellData)}
                loading={rowIndex > 20 ? "lazy" : "eager"}
              />
              <span>{champions?.[cellData]?.name}</span>
            </a>
          );
        case "tier": {
          const tooltip = ReactDOMServer.renderToStaticMarkup(
            <TierTooltip
              tier={rowData?.tier}
              tierPrev={rowData?.tierListTier?.previousTierRank}
            />
          );
          const Icon = getTierIcon(rowData?.tier);
          return (
            rowData?.tier && (
              <div data-tooltip={tooltip}>
                <Icon width="20" />
              </div>
            )
          );
        }
        case "winRate":
          return (
            <WinRate color={getWinRateColor(cellData * 100)}>
              {getLocaleString(cellData, percentOptions)}
            </WinRate>
          );
        case "banRate":
          return getLocaleString(cellData, percentOptions);
        case "pickRate":
          return getLocaleString(cellData, percentOptions);
        case "counters": {
          return cellData?.map((matchup, index) => {
            const championWinrate = matchup.wins / matchup.games;
            const championKey = rowData["championKey"];
            const championName = champions?.[championKey]?.name ?? championKey;

            const opponentKey = champions.keys[matchup.opponentChampionId];
            const opponentWinrate = 1 - championWinrate;
            const opponentName = champions?.[opponentKey]?.name ?? opponentKey;

            const tooltip = ReactDOMServer.renderToStaticMarkup(
              <CounterTooltip
                champion={{
                  name: championName,
                  image: Static.getChampionImage(championKey),
                  color: getWinRateColor(championWinrate * 100),
                  winRate: getLocaleString(championWinrate, {
                    style: "percent",
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }),
                }}
                matchupChampion={{
                  name: opponentName,
                  image: Static.getChampionImage(opponentKey),
                  color: getWinRateColor(opponentWinrate * 100),
                  winRate: getLocaleString(opponentWinrate, {
                    style: "percent",
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }),
                }}
                vsText={t("lol:vs", "vs")}
              />
            );

            return (
              <a
                key={index}
                href={`/lol/champions/${opponentKey}`}
                data-tooltip={tooltip}
              >
                <img src={Static.getChampionImage(opponentKey)} />
                <span>
                  {getLocaleString((1 - matchup.wins / matchup.games) * 100, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </a>
            );
          });
        }
        case "matches":
          return getLocaleString(cellData);
      }
    },
    [champions, t]
  );

  return {
    data: filteredData,
    cols,
    colRenderer,
    options: {
      sortBy: "tier",
      sortDirection: "DESC",
    },
  };
};

export default useChampionsOverview;
