import React from "react";

import { refs as appRefs } from "@/__main__/App.jsx";
import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import { NAV_MENU_MAP, refreshMenu } from "@/app/MainNav.jsx";
import { Modal } from "@/feature-arena/CompModal.jsx";
import { onEnterGame, onExitGame } from "@/feature-arena/hooks-lol.mjs";
import {
  createArenaPath,
  removeArenaPath,
} from "@/feature-arena/m-actions.mjs";
import { whitelistedGameSymbols } from "@/feature-arena/m-constants.mjs";
import {
  arenaGameRoutes,
  arenaRedirect,
  arenaRoute,
} from "@/feature-arena/routes.mjs";
import { refs as lolRefs } from "@/game-lol/lol-client-api.mjs";
import ArenaIcon from "@/inline-assets/nav-arena.svg";
import routes, { appRoutes, gameRoutes } from "@/routes/routes.mjs";

const gameStartOriginals = {};
const gameEndOriginals = {};

const modalElement = React.createElement(Modal);

const ARENA_MENU_ITEMS = {
  noSpecificGame: [
    {
      href: "/arena/discover",
      icon: ArenaIcon,
      label: ["tft:common.arena", "Arena"],
    },
  ],
};

for (const gameSymbol of whitelistedGameSymbols) {
  ARENA_MENU_ITEMS[gameSymbol] = [
    {
      href: `/${GAME_SHORT_NAMES[gameSymbol]}/arena/discover`,
      icon: ArenaIcon,
      label: ["tft:common.arena", "Arena"],
    },
  ];
}

export function setup() {
  // Routes
  routes.push(arenaRoute, arenaRedirect);
  appRoutes.push(arenaRoute);
  for (const gameSymbol of Object.getOwnPropertySymbols(arenaGameRoutes)) {
    const list = arenaGameRoutes[gameSymbol];
    routes.push(...list);
    gameRoutes[gameSymbol].push(...list);
  }

  // Refs
  toggleArenaMenu();
  appRefs.floatingElements.push(modalElement);
  gameStartOriginals.lol = lolRefs.onEnterGame;
  lolRefs.onEnterGame = onEnterGame;
  gameEndOriginals.lol = lolRefs.onExitGame;
  lolRefs.onExitGame = onExitGame;

  // State
  createArenaPath();
}

export function teardown() {
  // Routes
  appRoutes.splice(appRoutes.indexOf(arenaRoute), 1);
  routes.splice(routes.indexOf(arenaRoute), 1);
  routes.splice(routes.indexOf(arenaRedirect), 1);
  for (const gameSymbol of Object.getOwnPropertySymbols(arenaGameRoutes)) {
    const list = arenaGameRoutes[gameSymbol];
    for (const route of list) {
      routes.splice(routes.indexOf(route), 1);
      gameRoutes[gameSymbol].splice(gameRoutes[gameSymbol].indexOf(route), 1);
    }
  }

  // Refs
  toggleArenaMenu();
  appRefs.floatingElements.splice(
    appRefs.floatingElements.indexOf(modalElement),
    1
  );
  lolRefs.onEnterGame = gameStartOriginals.lol;
  lolRefs.onExitGame = gameEndOriginals.lol;

  // State
  removeArenaPath();
}

function toggleArenaMenu() {
  const hasMenuItems = NAV_MENU_MAP.noSpecificGame.includes(
    ARENA_MENU_ITEMS.noSpecificGame[0]
  );

  const keys = [
    ...Object.keys(ARENA_MENU_ITEMS),
    ...Object.getOwnPropertySymbols(ARENA_MENU_ITEMS),
  ];

  if (!hasMenuItems) {
    for (const key of keys) {
      const target = NAV_MENU_MAP[key];
      const src = ARENA_MENU_ITEMS[key];
      target.push(...src);
    }
    refreshMenu();
    return;
  }

  for (const key of keys) {
    const target = NAV_MENU_MAP[key];
    const src = ARENA_MENU_ITEMS[key];
    for (const item of src) {
      target.splice(target.indexOf(item), 1);
    }
  }
}
