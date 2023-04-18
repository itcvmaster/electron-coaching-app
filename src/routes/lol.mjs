import { pathToRegexp } from "path-to-regexp";

import lolFetchChampionData from "@/game-lol/lol-fetch-champion-data.mjs";
import lolFetchChampionsData from "@/game-lol/lol-fetch-champions-data.mjs";
import lolFetchPostmatchData from "@/game-lol/lol-fetch-postmatch-data.mjs";
import lolFetchProBuildsData from "@/game-lol/lol-fetch-probuilds-data.mjs";
import lolFetchProfileData from "@/game-lol/lol-fetch-profile-data.mjs";
import lolFetchStaticData from "@/game-lol/lol-fetch-static-data.mjs";
import lolFetchTierlistData from "@/game-lol/lol-fetch-tierlist-data.mjs";
import { isCatchAll } from "@/routes/constants.mjs";

const overallTabs = ["overview", "synergies", "combat", "objectives"].join("|");

const routes = [
  {
    path: /^\/lol/,
    [isCatchAll]: true,
    fetchData: lolFetchStaticData,
  },
  {
    path: pathToRegexp("/lol/profile/:region/:name"),
    component: "game-lol/Profile.jsx",
    fetchData: lolFetchProfileData,
  },
  {
    path: pathToRegexp("/lol/match/:region/:name/:id"),
    component: "game-lol/PostMatch.jsx",
    fetchData: lolFetchPostmatchData,
  },
  {
    path: "/lol/in-game",
    component: "game-lol/in-game.mjs",
    fetchData() {
      // This is intentionally a no-op, do not put anything in here.
      // The reasoning is that this route needs to be able to operate independently
      // of which route the app is actually on, including fetching data.
    },
  },
  {
    path: /^\/lol\/champions/,
    redirect: "/lol/champions/overview",
  },
  {
    path: new RegExp(`^/lol/champions/(${overallTabs})`),
    component: "game-lol/Champions.jsx",
    fetchData: lolFetchChampionsData,
  },
  {
    path: (() => {
      const tabs = ["overview", "probuilds", "trends", "counters"].join("|");
      return new RegExp(
        `^/lol/champions/((?!(${overallTabs}))\\w+)(/(${tabs})(/(\\w*))?)?$` // eslint-disable-line no-useless-escape
      );
    })(),
    component: "game-lol/Champion.jsx",
    fetchData: lolFetchChampionData,
  },
  {
    path: "/lol/tierlist",
    component: "game-lol/TierList.jsx",
    fetchData: lolFetchTierlistData,
  },
  {
    path: "/lol/probuilds",
    redirect: "/lol/probuilds/history",
  },
  {
    path: pathToRegexp("/lol/probuilds/(history|live)"),
    component: "game-lol/ProBuilds.jsx",
    fetchData: lolFetchProBuildsData,
  },
];

export default routes;
