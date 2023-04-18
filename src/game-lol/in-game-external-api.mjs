import getData from "@/__main__/get-data.mjs";
import { persistData } from "@/app/util.mjs";
import championRolesModel from "@/data-models/lol-champion-roles.mjs";
import championStatsModel from "@/data-models/lol-champion-stats.mjs";
import LoLChampionSynergies from "@/data-models/lol-champion-synergies.mjs";
import playerChampionStatsModel from "@/data-models/lol-player-champion-stats.mjs";
import playStylesModel from "@/data-models/lol-player-styles.mjs";
import roleMatchupsModel from "@/data-models/lol-role-matchups.mjs";
import summonersModel from "@/data-models/lol-summoner.mjs";
import {
  getChampionReport,
  getChampionRoles,
  getChampionSynergies,
  getLeagueProfile,
  getPlayerChampionStats,
  getPlayStyles,
  getRoleMatchups,
} from "@/game-lol/api.mjs";
import {
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
  REGION_LIST,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import { determinePremadeGroups } from "@/game-lol/in-game-util.mjs";
import {
  injectLanerTags,
  injectStreakTags,
  injectWardingTags,
} from "@/game-lol/in-game-vanity-tags.mjs";
import { IS_APP } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

// Careful, these are object references.
const { summonerTagsByCellId } = inGameState;

// This is meant to be an entry point for hooking/testing.
export const fetchRef = {
  get fetch() {
    return this._value || globals.fetch;
  },
  set fetch(value) {
    this._value = value;
  },
};

export async function getSummonerInfo(name, cellId) {
  const { region, summonerPremadesByCellId } = inGameState;
  const leagueProfile = await lookupSummonerAccount(
    region,
    {
      summoner_name: name,
    },
    cellId
  );
  const { accountId } = leagueProfile ?? {};
  if (accountId) {
    // fetch champion stats, playstyles
    const championStatsRequest = fetchPlayerChampionStats(
      region,
      accountId,
      cellId
    );
    const playStylesRequest = fetchPlayStyles(region, accountId, cellId);

    await Promise.all([championStatsRequest, playStylesRequest]);
    if (!summonerPremadesByCellId[cellId]) {
      determinePremadeGroups();
    }
  }
  generateSummonerVanityTags(cellId);
}

function lookupSummonerAccount(region, params, cellId) {
  const writeStatePath = ["summonerAccountsByCellId", cellId];
  writeStatePath.root = inGameState;

  return getData(
    getLeagueProfile(region, params),
    summonersModel,
    writeStatePath,
    {
      fetch: fetchRef.fetch,
    }
  );
}

function fetchPlayerChampionStats(region, accountId, cellId) {
  const vars = {
    region: region.toUpperCase(),
    accountId,
  };
  const writeStatePath = ["summonerChampionStatsByCellId", cellId];
  writeStatePath.root = inGameState;

  return getData(
    getPlayerChampionStats(vars),
    playerChampionStatsModel,
    writeStatePath,
    {
      fetch: fetchRef.fetch,
    }
  );
}

function fetchPlayStyles(region, accountId, cellId) {
  const writeStatePath = ["summonerPlayStylesByCellId", cellId];
  writeStatePath.root = inGameState;

  return getData(
    getPlayStyles(region, accountId),
    playStylesModel,
    writeStatePath,
    { fetch: fetchRef.fetch }
  );
}

const MIN_GAMES = 25;
const DAY = 24 * 60 * 60 * 1000;
let statsFetchedAt = null;
let matchupsFetchedAt = null;
let synergiesFetchedAt = null;

export async function fetchAllChampionStats() {
  const shouldFetchAfterDuration =
    !statsFetchedAt || Date.now() - statsFetchedAt > DAY;
  if (shouldFetchAfterDuration) statsFetchedAt = Date.now();

  const champStatsPath = ["championStats"];
  champStatsPath.root = inGameState;

  const champRolesPath = ["championRoles"];
  champRolesPath.root = inGameState;

  const [champStats] = await Promise.all([
    getData(getChampionReport(), championStatsModel, champStatsPath, {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
      fetch: fetchRef.fetch,
    }),
    getData(getChampionRoles(), championRolesModel, champRolesPath, {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
      fetch: fetchRef.fetch,
    }),
  ]);

  // Currently fetching this at app start instead
  // const roleSymbols = Object.values(ROLE_SYMBOLS).filter(
  //   (symbol) => symbol !== ROLE_SYMBOLS.all
  // );
  // const matchups = roleSymbols.map((symbol) => {
  //   const roleStr = ROLE_SYMBOL_TO_STR[symbol].internal;
  //   const rolePath = ["roleMatchups", roleStr];
  //   rolePath.root = inGameState;

  //   return getData(getRoleMatchups(roleStr), roleMatchupsModel, rolePath, {
  //     shouldFetchIfPathExists: shouldFetchAfterDuration,
  //     fetch: fetchRef.fetch,
  //   });
  // });

  // Promise.all(matchups);

  await persistData(champStats, champStatsPath);
}

// Role Matchups (for suggestions)
export function getMatchups() {
  if (!IS_APP) return;

  const shouldFetchAfterDuration =
    !matchupsFetchedAt || Date.now() - matchupsFetchedAt > DAY;
  if (shouldFetchAfterDuration) matchupsFetchedAt = Date.now();

  const roleSymbols = Object.values(ROLE_SYMBOLS).filter(
    (symbol) => symbol !== ROLE_SYMBOLS.all
  );
  const promises = roleSymbols.map((symbol) => {
    const roleStr = ROLE_SYMBOL_TO_STR[symbol].internal;
    const rolePath = ["roleMatchups", roleStr];
    rolePath.root = inGameState;

    return getData(getRoleMatchups(roleStr), roleMatchupsModel, rolePath, {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
      fetch: fetchRef.fetch,
    });
  });

  Promise.all(promises);
}

// Synergies (for suggestions)
export async function getSynergies() {
  if (!IS_APP) return;

  const shouldFetchAfterDuration =
    !synergiesFetchedAt || Date.now() - synergiesFetchedAt > DAY;
  if (shouldFetchAfterDuration) synergiesFetchedAt = Date.now();

  const roleSymbols = Object.values(ROLE_SYMBOLS).filter(
    (symbol) => symbol !== ROLE_SYMBOLS.all
  );
  const combinations = roleSymbols.reduce((p, roleSymbol, i) => {
    for (let j = i + 1; j < roleSymbols.length; j++) {
      p.push([roleSymbol, roleSymbols[j]]);
    }
    return p;
  }, []);

  const promises = combinations.map(([r1, r2]) => {
    const role1Str = ROLE_SYMBOL_TO_STR[r1].internal;
    const role2Str = ROLE_SYMBOL_TO_STR[r2].internal;

    const tier = RANK_SYMBOL_TO_STR[RANK_SYMBOLS.platinumPlus].gql;
    const region = REGION_LIST[0].gql;

    const params = { role: role1Str, duoRole: role2Str, tier, region };
    const synergiesPath = [
      "lol",
      "championSynergies",
      btoa(parseSearchParams(params)),
    ];

    return getData(
      getChampionSynergies(params),
      LoLChampionSynergies,
      synergiesPath,
      {
        shouldFetchIfPathExists: shouldFetchAfterDuration,
        fetch: fetchRef.fetch,
      }
    );
  });

  const synergies = await Promise.all(promises);

  const result = {};
  const intermediateFormat = {};

  for (const synergy of synergies) {
    if (!synergy.length) continue;
    const { role, duoRole } = synergy[0];
    const role1 = ROLE_SYMBOL_TO_STR[role].internal;
    const role2 = ROLE_SYMBOL_TO_STR[duoRole].internal;
    const id = `${role1}_${role2}`;
    intermediateFormat[id] = synergy;
  }

  for (const key in intermediateFormat) {
    const duos = intermediateFormat[key];
    if (!duos) continue;
    for (const duo of duos) {
      const { championId: c1, duoChampionId: c2, games: gameCount, wins } = duo;

      if (gameCount < MIN_GAMES) continue;

      // Duplicate permutations for easier data access.
      if (!result[c1]) result[c1] = {};
      if (!result[c1][c2]) result[c1][c2] = { games: 0, wins: 0 };
      if (!result[c2]) result[c2] = {};
      if (!result[c2][c1]) result[c2][c1] = { games: 0, wins: 0 };

      result[c1][c2].games += gameCount;
      result[c1][c2].wins += wins;
      result[c2][c1].games += gameCount;
      result[c2][c1].wins += wins;
    }
  }

  inGameState.synergies = result;

  // for (const combination of combinations) {
  //   const role1 = ROLE_SYMBOL_TO_STR[combination[0]].internal;
  //   const role2 = ROLE_SYMBOL_TO_STR[combination[1]].internal;
  //   const id = `${role1}_${role2}`;
  //   intermediateFormat[id] = await getSynergy(role1, role2);
  // }
  // // Now for the interesting part: we convert the intermediate format
  // // to a data structure that is more suitable for runtime calculations,
  // // duplicating permutations in the process.
  // for (const key in intermediateFormat) {
  //   const duos = intermediateFormat[key];
  //   if (!duos) continue;
  //   for (const duo of duos) {
  //     const { championId: c1, duoChampionId: c2, games: gameCount, wins } = duo;

  //     if (gameCount < MIN_GAMES) continue;

  //     // Duplicate permutations for easier data access.
  //     if (!result[c1]) result[c1] = {};
  //     if (!result[c1][c2]) result[c1][c2] = { games: 0, wins: 0 };
  //     if (!result[c2]) result[c2] = {};
  //     if (!result[c2][c1]) result[c2][c1] = { games: 0, wins: 0 };

  //     result[c1][c2].games += gameCount;
  //     result[c1][c2].wins += wins;
  //     result[c2][c1].games += gameCount;
  //     result[c2][c1].wins += wins;
  //   }
  // }
}

// TODO: Move generateSummonerVanityTags to utils
function generateSummonerVanityTags(cellId) {
  // TODO: Need to implement tags with i18n
  // Need to move logic to lol-summoner-vanity-tag-engine.mjs
  const { summonerPlayStylesByCellId } = inGameState;
  const playStyles = summonerPlayStylesByCellId[cellId];
  const tags = [];

  if (!playStyles) return;

  injectStreakTags(tags, playStyles);
  injectLanerTags(tags, playStyles);
  injectWardingTags(tags, playStyles);

  summonerTagsByCellId[cellId] = tags;
}
