import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import {
  GAME_SYMBOL_FN,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";

export function useGameAccount(gameSymbol) {
  const { user } = useSnapshot(readState);

  if (!user) return null;

  switch (gameSymbol) {
    case GAME_SYMBOL_LOL:
      return user.defaultSummoner;
    case GAME_SYMBOL_FN:
      return user.defaultFortniteUser;
    case GAME_SYMBOL_VAL:
      return user.defaultValorantUser;
    default:
      return null;
  }
}
