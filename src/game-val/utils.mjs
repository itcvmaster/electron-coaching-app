import { appURLs } from "@/app/constants.mjs";
import { sanitizeNumber, toFixedNumber } from "@/util/helpers.mjs";
import makeRangeObject from "@/util/make-range-object.mjs";

export * from "@/util/helpers.mjs";

export function getPlayerIdType(player) {
  if (player) {
    return player?.subject ? "subject" : "puuid";
  }
}
export function calcHeadshotPercent(stats) {
  const total = stats.headshots + stats.bodyshots + stats.legshots;
  const result = (stats.headshots * 100) / (total > 0 ? total : 1);
  return toFixedNumber(sanitizeNumber(result), 1);
}

export function calcBodyshotPercent(stats) {
  const total = stats.headshots + stats.bodyshots + stats.legshots;
  const result = (stats.bodyshots * 100) / (total > 0 ? total : 1);
  return toFixedNumber(sanitizeNumber(result), 1);
}

export function calcLegshotPercent(stats) {
  const total = stats.headshots + stats.bodyshots + stats.legshots;
  const result = (stats.legshots * 100) / (total > 0 ? total : 1);
  return toFixedNumber(sanitizeNumber(result), 1);
}

export function calculateHitLocationPercents(damageStats) {
  if (!damageStats) return null;
  const headshotPercent = calcHeadshotPercent(damageStats);
  const bodyshotPercent = calcBodyshotPercent(damageStats);
  const legshotPercent = calcLegshotPercent(damageStats);

  return {
    headshotPercent,
    bodyshotPercent,
    legshotPercent,
  };
}

// Avg score per round
export function calcAvgScore(score, rounds = 1) {
  const result = score / (rounds > 0 ? rounds : 1);
  return toFixedNumber(sanitizeNumber(result), 0);
}

// Damage per 1000 credits spent
export function calcAvgEconomy(stats) {
  if (stats?.damageStats?.damage) {
    const result = stats?.damageStats?.damage / (stats?.economy / 1000);
    return toFixedNumber(sanitizeNumber(result), 0);
  }
  return 0;
}

export function calcAvgDmgPerRound(stats) {
  const result =
    stats?.damageStats?.damage /
    (stats?.roundsPlayed > 0 ? stats?.roundsPlayed : 1);
  return toFixedNumber(sanitizeNumber(result), 0);
}

export function getValorantRankImage({ tier, rank, size = "full" }) {
  if (tier && typeof tier === "string" && size !== "full") {
    return `${
      appURLs.CDN_PLAIN
    }/blitz/val/ranks/${tier.toLowerCase()}_small.svg?v=2.2`;
  } else if (tier && typeof tier === "string" && rank) {
    return `${
      appURLs.CDN_PLAIN
    }/blitz/val/ranks/${tier.toLowerCase()}${rank}.svg?v=2.2`;
  } else if (tier && typeof tier === "string") {
    return `${
      appURLs.CDN_PLAIN
    }/blitz/val/ranks/${tier.toLowerCase()}.svg?v=2.2`;
  }
  return appURLs.CDN_PLAIN + `/blitz/val/ranks/unrated.svg?v=2.2`;
}
export function getAgentImage(name, type = "matchtyle") {
  if (!name) return "";
  const agentName = name.replace("/", "");
  let agentImage = `matchtile/${agentName}-art-withBG.png`;
  if (type === "header")
    agentImage = `${agentName}/${agentName}-concept-headshot.png`;
  if (agentName === "kayo") agentImage = `matchtile/kayo-art-withBG-2.png`;
  return appURLs.CDN + `/blitz/val/agents/${agentImage}`;
}

export function getWeaponImage(weaponId, WEAPON_IDs) {
  const name = WEAPON_IDs[weaponId];
  const url = appURLs.CDN_PLAIN + `/blitz/val/weapons/${name}/${name}.svg`;
  if (name) return url;
  return "";
}

export function getMapImage(mapId) {
  const mapUrl = appURLs.CDN + `${mapId}`;
  if (mapId) return mapUrl;
  return "";
}

export const formatActName = (actId, actData) => {
  const act = actData[actId];
  const actNumber = act.name.replace("ACT ", "");
  const parentId = act?.parentId;
  const episode = actData?.[parentId] || "";
  const episodeNumber = episode.name.replace("EPISODE ", "");
  const formatedName = `Ep ${episodeNumber} - Act ${actNumber}`;
  return formatedName;
};

