import { useEffect, useState } from "react";
import EventEmitter from "event-lite";

import router from "@/__main__/router.mjs";
import { gameRoutes } from "@/routes/routes.mjs";

class GameRouteEvents extends EventEmitter {}

export const EVENT_GAME_CHANGE = "EVENT_GAME_CHANGE";

export const gameRouteEvents = new GameRouteEvents();

const gameRouteSymbols = Object.getOwnPropertySymbols(gameRoutes);

// This is used to find the current game symbol, it does not update.
// For usage in React components, you should use the `useGameSymbol` hook,
// which handles updates.
export function findGameSymbol() {
  return gameRouteSymbols.find((symbol) => {
    return gameRoutes[symbol].find(({ path }) => {
      return path === router.route?.path;
    });
  });
}

export function useGameSymbol() {
  const [gameSymbol, setGameSymbol] = useState(findGameSymbol());

  useEffect(() => {
    function gameChange(symbol) {
      setGameSymbol(symbol);
    }
    gameRouteEvents.on(EVENT_GAME_CHANGE, gameChange);
    return () => {
      gameRouteEvents.off(EVENT_GAME_CHANGE, gameChange);
    };
  }, []);

  return gameSymbol;
}
