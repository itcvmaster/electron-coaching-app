import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import TftProBuildsMatches, {
  model as MatchModel,
} from "@/data-models/tft-probuilds-matches.mjs";
import TftProBuildsSummoners from "@/data-models/tft-probuilds-summoners.mjs";
import * as API from "@/game-tft/api.mjs";

async function fetchData(routeParams, searchParams, state) {
  const offset = state?.offset || 0;
  const [matches] = await Promise.all([
    getData(API.getProBuildsMatches(offset), TftProBuildsMatches, null, {
      shouldFetchIfPathExists: true,
    }),
    getData(
      API.getProBuildsSummoners(),
      TftProBuildsSummoners,
      ["tft", "proSummoners"],
      { shouldFetchIfPathExists: true }
    ),
  ]);
  const matchesToState = matches.reduce((acc, match) => {
    if (readState.tft.matches[match.matchid]) return acc;
    acc.push(
      getData(match, MatchModel, ["tft", "matches", match.matchid, "data"])
    );
    return acc;
  }, []);
  if (matchesToState.length) await Promise.all(matchesToState);
}

export default fetchData;
