import getData from "@/__main__/get-data.mjs";
import TftStats from "@/data-models/tft-stats.mjs";
import * as API from "@/game-tft/api.mjs";
import { setPatches } from "@/game-tft/constants.mjs";

// The latest patch may not always be the patch we support for champion or item stats
async function fetchStats({ patch, page, filters }) {
  const patches = Object.keys(setPatches);
  const patchKey = (patch.match(/([0-9]+\.[0-9]+|[0-9]+)/) || patches)[0];
  let index = patches.findIndex((i) => i === patchKey);
  if (typeof patches[index] === "undefined") return;

  async function retry() {
    try {
      await getData(
        API.getStats({
          patch: patches[index],
          page,
          filters,
        }),
        TftStats,
        ["tft", "stats", page],
        { shouldFetchIfPathExists: true }
      );
    } catch {
      if (index < 0) throw new Error("");
      index -= 1;
      await retry();
    }
  }
  await retry();
}

export default fetchStats;
