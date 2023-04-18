import blitzMessage, { EVENTS, initEvents } from "@/__main__/ipc-core.mjs";
import { updateLiveGame } from "@/game-apex/actions.mjs";
import { formatMode, getLastGameMode } from "@/game-apex/utils.mjs";
import { devError } from "@/util/dev.mjs";

async function initApex() {
  await initEvents;
  if (!EVENTS.APEX_READ_STATE) return null;
  await blitzMessage(EVENTS.APEX_READ_STATE);
  let liveGame = {};
  try {
    liveGame = await blitzMessage(EVENTS.APEX_READ_LIVE_GAME);
  } catch (e) {
    devError("Failed to get Apex live game or not in live game.");
  }

  const { players, gameMode, matchId, mapName, gameStartedAt } = liveGame || {};
  updateLiveGame(
    players
      ? {
          playerMatchChampionStats: players,
          matchId,
          mapName,
          gameStartedAt,
          mode: formatMode(getLastGameMode(gameMode), gameMode),
        }
      : null
  );
}

export default initApex;
