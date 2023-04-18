import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import {
  calcWeaponsAccuracy,
  getPlayerStatsByMatch,
} from "@/game-apex/utils.mjs";

function useApexLast20({ season, mode, profileId }) {
  const state = useSnapshot(readState);
  const matches = state.apex?.matchlists?.[profileId]?.[season]?.[mode];
  const apexWeapons = state.apex.meta?.weapons;

  const { last20Stats } = useMemo(() => {
    const last20Stats = {
      matches: 0,
      matchesWithShots: 0,
      matchesWithHits: 0,
      kills: 0,
      assists: 0,
      damagedealt: 0,
      knockdowns: 0,
      respawnsgiven: 0,
      revivesgiven: 0,
      survivaltime: 0,
      shots: 0,
      hits: 0,
      headshots: 0,
      accuracy: 0,
      headshotPercentage: 0,
    };

    for (const match of matches || []) {
      const myPlayer = getPlayerStatsByMatch(match, profileId);

      if (last20Stats.matches <= 20) last20Stats.matches++;
      if (last20Stats.matchesWithShots <= 20 && myPlayer.shots)
        last20Stats.matchesWithShots++;
      if (last20Stats.matchesWithHits <= 20 && myPlayer.hits)
        last20Stats.matchesWithHits++;
      for (const stat of Object.keys(last20Stats)) {
        if (stat === "accuracy" && last20Stats.matchesWithShots <= 20) {
          const accuracy = calcWeaponsAccuracy(myPlayer?.weapons, apexWeapons);
          if (typeof accuracy === "number") {
            last20Stats[stat] += accuracy;
          }
        } else if (
          stat === "headshotPercentage" &&
          last20Stats.matchesWithHits <= 20
        ) {
          if (myPlayer.hits && typeof myPlayer.headshots === "number") {
            last20Stats[stat] += myPlayer.headshots / myPlayer.hits;
          }
        } else if (myPlayer[stat] && last20Stats.matches <= 20) {
          last20Stats[stat] += myPlayer[stat];
        }
      }
      if (last20Stats.matchesWithHits >= 20) break;
    }

    for (const stat of Object.keys(last20Stats)) {
      if (last20Stats[stat] && !stat.startsWith("matches")) {
        if (["hits", "shots", "accuracy"].includes(stat)) {
          last20Stats[stat] = last20Stats[stat] / last20Stats.matchesWithShots;
        } else if (["headshots", "headshotPercentage"].includes(stat)) {
          last20Stats[stat] = last20Stats[stat] / last20Stats.matchesWithHits;
        } else {
          last20Stats[stat] = last20Stats[stat] / last20Stats.matches;
        }
      }
    }

    return {
      last20Stats,
    };
  }, [matches, profileId, apexWeapons]);

  return {
    matches,
    last20Stats,
  };
}

export default useApexLast20;
