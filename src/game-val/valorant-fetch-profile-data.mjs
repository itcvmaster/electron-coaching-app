import getData from "@/__main__/get-data.mjs";
import ValorantPlayer, {
  HeadshotNotification as headshotNotification,
  PlayerSeasonStats as valorantPlayerStats,
} from "@/data-models/valorant-player.mjs";
import valorantMatchPlayerStats from "@/data-models/valorant-player-total-stats.mjs";
import valorantMatchPlayerCoaching from "@/data-models/valorant-skill.mjs";
import * as API from "@/game-val/api.mjs";
import { getPlayerIdType } from "@/game-val/utils.mjs";
import { convertQueryToWriteStatePath } from "@/util/helpers.mjs";

export default async function fetchData([nameTag], urlSearchParams, state) {
  let offset = 0;
  if (state?.offset) {
    offset = state?.offset;
  }

  const lowercaseName = nameTag.toLowerCase();
  const valorantPlayer = await getData(
    API.getValorantPlayer(lowercaseName),
    ValorantPlayer,
    ["val", "profiles", lowercaseName],
    { shouldFetchIfPathExists: true }
  );
  const playerPuuid = valorantPlayer.puuid;
  const playerType = getPlayerIdType(valorantPlayer);
  const playerProfileId = valorantPlayer[playerType]; //getValorantPlayer.id;

  const searchActId = urlSearchParams.get("actName") || "lifetime";

  const paramsForMatchHistories = {
    offset: offset,
    queues: [
      "competitive",
      "unrated",
      "spikerush",
      "custom",
      "onefa",
      "newmap",
      "deathmatch",
      "snowball",
      "ggteam",
    ],
    type: playerType,
    updatedMPs: true,
    actId: searchActId,
  };

  for (const key in paramsForMatchHistories) {
    const value = urlSearchParams.get(key);
    if (value) paramsForMatchHistories[key] = value;
  }

  const getMatchHistories = getData(
    API.getValorantMatchStatsByPlayerId(
      playerProfileId,
      paramsForMatchHistories
    ),
    valorantMatchPlayerStats,
    [
      "val",
      "matchStats",
      `${searchActId}`,
      `${playerPuuid}?${convertQueryToWriteStatePath(paramsForMatchHistories)}`,
    ],
    {
      shouldFetchIfPathExists: true,
      mergeFn: (curValues, newValues) => {
        newValues.forEach((newMatch) => {
          if (!curValues.find((c) => c.matchId === newMatch.matchId)) {
            curValues.push(newMatch);
          }
        });
        return curValues;
      },
    }
  ).then((matchlist) => {
    if (!state) return null;
    const matchesToLoad = matchlist.filter(
      ({ matchId }) => state?.visibleMatches?.[matchId]
    );
    return matchesToLoad;
    // return Promise.allSettled(matchesToLoad);
  });

  const getHeadshotNotification = getData(
    API.getValorantHNByPlayerId(playerPuuid),
    headshotNotification,
    ["val", "headshotNotification", playerPuuid],
    { shouldFetchIfPathExists: true }
  );

  const paramsForValorantPlayerStats = {
    // type: urlSearchParams.get("stats-type") || "subject",
    type: urlSearchParams.get("stats-type") || playerType,
    actId: searchActId,
  };
  const getValorantPlayerStats = getData(
    API.getValorantPlayerStats(playerPuuid, paramsForValorantPlayerStats),
    valorantPlayerStats,
    [
      "val",
      "playerStats",
      `${playerPuuid}?${convertQueryToWriteStatePath(
        paramsForValorantPlayerStats
      )}`,
    ],
    { shouldFetchIfPathExists: true }
  );

  const getCoachingData = getData(
    API.getValorantSkillsByPlayerId(playerProfileId),
    valorantMatchPlayerCoaching,
    ["val", "coachingValue", "coachingData", playerProfileId],
    { shouldFetchIfPathExists: true }
  );

  const promises = [
    getMatchHistories,
    getHeadshotNotification,
    getValorantPlayerStats,
    getCoachingData,
  ];

  return Promise.all(promises);
}
