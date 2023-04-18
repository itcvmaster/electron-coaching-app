import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

/**
 * Gets a matching puuid user that contains a summoner and/or player data
 * from the current match
 * @returns {{summoner: {}, player: *}}
 */
export default function usePlayerByMatch() {
  const {
    parameters: [, name],
  } = useRoute();
  const state = useSnapshot(readState);
  const summoners = state.tft.summoners;
  const currentMatch = useMatch();
  let players = [];
  if (currentMatch && !(currentMatch instanceof Error)) {
    players = currentMatch.data.data;
  }
  let summoner = {};
  for (const key in summoners) {
    if (Reflect.get(summoners, key).name === name) {
      summoner = summoners[key];
      break;
    }
  }
  const player =
    players.length && typeof summoner.puuid === "string"
      ? players.find((i) => i.puuid === summoner.puuid) || {}
      : {};
  return {
    summoner,
    player,
  };
}
