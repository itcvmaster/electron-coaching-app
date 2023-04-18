import getData from "@/__main__/get-data.mjs";
import { getRitoLanguageCodeFromBCP47 } from "@/app/util.mjs";
import LoLChampionBuilds from "@/data-models/lol-champion-builds.mjs";
import LolChampionInsights from "@/data-models/lol-champion-insights.mjs";
import LoLChampionStats from "@/data-models/lol-champion-stats.mjs";
import LoLChampionStatsTrends from "@/data-models/lol-champion-stats-trends.mjs";
import LoLChampionProMatches from "@/data-models/lol-probuild-match.mjs";
import LoLProbuildSummary from "@/data-models/lol-probuild-summary.mjs";
import LoLRole from "@/data-models/lol-roles.mjs";
import * as API from "@/game-lol/api.mjs";
import {
  getCurrentPatchForStaticData,
  getDefaultedFiltersForChampion,
  getSearchParamsForChampion,
  getStaticChampionByKey,
} from "@/game-lol/util.mjs";
import { NotFoundError } from "@/util/custom-errors.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

// path regExp: /lol/champions/:championKey/:overview|:probuilds|:trends|:counters/:matchupChampionKey
async function fetchData(params, searchParams, state) {
  // get the params
  const [championKey, tab, matchupChampionKey] = params;
  const probuildPage = state?.page || 1;

  // get patch
  const patch = getCurrentPatchForStaticData();
  const champion = getStaticChampionByKey(championKey, patch);
  const matchupChampion = getStaticChampionByKey(matchupChampionKey, patch);

  // validate the params
  if (!champion) {
    throw new NotFoundError(`Champion "${championKey}" Not Found`);
  }

  const championId =
    typeof champion.id === "string" ? parseInt(champion.id) : champion.id;
  let matchupChampionId = null;

  // get champion role
  const defaultRole = await getData(
    API.getChampionRole(championId),
    LoLRole,
    ["lol", "championRoles", championId],
    { shouldFetchIfPathExists: false }
  );

  // get the filters
  const filters = getDefaultedFiltersForChampion(
    searchParams,
    defaultRole?.primaryRole
  );
  // get the urlParams
  const urlParams = getSearchParamsForChampion(filters);

  // Single champion stats
  const getChampionStats = (championId) => {
    return getData(
      API.getChampionStats(championId, filters),
      LoLChampionStats,
      ["lol", "championPage", championId, btoa(urlParams)],
      { shouldFetchIfPathExists: true }
    );
  };

  // Single champion stats trends
  const getChampionStatsTrends = (championId) => {
    return getData(
      API.getChampionTrends(championId, filters),
      LoLChampionStatsTrends,
      ["lol", "championStatsTrends", championId, btoa(urlParams)],
      { shouldFetchIfPathExists: true }
    );
  };

  // Single champion builds
  const getChampionBuilds = (championId) => {
    return getData(
      API.getChampionBuilds(championId, filters),
      LoLChampionBuilds,
      ["lol", "championBuilds", championId, filters.role],
      { shouldFetchIfPathExists: false }
    );
  };

  // Single champion PRO builds
  const getChampionProMatches = (championId, count) => {
    return getData(
      API.getChampionProMatches(championId, filters.role, count),
      LoLChampionProMatches,
      ["lol", "championProMatches", championId, filters.role],
      { shouldFetchIfPathExists: true }
    );
  };

  // All champions stats (for matchups)
  function getAllChampionsStats() {
    return getData(
      API.getAllChampionsStats(filters),
      LoLChampionStats,
      ["lol", "championStats", btoa(urlParams)],
      { shouldFetchIfPathExists: true }
    );
  }

  const requests = [];

  if (matchupChampion) {
    matchupChampionId =
      typeof matchupChampion.id === "string"
        ? parseInt(matchupChampion.id)
        : matchupChampion.id;

    requests.push(getAllChampionsStats());
    requests.push(getChampionStats(matchupChampionId));
  }

  requests.push(getChampionStats(championId));
  requests.push(getChampionStatsTrends(championId));

  switch (tab) {
    case undefined:
    case "overview": {
      const lang = getLocale();
      const ritoLanguageCode = getRitoLanguageCodeFromBCP47(lang);
      requests.push(getChampionBuilds(championId));
      requests.push(getChampionProMatches(championId, 6));
      requests.push(
        getData(
          API.getChampionTips(),
          LolChampionInsights,
          ["lol", "championTips", ritoLanguageCode],
          {
            shouldFetchIfPathExists: true,
          }
        )
      );
      break;
    }
    case "probuilds": {
      requests.push(getChampionProMatches(championId, probuildPage * 10));
      requests.push(
        getData(
          API.getProbuildSummaries(championId),
          LoLProbuildSummary,
          ["lol", "championProSummaries", championId, filters.role],
          {
            shouldFetchIfPathExists: true,
          }
        )
      );
      break;
    }
  }

  return Promise.all(requests);
}

export default fetchData;
