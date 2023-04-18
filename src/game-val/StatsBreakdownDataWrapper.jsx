import React from "react";
import { useTranslation } from "react-i18next";

import StatsBreakdown from "@/shared/StatsBreakdown.jsx";
import { calcRate } from "@/util/helpers.mjs";

const lessThan = (val1, val2) => {
  if (val1 === val2) return null;
  return val1 < val2;
};

const greaterThan = (val1, val2) => {
  if (val1 === val2) return null;
  return val1 > val2;
};

const StatsBreakdownDataWrapper = ({
  recentStats,
  playerGameStats,
  matchStats,
  hitPositionPercents,
  recentHitPositionPercents,
  isAnyDeathMatch,
}) => {
  const { t } = useTranslation();

  const stats = playerGameStats?.stats;

  const roundsPlayed = stats.roundsPlayed;
  const totalDamage = playerGameStats?.roundDamage?.reduce(
    (acc, round) => acc + (round?.damage || 0),
    0
  );

  const scorePerRound = calcRate(stats.score, roundsPlayed, 1);
  const damagePerRound = calcRate(totalDamage, roundsPlayed, 1);
  const kda = calcRate(stats.kills + stats.assists, stats.deaths, 1);

  const recentDamagePerRound = calcRate(
    recentStats.damageStats.damage,
    recentStats.roundsPlayed,
    1
  );

  const avgKills = calcRate(recentStats.kills, recentStats.matches, 1);

  const avgDeaths = calcRate(recentStats.deaths, recentStats.matches, 1);

  const avgAssists = calcRate(recentStats.assists, recentStats.matches, 1);

  const avgScore = calcRate(recentStats.score, recentStats.roundsPlayed, 1);

  const avgKda = calcRate(avgKills + avgAssists, avgDeaths, 1);

  const avgFirstBloodsTaken = calcRate(
    recentStats.firstBloodsTaken,
    recentStats.matches,
    1
  );
  const avgFirstBloodsGiven = calcRate(
    recentStats.firstBloodsGiven,
    recentStats.matches,
    1
  );

  const recentRoundsWonWhenFirstBloodTaken = calcRate(
    recentStats.roundsWonWhenFirstBloodTaken,
    recentStats.matches,
    1
  );
  const recentRoundsLostWhenFirstBloodGiven = calcRate(
    recentStats.roundsLostWhenFirstBloodGiven,
    recentStats.matches,
    1
  );
  //Last to die === lastKills (this key is badly named)
  const avgLastDead = calcRate(recentStats.lastKills, recentStats.matches, 1);

  //section one gernal info
  const firstSectionInfo = {
    leftTitleText: t("common:thismatch", "This Match"),
    centerTitleText: t("common:general", "General"),
    rightTitleText: t("common:recentnAvg", "Recent {{numberOfGames}} Avg.", {
      numberOfGames: recentStats.matches,
    }),
  };

  const deathmatchRows = [
    {
      title: t("common:combatScore", "Combat Score"),
      dataPoint: scorePerRound,
      recentAvg: avgScore,
    },
    { title: t("val:KDA", "KDA"), dataPoint: kda, recentAvg: avgKda },
    {
      title: t("val:Kills", "Kills"),
      dataPoint: stats.kills,
      recentAvg: avgKills,
    },
    {
      title: t("val:Deaths", "Deaths"),
      dataPoint: stats.deaths,
      recentAvg: avgDeaths,
      didBetter: lessThan,
    },
    {
      title: t("val:Assists", "Assists"),
      dataPoint: stats.assists,
      recentAvg: avgAssists,
    },
  ];

  if (isAnyDeathMatch) {
    const sections = [firstSectionInfo];
    const rowData = [deathmatchRows];
    return <StatsBreakdown rowData={rowData} sections={sections} />;
  }

  const firstSectionRows = [
    ...deathmatchRows,
    {
      title: t("common:damagePerRound", "Damage Per Round"),
      dataPoint: damagePerRound,
      recentAvg: recentDamagePerRound,
    },
    {
      title: t("First Blood", "First Blood"),
      dataPoint: matchStats.firstBloodsTaken,
      recentAvg: avgFirstBloodsTaken,
    },
    {
      title: t("Rounds Won when First Blood", "Rounds Won when First Blood"),
      dataPoint: matchStats.roundsWonWhenFirstBloodTaken,
      recentAvg: recentRoundsWonWhenFirstBloodTaken,
    },
    {
      title: t("First to Die", "First to Die"),
      dataPoint: matchStats.firstBloodsGiven,
      recentAvg: avgFirstBloodsGiven,
      didBetter: lessThan,
    },
    {
      title: t(
        "Rounds Lost when First to Die",
        "Rounds Lost when First to Die"
      ),
      dataPoint: matchStats.roundsLostWhenFirstBloodGiven,
      recentAvg: recentRoundsLostWhenFirstBloodGiven,
      didBetter: lessThan,
    },
    {
      title: t("Last to Die", "Last to Die"),
      dataPoint: matchStats.lastKills,
      recentAvg: avgLastDead,
    },
  ];

  //section 2 gun info
  const gunInfoHeader = {
    leftTitleText: t("common:thismatch", "This Match"),
    centerTitleText: t("common:gunSkills", "Gun Skills"),
    rightTitleText: t("common:recentnAvg", "Recent {{numberOfGames}} Avg.", {
      numberOfGames: recentStats.matches,
    }),
  };

  const hitPercentText = (amount) =>
    t("common:hitPercent", "{{percent}}%", {
      percent: amount,
    });

  const gunStatsRows = [
    {
      title: t("val:headshots", "head shots"),
      dataPoint: hitPercentText(hitPositionPercents.headshotPercent),
      recentAvg: hitPercentText(recentHitPositionPercents.headshotPercent),
      didBetter: (a, b) => greaterThan(parseFloat(a), parseFloat(b)),
    },
    {
      title: t("val:bodyshots", "body shots"),
      dataPoint: hitPercentText(hitPositionPercents.bodyshotPercent),
      recentAvg: hitPercentText(recentHitPositionPercents.bodyshotPercent),
      didBetter: (a, b) => greaterThan(parseFloat(a), parseFloat(b)),
    },
    {
      title: t("val:legshots", "leg shots"),
      dataPoint: hitPercentText(hitPositionPercents.legshotPercent),
      recentAvg: hitPercentText(recentHitPositionPercents.legshotPercent),
      didBetter: (a, b) => lessThan(parseFloat(a), parseFloat(b)),
    },
  ];
  const sections = [firstSectionInfo, gunInfoHeader];
  const rowData = [firstSectionRows, gunStatsRows];

  return <StatsBreakdown rowData={rowData} sections={sections} />;
};

export default StatsBreakdownDataWrapper;
