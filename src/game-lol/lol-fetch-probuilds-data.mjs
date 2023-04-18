import getData from "@/__main__/get-data.mjs";
import LolProbuildMatches from "@/data-models/lol-probuild-matches.mjs";
import LoLPros from "@/data-models/lol-probuild-pros.mjs";
import LolProbuildTeams from "@/data-models/lol-probuild-teams.mjs";
import * as API from "@/game-lol/api.mjs";
import { getDefaultedFiltersForProBuilds } from "@/game-lol/util.mjs";

const PER_PAGE = 15;

function fetchData(params, searchParams, state) {
  const [tab] = params;
  const filters = getDefaultedFiltersForProBuilds(searchParams);
  const currPage = state?.page || 1;

  const promises = [];

  promises.push(
    getData(
      API.getProBuildTeams(),
      LolProbuildTeams,
      ["lol", "proBuildTeams"],
      {
        shouldFetchIfPathExists: false,
      }
    )
  );

  switch (tab) {
    case "history":
    case undefined:
    default:
      if (!filters.team) delete filters.team;
      if (filters.team) filters.teamIds = [filters.team];

      promises.push(
        getData(
          API.getProMatchHistory({
            lane: filters.lane || filters.role,
            teamIds: filters.teamIds || [],
            first: PER_PAGE * currPage,
          }),
          LolProbuildMatches,
          ["lol", "proBuildMatchlist"],
          {
            shouldFetchIfPathExists: true,
          }
        )
      );

      break;
    case "live":
      promises.push(
        getData(API.getProPlayers(), LoLPros, ["lol", "proBuildPros"], {
          shouldFetchIfPathExists: true,
        })
      );
      break;
  }

  return Promise.all(promises);
}

export default fetchData;
