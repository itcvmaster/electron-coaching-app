import { t } from "i18next";

import { readState } from "@/__main__/app-state.mjs";
import { appURLs } from "@/app/constants.mjs";
import { getRitoLanguageCodeFromBCP47 } from "@/app/util.mjs";
import {
  BASE_SUPPORT_ITEMS,
  CHAMPION_ABILITY_MAP,
  GAME_LOL_RANK_COLORS,
  LOL_GRADE_COLORS,
  MAX_GAME_TIME_IN_MINUTES,
  MYTHICS,
  ORNN_MYTHICS,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
  REGION_LIST,
  ROLE_SYMBOL_TO_RIOT_STRING,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
  SKILL_HOTKEYS,
  TEAMS_IMGS,
  TIER_LIST,
  TIER_MAP,
  TIER1_SUPPORT_ITEMS,
  Z_SCORES,
} from "@/game-lol/constants.mjs";
import getRankIcon from "@/game-lol/get-rank-icon.mjs";
import get from "@/util/get.mjs";
import { calcKDA, calcRate } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import makeRangeObject from "@/util/make-range-object.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

// This is a hashmap of ONLY differences.
const regionServiceMap = {
  na: "na1",
  eune: "eun1",
  euw: "euw1",
  jp: "jp1",
  lan: "la1",
  las: "la2",
  br: "br1",
  oce: "oc1",
  tr: "tr1",
  id: "id1",
};

export const pretty = (s) =>
  s.replace(/[ /]/g, "-").replace(/[+]/g, "_plus").toLowerCase(); // aka: 'Ranked Solo/Duo' -> 'ranked-solo-duo'

export const defaultRole = "ALL";
export const defaultRank = "PLATINUM_PLUS";
export const defaultRegion = "WORLD";
export const defaultGameMode = "RANKED_SOLO_5X5"; // ranked-solo-duo
export const defaultSynergiesGameMode = "RANKED_SOLO_5X5"; // ranked-solo-duo

export function getRoleIdFromRole(role) {
  return role === "middle" ? "MID" : role.toUpperCase();
}
export function getRoleFromRoleId(roleId) {
  return roleId === "MID" ? "middle" : roleId.toLowerCase();
}

export function trimPatchForDisplay(patch = "") {
  const match = patch?.match(/(.*?\..*?)\./);
  return match ? match[1] : patch;
}

export function getAllValidPatches() {
  const patches = readState.lol?.patches;
  if (patches && patches.length > 0) {
    return patches;
  }
  return [];
}

/**
 * getLatestPatchForStaticData
 * which is used in fetching static data
 * @returns full patch version. ex:) 11.17.1
 */
export function getLatestPatchForStaticData() {
  const patches = getAllValidPatches();
  return `${patches[0]?.versionString}.1`;
}

/**
 * getLatestPatchForChampions
 * which is used in fetching champion aggregating data
 * @returns shorted patch version. ex:) 11.17
 */
export function getLatestPatchForChampions() {
  const patches = getAllValidPatches();
  return patches[0]?.versionString;
}

/**
 * getCurrentPatchForStaticData
 * which is used in fetching static data
 * @returns full patch version. ex:) 11.17.1
 */
export function getCurrentPatchForStaticData() {
  const patch = getStaticPatchOf(getCurrentPatchForChampions());
  return patch;
}

const staticDataKeys = new Set(["champions", "items", "spells", "runes"]);
export function getStaticData(key, patch) {
  if (!patch) patch = getCurrentPatchForStaticData();
  const lang = getLocale();
  const ritoLanguageCode = getRitoLanguageCodeFromBCP47(lang);
  const result = readState.lol.staticData[ritoLanguageCode]?.[patch]?.[key];
  const langs = Object.keys(readState.lol.staticData);
  const fallBackResult =
    readState.lol.staticData[langs[langs.length - 1]]?.[patch]?.[key];
  if (!staticDataKeys.has(key) && !result && !fallBackResult)
    throw new Error(`Invalid static data key "${key}"`);
  return result || fallBackResult || [];
}

export function getChampionTips() {
  const lang = getLocale();
  const ritoLanguageCode = getRitoLanguageCodeFromBCP47(lang);
  const result = readState.lol.championTips[ritoLanguageCode];
  const langs = Object.keys(readState.lol.championTips);
  const fallBackResult = readState.lol.championTips[langs[langs.length - 1]];
  return result || fallBackResult || [];
}

/**
 * getCurrentPatchForChampions
 * which is used in fetching champion aggregating data
 * @returns shorted patch version. ex:) 11.17
 */
export function getCurrentPatchForChampions() {
  const patch = getLatestPatchForChampions();
  return patch;
}

/**
 * getStaticPatchOf
 * which is used in getting static patch data from champion patch
 * @param patch : champion patch. ex:) 11.17
 * @returns : static patch. ex:) 11.17.1
 */
export function getStaticPatchOf(patch) {
  const patches = getAllValidPatches();
  const trimmedPatch = trimPatchForDisplay(patch);
  if (patches instanceof Error)
    throw new Error("Failed to load LoL patch info!");
  const p = patches.find((p) => p.versionString === trimmedPatch);
  return p ? `${p.versionString}.1` : null;
}

export function getAllPatchesForChampions() {
  const patches = getAllValidPatches();
  return patches.map((p) => p.versionString);
}

export function normalizeRegion(region = "world") {
  const lowerCaseRegion = region.toLowerCase();
  if (regionServiceMap.hasOwnProperty(lowerCaseRegion)) {
    return regionServiceMap[lowerCaseRegion];
  }
  return lowerCaseRegion;
}

export function getDerivedId(region, name) {
  return `${normalizeRegion(region)}:${name}`;
}

export function getChampionDivStatsId({ championId, role, queue }) {
  return `${queue.split("_").pop()}-${championId}-${role || ""}`.toLowerCase();
}

export function getDerivedQueue(derivedId, queue) {
  return `${derivedId}_${queue ? queue : "all"}`.toLowerCase();
}

export function mapQueueToSymbol(q) {
  switch ((q || "").toString().toLowerCase()) {
    case "420":
    case "ranked-solo-duo":
    case "ranked solo/duo":
    case "ranked_solo_5x5":
      return QUEUE_SYMBOLS.rankedSoloDuo;
    case "440":
    case "ranked-flex":
    case "ranked flex":
    case "ranked_flex_sr":
      return QUEUE_SYMBOLS.rankedFlex;
    case "400":
    case "normal-draft":
    case "normal draft":
    case "summoners_rift_draft_pick":
      return QUEUE_SYMBOLS.normalDraft;
    case "430":
    case "normal-blind":
    case "normal blind":
    case "summoners_rift_blind_pick":
      return QUEUE_SYMBOLS.normalBlind;
    case "470":
    case "3v3-ranked":
    case "3v3 ranked":
    case "ranked_flex_tt":
      return QUEUE_SYMBOLS.ranked3v3;
    case "460":
    case "3v3-draft":
    case "3v3 blind":
    case "twisted_treeline_blind_pick":
      return QUEUE_SYMBOLS.draft3v3;
    case "450":
    case "aram":
    case "howling_abyss_aram":
      return QUEUE_SYMBOLS.aram;
    case "900":
    case "urf":
    case "summoner_rift_urf":
      return QUEUE_SYMBOLS.urf;
    case "1100":
    case "ranked_tft":
      return QUEUE_SYMBOLS.rankedTft;
    case "all":
      return QUEUE_SYMBOLS.all;
    default:
      return null;
  }
}

const colorRangeArray = makeRangeObject({
  "0-45": "var(--perf-neg3)",
  "46-47": "var(--perf-neg2)",
  "48-49": "var(--perf-neg1)",
  50: "var(--perf-neutral)",
  "51-52": "var(--perf-pos1)",
  "53-54": "var(--perf-pos2)",
  "55-100": "var(--perf-pos3)",
});

export const getWinRateColor = (percent) => colorRangeArray[~~percent];

export const getIsRankedQueue = (queue) => {
  const soloObj = QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo];
  const flexObj = QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedFlex];
  const queueString = typeof queue === "string" ? queue : queue.toString();

  const isRankedQueue =
    queueString === soloObj.gql || queueString === flexObj.gql;

  return isRankedQueue;
};

export const getIsARAM = (queue) => {
  const isARAM = queue === QUEUE_SYMBOLS.aram;
  return isARAM;
};

export const isARAM = (queue) => queue === QUEUE_SYMBOLS.aram;

export const getDefaultedFiltersForChampions = (isSynergies, searchParams) => {
  const queue = searchParams?.get("queue");
  const region = searchParams?.get("region");
  const role = searchParams?.get("role");
  const duoRole = searchParams?.get("duoRole");
  const tier = searchParams?.get("tier");

  const defaultedRole = isSynergies
    ? role || ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.adc].gql
    : role || ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].gql;
  const defaultedduoRole = isSynergies
    ? duoRole || ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.support].gql
    : undefined;

  const filters = isSynergies
    ? {
        queue: queue || QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql,
        region: region || REGION_LIST[0].gql, // All Regions
        tier: tier || RANK_SYMBOL_TO_STR[RANK_SYMBOLS.platinumPlus].gql,
        role: defaultedRole,
        duoRole: defaultedduoRole,
      }
    : {
        role: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].gql,
        queue: queue || QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql,
        region: region || REGION_LIST[0].gql, // All Regions
        tier: tier || RANK_SYMBOL_TO_STR[RANK_SYMBOLS.platinumPlus].gql,
      };

  return filters;
};

