import getData from "@/__main__/get-data.mjs";
import valorantPlayer, {
  PlayerSeasonStats as valorantPlayerStats,
} from "@/data-models/valorant-player.mjs";
import * as API from "@/game-val/api.mjs";
import { getPlayerIdType } from "@/game-val/utils.mjs";
import { convertQueryToWriteStatePath } from "@/util/helpers.mjs";

export default async function fetchData([nameTag, actId, matchId]) {
  const lowercaseName = nameTag.toLowerCase();
  const player = await getData(
    API.getValorantPlayer(lowercaseName),
    valorantPlayer,
    ["val", "profiles", lowercaseName],
    { shouldFetchIfPathExists: true }
  );
  // const playerPuuid = player.puuid;
  const playerType = getPlayerIdType(player);
  const playerId = player[playerType];

  const paramsForMatch = {
    type: playerType,
    actId: actId,
  };

  const getValorantMatch = getData(
    API.getValorantMatch(matchId, paramsForMatch),
    valorantPlayer,
    ["val", "postmatch", matchId],
    {
      shouldFetchIfPathExists: false,
    }
  );

  const paramsForValorantPlayerStats = {
    type: playerType,
    actId: actId,
  };
  const getValorantPlayerStats = getData(
    API.getValorantPlayerStats(playerId, paramsForValorantPlayerStats),
    valorantPlayerStats,
    [
      "val",
      "playerStats",
      `${playerId}?${convertQueryToWriteStatePath(
        paramsForValorantPlayerStats
      )}`,
    ],
    { shouldFetchIfPathExists: true }
  );

  const promises = [getValorantMatch, getValorantPlayerStats];

  return Promise.all(promises);
}
