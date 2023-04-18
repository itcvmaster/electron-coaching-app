// import * as API from "@/game-apex/api.mjs";
import { END_OF_TIME } from "@/__main__/constants.mjs";
import getData from "@/__main__/get-data.mjs";
import ApexMatches from "@/data-models/apex-matches.mjs";
import ApexPlayer from "@/data-models/apex-player.mjs";
import ApexPlayerStats from "@/data-models/apex-player-stats.mjs";
import { getRankedModeByGameMode } from "@/game-apex/utils.mjs";

function fetchData([profileId], searchParam) {
  const promises = [];
  const getProfile = getData({}, ApexPlayer, ["apex", "profiles", profileId], {
    shouldFetchIfPathExists: true,
    expiryTime: END_OF_TIME,
    mergeFn: (curValue, newValue) => {
      return {
        ...curValue,
        ...newValue,
      };
    },
  });
  promises.push(getProfile);

  const paramsForStats = {
    season: "all",
    mode: "all",
  };

  for (const key in paramsForStats) {
    const value = searchParam.get(key);
    if (value) paramsForStats[key] = value;
  }

  const getPlayerStats = getData(
    {},
    ApexPlayerStats,
    [
      "apex",
      "playerStats",
      profileId,
      paramsForStats.season,
      paramsForStats.mode,
    ],
    {
      shouldFetchIfPathExists: true,
      expiryTime: END_OF_TIME,
      mergeFn: (curValue, newValue) => {
        return {
          ...curValue,
          ...newValue,
        };
      },
    }
  );

  promises.push(getPlayerStats);

  const rankedMode = getRankedModeByGameMode(paramsForStats.mode);

  if (rankedMode !== paramsForStats.mode) {
    const getRankedPlayerStats = getData(
      {},
      ApexPlayerStats,
      ["apex", "playerStats", profileId, paramsForStats.season, rankedMode],
      {
        shouldFetchIfPathExists: true,
        expiryTime: END_OF_TIME,
        mergeFn: (curValue, newValue) => {
          return {
            ...curValue,
            ...newValue,
          };
        },
      }
    );
    promises.push(getRankedPlayerStats);
  }

  const paramsForMatches = {
    ...paramsForStats,
  };

  const getMatches = getData(
    [],
    ApexMatches,
    [
      "apex",
      "matchlists",
      profileId,
      paramsForMatches.season,
      paramsForMatches.mode,
    ],
    {
      shouldFetchIfPathExists: true,
      expiryTime: END_OF_TIME,
      mergeFn: (curValue, newValue) => {
        return curValue
          ?.concat(newValue || [])
          .sort((a, b) => b.gameStartedAt - a.gameStartedAt);
      },
    }
  ).then((matchlist) => {
    for (const match of matchlist) {
      getData(match, ApexMatches, ["apex", "matches", match.matchId], {
        shouldFetchIfPathExists: false,
        expiryTime: END_OF_TIME,
        mergeFn: (curValue, newValue) => {
          return {
            ...curValue,
            ...newValue,
          };
        },
      });
    }
  });

  promises.push(getMatches);

  return Promise.all(promises);
}

export default fetchData;