export const getSearchParamsForChampions = (
  isSynergiesFilter,
  filterParams
) => {
  const { role, duoRole, tier, queue, region } = filterParams;
  let urlParams;

  if (isSynergiesFilter) {
    urlParams = { role, duoRole, tier, region };
  } else if (getIsARAM(queue)) {
    urlParams = { queue, region };
  } else if (!getIsRankedQueue(queue)) {
    urlParams = { queue, region };
  } else {
    urlParams = { tier, queue, region };
  }

  return parseSearchParams(urlParams);
};

/**
 * Returns if team won or not
 *
 * @param {Object} team
 * @returns {Boolean}
 */
export const isWinningTeam = (team) => {
  const { win } = team;
  if (typeof win === "string") return win === "Win";
  if (typeof win === "boolean") return win;
};

export const roleHumanize = (role) => {
  if (typeof role === "symbol") {
    role = ROLE_SYMBOL_TO_STR[role].key;
  }
  switch ((role || "").toLowerCase()) {
    case "TOP":
    case "top":
      return "Top";
    case "solo":
    case "mid":
    case "middle":
      return "Mid";
    case "jungle":
    case "jng":
      return "Jungle";
    case "duo":
    case "duo_carry":
    case "carry":
    case "adc":
      return "ADC";
    case "duo_support":
    case "sup":
    case "support":
    case "utility":
      return "Support";
    case "bottom":
      return "Bot";
    default:
      return "None";
  }
};

export const correctRoleName = (role) => {
  if (role === "ADC") return "bot";
  return role?.toLowerCase();
};

export const roleImgFilter = (roleOriginal, r) => {
  if (!roleOriginal) return "specialist";
  let role = roleOriginal;
  if (role === "BOTTOM" && r === "DUO_SUPPORT") return "support";
  if (role === "BOTTOM" && r === "DUO_CARRY") return "bot";
  role = role.replace("BOTTOM", "bot");
  role = role.replace("NONE", "specialist");
  return role.toLowerCase();
};

export const mapRankToSymbol = (rank) => {
  switch ((rank || "").toLowerCase()) {
    case "platinum_plus":
      return RANK_SYMBOLS.platinumPlus;
    case "challenger":
      return RANK_SYMBOLS.challenger;
    case "grandmaster":
      return RANK_SYMBOLS.grandmaster;
    case "master":
      return RANK_SYMBOLS.master;
    case "diamond":
      return RANK_SYMBOLS.diamond;
    case "platinum":
      return RANK_SYMBOLS.platinum;
    case "gold":
      return RANK_SYMBOLS.gold;
    case "silver":
      return RANK_SYMBOLS.silver;
    case "bronze":
      return RANK_SYMBOLS.bronze;
    case "iron":
      return RANK_SYMBOLS.iron;
    default:
      return null;
  }
};

export const getOneRankAbove = (newRank) => {
  let oneRankAboveIndex =
    TIER_LIST.findIndex((rank) => mapRankToSymbol(rank) === newRank) + 1;
  if (oneRankAboveIndex === TIER_LIST.length)
    oneRankAboveIndex = oneRankAboveIndex - 1;
  if (oneRankAboveIndex) return TIER_LIST[oneRankAboveIndex];
};

export const getDefaultedFiltersForChampion = (searchParams, defaultRole) => {
  const queue = searchParams.get("queue");
  const region = searchParams.get("region");
  const role = searchParams.get("role") || defaultRole;
  const tier = searchParams.get("tier");
  const filters = {
    queue: queue || QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql, // RANKED_SOLO_5V5
    region: region || REGION_LIST[0].gql, // All Regions
    tier: tier || RANK_SYMBOL_TO_STR[RANK_SYMBOLS.platinumPlus].gql, // "PLATINUM_PLUS". lowercase
    role: role || ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.top].gql,
  };

  return filters;
};

export const getDefaultedFiltersForProBuilds = (searchParams) => {
  let role = searchParams?.get("role");
  const team = searchParams?.get("team");

  if (role === "null") role = null;

  return {
    role: role || ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].gql,
    team,
  };
};

export const commonMatchups = (
  championStats,
  matchups,
  matchupThreshold = 0.005
) => {
  if (!championStats?.games) return [];
  return (matchups || []).filter(
    (m) => m.games / championStats.games >= matchupThreshold
  );
};

export const winningMatchups = (matchups) => {
  return (matchups || [])
    .filter((m) => m.wins / m.games >= 0.5)
    .sort((a, b) => {
      return b.wins / b.games - a.wins / a.games;
    });
};

export const winningLaneMatchups = (matchups) => {
  return (matchups || [])
    .filter((m) => m.laneWins / m.games >= 0.5)
    .sort((a, b) => {
      return b.laneWins / b.games - a.laneWins / a.games;
    });
};

export const losingMatchups = (matchups) => {
  return (matchups || [])
    .filter((m) => m.wins / m.games < 0.5)
    .sort((a, b) => {
      return a.wins / a.games - b.wins / b.games;
    });
};
export const losingLaneMatchups = (matchups) => {
  return (matchups || [])
    .filter((m) => m.laneWins / m.games < 0.5)
    .sort((a, b) => {
      return a.laneWins / a.games - b.laneWins / b.games;
    });
};

export const getSearchParamsForChampion = (filterParams) => {
  // We done need victoryOnly in searchParams.
  const newParams = { ...filterParams };
  delete newParams.victoryOnly;
  return parseSearchParams(newParams);
};

// getStaticChampionByKey
// @param championKey : championKey is not same with champion name.
//                      championKey has not space but champion name has.
export const getStaticChampionByKey = (championKey, patch) => {
  const champions = getStaticData("champions", patch);
  const champion = champions?.[championKey];
  return champion
    ? {
        ...champion,
        id: champion?.key,
        key: championKey,
      }
    : undefined;
};

export const getStaticChampionById = (championId, patch) => {
  const champions = getStaticData("champions", patch);
  const championKey = champions?.keys[championId];
  const champion = champions?.[championKey];
  return champion
    ? {
        ...champion,
        id: champion?.key,
        key: championKey,
      }
    : undefined;
};

export const getChampionKeyById = (championId, patch) => {
  const champions = getStaticData("champions", patch);
  const championKey = champions?.keys[championId];
  return championKey;
};

export const getAbilityVideo = (championKey, hotkey) => {
  return `${appURLs.CDN_VIDEOS}/tooltip_videos/${championKey}/${hotkey}.webm`;
};

export const getCorrectAbilityImg = (championKey, abilityKey) => {
  const key = `${championKey}_${abilityKey}`;
  return CHAMPION_ABILITY_MAP[key];
};

export const getLaneWinRate = (stats) => {
  return stats.laneWins / (stats.games || 1);
};
export const sortByLaneWinRate = (arr, isAsc) => {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];

  // process nested key
  const sorted = arr.sort((a, b) => {
    const v1 = getLaneWinRate(a);
    const v2 = getLaneWinRate(b);
    return v1 - v2;
  });
  return isAsc ? sorted : sorted.reverse();
};
export const sortByWinRate = (arr, isAsc) => {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];

  // process nested key
  const sorted = arr.sort((a, b) => {
    const v1 = a.wins / (a.games || 1);
    const v2 = b.wins / (b.games || 1);
    return v1 - v2;
  });
  return isAsc ? sorted : sorted.reverse();
};

export function filterMatchupsByThreshold(
  championStats,
  matchupStats,
  matchupThreshold = 0.01
) {
  if (!championStats && !matchupStats) return false;
  return (matchupStats?.games || 0) / (championStats?.games || 1) >=
    matchupThreshold
    ? 1
    : 0;
}

export function calcTeamDamages(teamStats) {
  let ap = 0;
  let ad = 0;
  let tr = 0;

  for (const championStats of teamStats || []) {
    if (!championStats) continue;
    tr += championStats.trueDamageDealtToChampions / championStats.games || 1;
    ap += championStats.magicDamageDealtToChampions / championStats.games || 1;
    ad +=
      championStats.physicalDamageDealtToChampions / championStats.games || 1;
  }

  // To avoid cases where the total sum of percentages is > or < 100 we need some computations
  // First of all we need to sort and truncate all percentages (without rounding)

  const dmgSum = tr + ap + ad;
  let damageShare = [
    ["tr", !tr ? 0 : (tr / dmgSum) * 100],
    ["ap", !ap ? 0 : (ap / dmgSum) * 100],
    ["ad", !ad ? 0 : (ad / dmgSum) * 100],
  ].sort((a, b) => a[1] - b[1]);

  // Then calculate the difference between 100 and the actual sum
  const diff = 100 - damageShare.reduce((acc, v) => acc + ~~v[1], 0);

  // Then we distribute the diffs
  if (ad && ad && tr)
    damageShare = damageShare.map((v, i) => [
      v[0],
      i < diff ? ~~v[1] + 1 : ~~v[1],
    ]);

  const apDamageShare = damageShare.find((v) => v[0] === "ap")[1] || null;
  const adDamageShare = damageShare.find((v) => v[0] === "ad")[1] || null;
  const trueDamageShare = damageShare.find((v) => v[0] === "tr")[1] || null;

  return { ap, ad, tr, apDamageShare, adDamageShare, trueDamageShare };
}

