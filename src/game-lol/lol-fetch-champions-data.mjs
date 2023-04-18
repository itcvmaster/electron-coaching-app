import getData from "@/__main__/get-data.mjs";
import LoLChampionStats from "@/data-models/lol-champion-stats.mjs";
import LoLChampionSynergies from "@/data-models/lol-champion-synergies.mjs";
import * as API from "@/game-lol/api.mjs";
import {
  getDefaultedFiltersForChampions,
  getSearchParamsForChampions,
} from "@/game-lol/util.mjs";

export function getAllChampionsStats(searchParams) {
  const filters = getDefaultedFiltersForChampions(false, searchParams);
  const urlParams = getSearchParamsForChampions(false, filters);

  return getData(
    API.getAllChampionsStats(filters),
    LoLChampionStats,
    ["lol", "championStats", btoa(urlParams)],
    { shouldFetchIfPathExists: true }
  );
}

// path regExp: /lol/champions/:overview|:synergies|:combat|:objectives
async function fetchData(params, searchParams) {
  const [tab] = params;
  if (tab === "overview" || tab === "combat" || tab === "objectives") {
    await getAllChampionsStats(searchParams);
  } else if (tab === "synergies") {
    const filters = getDefaultedFiltersForChampions(true, searchParams);
    const urlParams = getSearchParamsForChampions(true, filters);

    await getData(
      API.getChampionSynergies(filters),
      LoLChampionSynergies,
      ["lol", "championSynergies", btoa(urlParams)],
      { shouldFetchIfPathExists: true }
    );
  }
}

export default fetchData;
