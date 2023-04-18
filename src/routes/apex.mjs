import { pathToRegexp } from "path-to-regexp";

import getData from "@/__main__/get-data.mjs";
import apexLegends from "@/data-models/apex-legends.mjs";
import apexWeapons from "@/data-models/apex-weapon.mjs";
import apexFetchMatchData from "@/game-apex/apex-fetch-match-data.mjs";
import apexFetchProfileData from "@/game-apex/apex-fetch-profile-data.mjs";
import * as API from "@/game-apex/api.mjs";
import { LEGENDS } from "@/game-apex/constants.mjs";
import { isCatchAll } from "@/routes/constants.mjs";

const routes = [
  {
    path: /^\/apex/,
    [isCatchAll]: true,
    fetchData() {
      const getWeapons = getData(
        API.getApexConstByType("ApexWeapons"),
        apexWeapons,
        ["apex", "meta", "weapons"],
        { shouldFetchIfPathExists: false }
      );

      const getOutfits = getData(
        LEGENDS,
        apexLegends,
        ["apex", "meta", "legends"],
        { shouldFetchIfPathExists: false }
      );

      return Promise.all([getWeapons, getOutfits]);
    },
  },
  {
    path: pathToRegexp("/apex/profile/:profileId/:tab?"),
    component: "game-apex/Profile.jsx",
    fetchData: apexFetchProfileData,
  },
  {
    path: pathToRegexp("/apex/match/:profileId/:matchId"),
    component: "game-apex/Match.jsx",
    fetchData: apexFetchMatchData,
  },
];

export default routes;