export function determineSkillOrder(skills, threshold = 4, length = 3) {
  const counter = {};
  const result = [];

  if (!skills) return result;

  for (const skill of skills) {
    if (Number(skill) !== 0) {
      if (!(skill in counter)) counter[skill] = 0;

      counter[skill]++;

      if (counter[skill] === threshold) result.push(Number(skill));
    }
  }

  const counterArray = Object.entries(counter)
    .map(([spellID, count]) => ({
      spellID: Number(spellID),
      count,
    }))
    .filter((spell) => !result.includes(spell.spellID))
    .sort((a, z) => z.count - a.count);

  for (const incompleteSpell of counterArray) {
    result.push(incompleteSpell.spellID);
  }

  return result.slice(0, length);
}

export function getRuneImage(type = "png", runeID = 0) {
  if (typeof type !== "string") {
    return "";
  }

  switch (type.toLowerCase()) {
    case "webp":
      return `${appURLs.CDN}/runes/all/${runeID}.webp`;
    case "png":
    default:
      return `${appURLs.CDN}/runes/all/${runeID}.png`;
  }
}

export function mapRoleToSymbol(role) {
  if (typeof role === "symbol") return role;
  switch ((role || "").toLowerCase()) {
    case "top":
      return ROLE_SYMBOLS.top;
    case "jng":
    case "jungle":
      return ROLE_SYMBOLS.jungle;
    case "mid":
    case "middle":
      return ROLE_SYMBOLS.mid;
    case "adc":
    case "duo_carry":
    case "bot":
    case "bottom":
      return ROLE_SYMBOLS.adc;
    case "support":
    case "sup":
    case "duo_support":
    case "utility":
      return ROLE_SYMBOLS.support;
    case "all":
    case "":
      return ROLE_SYMBOLS.all;
    default:
      return null;
  }
}

function getRating(stat, { mean, stdev }, language, lowerIsBetter) {
  const zScore = (lowerIsBetter ? mean - stat : stat - mean) / (stdev || 1);
  const allScores = [];
  let myScore;
  const zScores = Z_SCORES.default;
  for (const z of zScores) {
    const { grade, score } = z;
    const fillColor = LOL_GRADE_COLORS[grade];
    if (
      !Number.isNaN(zScore) &&
      (score === undefined || score === null || zScore > score) &&
      !myScore
    ) {
      const actualPercentile = zScore;
      myScore = {
        ...z,
        fillColor,
        percentile: actualPercentile,
      };
      allScores.push({
        value: Math.max(stat, 0),
        text: stat.toLocaleString(language, { maximumFractionDigits: 0 }),
        key: "you",
        fillColor: "var(--turq)",
      });
    }
    const value = Math.max(score * stdev + mean, 0);
    if (grade === "S+" || grade.length === 1) {
      allScores.push({
        value,
        key: grade,
        text: value.toLocaleString(language, { maximumFractionDigits: 0 }),
        fillColor,
        img: grade,
      });
    }
  }

  if (!myScore) {
    const z = zScores[zScores.length - 1];
    const { grade } = z;
    const fillColor = LOL_GRADE_COLORS[grade];
    const actualPercentile = zScore;
    myScore = {
      ...z,
      fillColor,
      percentile: actualPercentile,
      // percentOfGrade,
    };
    allScores.push({
      value: Math.max(stat, 0),
      text: stat.toLocaleString(language, { maximumFractionDigits: 0 }),
      key: "you",
      fillColor: "var(--yellow)",
    });
  }

  return {
    allScores,
    myScore: myScore || {},
  };
}

export const getCSStats = ({
  rankStats,
  rankStatsByRole,
  stat,
  isARAM,
  rankFilter,
  language,
}) => {
  if (!rankStats?.length || !stat?.gameDuration || !rankFilter) return;
  const { gameDuration, csPerMin } = stat;
  if (Number.isNaN(csPerMin)) return;

  let isRoleOnly;
  let myRankStats = isARAM
    ? rankStats[0]
    : rankStats.find((r) => RANK_SYMBOL_TO_STR[r.tier]?.capped === rankFilter);
  const minutes =
    gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000);
  const maxMin = Math.ceil(minutes);

  if (!myRankStats?.creepScoreByMinute?.[maxMin] && rankStatsByRole) {
    myRankStats = rankStatsByRole.find(
      (r) => RANK_SYMBOL_TO_STR[r.tier]?.capped === rankFilter
    );
    isRoleOnly = true;
  }
  if (!myRankStats?.creepScoreByMinute?.[maxMin]?.stdev) return;

  const rankCsPerMin = {
    mean: myRankStats?.creepScoreByMinute[maxMin]?.mean / maxMin,
    stdev: myRankStats?.creepScoreByMinute[maxMin]?.stdev / maxMin,
  };
  const myRankCsPerMin = rankCsPerMin.mean;
  const myStatPerMin = csPerMin;

  return {
    ...(getRating(myStatPerMin, rankCsPerMin, language) || {}),
    myStatPerMin,
    myRankCsPerMin,
    // myRankDiff: (100 * (myStatPerMin - myRankCsPerMin)) / myRankCsPerMin,
    maxMin,
    isRoleOnly,
  };
};

export const getVisionScoreStats = ({
  rankStats,
  rankFilter,
  oneRankAbove,
  stat,
  isARAM,
}) => {
  if (!rankStats?.length || !rankFilter || !stat?.gameDuration) return;
  const { gameDuration, visionScorePerMin } = stat;
  if (Number.isNaN(visionScorePerMin)) return;

  const myRankStats = isARAM
    ? rankStats[0]
    : rankStats.find((r) => RANK_SYMBOL_TO_STR[r.tier]?.capped === rankFilter);

  if (!myRankStats || !myRankStats.visionScorePerMinute) return;

  const oneRankAboveStats = rankStats.find((r) => r.tier === oneRankAbove);
  const minutes =
    gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000);

  let key, maxMin;
  if (minutes <= 20) {
    key = "gameDuration_15MinTo_20Min";
    maxMin = 20;
  } else if (minutes <= 25) {
    key = "gameDuration_20MinTo_25Min";
    maxMin = 25;
  } else if (minutes <= 30) {
    key = "gameDuration_25MinTo_30Min";
    maxMin = 30;
  } else if (minutes <= 35) {
    key = "gameDuration_30MinTo_35Min";
    maxMin = 35;
  } else if (minutes <= 40) {
    key = "gameDuration_35MinTo_40Min";
    maxMin = 40;
  } else if (minutes <= 45) {
    key = "gameDuration_40MinTo_45Min";
    maxMin = 45;
  } else {
    key = "gameDuration_45MinTo_50Min";
    maxMin = 50;
  }

  if (!myRankStats?.visionScorePerMinute[key]?.stdev) return;

  const myStatPerMin = visionScorePerMin;

  const myRankVision = myRankStats?.visionScorePerMinute[key]?.mean * minutes;

  return {
    ...(getRating(
      myStatPerMin / minutes,
      myRankStats?.visionScorePerMinute[key]
    ) || {}),
    myStatPerMin,
    oneRankAboveVision:
      oneRankAboveStats?.visionScorePerMinute?.[key] &&
      oneRankAboveStats?.visionScorePerMinute?.[key].mean * minutes,
    key,
    myRankVision,
    // myRankDiff: (100 * (myStatPerMin - myRankVision)) / myRankVision,
    maxMin,
    minutes,
  };
};

export const getDamageStats = ({
  rankStats,
  rankStatsByRole,
  rankFilter,
  isARAM,
  stat,
}) => {
  if (!rankStats?.length || !rankFilter || !stat?.gameDuration) return;
  const { gameDuration, dmgPerMin } = stat;
  if (Number.isNaN(dmgPerMin)) return;

  let myRankStats = isARAM
    ? rankStats[0]
    : rankStats.find((r) => RANK_SYMBOL_TO_STR[r.tier]?.capped === rankFilter);

  const minutes =
    gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000);
  let key, maxMin, isRoleOnly;
  if (minutes <= 20) {
    key = "gameDuration_15MinTo_20Min";
    maxMin = 20;
  } else if (minutes <= 25) {
    key = "gameDuration_20MinTo_25Min";
    maxMin = 25;
  } else if (minutes <= 30) {
    key = "gameDuration_25MinTo_30Min";
    maxMin = 30;
  } else if (minutes <= 35) {
    key = "gameDuration_30MinTo_35Min";
    maxMin = 35;
  } else if (minutes <= 40) {
    key = "gameDuration_35MinTo_40Min";
    maxMin = 40;
  } else if (minutes <= 45) {
    key = "gameDuration_40MinTo_45Min";
    maxMin = 45;
  } else {
    key = "gameDuration_45MinTo_50Min";
    maxMin = 50;
  }
  if (
    !isARAM &&
    !myRankStats?.damageDealtToChampionsPerMinute?.[key]?.stdev &&
    rankStatsByRole
  ) {
    myRankStats = rankStatsByRole.find((r) => r.tier === rankFilter);
    isRoleOnly = true;
  }
  if (!myRankStats?.damageDealtToChampionsPerMinute?.[key]?.stdev) return;

  const totalDamageDealtToChampions =
    myRankStats?.totalDamageDealtToChampions?.mean || 0;
  const myStatPerMin = dmgPerMin;
  const rankDmgPerMin =
    myRankStats?.damageDealtToChampionsPerMinute?.[key]?.mean;
  const rankDmg =
    myRankStats?.damageDealtToChampionsPerMinute?.[key]?.mean * minutes;
  const dmgDiff = totalDamageDealtToChampions - rankDmg;

  return {
    ...(getRating(
      myStatPerMin,
      myRankStats?.damageDealtToChampionsPerMinute?.[key]
    ) || {}),
    myStatPerMin,
    dmgDiff,
    rankDmg:
      myRankStats?.damageDealtToChampionsPerMinute?.[key]?.mean * minutes,
    rankDmgPerMin,
    // myRankDiff: (100 * (myStatPerMin - rankDmgPerMin)) / rankDmgPerMin,
    maxMin,
    minutes: minutes.toFixed(),
    isRoleOnly,
  };
};

