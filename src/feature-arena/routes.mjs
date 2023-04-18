import { pathToRegexp } from "path-to-regexp";

import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import {
  TABS_EVENT,
  TABS_HUB,
  whitelistedGameSymbols,
} from "@/feature-arena/m-constants.mjs";
import { fetchEvent, fetchEvents } from "@/feature-arena/m-fetch-events.mjs";
import { gameRoutes } from "@/routes/routes.mjs";

const HubTabs = TABS_HUB.join("|");
const EventTabs = TABS_EVENT.join("|");

export const arenaRoute = {
  path: pathToRegexp(`/arena/:tab(${HubTabs})`),
  component: "feature-arena/ArenaHub.jsx",
  fetchData: fetchEvents,
};

export const arenaRedirect = {
  path: "/arena",
  redirect: "/arena/discover",
};

export const arenaGameRoutes = Object.getOwnPropertySymbols(gameRoutes).reduce(
  (hash, symbol) => {
    if (!whitelistedGameSymbols.has(symbol)) return hash;

    const shortName = GAME_SHORT_NAMES[symbol];
    const routes = [
      {
        path: pathToRegexp(`/${shortName}/arena/:tab(${HubTabs})`),
        component: "feature-arena/ArenaHub.jsx",
        fetchData: fetchEvents,
      },
      {
        path: pathToRegexp(`/${shortName}/arena/:id/:tab(${EventTabs})`),
        component: "feature-arena/ArenaEvent.jsx",
        fetchData: fetchEvent,
      },
    ];

    hash[symbol] = routes;

    return hash;
  },
  {}
);
