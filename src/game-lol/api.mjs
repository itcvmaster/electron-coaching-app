import { appURLs } from "@/app/constants.mjs";
import { getRitoLanguageCodeFromBCP47 } from "@/app/util.mjs";
import {
  GARENA_REGIONS,
  QUEUE_SYMBOL_TO_STR,
  ROLE_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import * as GraphQLTemplates from "@/game-lol/graphql-templates.mjs";
import SymbolQueue from "@/game-lol/symbol-queue.mjs";
import SymbolRole from "@/game-lol/symbol-role.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

function queryGQL(baseURL, query, variables) {
  const params = parseSearchParams({ query, variables });
  const url = `${baseURL}/graphql?${params}`;
  return url;
}

export const refs = {
  championBuildsKey: "PUBLIC", // alternative is pr0
};

// This module is solely responsible for constructing API requests and nothing else.

export function getPatches() {
  return queryGQL(appURLs.LOL_CHAMPION_AGGREGATE, GraphQLTemplates.Patches, {});
}

export function getSeasons() {
  return queryGQL(appURLs.LOL_CHAMPION_AGGREGATE, GraphQLTemplates.Seasons, {});
}

export function getPlayStyles(region, accountId, queue) {
  const query = GraphQLTemplates.fetchPlayStyles;
  const variables = {
    region: region?.toUpperCase(),
    accountId,
  };
  if (queue) {
    variables.queue = queue;
  }

  const searchParams = parseSearchParams({ query, variables });

  const url = `${appURLs.LOL_LEAGUE_PLAYER}/graphql?${searchParams}`;
  return url;
}

export function getStaticVersions() {
  return `${appURLs.UTILS_STATIC}/lol/riot/versions`;
}

export function getStaticData(version, entry) {
  if (entry === "spells") entry = "summoners";

  const lang = getLocale();
  return `${
    appURLs.CDN_PLAIN
  }/blitz/ddragon/${version}/data/${getRitoLanguageCodeFromBCP47(
    lang
  )}/${entry}.json`;
}

export function getLeagueProfile(region, params) {
  const query = GraphQLTemplates.LeagueProfile;

  const variables = {
    ...params,
    region: region?.toUpperCase(),
  };

  const searchParams = parseSearchParams({ query, variables });

  const url = `${appURLs.RIOT}/graphql?${searchParams}`;
  return url;
}

export function getSummoner({ region, name, puuid }) {
  return getLeagueProfile(region, { summoner_name: name, puuid });
}

export function getSummonerByAccountId(region, accountid) {
  return getLeagueProfile(region, { account_id: accountid });
}

export function getMatchList(region, puuid) {
  const isGarena = GARENA_REGIONS.includes(region);
  const variables = {
    region: region?.toUpperCase(),
    puuid,
  };
  let query = GraphQLTemplates.GetOfficialMatchList;
  let baseUrl = `${appURLs.RIOT}/graphql`;
  if (isGarena) {
    query = GraphQLTemplates.GetUnofficialMatchList;
    baseUrl = `${appURLs.LOL_LEAGUE_PLAYER}/graphql`;
  }

  const params = parseSearchParams({ query, variables });
  return `${baseUrl}?${params.toString()}`;
}

export function getMatch(region, matchId) {
  const isGarena = GARENA_REGIONS.includes(region);
  // const isGarena = true;
  if (isGarena) {
    const query = GraphQLTemplates.GetUnofficialMatch;
    const variables = {
      riot_match_id: String(matchId),
      region: region.toUpperCase(),
    };

    const params = parseSearchParams({ query, variables });
    return `${appURLs.LOL_LEAGUE_PLAYER}/graphql?${params.toString()}`;
  }
  const query = GraphQLTemplates.getLeagueMatch;
  const variables = {
    matchId: String(matchId),
    region: region.toUpperCase(),
  };

  const params = parseSearchParams({ query, variables });
  // Official match API
  return `${appURLs.RIOT}/graphql?${params.toString()}`;
}

/* Single champion stats */
export function getChampionStats(championId, filter) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.ChampionStats,
    { ...filter, championId }
  );
}

/* Single champion stats trends */
export function getChampionTrends(championId, filter) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.ChampionStatsTrends,
    { ...filter, championId }
  );
}

/* Single champion builds */
export function getChampionBuilds(championId, variables) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.ChampionBuilds,
    { ...variables, championId }
  );
}

// /* Single champion builds for a matchup */
// export function getChampionBuildsMatchup(variables) {
//   return queryGQL(
//     appURLs.LOL_CHAMPION_AGGREGATE,
//     GraphQLTemplates.ChampionBuildsMatchup,
//     variables
//   );
// }

