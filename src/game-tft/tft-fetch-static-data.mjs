import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import TftAttributes from "@/data-models/tft-attributes.mjs";
import TftChampions from "@/data-models/tft-champions.mjs";
import TftItems from "@/data-models/tft-items.mjs";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import { setDefaultStatsFilters } from "@/game-tft/actions.mjs";
import * as API from "@/game-tft/api.mjs";
import fetchStats from "@/game-tft/tft-fetch-stats.mjs";

function fetchData([region], urlSearchParams) {
  setDefaultStatsFilters();
  const patch = getCurrentPatchForStaticData() || "";

  // Filters for getStats
  const statFilters = readState.tft.stats.filters;
  const fSort = urlSearchParams.get("sort") || statFilters.sort;
  const fRank = urlSearchParams.get("rank") || statFilters.rank;
  const fRegion = region || statFilters.region;
  const filters = `${fRank}_${fRegion}_${fSort}`.toLowerCase();

  // Promise
  return Promise.all([
    getData(API.getChampions(), TftChampions, ["tft", "champions"]),
    getData(API.getClasses(), TftAttributes, ["tft", "classes"]),
    getData(API.getOrigins(), TftAttributes, ["tft", "origins"]),
    getData(API.getItems(), TftItems, ["tft", "items"]),
    fetchStats({
      patch,
      page: "items",
      filters,
    }),
    fetchStats({
      patch,
      page: "champions",
      filters,
    }),
  ]);
}

export default fetchData;
