import React from "react";
import i18n from "i18next";

import { refs } from "@/__main__/App.jsx";
import router, { updateRoute } from "@/__main__/router.mjs";
import { GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import * as CNLandingPage from "@/feature-china-web/Landing.jsx";
import { LoginToApp } from "@/feature-china-web/LoginToApp.jsx";
import cnWebRoutes from "@/feature-china-web/routes.mjs";
import routes, { appRoutes, gameRoutes } from "@/routes/routes.mjs";

const homeRoute = routes.find(({ path }) => path === "/");
const originals = {
  gameRoutes: {},
};

const element = React.createElement(LoginToApp);

// Unavailable games in China
const unavailables = Object.getOwnPropertySymbols(gameRoutes)
  .filter((gameSymbol) => gameSymbol !== GAME_SYMBOL_LOL) // select games which is not available in China
  .flatMap((gameSymbol) => gameRoutes[gameSymbol]);

export function setup() {
  routes.push(...cnWebRoutes);
  unavailables.forEach((route) => {
    const i = routes.indexOf(route);
    routes.splice(i, 1);
  });

  // Temporary: remove home page from app route.
  appRoutes.splice(appRoutes.indexOf(homeRoute), 1);

  originals.component = homeRoute.component;
  homeRoute.component = CNLandingPage;
  refs.floatingElements.push(element);

  originals.language = i18n.language;
  i18n.changeLanguage("zh-Hans-CN");
}

export async function teardown() {
  // Temporary: restore home page to app route.
  appRoutes.push(homeRoute);

  homeRoute.component = originals.component;

  const index = refs.floatingElements.indexOf(element);
  refs.floatingElements.splice(index, 1);

  routes.push(...unavailables);
  cnWebRoutes.forEach((route) => {
    const i = routes.indexOf(route);
    routes.splice(i, 1);
  });

  await updateRoute(router.route.currentPath);
  i18n.changeLanguage(originals.language);
}
