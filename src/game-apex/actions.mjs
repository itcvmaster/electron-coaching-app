import {
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import {
  END_OF_TIME,
  isPersistent,
  isVolatile,
} from "@/__main__/constants.mjs";
import clone from "@/util/clone.mjs";
//   import pruneKeys from "@/util/prune-keys.mjs";

export function updateLoggedInAccountId(profileId) {
  const settings = clone(readState.settings);
  settings.loggedInAccounts.apex = profileId;
  writeState.settings = settings;
}

export function updateProfile(profileId, update) {
  if (!profileId) return;
  let profile = clone(readState.apex.profiles[profileId]);
  profile = {
    ...(profile || {}),
    ...update,
  };
  profile[isPersistent] = END_OF_TIME;
  writeState.apex.profiles[profileId] = profile;
}

export function updatePlayerStats(profileId, stats) {
  if (!profileId) return;
  for (const season in stats) {
    for (const mode in stats[season]) {
      let playerStats = clone(
        readState.apex.playerStats?.[profileId]?.[season]?.[mode]
      );
      playerStats = {
        ...(playerStats || {}),
        ...stats[season][mode],
      };
      playerStats[isPersistent] = END_OF_TIME;
      writeState.apex.playerStats[profileId][season][mode] = playerStats;
    }
  }
}

export function addMatch(profileId, match) {
  if (!profileId || !match) return;
  const seasons = ["all", match.season];
  const modes = ["all", match.mode];
  for (const season of seasons) {
    for (const mode of modes) {
      const matchlist = clone(
        readState.apex.matchlists[profileId]?.[season]?.[mode] || []
      );

      (matchlist || []).unshift(match);
      matchlist.sort((a, b) => b.gameStartedAt - a.gameStartedAt);
      matchlist[isPersistent] = END_OF_TIME;
      writeState.apex.matchlists[profileId][season][mode] = matchlist;
    }
  }
  const oldMatch = clone(readState.apex.matches?.[match.matchId]);
  const newMatch = {
    ...(oldMatch || {}),
    ...match,
  };
  newMatch[isPersistent] = END_OF_TIME;
  writeState.apex.matches[match.matchId] = newMatch;
}

export function updateLiveGame(match) {
  if (match?.playerMatchChampionStats?.length <= 1) return;
  const liveGame = clone(readState.apex.liveGame);
  liveGame[isVolatile] = true;
  writeState.apex.liveGame = match
    ? {
        ...(liveGame || {}),
        ...match,
      }
    : null;
}
