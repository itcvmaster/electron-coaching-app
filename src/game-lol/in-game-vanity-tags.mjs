import { t } from "i18next";

import getPlaystyleIcon from "@/game-lol/get-playstyle-icon.mjs";

function getStreakColor(streakType) {
  if (streakType === "streak") {
    return "hot";
  }
  if (streakType === "loss-streak") {
    return "cold";
  }
  return "";
}

function getStreak(playStyles) {
  const didWinLastGame = playStyles.lastFewWins[0];
  let streakCount = 0;

  for (const didWin of playStyles.lastFewWins) {
    if (didWin === didWinLastGame) {
      streakCount++;
    } else {
      break;
    }
  }

  const isWarmingUp =
    Date.now() - new Date(playStyles.lastGame).getTime() >
    30 * 24 * 60 * 60 * 1000; // 30 days

  return isWarmingUp
    ? ["warming-up", null]
    : streakCount > 1
    ? [
        didWinLastGame ? "streak" : "loss-streak",
        streakCount === playStyles.lastFewWins.length
          ? `${playStyles.lastFewWins.length}+`
          : streakCount,
      ]
    : [];
}

export function injectStreakTags(tags, playStyles) {
  const [streakType, streakCount] = getStreak(playStyles);

  if (streakType) {
    const streakTag = {
      content: streakCount,
      color: getStreakColor(streakType),
      icon: getPlaystyleIcon(streakType, true),
    };

    tags.push(streakTag);
  }
}

export function injectLanerTags(tags, playStyles) {
  const {
    //BAD
    averageDeathsAt10Min,
    averageGankDeaths,
    averageLaningPhaseDeaths,

    // GOOD
    firstGankedLaneCounts,
  } = playStyles;

  let jungleGanksTotalGames = 0;
  firstGankedLaneCounts.forEach((item) => {
    jungleGanksTotalGames += item.count || 0;
  });

  if (jungleGanksTotalGames > 5) {
    const favoriteGankingLane = firstGankedLaneCounts.sort(
      (a, b) => b.count - a.count
    )[0].id;

    switch (favoriteGankingLane) {
      case "TOP":
        tags.push({
          role: "JUNGLE",
          content: t("lol:playStyleTags.tags.first_gank_target_lane", {
            lane: `${t("lol:roles.top", "Top")} ${t("lol:championData.lane")}`,
          }),
          icon: getPlaystyleIcon("ganks-top", true),
          color: "neutral",
        });
        break;
      case "MID":
        tags.push({
          role: "JUNGLE",
          content: t("lol:playStyleTags.tags.first_gank_target_lane", {
            lane: `${t("lol:roles.mid", "Mid")} ${t("lol:championData.lane")}`,
          }),
          icon: getPlaystyleIcon("ganks-mid", true),
          color: "neutral",
        });
        break;
      case "BOTTOM":
        tags.push({
          role: "JUNGLE",
          content: t("lol:playStyleTags.tags.first_gank_target_lane", {
            lane: `${t("lol:roles.bot", "Bot")} ${t("lol:championData.lane")}`,
          }),
          icon: getPlaystyleIcon("ganks-bot", true),
          color: "neutral",
        });
        break;
      default:
    }
  }

  // GANK PRONE
  if (averageGankDeaths > 0.7) {
    tags.push({
      role: "NOT_JUNGLE",
      content: t("lol:playStyleTags.tags.gank_deaths.gankProne", "Gank Prone"),
      icon: getPlaystyleIcon("laner-unsafe", true),
      color: "negative",
    });
  } else if (averageGankDeaths < 0.2) {
    tags.push({
      role: "NOT_JUNGLE",
      content: t(
        "lol:playStyleTags.tags.gank_deaths.hardToGank",
        "Hard to Gank"
      ),
      icon: getPlaystyleIcon("laner-safe", true),
      color: "positive",
    });
  }

  // LANE PHASE
  if (averageLaningPhaseDeaths > 2) {
    tags.push({
      role: "NOT_JUNGLE",
      content: t("lol:playStyleTags.tags.worstLaner", "Bad Laner"),
      icon: getPlaystyleIcon("laner-worst", true),
      color: "negative",
    });
  } else if (averageLaningPhaseDeaths > 1.5) {
    tags.push({
      role: "NOT_JUNGLE",
      content: t("lol:playStyleTags.tags.vulnerable", "Vulnerable"),
      icon: getPlaystyleIcon("laner-unsafe", true),
      color: "negative",
    });
  } else if (averageLaningPhaseDeaths < 0.5) {
    tags.push({
      role: "NOT_JUNGLE",
      content: t("lol:playStyleTags.tags.safeLaner", "Safe Laner"),
      icon: getPlaystyleIcon("laner-safe", true),
      color: "positive",
    });
  }
  if (averageDeathsAt10Min > 1.6) {
    tags.push({
      content: t("lol:playStyleTags.tags.vulnerable", "Dies Early"),
      icon: getPlaystyleIcon("laner-worst", true),
      color: "negative",
    });
  }
}

export function injectWardingTags(tags, playStyles) {
  const { averageWardsPlaced, averageFirstWardTime } = playStyles;

  if (averageWardsPlaced > 3 && averageFirstWardTime > 270000) {
    tags.push({
      content: t("lol:playStyleTags.tags.lateWarder", "Late Warder"),
      icon: getPlaystyleIcon("warder-late", true),
      color: "neutral",
    });
  } else if (averageWardsPlaced < 3) {
    tags.push({
      content: t("lol:playStyleTags.tags.badWarder", "Bad Warder"),
      icon: getPlaystyleIcon("warder-bad", true),
      color: "negative",
    });
  }
  if (averageWardsPlaced > 7) {
    tags.push({
      content: t("lol:playStyleTags.tags.activeWarder", "Active Warder"),
      icon: getPlaystyleIcon("warder-active", true),
      color: "positive",
    });
  }
}
