import { pathToRegexp } from "path-to-regexp";

import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import { IS_APP } from "@/util/dev.mjs";

const games = Object.getOwnPropertySymbols(GAME_SHORT_NAMES).map(
  (symbol) => GAME_SHORT_NAMES[symbol]
);

const routes = [
  IS_APP && {
    path: "/",
    // TODO: change this to just "/dashboard" later
    redirect: "/dashboard/lol",
  },
  {
    path: pathToRegexp(`/dashboard/:tab(${games.join("|")})?`),
    component: "dashboard/Dashboard.jsx",
  },
].filter(Boolean);

export default routes;
