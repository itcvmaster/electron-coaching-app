import { initSettings } from "@/app/actions.mjs";
import {
  GAME_SYMBOL_APEX,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_UNKNOWN,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import apexRoutes from "@/routes/apex.mjs";
import { isCatchAll } from "@/routes/constants.mjs";
import generalRoutes from "@/routes/general.mjs";
import lolRoutes from "@/routes/lol.mjs";
import marketingRoutes from "@/routes/marketing.mjs";
import settingsRoutes from "@/routes/settings.mjs";
import tftRoutes from "@/routes/tft.mjs";
import unknownRoutes from "@/routes/unknown.mjs";
import valRoutes from "@/routes/val.mjs";

export const gameRoutes = {
  [GAME_SYMBOL_UNKNOWN]: unknownRoutes,
  [GAME_SYMBOL_LOL]: lolRoutes,
  [GAME_SYMBOL_VAL]: valRoutes,
  [GAME_SYMBOL_TFT]: tftRoutes,
  [GAME_SYMBOL_APEX]: apexRoutes,
};

// These are routes which do not belong to any game, but should still
// show app navigation.
export const appRoutes = [...generalRoutes, ...settingsRoutes];

// The default route should fetch global data (user, settings).
// It also has a special behavior in the router if these conditions are met:
// 1) It is the first initial render
// 2) There is SSR content available
// Then it should defer calling `fetchData` until after rendering.
// This is to guarantee that there's no mismatch between server/client render.
// https://www.benmvp.com/blog/handling-react-server-mismatch-error/
export const defaultRoute = {
  path: /.*/,
  [isCatchAll]: true,
  async fetchData() {
    await initSettings();
  },
};

const routes = [defaultRoute, ...appRoutes, ...marketingRoutes];
for (const gameSymbol of Object.getOwnPropertySymbols(gameRoutes)) {
  routes.push(...gameRoutes[gameSymbol]);
}

export default routes;
