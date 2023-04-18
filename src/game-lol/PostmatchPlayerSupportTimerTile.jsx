import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { STAT_TILE_TYPES } from "@/game-lol/constants.mjs";
import PlayerEmptyStatTile from "@/game-lol/PlayerEmptyStatTile.jsx";
import PlayerStatTile from "@/game-lol/PlayerStatsTile.jsx";
import Static from "@/game-lol/static.mjs";
import {
  getRanksArr,
  getStaticData,
  getSuppItemUpgradeTimes,
  getSuppStats,
} from "@/game-lol/util.mjs";
import HextechMatchWard from "@/inline-assets/hextech-match-ward.svg";
import orderArrayBy from "@/util/order-array-by.mjs";

const PlayerSupportTimerTile = (props) => {
  const {
    currParticipant,
    rankStats,
    match,
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
  const state = useSnapshot(readState);
  const timeline = state?.lol?.matchTimeline?.[match?.gameId];
  const items = getStaticData("items");

  const ranks = orderArrayBy(account.latestRanks, "insertedAt", "desc");
  const summonerRank = ranks[0] && ranks[0].tier ? ranks[0].tier : "IRON";

  const tips = useMemo(() => {
    return {
      "S+": {
        tag: t("lol:postmatch.suppTagS+", "Support god!"),
      },
      S: {
        tag: t("lol:postmatch.suppTagS", "Support master!"),
      },
      A: {
        tag: t("lol:postmatch.suppTagA", "Amazing!"),
      },
      B: {
        tag: t("lol:postmatch.suppTagB", "Well played!"),
      },
    };
  }, [t]);

  const suppStats = useMemo(() => {
    if (
      !match?.gameDuration ||
      !timeline ||
      !rankStats.length ||
      !currParticipant ||
      !summonerRank
    )
      return;

    const stat = getSuppItemUpgradeTimes(timeline, currParticipant);
    const suppStats = getSuppStats({
      stat,
      currParticipant,
      rankStats,
      oneRankAbove,
      rankFilter: summonerRank,
      language,
    });

    if (suppStats)
      return {
        ...suppStats,
        scoreLabelIcon: Static.getItems(stat?.itemId1),
        scoreLabelIcon2: Static.getItems(stat?.itemId2),
      };
  }, [
    match.gameDuration,
    timeline,
    rankStats,
    currParticipant,
    summonerRank,
    oneRankAbove,
    language,
  ]);

  const {
    allScores,
    allScores2,
    maxRankValue,
    maxRankValue2,
    MyPlacementRankIcon,
    MyPlacementRankIcon2,
    yourRank,
    yourRank2,
  } = useMemo(() => {
    if (!suppStats) return {};
    const tier1Scores = getRanksArr({
      rankStats,
      oneRankAbove,
      wholeNumber: true,
      isTime: true,
      lowerIsBetter: true,
      condensed: suppStats.myStatPerMin2 ? 3 : 8,
      stats: {
        itemId: suppStats.itemId1,
        myStatPerMin: suppStats.myStatPerMin,
        myStatPerMinLabel: suppStats.myStatPerMinLabel,
      },
      calcStat: (rankStat, stats) => {
        return rankStat?.supportItemQuestCompletionTime?.[
          `item_${stats.itemId}`
        ]?.mean;
      },
    });
    const tier2Scores =
      suppStats.myStatPerMin2 &&
      getRanksArr({
        rankStats,
        oneRankAbove,
        wholeNumber: true,
        isTime: true,
        lowerIsBetter: true,
        condensed: 3,
        stats: {
          itemId: suppStats.itemId2,
          myStatPerMin: suppStats.myStatPerMin2,
          myStatPerMinLabel: suppStats.myStatPerMin2Label,
        },
        calcStat: (rankStat, stats) => {
          return rankStat?.supportItemQuestCompletionTime?.[
            `item_${stats.itemId}`
          ]?.mean;
        },
      });

    return {
      allScores: tier1Scores.allScores,
      allScores2: tier2Scores?.allScores,
      maxRankValue: tier1Scores.maxRankValue,
      maxRankValue2: tier2Scores?.maxRankValue,
      MyPlacementRankIcon: tier1Scores.MyPlacementRankIcon,
      MyPlacementRankIcon2: tier2Scores?.MyPlacementRankIcon,
      yourRank: tier1Scores.yourRank,
      yourRank2: tier2Scores?.yourRank,
    };
  }, [suppStats, rankStats, oneRankAbove]);

  if (!allScores) {
    return <PlayerEmptyStatTile isLoading={isLoading} />;
  }

  const isPositive = suppStats.myStatPerMin <= suppStats.myRankTime;
  const isPositive2 = suppStats.myStatPerMin2 <= suppStats.myRankTime2;
  // Set the grade as 'D' if grade is undefined.
  // But we need to investigate the reason why grade is undefined.
  const tipGrade = suppStats.myScore.grade
    ? suppStats.myScore.grade === "S+"
      ? suppStats.myScore.grade
      : suppStats.myScore.grade[0]
    : "D";

  return (
    <PlayerStatTile
      key={STAT_TILE_TYPES.supportItem}
      currParticipant={currParticipant}
      isWinner={isWinner}
      isPositive={isPositive}
      isPositive2={isPositive2}
      tips={tips}
      tipGrade={tipGrade}
      allScores={allScores}
      allScores2={allScores2}
      itemLabel={items?.data?.[suppStats?.itemId1]?.name}
      itemLabel2={items?.data?.[suppStats?.itemId2]?.name}
      MyPlacementRankIcon={<MyPlacementRankIcon className="rank-icon" />}
      MyPlacementRankIcon2={() => (
        <MyPlacementRankIcon2 className="rank-icon" />
      )}
      rankStr={rankStr}
      yourRank={yourRank}
      yourRank2={yourRank2}
      maxRankValue={maxRankValue}
      maxRankValue2={maxRankValue2}
      stats={suppStats}
      delay={delay}
      tiletype={STAT_TILE_TYPES.supportItem}
      title={t("lol:support", "Support")}
      TitleIcon={HextechMatchWard}
      proLockInfo={{
        title: t("lol:postmatch.betterSupp", "Become a  Better Support"),
        info: (
          <Trans>
            Track support item progression in real time and compare performance
            to any rank with{" "}
            <span
              css={`
                color: var(--pro-solid);
              `}
            >
              Blitz Pro
            </span>
            .
          </Trans>
        ),
        btnLink: "/pro/subscription/landing-page",
        btnText: t(
          "lol:postmatch.unlockSuppOverlay",
          "Unlock Support Item Overlay"
        ),
      }}
    />
  );
};

export default PlayerSupportTimerTile;
