import { pathToRegexp } from "path-to-regexp";

import getData from "@/__main__/get-data.mjs";
import TFTMatchList from "@/data-models/tft-match-list.mjs";
import TFTPlayer from "@/data-models/tft-player.mjs";
import fetchLoLData from "@/game-lol/lol-fetch-static-data.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import * as API from "@/game-tft/api.mjs";
import fetchCompanions from "@/game-tft/tft-fetch-companions-data.mjs";
import fetchPostMatchData from "@/game-tft/tft-fetch-postmatch-data.mjs";
import fetchProBuildsData from "@/game-tft/tft-fetch-probuilds-data.mjs";
import fetchTftData from "@/game-tft/tft-fetch-static-data.mjs";
import { isCatchAll } from "@/routes/constants.mjs";

const routes = [
  {
    path: /^\/tft/,
    [isCatchAll]: true,
    fetchData: fetchLoLData,
  },
  {
    path: /^\/tft\/profile\/(.*)\/(.*)/,
    component: "game-tft/Profile.jsx",
    async fetchData([region, name], urlSearchParams) {
      const profile = await getData(
        API.getPlayer(region, name),
        TFTPlayer,
        ["tft", "summoners", getDerivedId(region, name)],
        { shouldFetchIfPathExists: true }
      );

      const startIndex = parseInt(urlSearchParams.get("startIndex") || "0");
      const count = parseInt(urlSearchParams.get("count") || "20");
      const matchIds = profile.matchids.slice(startIndex, count);

      const matchlist = await getData(
        API.getMatchList(matchIds),
        TFTMatchList,
        ["tft", "matchlists", getDerivedId(region, name)],
        { shouldFetchIfPathExists: true }
      );
      Promise.all([matchlist]);

      return profile;
    },
  },
  {
    path: pathToRegexp("/tft/match/:region/:name/:matchId/:tab?"),
    component: "game-tft/PostMatch.jsx",
    async fetchData() {
      await fetchLoLData();
      return Promise.all([
        fetchTftData(...arguments),
        fetchPostMatchData(...arguments),
      ]);
    },
  },
  {
    path: "/tft/probuilds",
    component: "game-tft/ProBuilds.jsx",
    async fetchData() {
      await fetchLoLData();
      return Promise.all([
        fetchTftData(...arguments),
        fetchCompanions(),
        fetchProBuildsData(...arguments),
      ]);
    },
  },
];

export default routes;