// List of pro matches (specific champion)
export function getChampionProMatches(id, lane, amount = 8) {
  return queryGQL(appURLs.PROBUILDS_URL, GraphQLTemplates.ChampionProMatches, {
    id,
    lane,
    first: amount,
  });
}

/**
 * getChampionSynergies
 * @param params : { region, queue, rank, role, duoRole }
 * @returns
 */
export function getChampionSynergies(params) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.Synergies,
    params
  );
}

export function getAllChampionsStats(variables) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.AllChampionsStats,
    variables
  );
}

export function getRoleMatchups(role) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.RoleMatchups,
    { role }
  );
}

export function getLolRankStats(variables) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.rankStatsQuery,
    variables
  );
}

export function getPlayerChampionStats(variables) {
  return queryGQL(
    appURLs.LOL_LEAGUE_PLAYER,
    GraphQLTemplates.fetchUserChampions,
    variables
  );
}

export function getLOLMatches(variables) {
  return queryGQL(
    appURLs.LOL_LEAGUE_PLAYER,
    GraphQLTemplates.getMatchListForPlayer,
    variables
  );
}
/**
 * Convert filter params to search params which is used in api request
 * @param filter : filter params
 * @returns URLSearchParams
 */
export function getSearchParamsFromFilter(filter) {
  const queryParams = [];
  for (const key in filter) {
    let value = filter[key];

    switch (key) {
      case "rank":
        value = value === "all" ? undefined : value?.toUpperCase();
        queryParams.push(["tier", value]);
        break;
      case "role":
        value = value === "all" ? undefined : value?.toUpperCase();
        queryParams.push([key, value]);
        break;
      default:
        queryParams.push([key, value]);
        break;
    }
  }

  const query = new URLSearchParams(queryParams.filter(([, v]) => v));
  return query;
}

export function getChampionTips() {
  const localeCode = getRitoLanguageCodeFromBCP47(getLocale());
  const variables = {
    language: localeCode,
  };
  const query = GraphQLTemplates.GetChampionInsights;

  const params = parseSearchParams({ query, variables });
  return `${appURLs.CMS}/graphql?${params.toString()}`;
}

export function getChampionReport(variables = {}) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.ChampionsReport,
    variables
  );
}

export function getChampionRoles(variables = {}) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.AllChampionRoles,
    variables
  );
}

// List of pro matches (no specific champion)
export function getProMatchHistory(params = {}) {
  if (!params.lane) delete params.lane;
  if (!params.role) delete params.role;
  return queryGQL(appURLs.PROBUILDS_URL, GraphQLTemplates.ProMatches, params);
}

export function getProbuildSummaries(championId) {
  const variables = { id: championId };
  const query = GraphQLTemplates.fetchProBuildsSummariesForChampion;
  const baseUrl = `${appURLs.PROBUILDS_URL}/graphql`;

  const params = parseSearchParams({ query, variables });
  return `${baseUrl}?${params.toString()}`;
}

export function getProBuildPros() {
  const variables = {};
  const query = GraphQLTemplates.queryProBuildPros;
  const baseUrl = `${appURLs.PROBUILDS_URL}/graphql`;

  const params = parseSearchParams({ query, variables });
  return `${baseUrl}?${params.toString()}`;
}

export function getProBuildTeams() {
  const variables = {};
  const query = GraphQLTemplates.getProBuildTeams;
  const baseUrl = `${appURLs.PROBUILDS_URL}/graphql`;

  const params = parseSearchParams({ query, variables });
  return `${baseUrl}?${params.toString()}`;
}

export function getProPlayers() {
  return queryGQL(
    appURLs.PROBUILDS_URL,
    GraphQLTemplates.queryProBuildPros,
    {}
  );
}

export function getMatchTimeline({ matchId, region }) {
  const variables = {
    matchId,
    region: region.toUpperCase(),
  };
  const query = GraphQLTemplates.GetMatchTimeline;

  const params = parseSearchParams({ query, variables });
  return `${appURLs.RIOT}/graphql?${params.toString()}`;
}

export function getChampionRole(championId) {
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.ChampionPrimaryRole,
    { championId }
  );
}

export function getChampionBuildsGeneral(championId, role, queue) {
  if (typeof role !== "symbol") role = SymbolRole(role);
  if (typeof queue !== "symbol") queue = SymbolQueue(queue);
  if (role) role = ROLE_SYMBOL_TO_STR[role]?.internal;
  if (queue) queue = QUEUE_SYMBOL_TO_STR[queue]?.gql;
  const variables = {
    championId,
    role,
    queue,
    key: refs.championBuildsKey,
  };
  return queryGQL(
    appURLs.LOL_CHAMPION_AGGREGATE,
    GraphQLTemplates.buildsForChampion,
    variables
  );
}
