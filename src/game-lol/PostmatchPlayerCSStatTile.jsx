import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import {
  MAX_GAME_TIME_IN_MINUTES,
  RANK_SYMBOL_TO_STR,
  STAT_TILE_TYPES,
} from "@/game-lol/constants.mjs";
import PlayerEmptyStatTile from "@/game-lol/PlayerEmptyStatTile.jsx";
import PlayerStatTile from "@/game-lol/PlayerStatsTile.jsx";
import {
  getCSStats,
  getRanksArr,
  isSameAccount,
  mapRankToSymbol,
  translateLolRankedTier,
} from "@/game-lol/util.mjs";
import HextechMatchGold from "@/inline-assets/hextech-match-gold.svg";
import orderArrayBy from "@/util/order-array-by.mjs";

const PlayerCSStatTile = (props) => {
  const {
    currParticipant,
    rankStats,
    rankStatsByRole,
    match,
    oneRankAbove,
    myChampion,
    isWinner,
    isLoading,
    delay,
    account,
  } = props;
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const state = useSnapshot(readState);

  const srOverlaySettings = state.lol_settings?.srOverlaySettings?.csBenchmarks;

  const loggedInAccount = currParticipant;

  const isOwnAccount = isSameAccount(loggedInAccount, currParticipant);

  const { leagueDivision } = srOverlaySettings || {};

  const ranks = orderArrayBy(account.latestRanks, "insertedAt", "desc");

  const summonerRank =
    isOwnAccount && leagueDivision
      ? RANK_SYMBOL_TO_STR[mapRankToSymbol(leagueDivision)]?.capped
      : ranks[0]
      ? RANK_SYMBOL_TO_STR[ranks[0].tier]?.capped
      : "IRON";
  const rankStr = translateLolRankedTier(t, summonerRank);

  const tips = useMemo(() => {
    return {
      "S+": {
        tag: t("lol:postmatch.csTagS+", "Farming god!"),
        win: (
          <Trans i18nKey="lol:postmatch.csWinS+">
            Your <span>CS</span> ability allowed you to carry!
          </Trans>
        ),
        lose: t("lol:postmatch.csLoseS+", "CS God! unlucky!"),
      },
      S: {
        tag: t("lol:postmatch.csTagS", "Farm master!"),
        win: t("lol:postmatch.csWinS", "You crushed your CS."),
        lose: t(
          "lol:postmatch.csLoseS+",
          "Unlucky! Your CS was off the charts."
        ),
      },
      A: {
        tag: t("lol:postmatch.csTagA", "Amazing CS!"),
        win: t("lol:postmatch.csWinA", "All that farm really paid off."),
        lose: t(
          "lol:postmatch.csLoseA",
          "Solid CS. Keep CSing like this and focus on using your gold advantage."
        ),
      },
      B: {
        tag: t("lol:postmatch.csTagB", "Well played!"),
        win: t(
          "lol:postmatch.csWinB",
          "You farmed well, but there's room for improvement."
        ),
        lose: t(
          "lol:postmatch.csLoseB",
          "Well played. Think about ways to improve your CS."
        ),
      },
      C: {
        win: t(
          "lol:postmatch.csWinC",
          "Good game! Remember to focus on CS to get a gold advantage."
        ),
        lose: t(
          "lol:postmatch.csLoseC",
          "Good effort. Earning more CS means you’ll have more items and die less. Keep at it!"
        ),
      },
      D: {
        win: t(
          "lol:postmatch.csWinD",
          "Congrats on the win! You’ll win more consistently if you improve your CS."
        ),
        lose: t(
          "lol:postmatch.csLoseD",
          "Focus on getting one more CS each minute. It’ll have a big impact on your win rate!"
        ),
      },
    };
  }, [t]);
  const csStats = useMemo(() => {
    if (
      !match?.gameDuration ||
      !rankStats.length ||
      !currParticipant ||
      !summonerRank
    )
      return;

    const { gameDuration } = match;
    const { totalMinionsKilled, neutralMinionsKilled } = currParticipant;
    const myStat = totalMinionsKilled + neutralMinionsKilled;
    const csPerMin =
      myStat /
      (gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000));

    return getCSStats({
      rankStats,
      rankStatsByRole,
      oneRankAbove,
      stat: {
        gameDuration,
        csPerMin,
      },
      rankFilter: summonerRank,
      language,
    });
  }, [
    match,
    rankStats,
    rankStatsByRole,
    currParticipant,
    summonerRank,
    language,
    oneRankAbove,
  ]);

  const {
    allScores,
    maxRankValue,
    percentDiff,
    MyPlacementRankIcon,
    yourRank,
  } = useMemo(() => {
    return getRanksArr({
      rankStats: csStats?.isRoleOnly ? rankStatsByRole : rankStats,
      oneRankAbove,
      stats: csStats,
      calcStat: (rankStat, stats) => {
        const { creepScoreByMinute } = rankStat || {};
        if (stats?.maxMin && creepScoreByMinute?.[stats?.maxMin]?.mean) {
          return creepScoreByMinute[stats.maxMin]?.mean / stats.maxMin;
        }
      },
    });
  }, [csStats, oneRankAbove, rankStats, rankStatsByRole]);

  if (!allScores) {
    return <PlayerEmptyStatTile isLoading={isLoading} />;
  }

  const isPositive = csStats.myStatPerMin >= csStats.myRankCsPerMin;

  const tipGrade =
    csStats?.myScore?.grade === "S+"
      ? csStats?.myScore?.grade
      : csStats?.myScore?.grade?.[0];

  return (
    <PlayerStatTile
      key={STAT_TILE_TYPES.cs}
      currParticipant={currParticipant}
      myChampion={myChampion}
      isWinner={isWinner}
      isPositive={isPositive}
      showSetCSGoal={true}
      percentDiff={percentDiff * 100}
      tips={tips}
      tipGrade={tipGrade}
      allScores={allScores}
      scoreTrendLabel={t("lol:postmatch.csPerMin", "CS/Min.")}
      MyPlacementRankIcon={<MyPlacementRankIcon className="rank-icon" />}
      rankStr={rankStr}
      yourRank={yourRank}
      maxRankValue={maxRankValue}
      stats={csStats}
      delay={delay}
      tiletype={STAT_TILE_TYPES.cs}
      title={t("common:income", "Income")}
      TitleIcon={HextechMatchGold}
    />
  );
};

export default PlayerCSStatTile;