export const getActValue = (actId, actData) => {
  const act = actData[actId];
  const actNumber = act.name.replace("ACT ", "");
  const parentId = act?.parentId;
  const episode = actData?.[parentId] || "";
  const episodeNumber = episode.name.replace("EPISODE ", "");
  const value =
    actNumber === 1 ? `act${actNumber}` : `e${episodeNumber}act${actNumber}`;
  return value;
};

export function translateValRankedTier(t, tier) {
  switch (tier.toLowerCase()) {
    case "iron":
      return t("val:ranks.iron", "Iron");
    case "bronze":
      return t("val:ranks.bronze", "Bronze");
    case "silver":
      return t("val:ranks.silver", "Silver");
    case "gold":
      return t("val:ranks.gold", "Gold");
    case "platinum":
      return t("val:ranks.platinum", "Platinum");
    case "diamond":
      return t("val:ranks.diamond", "Diamond");
    case "immortal":
      return t("val:ranks.immortal", "Immortal");
    case "radiant":
      return t("val:ranks.radiant", "Radiant");
    case "unrated":
      return t("val:ranks.unrated", "Unrated");
    default:
      return tier.charAt(0).toUpperCase() + tier.slice(1);
  }
}

export const getMapDisplayName = (map) => {
  //port -> icebox //todo:this mapping should be pulled down from json with ranks soon to be added
  if (map.toLowerCase() === "port") return "Icebox";
  return map;
};

export function kdaColor(kda) {
  switch (true) {
    case kda < 1:
      return "#828790";
    case kda >= 1 && kda < 1.25:
      return "#978D87";
    case kda >= 1.25 && kda < 1.5:
      return "#C4A889";
    case kda >= 1.5 && kda < 1.75:
      return "#DEAF78";
    case kda >= 1.75 && kda < 2.0:
      return "#E6A85F";
    default:
      return "#FF9417";
  }
}

// Color range for combat score
export function scoreColorStyle(score) {
  return makeRangeObject({
    "0-159": "#E44C4D",
    "160-169": "#DD7A7D",
    "170-179": "#DD7A7D",
    "180-189": "#D5B1B5",
    "190-199": "#D5B1B5",
    "200-209": "#C1D4D8",
    "210-219": "#9DD5D7",
    "220-229": "#9DD5D7",
    "230-239": "#79D6D6",
    "240-249": "#79D6D6",
    "250-10000": "#30D9D4",
  })[Math.floor(score)];
}

export function getDeathmatchPositionColor(position) {
  const colors = {
    1: "var(--yellow)",
    2: "#A6ACB9",
    3: "#AE8967",
    4: "var(--shade2)",
  };
  if (colors?.[position]) return colors[position];
  return "var(--shade3)";
}

// // Color range for wep avg dmg
export function weaponDamageColor(score) {
  return makeRangeObject({
    "0-14": "#E44C4D",
    "15-29": "#DD7A7D",
    "30-44": "#DD7A7D",
    "45-59": "#D5B1B5",
    "60-74": "#D5B1B5",
    "75-89": "#C1D4D8",
    "90-104": "#9DD5D7",
    "105-119": "#9DD5D7",
    "120-134": "#79D6D6",
    "135-149": "#79D6D6",
    "150-2000": "#79D6D6",
  })[Math.floor(score)];
}

export const getWeaponHeadshotColor = (hsRate, avg) => {
  if (hsRate > avg - 1 && hsRate < avg + 1) {
    return "var(--shade2)";
  }
  if (hsRate < avg) {
    return "#E4858F";
  }
  return "#8DC1EC";
};

export const getWinRateColor = (rate) =>
  makeRangeObject({
    "0-45": "var(--perf-neg3)",
    "46-47": "var(--perf-neg2)",
    "48-49": "var(--perf-neg1)",
    50: "var(--perf-neutral)",
    "51-52": "var(--perf-pos1)",
    "53-54": "var(--perf-pos2)",
    "55-100": "var(--perf-pos3)",
  })[Math.floor(rate)];

export const rankColor = {
  iron: "#757E80",
  bronze: "#A78260",
  silver: "#BAC7C8",
  gold: "#CDA353",
  platinum: "#4CACB9",
  diamond: "#A462EC",
  immortal: "#CB2C56",
  radiant: "#D6BE64",
  unrated: "var(--shade3)",
};

