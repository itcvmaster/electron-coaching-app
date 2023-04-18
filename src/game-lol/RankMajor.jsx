import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Select } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { winRatecolorRange } from "@/app/util.mjs";
import {
  GAME_LOL_RANK_COLORS,
  RANK_SYMBOL_TO_STR,
  SEASON_FILTERS,
  TIER_UNRANKED,
} from "@/game-lol/constants.mjs";
import staticMediaURLs from "@/game-lol/static.mjs";
import {
  getDerivedId,
  getDerivedQueue,
  translateLolRankedTier,
} from "@/game-lol/util.mjs";
import { LoLWinStreakBadge } from "@/game-lol/WinStreakBadges.jsx";
import Close from "@/inline-assets/close.svg";
import Trophy from "@/inline-assets/trophy.svg";
import DefaultWinrate from "@/shared/DefaultWinrate.jsx";
import RadialProgress from "@/shared/RadialProgress.jsx";
import { getLocaleRate } from "@/util/i18n-helper.mjs";

const RankMajorFrame = styled("div")`
  &:not(:last-of-type) {
    margin-bottom: var(--sp-6);
  }
`;

const RankInfo = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0 10px 20px;
`;

const PlayerRank = styled("div")`
  position: relative;
  margin-top: var(--sp-3);
  display: flex;
`;

const PlayerRankIcon = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 0;
`;

const PlayerRankDetails = styled("div")`
  margin-left: var(--sp-4);
  color: var(--shade0);
`;

const RankTier = styled("h4")`
  color: ${({ color }) => (color ? color : "inherit")};
`;

const Points = styled("p")`
  color: var(--shade2);

  span {
    margin-left: var(--sp-2);
  }
`;

const SeriesResult = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sp-4);
  width: var(--sp-4);
  background: var(--shade6);
  margin-right: var(--sp-1);
  font-size: var(--sp-3);
  border-radius: 50%;

  ${({ result }) =>
    result && result === "W"
      ? `background: var(--turq);
        color: var(--shade10)`
      : result === "L"
      ? `background: var(--red);
        color: var(--shade10)`
      : `background: var(--shade4);`};
`;

const WinRate = styled("span")`
  color: var(--shade1);
`;

const SeriesTitle = styled("div")`
  color: var(--shade2);
  margin-bottom: var(--sp-3);
  margin-top: var(--sp-3);
`;

const View = styled("div")`
  display: flex;
  flex-direction: ${(props) => (props.row ? "row" : "column")};
`;

const FilterSelectContainer = styled("div")`
  display: flex;
  margin-bottom: var(--sp-6);
  gap: var(--sp-2);