export const getKDAStats = ({
  rankStats,
  rankStatsByRole,
  rankFilter,
  isARAM,
  stat,
  language,
}) => {
  if (!rankStats?.length || !rankFilter || !stat?.gameDuration) return;

  const { gameDuration, kdaPerMin } = stat;
  let myRankStats = isARAM
    ? rankStats[0]
    : rankStats.find((r) => r.tier === rankFilter);

  const minutes =
    gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000);
  let key, maxMin, isRoleOnly;
  if (minutes <= 20) {
    key = "gameDuration_15MinTo_20Min";
    maxMin = 20;
  } else if (minutes <= 25) {
    key = "gameDuration_20MinTo_25Min";
    maxMin = 25;
  } else if (minutes <= 30) {
    key = "gameDuration_25MinTo_30Min";
    maxMin = 30;
  } else if (minutes <= 35) {
    key = "gameDuration_30MinTo_35Min";
    maxMin = 35;
  } else if (minutes <= 40) {
    key = "gameDuration_35MinTo_40Min";
    maxMin = 40;
  } else if (minutes <= 45) {
    key = "gameDuration_40MinTo_45Min";
    maxMin = 45;
  } else {
    key = "gameDuration_45MinTo_50Min";
    maxMin = 50;
  }
  if (!isARAM && !myRankStats?.kdaByGameDuration?.[key]?.stdev) {
    myRankStats = rankStatsByRole?.find((r) => r.tier === rankFilter);
    isRoleOnly = true;
  }
  if (!myRankStats?.kdaByGameDuration?.[key]?.stdev) return;

  const myStatPerMin = kdaPerMin || 0;
  const rankKDAPerMin = myRankStats?.kdaByGameDuration?.[key]?.mean;
  const rankKDA = myRankStats?.kdaByGameDuration?.[key]?.mean * minutes;
  const KDADiff = myStatPerMin - rankKDA;

  return {
    ...(getRating(
      myStatPerMin,
      myRankStats?.kdaByGameDuration?.[key],
      language
    ) || {}),
    myStatPerMin,
    KDADiff,
    rankKDA: myRankStats?.kdaByGameDuration?.[key]?.mean * minutes,
    rankKDAPerMin,
    // myRankDiff: (100 * (myStatPerMin - rankKDAPerMin)) / rankKDAPerMin,
    maxMin,
    minutes: minutes.toFixed(0),
    isRoleOnly,
  };
};

export function translateLolRankedTier(t, tier) {
  switch (tier.toLowerCase()) {
    case "iron":
      return t("lol:ranks.iron", "Iron");
    case "bronze":
      return t("lol:ranks.bronze", "Bronze");
    case "silver":
      return t("lol:ranks.silver", "Silver");
    case "gold":
      return t("lol:ranks.gold", "Gold");
    case "platinum":
      return t("lol:ranks.platinum", "Platinum");
    case "diamond":
      return t("lol:ranks.diamond", "Diamond");
    case "master":
      return t("lol:ranks.master", "Master");
    case "grandmaster":
      return t("lol:ranks.grandmaster", "Grandmaster");
    case "challenger":
      return t("lol:ranks.challenger", "Challenger");
    default:
      return t("lol:ranks.unranked", "Unranked");
  }
}

const map = { I: 1, II: 2, III: 3, IV: 4 };

export const convertRankFromRomanToNumber = (rank) => map[rank];

export const formatGarenaMatch = (match, accountId) => {
  const { region, gameCreation, duration, riotMatchId, queue, leaguePatch } =
    match;
  let { playerMatches } = match;

  if (!playerMatches) playerMatches = [];

  //Need for matchlist
  const {
    champion: { id },
    role,
  } = playerMatches.find((p) => p?.accountId === accountId) || { champion: {} };

  const matchId = `${regionsToServices(region)}:${riotMatchId}`;
  const { majorVersion, minorVersion } = leaguePatch || {};

  const participantIdentities = [];
  const participants = playerMatches.map((player, i) => {
    const {
      matchStatsFromClient,
      playerMatchStats,
      accountId,
      champion: { id: championId },
      league_profile: profile,
      role,
      teamId,
    } = player;

    const { summonerName } = profile || {};
    const {
      time_cc_others,
      total_time_cc_dealt,
      wards_purchased,
      damage_to_champions,
      damage_to_towers,
      damage_to_objectives,
      damage_taken,
      damage_healed,
      damage_physical_dealt,
      damage_magic_dealt,
      damage_true_dealt,
      minions_killed_neutral,
      minions_killed_total,
      first_blood,
      perks,
      spells,
      items,
    } = playerMatchStats || {};
    const participantId = i + 1;
    const playerObj = {
      accountId,
      participantId,
      summonerName,
      currentPlatformId: region,
      platformId: region,
    };
    participantIdentities.push({
      participantId,
      player: playerObj,
    });
    const stats = {
      ...playerMatchStats,
      spell1Id: spells && spells[0],
      spell2Id: spells && spells[1],
      totalTimeCrowdControlDealt: total_time_cc_dealt,
      timeCCingOthers: time_cc_others,
      visionWardsBoughtInGame: wards_purchased,
      totalDamageDealtToChampions: damage_to_champions,
      damageDealtToTurrets: damage_to_towers,
      damageDealtToObjectives: damage_to_objectives,
      totalDamageTaken: damage_taken,
      totalHeal: damage_healed,
      physicalDamageDealt: damage_physical_dealt,
      magicDamageDealt: damage_magic_dealt,
      trueDamageDealt: damage_true_dealt,
      neutralMinionsKilled: minions_killed_neutral,
      totalMinionsKilled: minions_killed_total,
      firstBloodKill: first_blood,
    };
    (perks || []).forEach((perk, i) => {
      stats[`perk${i}`] = perk;
    });
    (items || []).forEach((item, i) => {
      stats[`item${i}`] = item;
    });

    return {
      participantId,
      championId: parseInt(championId),
      events: [],
      role,
      teamId,
      identity: {
        player: playerObj,
      },
      stats,
      matchStatsFromClient,
    };
  });

  const timestamp = new Date(gameCreation).getTime();

  const playerOne = participants[0];
  const team100Win =
    playerOne?.teamId === 100 ? playerOne?.stats.win : !playerOne?.stats.win;

  return {
    champion: parseInt(id),
    role,
    gameId: parseInt(riotMatchId),
    derivedMatchId: matchId,
    gameCreation: timestamp,
    gameDuration: duration,
    gameVersion: `${majorVersion}.${minorVersion}`,
    timestamp,
    queueId: queue,
    queue,
    platformId: region,
    participantIdentities,
    participants,
    teams: [
      { teamId: 100, bans: [], win: team100Win },
      { teamId: 200, bans: [], win: !team100Win },
    ],
  };
};

const mapRankToRoman = ["I", "II", "III", "IV"];
export const LP_PER_TIER = 100;

/**
 * Check if rank tier is "MASTER"/"GRANDMASTER"/"CHALLENGER"
 *
 * @param {String} rankTier : an element of TIER_MAP
 * @returns {boolean}
 */
export const checkApexRank = (rankTier) => {
  return (
    rankTier === "MASTER" ||
    rankTier === "GRANDMASTER" ||
    rankTier === "CHALLENGER"
  );
};
/**
 * Get Roman letter from rank number
 *
 * @param {number} rankNumber: 1 - I, 2 - II, 3 - III, 4 - IV
 * @returns I / II / III / IV
 */
export const convertRankFromNumberToRoman = (rankNumber) => {
  if (!rankNumber || rankNumber > 4) {
    return "";
  }
  return mapRankToRoman[rankNumber - 1];
};

export function absoluteRank(rankData) {
  const isApexRank = checkApexRank(rankData?.tier);
  const tierID = `${rankData?.tier}_${rankData?.rank}`;
  const tierIndex = TIER_MAP.findIndex((tier) => tier === tierID);
  const absoluteLP = isApexRank
    ? (TIER_MAP.length - 2) * LP_PER_TIER + rankData.leaguePoints
    : tierIndex && tierIndex * LP_PER_TIER + rankData.leaguePoints;

  return absoluteLP;
}

/**
 * Get absolute Tier + Rank
 *
 * @param {Object} rankData = { tier, rank }
 */
