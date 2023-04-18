import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import UnknownMatch from "@/data-models/unknown-match.mjs";
import UnknownMatchList, {
  fixture as matchListFixture,
} from "@/data-models/unknown-matchlist.mjs";
import UnknownPlayer, {
  fixture as playerFixture,
} from "@/data-models/unknown-player.mjs";
import { isCatchAll } from "@/routes/constants.mjs";

const routes = [
  {
    path: /^\/unknown/,
    [isCatchAll]: true,
    fetchData() {},
  },
  {
    path: /^\/unknown\/profile\/(.*?)$/,
    component: "game-unknown/Profile.jsx",
    async fetchData([name], urlSearchParams, state) {
      if (!state || !state.visibleMatches) {
        await getData(
          playerFixture,
          UnknownPlayer,
          ["unknown", "profiles", name],
          {
            shouldFetchIfPathExists: true,
          }
        );

        await getData(
          matchListFixture,
          UnknownMatchList,
          ["unknown", "matchLists", name],
          {
            shouldFetchIfPathExists: true,
          }
        );
        return;
      }

      // This part is just about fetching matches.
      const matchList = readState.unknown.matchLists[name];
      const visibleMatches = matchList.matches.filter(
        ({ id }) => state.visibleMatches[id]
      );
      await Promise.all(
        visibleMatches.map(({ id }, i) => {
          return getData(
            {
              id,
              isWinner: Math.random() < 0.5,
              timestamp: Date.now() - 1000 * 60 * 60 * 3 * i,
            },
            UnknownMatch,
            ["unknown", "matches", id]
          );
        })
      );
    },
  },
  {
    path: /^\/unknown\/match\/(.*)/,
    component: "game-unknown/Match.jsx",
    async fetchData([matchId]) {
      await getData(
        {
          id: matchId,
          isWinner: Math.random() < 0.5,
          timestamp: Date.now() - 1000 * 60 * 60 * 1,
        },
        UnknownMatch,
        ["unknown", "matches", matchId]
      );
    },
  },
];

export default routes;
