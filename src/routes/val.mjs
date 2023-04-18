import { pathToRegexp } from "path-to-regexp";

import getData from "@/__main__/get-data.mjs";
import ValorantConstants from "@/data-models/valorant-constants.mjs";
// import valorantDivisionStats from "@/data-models/valorant-division-stats.mjs";
import ValorantRanksAllStats from "@/data-models/valorant-ranks-all-stats.mjs";
import ValorantWeapons from "@/data-models/valorant-weapon.mjs";
import * as API from "@/game-val/api.mjs";
import valorantFetchLeaderboardData from "@/game-val/fetch-leaderboard-data.mjs";
import valorantFetchPostmatchData from "@/game-val/valorant-fetch-postmatch-data.mjs";
import valorantFetchProfileData from "@/game-val/valorant-fetch-profile-data.mjs";
import { isCatchAll } from "@/routes/constants.mjs";

const profileTabs = [, /*, "weapons", "agents"*/ "coaching"].join("|");

const routes = [
  {
    path: /^\/valorant/,
    [isCatchAll]: true,
    fetchData() {
      const getConstantData = getData(
        API.getLatestValorantContent(),
        ValorantConstants,
        ["val", "constants"],
        { shouldFetchIfPathExists: true }
      );

      const getWeapons = getData(
        API.getValorantConstDataByType("weapons"),
        ValorantWeapons,
        ["val", "meta", "weapons"],
        { shouldFetchIfPathExists: true }
      );

      const getRankWeaponStats = getData(
        API.getValorantRankStats(),
        ValorantRanksAllStats,
        ["val", "meta", "division"],
        { shouldFetchIfPathExists: true }
      );

      return Promise.all([getConstantData, getWeapons, getRankWeaponStats]); //getDivisionStats
    },
  },
  {
    path: pathToRegexp(`/valorant/profile/:nameTag/:tab(${profileTabs})?`),
    component: "game-val/Profile.jsx",
    fetchData: valorantFetchProfileData,
  },
  {
    path: pathToRegexp("/valorant/match/:nameTag/:actId/:matchId"),
    component: "game-val/Postmatch.jsx",
    fetchData: valorantFetchPostmatchData,
  },
  {
    path: "/valorant/leaderboards/official",
    component: "game-val/Leaderboard.jsx",
    fetchData: valorantFetchLeaderboardData,
  },
];

export default routes;
