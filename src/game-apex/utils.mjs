import { ARENA_DIVISIONS, DIVISIONS, LEGENDS } from "@/game-apex/constants.mjs";
import getOrdinal from "@/util/get-ordinal.mjs";

export const formatMode = (lastgamemode, gameMode) => {
  switch (lastgamemode) {
    case "survival": {
      return gameMode.split("_").slice(-1)[0];
    }
    case "arenas": {
      return gameMode.endsWith("ranked") ? "rankedArenas" : "arenas";
    }
    default:
      return lastgamemode;
  }
};

export const getLastGameMode = (gameMode) => {
  if (gameMode.includes("arenas")) {
    return "arenas";
  } else if (
    gameMode.endsWith("ranked") ||
    gameMode.endsWith("duo") ||
    gameMode.endsWith("trio")
  ) {
    return "survival";
  }
};

export function translateApexRankedTier(t, tier) {
  switch (tier.toLowerCase()) {
    case "bronze":
      return t("apex:rank.bronze", "Bronze");
    case "silver":
      return t("apex:rank.silver", "Silver");
    case "gold":
      return t("apex:rank.gold", "Gold");
    case "platinum":
      return t("apex:rank.platinum", "Platinum");
    case "diamond":
      return t("apex:rank.diamond", "Diamond");
    case "master":
      return t("apex:rank.master", "Master");
    case "radiant":
      return t("apex:rank.predator", "Predator");
    case "unrated":
      return t("apex:rank.unrated", "Unrated");
    default:
      return tier.charAt(0).toUpperCase() + tier.slice(1);
  }
}

const getRankRating = (rp, mode) => {
  const tierPoints = (
    mode === "rankedArenas" ? ARENA_DIVISIONS : DIVISIONS
  ).reduce((arr, div) => arr.concat(div.tiers), []);
  const tierIndex = tierPoints.findIndex((tier) => tier <= rp);

  if (tierIndex === -1) return 0;
  if (tierIndex === 0) return 100;
  return Math.floor(
    ((rp - tierPoints[tierIndex]) /
      (tierPoints[tierIndex - 1] - tierPoints[tierIndex])) *
      100
  );
};

export const getDivision = (rp, mode) => {
  for (const division of mode === "rankedArenas"
    ? ARENA_DIVISIONS
    : DIVISIONS) {
    if (rp >= division.minRp) {
      let myTier;
      if (division.tiers)
        for (const [i, tier] of division.tiers.entries()) {
          if (rp >= tier) {
            myTier = i + 1;
            break;
          }
        }
      return {
        ...division,
        rank: myTier,
        rankRating: getRankRating(rp, mode),
      };
    }
  }
};

export const getSplitRanksByPlayerSeason = (season, gameMode) => {
  const rankedMode = getRankedModeByGameMode(gameMode);
  const ranks = {};
  if (!rankedMode || !season?.[rankedMode]?.games_played) return ranks;
  const hasSplitOccured = season?.[rankedMode]?.hassplitresetoccured;

  // Add rank information for 1st split
  const firstRankscore = hasSplitOccured
    ? season?.[rankedMode]?.firstsplitrankedscore
    : season?.[rankedMode]?.current_rank_score;
  const firstRankInfo = getDivision(Number(firstRankscore), rankedMode);
  ranks.firstSplit = {
    ...firstRankInfo,
    rankedPoint: firstRankscore,
    rankedRating: firstRankInfo?.rankRating,
  };

  // Add rank information for 2nd split
  if (hasSplitOccured) {
    const secondRankscore = season?.[rankedMode]?.current_rank_score;
    const secondRankInfo = getDivision(Number(secondRankscore), rankedMode);
    ranks.secondSplit = {
      ...secondRankInfo,
      rankedPoint: secondRankscore,
      rankedRating: secondRankInfo?.rankRating,
    };
  }

  return ranks;
};

export const getRankedModeByGameMode = (gameMode) => {
  let rankedMode;
  switch (gameMode) {
    case "all":
    case "ranked":
      rankedMode = "ranked";
      break;
    case "arenas":
    case "rankedArenas":
      rankedMode = "rankedArenas";
      break;
  }

  return rankedMode;
};

export const getPlayerStatsByMatch = (match, playerId) => {
  const championStats = match?.playerMatchChampionStats || [];
  return championStats.find(
    (stat) => stat.apex_id?.toString() === playerId?.toString()
  );
};

export function getMatchResultData(t, modeObj, myPlayer, liveGame) {
  const { team: { placement } = {} } = myPlayer || {};
  const res = {
    win: false,
  };
  if (placement) {
    res.grade = getOrdinal(placement);
    res.label = res.grade;
  }
  if (liveGame) {
    res.colorClass = "title_won";
    res.label = t("common:stats.live", "Live Game");
  } else if (placement === 1) {
    res.colorClass = "title_won";
    res.label = t("common:stats.victory", "Victory");
    res.win = true;
  } else if (modeObj?.noPlacement) {
    res.colorClass = "title_lost";
    res.label = t("common:stats.defeat", "Defeat");
  } else if (placement <= 25) {
    res.color = "title_won";
  }
  return res;
}

export const getLegendFromModelName = (modelName) => {
  return Object.values(LEGENDS).find((l) =>
    l.modelNames.find((m) => modelName?.includes(m))
  );
};

export const getTotalHitsShots = (weapons, apexWeapons) => {
  if (!Object.keys(weapons || {}).length) return {};
  let totalHits;
  let totalShots;

  for (const weapon in weapons) {
    const { hits, shots } = weapons[weapon];

    if (typeof hits !== "number") break;
    totalHits = (totalHits || 0) + hits;
    totalShots =
      (totalShots || 0) + shots * (apexWeapons?.[weapon]?.hitsPerShot || 1);
  }
  return { totalHits, totalShots };
};

export const calcWeaponsAccuracy = (weapons, apexWeapons) => {
  const { totalHits, totalShots } = getTotalHitsShots(weapons, apexWeapons);
  return typeof totalHits === "number" ? totalHits / (totalShots || 1) : null;
};