export const getAbsoluteRankDivision = (rankData) => {
  const isApexRank = checkApexRank(rankData?.tier);
  const tierID = rankData?.tier + (isApexRank ? "" : `_${rankData?.rank}`);
  const absoluteRankDivision = TIER_MAP.findIndex((tier) => tier === tierID);

  return absoluteRankDivision;
};

export const getTierInfoFromAbsoluteLp = (absLp, leagueTier) => {
  if (!absLp) {
    return {
      tierLp: 0,
      tier: "IRON",
      rank: "IV",
    };
  }
  let tierLp = absLp;
  const tierIndex = TIER_MAP.slice(0, -3).findIndex(() => {
    if (tierLp - LP_PER_TIER < 0) {
      return true;
    }
    tierLp = tierLp - LP_PER_TIER;
    return false;
  });

  const tierInfo = tierIndex !== -1 ? TIER_MAP[tierIndex] : leagueTier;
  const isApex = checkApexRank(tierInfo);

  const tier = isApex ? tierInfo : tierInfo.split("_")[0];
  const rank = isApex ? "" : tierInfo.split("_")[1];

  return { tierLp, tier, rank };
};

export function getShortTierFromRank(rank = "", tierSymbol) {
  const tier = RANK_SYMBOL_TO_STR[tierSymbol]?.capped ?? "NONE";
  let text = "";
  let rankNum = "";
  if (tier === "MASTER" || tier === "GRANDMASTER" || tier === "CHALLENGER") {
    text = tier.slice(0, 2);
  } else {
    text = tier.slice(0, 1);
    rankNum = mapRankToRoman.indexOf(rank) + 1;
  }

  return {
    text: tier === "NONE" ? "-" : text + (rankNum > 0 ? rankNum : ""),
    colors: GAME_LOL_RANK_COLORS[tier.toLowerCase()],
  };
}

export function getRoleDataForChampion(championId, championsStats) {
  if (!championId || !championsStats) return [];
  const reportsForChampion = championsStats.filter(
    (report) => String(report.champion_id) === String(championId)
  );
  const sortedReportsForChampion = reportsForChampion.sort((a, b) => {
    return b.stats.rolePercentage - a.stats.rolePercentage;
  });
  return sortedReportsForChampion;
}

// TODO: this fn is broken (missing champ parameter) and performance sucks
export function findChampionMainRole(championStats) {
  try {
    const possibleRoles = championStats.sort((a, b) => {
      return b.stats.rolePercentage - a.stats.rolePercentage;
    });
    const mainRole = possibleRoles.reduce(
      (prev, next) =>
        get(next, "stats.games", 0) > get(prev, "stats.games", 0) ? next : prev,
      {}
    );
    return mainRole.role;
  } catch (err) {
    return null;
  }
}

export function getChampionLink(championKey, tab, matchupChampionKey, filters) {
  const pathname = `/lol/champions/${championKey}/${tab}/${
    matchupChampionKey || ""
  }`;
  const urlParams = getSearchParamsForChampion(filters);
  const paramString = urlParams?.toString();
  return paramString ? pathname + `?${paramString}` : pathname;
}

export function splitParticipantsByTeam(participants, teamId = 100) {
  const teams = { t1: [], t2: [] };
  for (const participant of participants) {
    if (participant.teamId === teamId) {
      teams.t1.push(participant);
    } else if (participant.teamId) {
      teams.t2.push(participant);
    }
  }
  return teams;
}

/**
 * Infers main roles based on an array of champions
 *
 * Returns: an array of role symbols in the same order as the champions were
 *
 * @function
 * @param {Array} champions         Array of champion ids or participants
 * @param {Object} championsReport  Champions report from redux (_getChampionsReport)
 * @return {Array}
 */
export function inferRolesFromChampions(champions, championsReport) {
  const areParticipants =
    champions &&
    champions.every((p) => p && p.championId) &&
    champions.length === 5;

  const areChampions =
    champions &&
    champions.every((id) => id && Number.parseInt(id, 10)) &&
    champions.length === 5;

  if ((!areParticipants && !areChampions) || !championsReport) {
    return [];
  }

  const roleFills = Object.values(ROLE_SYMBOLS);
  const mappedChampions = champions.map((hash) =>
    areChampions ? parseInt(hash) : parseInt(hash.championId)
  );

  // Filter championsReport by champions
  // Sort championsReport by number of possible roles, the one with less possible roles will be analyzed first
  // Sort specific champion roles based on rolePercentage
  const championsRoles = mappedChampions
    .map((champion) =>
      championsReport
        .filter((v) => parseInt(v?.champion_id) === champion)
        .sort((a, b) => b?.stats?.rolePercentage - a?.stats?.rolePercentage)
    )
    .sort(
      (a, b) =>
        a.length &&
        b.length &&
        a.length - b.length &&
        b[0]?.stats?.rolePercentage - a[0]?.stats?.rolePercentage
    );

  // If for any reasons we can't find enough data, we return original data
  if (championsRoles.some((_) => !_ || _.length === 0)) {
    return champions;
  }

  // Assign main roles
  const finalRoles = [];
  const smiteId = 11;
  const shouldUseSmiteInfo =
    areParticipants &&
    champions.filter(
      ({ spell1Id, spell2Id }) => spell1Id === smiteId || spell2Id === smiteId
    ).length === 1;

  for (const championRoles of championsRoles) {
    let found = false;
    const championIndex = mappedChampions.indexOf(
      parseInt(championRoles[0].champion_id)
    );

    if (shouldUseSmiteInfo) {
      const { spell1Id, spell2Id } = champions[championIndex] || {};
      if (spell1Id === smiteId || spell2Id === smiteId) {
        const findRole = (role) => role?.role === "jungle";
        const prevRoleIndex = finalRoles.findIndex((r) => findRole(r));
        if (prevRoleIndex >= 0) {
          finalRoles[prevRoleIndex] = null;
        }
        finalRoles[championIndex] = { role: "jungle" };
        continue;
      }
    }

    const allChampionRoles = shouldUseSmiteInfo
      ? championRoles.filter((v) => v.role !== "JUNGLE")
      : championRoles;

    for (const possibleRole of allChampionRoles) {
      const findRole = (role) => role?.role === possibleRole.role;
      const prevRole = finalRoles.find((r) => findRole(r));
      const prevRoleIndex = finalRoles.findIndex((r) => findRole(r));
      if (!prevRole) {
        found = true;
        finalRoles[championIndex] = possibleRole;
        break;
      } else if (
        possibleRole.stats.rolePercentage > prevRole?.stats?.rolePercentage
      ) {
        found = true;
        finalRoles[prevRoleIndex] = null;
        finalRoles[championIndex] = possibleRole;
        break;
      }
    }
    if (!found) {
      finalRoles[championIndex] = null;
    }
  }

  // Fill null values with remaining roles and map to role symbols
  for (const [index, role] of finalRoles.entries()) {
    if (role) {
      finalRoles[index] = mapRoleToSymbol(role.role);
      continue;
    }
    for (const possibleRoleSymbol of roleFills) {
      const findRole = (role) =>
        mapRoleToSymbol(role?.role) === possibleRoleSymbol ||
        role === possibleRoleSymbol;
      if (!finalRoles.find((r) => findRole(r))) {
        finalRoles[index] = possibleRoleSymbol;
        break;
      }
    }
  }

  // If areParticipants, map them back to the original format
  if (areParticipants) {
    for (const [index, participant] of champions.entries()) {
      const role = ROLE_SYMBOL_TO_RIOT_STRING[finalRoles[index]].toLowerCase();
      finalRoles[index] = {
        ...participant,
        role,
        individualPosition: role,
      };
    }
  }

  return finalRoles;
}

export function isRemakeGame(matchDuration, inSeconds) {
  return matchDuration / (inSeconds ? 1 : 1000) <= 300;
}

export function isAbandonedMatch(match) {
  // No winner = only losers = abandoned game
  if (!match?.teams) return false;
  return !match.teams.find(({ win }) => win);
}

export const isMatchInQueue = (match, queue) =>
  !match || queue === "all" || match.queueId === mapQueueToSymbol(queue);

export function isSameAccount(account1, account2) {
  const ids = [
    "puuid",
    "accountId",
    "encryptedSummonerId",
    "unencryptedSummonerId",
    "derivedId",
  ];
  if (!account1 || !account2) {
    return false;
  }
  for (const id of ids) {
    let id1 = get(account1, id);
    let id2 = get(account2, id);
    if (id === "accountId" && !id1) id1 = get(account1, "currentAccountId");
    if (id === "accountId" && !id2) id2 = get(account2, "currentAccountId");
    if (id1 && id2 && id1 === id2) return true;
  }

  return false;
}

export function getChampion(keyOrId) {
  const champions = getStaticData("champions");
  const key = champions?.[keyOrId] ? keyOrId : champions?.keys[keyOrId];
  const champion = champions?.[key];
  if (!champion) return null;
  const id = champion?.key; // This is misleading because in the data, key = id here. blame rito
  return {
    key,
    id,
    name: champion?.name,
  };
}

/**
 * Sorts participants by role, each participant needs to have a participant.role property
 *
 * Returns: A new sorted array of participants
 *
 * @function
 * @param {Array} champions         Array of participants
 * @return {Array}
 */