export function calcAvgEconomyForMatch(
  roundResults,
  playerId,
  type = "subject"
) {
  let damage = 0;
  let economySpent = 0;
  roundResults.forEach((round) => {
    damage +=
      round?.playerStats
        ?.find((p) => p[type] === playerId)
        ?.damage?.reduce((a, round) => a + round.damage, 0) || 0;

    economySpent +=
      round?.playerEconomies?.find((p) => p[type] === playerId)?.spent || 0;
  });

  return toFixedNumber(
    sanitizeNumber((damage * 1000) / (economySpent || 1000)),
    0
  );
}

// Avg score
export function getAvgScore(score, roundsPlayed) {
  const result = Math.floor(score / (roundsPlayed > 0 ? roundsPlayed : 1));
  return toFixedNumber(sanitizeNumber(result), 0);
}

export const getMatchPositionText = (t, position) => {
  if (position === 1) {
    return t("val:matchPosition.1st", "1st");
  } else if (position === 2) {
    return t("val:matchPosition.2nd", "2nd");
  } else if (position === 3) {
    return t("val:matchPosition.3rd", "3rd");
  }
  return t("val:matchPosition", "{{position}}th", { position: position });
};

export const getQueueName = (queue) => {
  if (!queue) return null;
  if (queue.toLowerCase() === "ggteam") return "Escalation";
  return queue;
};

export const getGraphPoint = (
  val,
  xIndex,
  xInterval,
  minVal,
  maxVal,
  graphHeight,
  graphWidth,
  margin,
  isReversedX,
  xShiftIndex
) => {
  const { marginTop, marginBottom } = margin;
  const minGraphVal = marginTop;
  const maxGraphVal = graphHeight - marginBottom;
  const scale = (minGraphVal - maxGraphVal) / (maxVal - minVal || 1);

  const posY = (val - minVal) * scale + maxGraphVal;
  let posX = xInterval / 2 + xInterval * (xIndex + xShiftIndex);
  posX = isReversedX ? graphWidth - posX : posX;

  return { posX, posY };
};

export const getGraphPoints = (params) => {
  const {
    graphHeight,
    graphWidth,
    pointCount,
    graphValues,
    isStretch,
    isReversedX,
    margin,
    limits,
    isLeftAligned = true,
    diffStart,
    diffEnd,
  } = params;

  const { maxValue, minValue, avgValue } = limits;

  // Get number of graph to display.
  const numPoints = pointCount
    ? Math.min(pointCount, graphValues.length)
    : graphValues.length;
  const numBreakBars = isStretch ? graphValues.length : pointCount;

  // Calculate width of break bar in x direction, [px]
  const colWidth = graphWidth / numBreakBars;

  // Get values of graph to display
  const data = graphValues?.slice(0, numPoints);

  // Calculate the start value of graph.
  let startVal = 0;
  if (diffStart === undefined || diffStart === null) {
    if (graphValues?.length) {
      const x1 = graphValues[0];
      const x2 = graphValues.length > 1 ? graphValues[1] : graphValues[0];
      startVal = x1 - (x2 - x1) / 2;
    }
  } else {
    startVal = (graphValues?.[0] ?? 0) + diffStart / 2;
  }

  let endVal = 0;
  if (diffEnd === undefined || diffEnd === null) {
    if (graphValues?.length) {
      const graphLength = graphValues.length;
      const x2 = graphValues[graphLength - 1];
      const x1 =
        graphValues.length > 1
          ? graphValues[graphLength - 2]
          : graphValues[graphLength - 1];
      endVal = x2 + (x2 - x1) / 2;
    }
  } else {
    endVal = (graphValues?.[graphValues.length - 1] ?? 0) + diffEnd / 2;
  }

  // const upperValueGap = Math.max(maxValue, startVal, endVal) - avgValue;
  // const lowerValueGap = avgValue - Math.min(minValue, startVal, endVal);
  // const maxValueGap = Math.max(upperValueGap, lowerValueGap);
  const fixedMaxValue = maxValue; // Math.ceil(maxValueGap + avgValue);
  const fixedMinValue = minValue; // Math.floor(avgValue - maxValueGap);

  const isShifted =
    !isStretch &&
    ((isReversedX && isLeftAligned) || !(isReversedX || isLeftAligned));
  const xShiftIndex = isShifted
    ? numBreakBars - Math.min(graphValues.length, numBreakBars)
    : 0;

  // Get Graph Points
  const graphPoints = data?.map((val, index) => {
    return getGraphPoint(
      val,
      index,
      colWidth,
      fixedMinValue,
      fixedMaxValue,
      graphHeight,
      graphWidth,
      margin,
      isReversedX,
      xShiftIndex
    );
  });
  // Get Point for average value
  const avgPoint = getGraphPoint(
    avgValue,
    0,
    colWidth,
    fixedMinValue,
    fixedMaxValue,
    graphHeight,
    graphWidth,
    margin,
    isReversedX,
    xShiftIndex
  );

  // Get start point
  const startPoint = getGraphPoint(
    startVal,
    0,
    colWidth,
    fixedMinValue,
    fixedMaxValue,
    graphHeight,
    graphWidth,
    margin,
    isReversedX,
    xShiftIndex
  );
  startPoint.posX += isReversedX ? colWidth / 2 : -colWidth / 2;
  startPoint.posY += 0.1;

  // Get end point
  const endPoint = getGraphPoint(
    endVal,
    graphValues.length - 1,
    colWidth,
    fixedMinValue,
    fixedMaxValue,
    graphHeight,
    graphWidth,
    margin,
    isReversedX,
    xShiftIndex
  );
  endPoint.posX += isReversedX ? -colWidth / 2 : colWidth / 2;

  return {
    graphPoints,
    startPoint,
    endPoint,
    avgPoint,
  };
};

