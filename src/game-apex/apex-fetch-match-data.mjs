// import * as API from "@/game-apex/api.mjs";
import { END_OF_TIME } from "@/__main__/constants.mjs";
import getData from "@/__main__/get-data.mjs";
import ApexMatch from "@/data-models/apex-match.mjs";
import ApexMatches from "@/data-models/apex-matches.mjs";
import ApexPlayer from "@/data-models/apex-player.mjs";

async function fetchData([profileId, matchId]) {
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

  const match = await getData({}, ApexMatch, ["apex", "matches", matchId], {
    shouldFetchIfPathExists: false,
    expiryTime: END_OF_TIME,
    mergeFn: (curValue, newValue) => {
      return {
        ...curValue,
        ...newValue,
      };
    },
  });

  const getMatches = getData(
    [],
    ApexMatches,
    ["apex", "matchlists", profileId, match.season, match.mode],
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
