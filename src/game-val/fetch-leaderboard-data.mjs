import getData from "@/__main__/get-data.mjs";
import ValorantLeaderboard from "@/data-models/valorant-leaderboard.mjs";
import { getOfficialLeaderboard } from "@/game-val/api.mjs";
import { getParamsStr } from "@/game-val/leaderboard-utils.mjs";

export default async function fetchData(params, searchParams) {
  const urlParams = getParamsStr(searchParams);

  await getData(
    getOfficialLeaderboard(urlParams),
    ValorantLeaderboard,
    ["val", "leaderboard", btoa(urlParams)],
    {
      shouldFetchIfPathExists: true,
    }
  );
}