export function sortParticipantsByRole(participants) {
  if (!participants) return [];
  if (!participants.every((p) => mapRoleToSymbol(p.individualPosition)))
    return participants;
  const sortOrder = {
    [ROLE_SYMBOLS.top]: "0",
    [ROLE_SYMBOLS.jungle]: "1",
    [ROLE_SYMBOLS.mid]: "2",
    [ROLE_SYMBOLS.adc]: "3",
    [ROLE_SYMBOLS.support]: "4",
  };
  return participants.sort((a, b) => {
    const a1Symbol = mapRoleToSymbol(a.individualPosition);
    const b1Symbol = mapRoleToSymbol(b.individualPosition);
    return sortOrder[a1Symbol].localeCompare(sortOrder[b1Symbol]);
  });
}

export function getRuneArrayFromParticipant(participant) {
  const runeArray = [
    participant.perks.styles[0].style,
    participant.perks.styles[0].selections[0].perk,
    participant.perks.styles[0].selections[1].perk,
    participant.perks.styles[0].selections[2].perk,
    participant.perks.styles[0].selections[3].perk,
    participant.perks.styles[1].style,
    participant.perks.styles[1].selections[0].perk,
    participant.perks.styles[1].selections[1].perk,
  ];
  return runeArray;
}

export function getRuneTreeObjectFromRuneArray(runeArray, perks) {
  const treeObject = {};
  if (!runeArray) return {};
  if (runeArray.indexOf(undefined) !== -1 || !Array.isArray(perks)) {
    // if no runes
    treeObject.runes = [];
    treeObject.mainTree = null;
    treeObject.mainTreeKey = null;
    treeObject.secondTree = null;
    treeObject.secondTreeKey = null;
    treeObject.keystone = null;
    return treeObject;
  }
  treeObject.runes = runeArray;
  treeObject.mainTree = perks.find((tree) => tree.id === runeArray[0]);
  treeObject.mainTreeKey = get(treeObject, "mainTree.key", "").toLowerCase();
  treeObject.secondTree = perks.find((tree) => tree.id === runeArray[5]);
  treeObject.secondTreeKey = get(
    treeObject,
    "secondTree.key",
    ""
  ).toLowerCase();
  if (treeObject.mainTree) {
    treeObject.keystone = treeObject.mainTree.slots[0].runes.find(
      (rune) => rune.id === runeArray[1]
    );
  }
  return treeObject;
}

export function getRuneTreeObjectFromParticipant(participant, perks) {
  const runeArray = getRuneArrayFromParticipant(participant);
  return getRuneTreeObjectFromRuneArray(runeArray, perks);
}

export function getShardArrayFromParticipant(participant) {
  if (
    !participant.perks.statPerks.offense &&
    !participant.perks.statPerks.flex &&
    !participant.perks.statPerks.defense
  ) {
    return [];
  }
  const shardArray = [
    participant.perks.statPerks.offense,
    participant.perks.statPerks.flex,
    participant.perks.statPerks.defense,
  ];
  return shardArray;
}

export function mapQueueToRanked(queueId) {
  switch (queueId) {
    case 440:
      return 440;
    case 460:
    case 470:
      return 470;
    case 1090:
    case 1092:
    case 1100:
    case 1130:
      return 1100;
    default:
      return 420;
  }
}

export const CURRENT_SEASON_TIMESTAMP = (function () {
  const SEASON_2020_START = 1578524400000;
  const SEASON_2021_START = 1610038800000;
  const now = Date.now();

  if (now < SEASON_2021_START) {
    return SEASON_2020_START;
  }

  return SEASON_2021_START;
})();

export function getRankBasedOnQueue(
  queueType,
  _seasons,
  playerLeagues,
  getLatestRankAnyway
) {
  // const currentSeason = Number.parseInt(Object.keys(seasons).reverse()[0], 10);

  // Map queueId to corresponding ranked queueId
  const mappedRankedQueueId = mapQueueToRanked(Number.parseInt(queueType, 10));
  // Showing TFT rank for TFT games, flex rank for flex games, soloQ rank in all other cases
  return (playerLeagues || []).find(
    (league) =>
      mapQueueToSymbol(league.queue) ===
        mapQueueToSymbol(mappedRankedQueueId) &&
      (new Date(league.insertedAt).getTime() >= CURRENT_SEASON_TIMESTAMP ||
        getLatestRankAnyway)
  );
}

export const tierToAbbr = (league) => {
  switch (league.tier) {
    case "IRON":
      return "I";
    case "BRONZE":
      return "B";
    case "SILVER":
      return "S";
    case "GOLD":
      return "G";
    case "PLATINUM":
      return "P";
    case "DIAMOND":
      return "D";
    case "MASTER":
    case "GRANDMASTER":
    case "CHALLENGER":
      return league.leaguePoints;
    default:
      return "-";
  }
};

export const getChampionsWithStats = (championsReport) => {
  return championsReport?.map((champ) => {
    const averageGameSeconds = Number.parseFloat(
      get(champ, "stats.gameDuration", 0) / get(champ, "stats.games", 1)
    ).toFixed(1);
    return {
      ...champ,
      stats: {
        ...champ.stats,
        winRate: Number.parseFloat(
          (get(champ, "stats.wins", 0) / get(champ, "stats.games", 1)) * 100
        ).toFixed(1),
        banRate: Number.parseFloat(
          (get(champ, "stats.bans.ban_count", 0) /
            get(champ, "total_game_count", 1)) *
            100
        ).toFixed(1),
        pickRate: Number.parseFloat(
          (get(champ, "stats.games", 0) / get(champ, "total_game_count", 1)) *
            100
        ).toFixed(1),
        kda: Number.parseFloat(
          (get(champ, "stats.kills", 0) + get(champ, "stats.assists", 0)) /
            get(champ, "stats.deaths", 1)
        ).toFixed(2),
        damage: Math.round(
          get(champ, "stats.totalDamageDealtToChampions", 0) /
            get(champ, "stats.games", 1)
        ),
        damageTaken: Math.round(
          get(champ, "stats.damageSelfMitigated", 0) /
            get(champ, "stats.games", 1)
        ),
        heals: Math.round(
          get(champ, "stats.totalHeal", 0) / get(champ, "stats.games", 1)
        ),
        gold: Math.round(
          get(champ, "stats.goldEarned", 0) / get(champ, "stats.games", 1)
        ),
        avgDamageToTurrets: Math.round(
          get(champ, "stats.damageDealtToTurrets", 0) /
            get(champ, "stats.games", 1)
        ),
        creepScore: Number.parseFloat(
          get(champ, "stats.totalMinionsKilled", 0) /
            get(champ, "stats.games", 1)
        ),
        averageGameSeconds,
        averageGameTime: `${~~(averageGameSeconds / 60)}:${`00${~~(
          averageGameSeconds % 60
        )}`.slice(-2)}`,
      },
    };
  });
};

/**
 * Set defaults
 */
export function getDefaultedFilters(filters) {
  const filtersWithDefaults = Object.assign(
    {
      role: defaultRole,
      tier: defaultRank,
      region: defaultRegion,
      queue:
        QUEUE_SYMBOL_TO_STR[
          Object.getOwnPropertySymbols(QUEUE_SYMBOL_TO_STR)[0]
        ].enum,
    },
    filters
  );

  filtersWithDefaults.role = getRoleIdFromRole(filtersWithDefaults.role);
  return filtersWithDefaults;
}

export const laneNormalize = (lane) => {
  switch (lane?.toLowerCase()) {
    case "adc":
    case "duo_carry":
    case "bot":
    case "bottom":
    case "support":
    case "sup":
    case "duo_support":
    case "utility":
      return "BOTTOM";
    case "mid":
    case "middle":
      return "MIDDLE";
    default:
      return lane;
  }
};

export const laneHumanize = (lane) => {
  switch (lane) {
    case "TOP":
      return "Top";
    case "JUNGLE":
      return "Jungle";
    case "BOTTOM":
      return "Bot";
    case "MID":
      return "Mid";
    case "MIDDLE":
      return "Mid";
    default:
      return lane;
  }
};

