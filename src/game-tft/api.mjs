import { appURLs } from "@/app/constants.mjs";
import * as GraphQLTemplates from "@/game-tft/graphql-templates.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

// This module is solely responsible for constructing API requests and nothing else.

export function getPlayer(region, name) {
  const query = GraphQLTemplates.Profile;
  const variables = {
    name: name,
    region: region.toUpperCase(),
    user: false,
    getLatest: false,
  };

  const params = parseSearchParams({ query, variables });

  const url = `${appURLs.TFT_GRAPHQL}?${params.toString()}`;
  return url;
}

export function getMatchList(ids) {
  const query = GraphQLTemplates.Matchlist;
  const variables = { ids };

  const params = parseSearchParams({ query, variables });

  const url = `${appURLs.TFT_GRAPHQL}?${params.toString()}`;
  return url;
}

export function getMatchListFixture() {
  return `${appURLs.CDN_WEB}/reindex/tft_matchlist.json`;
}

export function getPostMatchExtra({ region, name, matchId }) {
  return `${appURLs.TFT_AGGREGATE}/getPostmatch?${parseSearchParams({
    region,
    name,
    matchId,
  })}`;
}

export function getPostMatchExtraFixture() {
  return `${appURLs.CDN_WEB}/reindex/tft_postmatch_extra.json`;
}

export function getChampions() {
  return `${appURLs.UTILS_STATIC}/tft/champions`;
}

export function getClasses() {
  return `${appURLs.UTILS_STATIC}/tft/classes`;
}

export function getOrigins() {
  return `${appURLs.UTILS_STATIC}/tft/origins`;
}

export function getItems() {
  return `${appURLs.UTILS_STATIC}/tft/items`;
}

export function getStats({ patch, page, filters }) {
  return `${appURLs.TFT}/stats/${page}/${patch}/${filters}.json`;
}

export function getProBuildsSummoners() {
  return `${appURLs.TFT_GRAPHQL}?${parseSearchParams({
    query: GraphQLTemplates.ProBuildsSummoners,
  })}`;
}

export function getProBuildsMatches(offset = 0) {
  return `${appURLs.TFT_GRAPHQL}?${parseSearchParams({
    query: GraphQLTemplates.ProBuildsMatches,
    variables: { offset },
  })}`;
}

export function getCompanions() {
  return `${appURLs.UTILS_STATIC}/tft/companions`;
}