export const meanBy = (values) => {
  let avg = 0;
  for (let i = 0; i < values.length; i++) {
    avg += values[i];
  }
  return avg / values.length;
};

export const getMatchDataWithPerfStats = (matchPerformanceStats, profileId) => {
  if (!matchPerformanceStats) return [];
  return matchPerformanceStats
    .map((performanceMatch) => {
      return {
        date: getDate(performanceMatch.matchDate),
        hs: getAvgHeadshot(performanceMatch?.current) || 0,
        sprayControl: getSprayControl(performanceMatch?.current) || 0,
        crosshair:
          parseInt(
            100 -
              safeDivide(
                performanceMatch?.current?.distance,
                performanceMatch?.current?.crosshairplacementCount
              )
          ) || 0,
        link: `/valorant/match/${profileId}/${performanceMatch.season}/${performanceMatch.matchId}`,
        tooltipData: {
          hs: {
            current: getAvgHeadshot(performanceMatch?.current) || 0,
            avg: getAvgHeadshot(performanceMatch?.lastN) || 0,
          },
          sprayControl: {
            current: getSprayControl(performanceMatch?.current) || 0,
            avg: getSprayControl(performanceMatch?.lastN) || 0,
          },
          crosshair: {
            current:
              parseInt(
                100 -
                  safeDivide(
                    performanceMatch?.current?.distance,
                    performanceMatch?.current?.crosshairplacementCount
                  )
              ) || 0,
            avg:
              parseInt(
                100 -
                  safeDivide(
                    performanceMatch?.lastN?.distance,
                    performanceMatch?.lastN?.crosshairplacementCount
                  )
              ) || 0,
          },
          playerIcon: getAgentImage({
            type: "matchtile",
            agentID: performanceMatch.agentId,
          }),
        },
      };
    })
    .slice(0, 10)
    .reverse();
};

export const getAvgHeadshot = (stats) => {
  if (stats) {
    return (
      (stats?.headshots * 100) /
      (stats?.headshots +
        stats?.bodyshots +
        stats?.legshots +
        stats?.missedshots || 1)
    ).toFixed(1);
  }
  return null;
};

export const getSprayControl = (stats) => {
  if (!stats) return 0;
  return (
    (stats.missedshots * 100) /
    (stats.headshots + stats.bodyshots + stats.legshots + stats.missedshots ||
      1)
  ).toFixed(1);
};

export const safeDivide = (a, b) => {
  return (a || 0) / (b || 1);
};

export const getDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.getMonth() + 1 + "/" + date.getDate();
};

export const getActData = (constants) =>
  constants?.acts?.reduce((actData, act) => {
    actData[act?.id] = act;
    return actData;
  }, {});

export const getActOptions = (actData = {}) => {
  const acts = [];
  for (const actId of Object.keys(actData)) {
    if (actData[actId]?.type === "act") {
      const displayName = formatActName(actId, actData);
      acts.push({
        disabled: false,
        text: displayName,
        value: actId,
      });
      if (actData[actId]?.isActive) break;
    }
  }
  return acts.reverse();
};