`;

const RankContainer = styled("div")`
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--sp-1);
`;

const RankIcon = ({ rank, radialPercent, radialColor, size = 80 }) => {
  return (
    <PlayerRank>
      <RadialProgress
        size={108}
        background={"var(--shade6)"}
        data={[radialPercent]}
        colors={[radialColor ? radialColor : "var(--shade6)"]}
        strokeWidth={4}
      />
      <PlayerRankIcon>
        <img
          src={staticMediaURLs.getRankImage(rank, size)}
          width={size}
          loading="lazy"
        />
      </PlayerRankIcon>
    </PlayerRank>
  );
};

const GlobalWinRate = ({ winRateColors, children }) => (
  <WinRate style={{ color: winRateColors }}>{children}</WinRate>
);

function RankMajor({
  queue,
  seasonValue,
  setSeason,
  queueName,
  setQueue,
  supportedQueues,
  region,
  name,
}) {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const champStatsData =
    state?.lol?.playerChampionStats?.[
      getDerivedQueue(getDerivedId(region, name), queueName)
    ];
  const champStatsError =
    champStatsData instanceof Error ? champStatsData : null;
  const champStats = champStatsData?.playerChampionsStats;
  const seasons = state?.lol?.seasons || [];
  const seasonError = seasons instanceof Error ? seasons : null;

  const currentSeasonId = Number.parseInt(
    Object.keys(seasons).reverse()[0],
    10
  );

  const selectSeasons = (() => {
    const seasonFilterList = [
      {
        key: SEASON_FILTERS.SEASON,
        value: currentSeasonId,
        text: t("lol:currentSeason", `${seasons?.[currentSeasonId]}`),
        disabled: false,
      },
    ];

    seasonFilterList.push({
      value: SEASON_FILTERS.PREV20,
      text: t("lol:last20Games,", "Last {{games}} Games", { games: 20 }),
      disabled: false,
    });

    return seasonFilterList;
  })();

  let games = 0;
  let wins = queue?.wins;
  let losses = queue?.losses;

  if (wins === undefined && champStats) {
    wins = 0;
    for (const entry of champStats) {
      if (!entry || !entry.basicStats) continue;
      games += entry.gameCount || 0;
      wins += entry.basicStats.wins || 0;
    }
    losses = games - wins;
  }

  const colors = GAME_LOL_RANK_COLORS;

  const queueWinrate =
    wins !== undefined ? getLocaleRate(wins, losses + wins) : null;

  const rankSymbol = queue?.tier && RANK_SYMBOL_TO_STR[queue.tier];
  const rankName = rankSymbol && rankSymbol.key;

  const winRateColors =
    wins !== undefined &&
    winRatecolorRange(100 * (wins / (wins + losses || 1)));

  let radialPercent = 0;
  if (queue) {
    radialPercent = TIER_UNRANKED.includes(
      RANK_SYMBOL_TO_STR[queue.tier]?.capped
    )
      ? 1
      : queue.leaguePoints / 100;
  }

  const radialColor = rankName ? colors[rankName].fill : "var(--shade6)";
  const titleColor = rankName ? colors[rankName].text : "var(--shade3)";

  if (champStatsError || seasonError) {
    return null;
  }

  return (
    <RankMajorFrame>
      <FilterSelectContainer>
        <Select
          selected={
            supportedQueues.find((q) => q.value === queueName) || queueName
          }
          options={supportedQueues}
          onChange={setQueue}
        />
        <Select
          selected={seasonValue ? seasonValue : currentSeasonId}
          options={selectSeasons}
          onChange={setSeason}
        />
      </FilterSelectContainer>
      <RankInfo>
        {queue ? (
          <RankIcon
            rank={rankName}
            radialColor={radialColor}
            radialPercent={radialPercent}
          />
        ) : (
          <DefaultWinrate wins={wins} games={games} />
        )}
        <PlayerRankDetails>
          {/*PlayerRankGame()*/}
          <div>
            {queue && (
              <>
                <RankContainer>
                  <RankTier
                    color={titleColor}
                    className="type-body1-form--active"
                  >
                    {translateLolRankedTier(
                      t,
                      RANK_SYMBOL_TO_STR[queue.tier]?.capped
                    ) + " "}
                    {queue &&
                      !TIER_UNRANKED.includes(
                        RANK_SYMBOL_TO_STR[queue.tier]?.capped
                      ) &&
                      queue.rank}
                  </RankTier>
                  &nbsp;&nbsp;
                  <LoLWinStreakBadge region={region} name={name} />
                </RankContainer>
                <Points className="type-caption--bold">
                  {queue &&
                    queue.leaguePoints >= 0 &&
                    t("lol:leaguePoints", "{{points}} LP", {
                      points: queue.leaguePoints >= 0 ? queue.leaguePoints : 0,
                    })}
                </Points>
              </>
            )}
            <Points className="type-caption--bold">
              {wins !== undefined &&
                losses !== undefined &&
                t("lol:winsAndLosses", "{{wins}}W {{losses}}L", {
                  wins: wins || 0,
                  losses: losses || 0,
                })}
              {queueWinrate !== null ? (
                <GlobalWinRate
                  queueWinrate={queueWinrate}
                  winRateColors={winRateColors}
                >
                  {t("common:percent", "{{percent, percent}}", {
                    percent: queueWinrate,
                  })}
                </GlobalWinRate>
              ) : null}
            </Points>
          </div>
          {queue && queue.series && (
            <div>
              <SeriesTitle>
                {t("lol:seriesInProgress", "Series in progress")}
              </SeriesTitle>
              <View>
                {queue.series.split("").map((char) => {
                  switch (char) {
                    case "W":
                      return (
                        <SeriesResult result={char}>
                          <Trophy />
                        </SeriesResult>
                      );
                    case "L":
                      return (
                        <SeriesResult result={char}>
                          <Close />
                        </SeriesResult>
                      );
                    default:
                      return <SeriesResult />;
                  }
                })}
              </View>
            </div>
          )}
        </PlayerRankDetails>
      </RankInfo>
    </RankMajorFrame>
  );
}
export default RankMajor;