export const getRanksArr = ({
  rankStats,
  oneRankAbove,
  stats,
  wholeNumber,
  isTime,
  calcStat,
  condensed,
  lowerIsBetter,
}) => {
  if (!stats) return {};

  let yourRank = RANK_SYMBOL_TO_STR[mapRankToSymbol("iron")].capped;

  const you = {
    key: "you",
    value: stats.myStatPerMin,
    text: wholeNumber
      ? stats.myStatPerMinLabel || stats.myStatPerMin
      : stats.myStatPerMin?.toFixed(1),
    fillColor: "var(--yellow)",
  };
  let oneRankBelowIndex = null;
  let oneRankAboveIndex;
  let passedOneRankAbove;
  let condensedScores;

  const scores = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)
    .reverse()
    .filter((s) => s !== RANK_SYMBOLS.platinumPlus)
    .reduce((arr, key, i) => {
      const val = RANK_SYMBOL_TO_STR[key];
      const rankStat = rankStats.find(
        (s) => RANK_SYMBOL_TO_STR[s.tier]?.capped === val.capped
      );
      const stat = calcStat(rankStat, stats) || 0;

      if (
        (lowerIsBetter
          ? stat < stats.myStatPerMin
          : stat > stats.myStatPerMin) &&
        oneRankBelowIndex === null
      ) {
        oneRankBelowIndex = Math.max(0, i - 1);
        oneRankAboveIndex = i + 1;
        if (!passedOneRankAbove) {
          if (arr[i + 1]) arr[i + 1].showAbv = true;
        }
        arr.push(you);
      }

      if (
        (lowerIsBetter
          ? stat >= stats.myStatPerMin
          : stat <= stats.myStatPerMin) &&
        oneRankBelowIndex === null
      ) {
        yourRank = val.capped;
      }

      if (oneRankAbove === val.capped) passedOneRankAbove = true;
      const RankIcon = getRankIcon(val.t.fallback.toLowerCase());

      arr.push({
        img: RankIcon,
        text: isTime ? stat : stat.toFixed(1),
        value: stat,
        rankIconName: val.t.fallback.toLowerCase(),
        key: val.capped,
        fillColor: GAME_LOL_RANK_COLORS[val.key].fill,
      });

      return arr;
    }, []);
  if (scores.length < 2) return {};
  if (!oneRankAboveIndex) {
    scores.push(you);
    oneRankBelowIndex = scores.length - 2;
    oneRankAboveIndex = scores.length - 1;
    yourRank = RANK_SYMBOL_TO_STR[mapRankToSymbol("challenger")].capped;
    if (condensed)
      condensedScores = scores.slice(
        oneRankAboveIndex - condensed + 1,
        oneRankAboveIndex + 1
      );
  } else if (condensed) {
    const leftIndex = oneRankBelowIndex - (Math.floor(condensed / 2) - 1);
    const rightIndex = oneRankBelowIndex + (Math.ceil(condensed / 2) + 1);
    condensedScores = scores.slice(
      Math.max(
        0,
        leftIndex -
          (rightIndex > scores.length ? rightIndex - scores.length : 0)
      ),
      Math.min(scores.length, rightIndex - (leftIndex < 0 ? leftIndex : 0))
    );
  }

  const myPlacement = scores[oneRankBelowIndex];
  const oneRankAbovePlacement = scores[oneRankAboveIndex];

  const myPlacementRankIcon = getRankIcon(
    myPlacement.key === "you"
      ? RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].capped
      : myPlacement.key
  );
  const percentDiff = Math.min(
    stats.myStatPerMin / oneRankAbovePlacement.value,
    1
  );

  return {
    allScores: condensed ? condensedScores : scores,
    maxRankValue: Math.max(...scores.map((s) => s.value)),
    oneRankBelowIndex,
    percentDiff,
    myPlacement,
    MyPlacementRankIcon: myPlacementRankIcon,
    MyPlacementRankKey:
      myPlacement.key === "you"
        ? RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].capped
        : myPlacement.key,
    yourRank,
  };
};

export const getSuppStats = ({
  timeline,
  stat,
  rankStats = [],
  isARAM,
  rankFilter,
  language,
}) => {
  if ((!timeline && !stat) || !rankStats?.length || !rankFilter) return;
  const { tier1Time, tier2Time, itemId1, itemId2 } = stat;
  if (!tier1Time || Number.isNaN(tier1Time)) return;

  const myRankStats = isARAM
    ? rankStats[0]
    : rankStats.find((r) => r.tier === rankFilter);

  if (!myRankStats?.supportItemQuestCompletionTime?.[`item_${itemId1}`]?.stdev)
    return;

  const tier1RankTime = {
    mean: myRankStats?.supportItemQuestCompletionTime?.[`item_${itemId1}`]
      ?.mean,
    stdev: 1,
  };
  const myRankTime = tier1RankTime.mean;
  const myStatPerMin = tier1Time;
  const myStatPerMin2 = tier2Time;

  let rating = getRating(myStatPerMin, tier1RankTime, language, true) || {};

  let myRankTime2;
  if (
    tier2Time &&
    myRankStats?.supportItemQuestCompletionTime?.[`item_${itemId2}`]?.stdev
  ) {
    const tier2RankTime = {
      mean: myRankStats?.supportItemQuestCompletionTime?.[`item_${itemId2}`]
        ?.mean,
      stdev: 1,
    };
    myRankTime2 = tier2RankTime?.mean;
    const tier2Rating =
      getRating(myStatPerMin2, tier2RankTime, language, true) || {};
    rating = tier2Rating;
  }

  return {
    ...rating,
    myStatPerMin,
    myStatPerMin2,
    myStatPerMinLabel: myStatPerMin,
    myStatPerMin2Label: myStatPerMin2,
    myRankTime,
    myRankTime2,
    itemId1,
    itemId2,
    // myRankDiff: (100 * (myStatPerMin - myRankTime)) / myRankTime,
  };
};

export const getSuppItemUpgradeTimes = (timeline, currParticipant) => {
  if (!timeline) return {};
  let tier1Time, tier2Time, itemId1, itemId2;
  for (let i = 2; i < timeline.frames.length; i++) {
    for (const event of timeline.frames[i].events) {
      const { itemId, participantId, timestamp, type } = event;
      if (
        type === "ITEM_DESTROYED" &&
        participantId === currParticipant.participantId
      ) {
        if (BASE_SUPPORT_ITEMS[itemId]) {
          tier1Time = timestamp;
          itemId1 = BASE_SUPPORT_ITEMS[itemId];
        }
        if (TIER1_SUPPORT_ITEMS[itemId]) {
          tier2Time = timestamp;
          itemId2 = TIER1_SUPPORT_ITEMS[itemId];
          break;
        }
      }
    }
    if (tier2Time) break;
  }
  return { tier1Time, tier2Time, itemId1, itemId2 };
};
export function getBgImage(championKey, scale = "300x600", quality = 80) {
  return `${appURLs.CDN}/fit-in/${scale}/filters:quality(${quality})/blitz/centered/${championKey}_Splash_Centered_0.webp`;
}

export function isCompletedItem(itemID = "", itemsStaticData = {}) {
  let isCompleted = false;

  const itemInfo = itemsStaticData[itemID];
  if (!itemInfo) return isCompleted;

  // Doesnt build INTO anything and has a depth
  if (!itemInfo.into && itemInfo.gold?.total >= 900) {
    isCompleted = true;
  }

  return isCompleted;
}

export function aggregateMatches(matches = [], itemsStaticData = {}) {
  const agg = {
    wins: 0,
    summoners: {},
    keystones: {},
    starters: {},
    mythics: {},
    finalItems: {},
    completedBoots: {},
    skillOrders: {},
  };

  if (!matches || !itemsStaticData) {
    return agg;
  }

  for (const match of matches) {
    if (match.win) agg.wins += 1;

    // Aggregate skill orders
    const skills = match.skillOrder.map((level) => level.skillSlot);
    const skillOrder = determineSkillOrder(skills).map(
      (spell) => SKILL_HOTKEYS[spell - 1]
    );
    const skillOrderID = skillOrder.join(":");
    if (agg.skillOrders[skillOrderID]) {
      agg.skillOrders[skillOrderID] += 1;
    } else {
      agg.skillOrders[skillOrderID] = 1;
    }

    // Aggregate keystones
    const keystone = match.runes?.[0]?.id;
    if (agg.keystones[keystone]) {
      agg.keystones[keystone] += 1;
    } else {
      agg.keystones[keystone] = 1;
    }

    // Aggregate summoners
    for (const summoner of match.spells?.[0]?.ids || []) {
      if (agg.summoners[summoner]) {
        agg.summoners[summoner] += 1;
      } else {
        agg.summoners[summoner] = 1;
      }
    }

    // Aggregate starting items
    const starter = match.buildPaths[match.buildPaths?.length - 1]?.itemId;
    if (agg.starters[starter]) {
      agg.starters[starter] += 1;
    } else {
      agg.starters[starter] = 1;
    }

    for (const item of match.items) {
      // Aggregate mythics
      if (MYTHICS[item.id]) {
        const itemId = ORNN_MYTHICS.includes(item.id)
          ? MYTHICS[item.id]?.originalId
          : item.id;
        if (agg.mythics[itemId]) {
          agg.mythics[itemId] += 1;
        } else {
          agg.mythics[itemId] = 1;
        }
      }

      // Aggregate completed items
      if (isCompletedItem(item.id, itemsStaticData) && !MYTHICS[item.id]) {
        if (agg.finalItems[item.id]) {
          agg.finalItems[item.id] += 1;
        } else {
          agg.finalItems[item.id] = 1;
        }
      }
    }

    for (const boots of match.boots) {
      if (isCompletedItem(boots.id, itemsStaticData)) {
        if (agg.completedBoots[boots.id]) {
          agg.completedBoots[boots.id] += 1;
        } else {
          agg.completedBoots[boots.id] = 1;
        }
      }
    }
  }

  return {
    winRate: Math.round((agg.wins / matches.length) * 100),
    skillOrders: Object.entries(agg.skillOrders)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
    summoners: Object.entries(agg.summoners)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
    keystones: Object.entries(agg.keystones)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
    starters: Object.entries(agg.starters)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
    mythics: Object.entries(agg.mythics)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
    items: Object.entries(agg.finalItems)
      .sort((a, z) => z[1] - a[1])
      .map((item) => item[0]),
  };
}

