import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { RANK_SYMBOL_TO_STR, STAT_TILE_TYPES } from "@/game-lol/constants.mjs";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import PlayerEmptyStatTile from "@/game-lol/PlayerEmptyStatTile.jsx";
import PlayerStatsTile from "@/game-lol/PlayerStatsTile.jsx";
import {
  getRanksArr,
  getVisionScoreStats,
  translateLolRankedTier,
} from "@/game-lol/util.mjs";
import HextechMatchWard from "@/inline-assets/hextech-match-ward.svg";
import orderArrayBy from "@/util/order-array-by.mjs";

const PlayerVisionScoreStatTile = (props) => {
  const {
    currParticipant,
    rankStats,
    match,
    RankIcon,
    summonerRank: currRank,
    oneRankAbove,
    isWinner,
    isLoading,
    rankStr,
    delay,
    account,
  } = props;

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const ranks = orderArrayBy(account.latestRanks, "insertedAt", "desc");
  const summonerRank =
    ranks[0] && ranks[0].tier
      ? RANK_SYMBOL_TO_STR[ranks[0].tier]?.capped
      : currRank;
  const tips = useMemo(() => {
    return {
      "S+": {
        tag: t("lol:postmatch.visionTagS+", "ALL-SEEING Vision GOD!"),
        win: t(
          "lol:postmatch.visionWinS+",
          "Your vision secured objectives, won fights, and helped your teammates avoid deaths."
        ),
        lose: t("lol:postmatch.visionLoseS+", "Vision GOD! Unlucky!"),
      },
      S: {
        tag: t("lol:postmatch.visionTagS", "Vision god."),
        win: t(
          "lol:postmatch.visionWinS",
          "You played a HUGE part in helping your team win."
        ),
        lose: t(
          "lol:postmatch.visionLoseS+",
          "Unlucky! Your vision score was off the charts."
        ),
      },
      A: {
        tag: t("lol:postmatch.visionTagA", "Amazing."),
        win: t("lol:postmatch.visionWinA", "Keep going and queue again!"),
        lose: t(
          "lol:postmatch.visionLoseA",
          "Amazing, top 30% of vision score. Keep it up and you will win more."
        ),
      },
      B: {
        tag: t("lol:postmatch.visionTagB", "Nice win!"),

        win: t(
          "lol:postmatch.visionWinB",
          "The extra vision and denial goes a long way!"
        ),
        lose: t(
          "lol:postmatch.visionLoseB",
          "Nice score. Be consistent with your vision while you improve in other areas."
        ),
      },
      C: {
        win: t(
          "lol:postmatch.visionWinC",
          "Be more consistent with your yellow trinket and control wards to win more."
        ),
        lose: t(
          "lol:postmatch.visionLoseC",
          "Be more consistent with your free and control wards."
        ),
      },
      D: {
        win: t(
          "lol:postmatch.visionWinD",
          "Nice Win! Improve your vision score to win more consistently and be even more impactful."
        ),
        lose: t(
          "lol:postmatch.visionLoseD",
          "Using your yellow trinket more helps you and your teammates die less and increases your chances of winning."
        ),
      },
    };
  }, [t]);

  const visionStats = useMemo(() => {
    if (
      !match?.gameDuration ||
      !rankStats.length ||
      !currParticipant ||
      !summonerRank
    )
      return;

    const { gameDuration } = match;
    const { visionScore } = currParticipant;
    return getVisionScoreStats({
      rankStats,
      oneRankAbove,
      stat: {
        gameDuration,
        visionScorePerMin: visionScore,
      },
      rankFilter: summonerRank,
      language,
    });
  }, [match, rankStats, currParticipant, summonerRank, oneRankAbove, language]);
  const {
    allScores,
    maxRankValue,
    percentDiff,
    MyPlacementRankIcon,
    yourRank,
    challengerVisionPerMin,
  } = useMemo(() => {
    return getRanksArr({
      rankStats,
      oneRankAbove,
      stats: visionStats,
      wholeNumber: true,
      calcStat: (rankStat, stats) => {
        const { visionScorePerMinute } = rankStat || {};
        if (
          stats?.key &&
          visionScorePerMinute?.[stats?.key]?.mean &&
          stats?.minutes
        ) {
          return visionScorePerMinute[stats.key]?.mean * stats.minutes;
        }
      },
    });
  }, [visionStats, rankStats, oneRankAbove]);

  if (!allScores) {
    return <PlayerEmptyStatTile isLoading={isLoading} />;
  }

  const isPositive = visionStats.myStatPerMin >= visionStats.myRankVision;
  // Set the grade as 'D' if grade is undefined.
  // But we need to investigate the reason why grade is undefined.
  const tipGrade = visionStats?.myScore?.grade
    ? visionStats?.myScore?.grade === "S+"
      ? visionStats?.myScore?.grade
      : visionStats?.myScore?.grade[0]
    : "D";

  const ChallengerIcon = getHextechRankIcon("CHALLENGER");
  const VisionTipIcon = challengerVisionPerMin ? ChallengerIcon : RankIcon;
  return (
    <PlayerStatsTile
      key={STAT_TILE_TYPES.visionScore}
      myChampion={null}
      isWinner={isWinner}
      isPositive={isPositive}
      showSetCSGoal={false}
      percentDiff={percentDiff * 100}
      tips={tips}
      tipGrade={tipGrade}
      allScores={allScores}
      scoreTrendLabel={t(
        "lol:postmatch.advancedStatsSubHeaders.visionScore",
        "Vision Score"
      )}
      MyPlacementRankIcon={<MyPlacementRankIcon className="rank-icon" />}
      rankStr={rankStr}
      yourRank={yourRank}
      maxRankValue={maxRankValue}
      description={
        <Trans i18nKey="lol:postmatch.visionTip">
          <span>Blitz Vision Score</span> helps you defeat enemies and die less.{" "}
          <b
            css={`
              color: red;
            `}
          >
            <VisionTipIcon />
            {{
              rankStr: challengerVisionPerMin
                ? translateLolRankedTier(t, "CHALLENGER")
                : rankStr,
            }}
          </b>{" "}
          players average a{" "}
          <span>
            {{
              visionScore: (challengerVisionPerMin
                ? challengerVisionPerMin
                : visionStats.myRankVision
              ).toFixed(1),
            }}{" "}
            Vision score
          </span>
          . Better vision will help you win more and rank up.
        </Trans>
      }
      stats={visionStats}
      delay={delay}
      isVisionTile={true}
      tiletype={STAT_TILE_TYPES.visionScore}
      title={t("lol:vision", "Vision")}
      TitleIcon={HextechMatchWard}
    />
  );
};

export default PlayerVisionScoreStatTile;