export function getFilteredSummoners(input) {
  const newArr = [];
  const indexes = [];
  for (const elem of input) {
    const sum = Number.parseInt(elem.ids[0]) + Number.parseInt(elem.ids[1]);
    if (!indexes.includes(sum)) {
      newArr.push(elem);
      indexes.push(sum);
    }
  }
  return newArr;
}

export function roleToLane(role) {
  if (role?.toUpperCase() === "ADC") return "BOTTOM";
  return role?.toUpperCase();
}

export function regionsToServices(region = "world") {
  switch (region.toLowerCase()) {
    case "na1":
    case "na":
      return "na1";
    case "eun1":
    case "eune":
      return "eun1";
    case "euw1":
    case "euw":
      return "euw1";
    case "jp1":
    case "jp":
      return "jp1";
    case "kr":
      return "kr";
    case "la1":
    case "lan":
      return "la1";
    case "la2":
    case "las":
      return "la2";
    case "br1":
    case "br":
      return "br1";
    case "oc1":
    case "oce":
      return "oc1";
    case "tr1":
    case "tr":
      return "tr1";
    case "ru":
      return "ru";
    case "sg":
      return "sg";
    case "id1":
    case "id":
      return "id1";
    case "ph":
      return "ph";
    case "vn":
      return "vn";
    case "th":
      return "th";
    case "tw":
      return "tw";
    default:
      return region.toLowerCase();
  }
}

const getKDA = (stats) => calcKDA(stats?.kills, stats?.deaths, stats?.assists);
const getWinRate = (stats) => 100 * calcRate(stats?.wins, stats?.games);
const getPickRate = (stats) =>
  100 * calcRate(stats?.stats?.games, stats?.totalGameCount);
const getDamageToChampions = (stats) =>
  calcRate(stats?.totalDamageDealtToChampions, stats?.games);
const getBanRate = (stats) => 100 * calcRate(stats?.banRate);
const getHealing = (stats) => calcRate(stats?.totalHeal, stats?.games);
const getCcApplied = (stats) => calcRate(stats?.timeCcingOthers, stats?.games);
const getGoldEarned = (stats) => calcRate(stats?.goldEarned, stats?.games);
const getVisionScore = (stats) => calcRate(stats?.visionScore, stats?.games);
const getDamageToTurrets = (stats) =>
  calcRate(stats?.damageDealtToTurrets, stats?.games);
const getDamageEfficency = (stats) =>
  calcRate(stats?.totalDamageDealtToChampions, stats?.goldSpent, 2);

export const getSpecificMatchupStats = ({
  champion,
  matchupChampion,
  allChampionsStats,
}) => {
  if (!champion || !matchupChampion || !allChampionsStats?.length) return null;

  const championStats = allChampionsStats?.find(
    (c) => c.championId === parseInt(champion.id)
  );
  const matchupChampionStats = allChampionsStats?.find(
    (c) => c.championId === parseInt(matchupChampion.id)
  );

  if (!championStats || !matchupChampionStats) return null;
  return {
    championStats,
    matchupChampionStats,
    kda: [getKDA(championStats), getKDA(matchupChampionStats), 2],
    winRate: [
      getWinRate(championStats),
      getWinRate(matchupChampionStats),
      1,
      "%",
    ],
    pickRate: [
      getPickRate(championStats),
      getPickRate(matchupChampionStats),
      1,
      "%",
    ],
    damageDealt: [
      getDamageToChampions(championStats),
      getDamageToChampions(matchupChampionStats),
    ],
    banRate: [
      getBanRate(championStats),
      getBanRate(matchupChampionStats),
      2,
      "%",
    ],
    damageEfficiency: [
      getDamageEfficency(championStats),
      getDamageEfficency(matchupChampionStats),
      2,
    ],
    damageToChampions: [
      getDamageToChampions(championStats),
      getDamageToChampions(matchupChampionStats),
      0,
    ],
    healing: [getHealing(championStats), getHealing(matchupChampionStats)],
    ccApplied: [
      getCcApplied(championStats),
      getCcApplied(matchupChampionStats),
      1,
    ],
    goldEarned: [
      getGoldEarned(championStats),
      getGoldEarned(matchupChampionStats),
      0,
    ],
    visionScore: [
      getVisionScore(championStats),
      getVisionScore(matchupChampionStats),
      1,
    ],
    damageToObjectives: [
      getDamageToTurrets(championStats),
      getDamageToTurrets(matchupChampionStats),
      0,
    ],
  };
};

export const getChampionRoleById = (championId) => {
  const roles = readState.lol.championRoles;
  return roles?.[championId]?.primaryRole;
};

export const getBorderColor = (isMe, isMyTeam) => {
  return isMe ? "var(--yellow)" : isMyTeam ? "var(--blue)" : "var(--red)";
};

const lolEndpointRegex = new RegExp("(.*://.*:.+?/|.*://)(.*)");

export const getLolEndpointKey = (url) => {
  const endpoint = lolEndpointRegex.exec(url)[2];
  return endpoint;
};

export const getGoldDiff = (frames, t1, participants, myTeam) => {
  let blueSum;
  let redSum;

  return frames.map((frame) => {
    const { participantFrames, timestamp } = frame;
    blueSum = 0;
    redSum = 0;

    for (let i = 1; i <= participants; i++) {
      if (i <= t1 && myTeam === 200) {
        redSum += participantFrames[i].totalGold;
      } else if (i <= t1 && myTeam !== 200) {
        blueSum += participantFrames[i].totalGold;
      } else if (i > t1 && myTeam === 200) {
        blueSum += participantFrames[i].totalGold;
      } else {
        redSum += participantFrames[i].totalGold;
      }
    }

    return { diff: blueSum - redSum, time: timestamp };
  });
};

export const kFormatter = (num) => {
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num;
};

export const sanitizeMatchId = (id) => {
  const idMatch = id.match(/_(.*?)$/);
  return idMatch ? idMatch[1] : id;
};

const compareFunc = (a, b) => {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
};

export function calculateTeamDamages(team, championsReport = []) {
  let ap = 0;
  let ad = 0;
  let tr = 0;

  for (const player of team || []) {
    const championReport = championsReport.find(
      (report) =>
        report?.championId === player.championId ||
        report?.championId === player.championPickIntent
    );
    if (!championReport) continue;
    tr += championReport.trueDamageDealtToChampions / championReport.games || 1;
    ap +=
      championReport.magicDamageDealtToChampions / championReport.games || 1;
    ad +=
      championReport.physicalDamageDealtToChampions / championReport.games || 1;
  }

  // To avoid cases where the total sum of percentages is > or < 100 we need some computations
  // First of all we need to sort and truncate all percentages (without rounding)

  const dmgSum = tr + ap + ad;
  let damageShare = [
    ["tr", !tr ? 0 : (tr / dmgSum) * 100],
    ["ap", !ap ? 0 : (ap / dmgSum) * 100],
    ["ad", !ad ? 0 : (ad / dmgSum) * 100],
  ].sort(compareFunc);

  // Then calculate the difference between 100 and the actual sum
  const diff = 100 - damageShare.reduce((acc, v) => acc + ~~v[1], 0);

  // Then we distribute the diffs
  if (ad && ad && tr)
    damageShare = damageShare.map((v, i) => [
      v[0],
      i < diff ? ~~v[1] + 1 : ~~v[1],
    ]);

  const apDamageShare = damageShare.find((v) => v[0] === "ap")[1] || 0;
  const adDamageShare = damageShare.find((v) => v[0] === "ad")[1] || 0;
  const trueDamageShare = damageShare.find((v) => v[0] === "tr")[1] || 0;

  return { ap, ad, tr, apDamageShare, adDamageShare, trueDamageShare };
}

const hiddenThreshold = 3;

export const getDamageTextPercentage = (perc, type) => {
  if (perc <= hiddenThreshold) return "";
  if (perc <= hiddenThreshold + 8)
    return t("lol:amount", "{{amount}}%", {
      amount: perc,
    });
  return t(`lol:amount${type}`, `{{amount}}% ${type}`, {
    amount: perc,
  });
};

export const getBuildTeamImg = (teamImage) => {
  return (
    teamImage && teamImage !== "streamers.png" && `${TEAMS_IMGS}/${teamImage}`
  );
};

export function groupRecentlyPlayedTeam(data) {
  const namesOnTeam = data.map((p) => p.name).sort();

  const players = {};
  for (const item of data) {
    players[item.name] = new Set(
      item.recentlyPlayedWith.filter((r) => namesOnTeam.includes(r)).sort()
    );
  }

  const groups = new Set();

  function addToGroup(group, names) {
    if (!names.length) {
      return groups.add(group.sort().join("."));
    }

    for (const name of names) {
      addToGroup(
        [...group, name],
        names.filter((n) => players[n].has(name))
      );
    }
  }

  addToGroup([], namesOnTeam);

  return new Array(...groups).map((v) => v.split("."));
}

export function isExternalAPIRegion(region) {
  const lowerCaseRegion = region.toLowerCase();
  if (regionServiceMap.hasOwnProperty(lowerCaseRegion)) return true;
  if (
    REGION_LIST.find(
      ({ key, name }) =>
        key === lowerCaseRegion || name.toLowerCase() === lowerCaseRegion
    )
  )
    return true;
  return false;
}
