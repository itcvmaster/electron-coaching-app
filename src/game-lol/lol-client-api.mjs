// eslint-disable-next-line simple-import-sort/imports
import { readState } from "@/__main__/app-state.mjs";
import db from "@/__main__/db.mjs";
import { readData } from "@/__main__/get-data.mjs";
import lolClient, {
  EVENT_CONNECTION_INIT,
  EVENT_LCU,
  events,
} from "@/game-lol/lol-client.mjs";
import router, { setRoute } from "@/__main__/router.mjs";
import transformChampionSelect from "@/data-models/lol-champion-select.mjs";
import {
  updateLobbyMembers,
  updateLoggedInSummonerSettings,
} from "@/game-lol/actions.mjs";
import {
  PHASE_IN_PROGRESS,
  PHASE_NONE,
  PHASE_WAITING_FOR_STATS,
} from "@/game-lol/constants.mjs";
import {
  fetchAllChampionStats,
  getSummonerInfo,
} from "@/game-lol/in-game-external-api.mjs";
import inGameState, { getInitialOptions } from "@/game-lol/in-game-state.mjs";
import {
  setEnemySummoners,
  processSuggestions,
  carefullyResetObservable,
} from "@/game-lol/in-game-util.mjs";
import { getDerivedId, regionsToServices } from "@/game-lol/util.mjs";
import { devError, devLog } from "@/util/dev.mjs";
import lruObject from "@/util/lru-object.mjs";

// Re-exporting here fixes circular dependencies.
export {
  calculateItemSets,
  formatItemSet,
  default as writeItems,
} from "@/game-lol/in-game-write-items.mjs";
export {
  formatRunes,
  default as writeRunes,
} from "@/game-lol/in-game-write-runes.mjs";
export { default as writeSpells } from "@/game-lol/in-game-write-spells.mjs";

const connections = new WeakSet();
export const refs = {
  resolveLogin() {},
  resolveLoginFinalization() {},
  onEnterGame() {},
  onExitGame() {},
};

// Respond to lower-level events.
events.on(EVENT_CONNECTION_INIT, async (client) => {
  try {
    await handleConnectionInit(client);
  } catch (e) {
    devError("CONNECTION INIT ERROR", e);
  }
});
events.on(EVENT_LCU, handleLCUEvent);

async function handleConnectionInit(client) {
  if (connections.has(client)) return;
  connections.add(client);

  // We want to wait for the login before fetching login data, and there
  // are multiple scenarios from our perspective.
  // 1) User logging in for the first time.
  // 2) User already logged in to LoL, starting LoL after Blitz.
  // 3) LoL already open, Blitz is starting up.
  let platformId;
  try {
    platformId = await lolClient.request(
      "get",
      "/lol-platform-config/v1/namespaces/LoginDataPacket/platformId"
    );
    devLog("got LoL login - immediate");
  } catch (e) {
    // Safe to ignore.
    platformId = await new Promise((resolve) => {
      refs.resolveLogin = ({ platformId }) => {
        resolve(platformId);
      };
    });
    // The request to get current summoner fails if we try to get it right away.
    await new Promise((resolve) => {
      refs.resolveLoginFinalization = resolve;
    });
    devLog("got LoL login - deferred");
  }

  const t0 = Date.now();
  const summoner = await lolClient.request(
    "get",
    "/lol-summoner/v1/current-summoner"
  );

  const region = regionsToServices(platformId);

  const { displayName } = summoner;
  updateLoggedInSummonerSettings(region, summoner);
  inGameState.localSummoner = summoner;

  devLog(`initialized LoL client in ${Date.now() - t0} ms`);
  inGameState.region = region;

  // Try to see if we're currently in champ select.
  try {
    const champSelectSession = await lolClient.request(
      "get",
      "/lol-champ-select/v1/session"
    );
    return enterChampionSelect(champSelectSession);
  } catch (error) {
    if (!error.httpStatus) {
      devError("CHAMP SELECT FAILED", error);
    }
  }

  // Checking for live game mainly.
  try {
    const gameFlowSession = await lolClient.request(
      "get",
      "/lol-gameflow/v1/session"
    );
    // For control flow purposes, we're going to throw an error here
    // if it's not in live game.
    const { phase } = gameFlowSession;
    if (phase !== PHASE_IN_PROGRESS) {
      const error = new Error(`Skipping phase "${phase}"`);
      error.isHandled = true;
      throw error;
    }

    return updateGameFlow(gameFlowSession);
  } catch (error) {
    if (!error.httpStatus && !error.isHandled) {
      devError("GAME FLOW FAILED", error);
    }
    const path = `/lol/profile/${region}/${displayName}`;
    if (router.route?.currentPath !== path) {
      return setRoute(path, undefined, undefined, true);
    }
  }

  return null;
}

export const lcuEventHandlers = {
  Create: {
    "/lol-champ-select/v1/session": enterChampionSelect,
    "/lol-lobby/v2/lobby": updateQueue,
    "/lol-champ-select/v1/bannable-champion-ids": updateBannableChampionIds,
    "/lol-champ-select/v1/pickable-champion-ids": updatePickableChampionIds,
  },
  Update: {
    "/lol-champ-select/v1/session": updateChampionSelect,
    "/lol-gameflow/v1/session": updateGameFlow,
    "/lol-login/v1/login-data-packet": updateLogin,
    "/lol-summoner/v1/status": emitLoginFinalization,
    "/lol-lobby/v2/lobby/members": handleUpdateLobbyMembers,
  },
  Delete: {
    "/lol-champ-select/v1/bannable-champion-ids": updateBannableChampionIds,
    "/lol-champ-select/v1/pickable-champion-ids": updatePickableChampionIds,
    // "/lol-champ-select/v1/session": exitGame,
  },
};

function handleLCUEvent(event) {
  const { data, eventType, uri } = event;
  const fn = lcuEventHandlers[eventType]?.[uri];
  if (!fn) return;
  try {
    fn(data);
  } catch (e) {
    devError("LCU EVENT ERROR", e);
  }
}

function emitLoginFinalization(data) {
  if (data?.ready) refs.resolveLoginFinalization();
}

function updateLogin(data) {
  refs.resolveLogin(data);
}

const summonerPromisesByRawId = lruObject();

function lookupSummoners() {
  // Since the summoner names do not exist in the champion select event, we have to
  // query another LCU endpoint to get more info about the summoner. There's nothing
  // really interesting other than name and puuid.
  const {
    lol: { lobbyMembers },
  } = readState;
  const {
    region,
    summonerNamesByCellId,
    lobbyMemberByCellId,
    currentState: { summonersByCellId },
  } = inGameState;
  for (const cellId in summonersByCellId) {
    const { summonerId } = summonersByCellId[cellId];
    if (!summonerId || summonerPromisesByRawId[summonerId]) continue;
    summonerPromisesByRawId[summonerId] = getSummonerById(summonerId)
      .then((summoner) => {
        const { displayName, puuid } = summoner;
        summonerNamesByCellId[cellId] = displayName;

        if (lobbyMembers.includes(getDerivedId(region, displayName)))
          lobbyMemberByCellId[cellId] = { displayName, puuid };

        return getSummonerInfo(displayName, cellId);
      })
      .catch((error) => {
        devError("FAILED TO GET SUMMONER INFO", error);
      });
  }
}

const seenIds = lruObject();
const postGameSeenIds = lruObject();

async function updateGameFlow(data) {
  const {
    phase,
    gameData: {
      gameId,
      queue: { id: queueId },
    },
  } = data;
  inGameState.queueId = queueId;
  switch (phase) {
    case PHASE_IN_PROGRESS: {
      if (seenIds[gameId]) return;
      seenIds[gameId] = true;
      await setEnemySummoners(data);
      const writeStatePath = ["lolGameState"];
      writeStatePath.root = {};
      const result = await readData(writeStatePath);
      result.queueId = queueId;
      if (!result) {
        await db.upsert("lolGameState", inGameState);
      } else {
        Object.assign(inGameState, result);
      }
      await enterChampionSelect(null, true);
      await refs.onEnterGame(gameId);
      break;
    }
    case PHASE_NONE:
    case PHASE_WAITING_FOR_STATS: {
      // TODO: add db.delete method...
      db.upsert("lolGameState", null);
      exitGame();

      if (gameId && !postGameSeenIds[gameId]) {
        postGameSeenIds[gameId] = true;
        await refs.onExitGame(gameId);
      }
      break;
    }
  }
}

function updateChampionSelect(data, fromEnter = false) {
  if (!inGameState.currentState && !fromEnter) {
    enterChampionSelect(data, true);
  }

  if (!data?.timer?.phase) {
    // Ignores this event if the phase is not set.
    // This is a bit of a hack, but it's the only way to get the timer phase to not update
    // when the phase is undefined.
    return;
  }

  const sanitizedData = transformChampionSelect(data);
  inGameState.currentState = sanitizedData;

  processSuggestions();
  lookupSummoners();
}

async function enterChampionSelect(data, fromUpdate = false) {
  carefullyResetObservable(inGameState.options, getInitialOptions());
  await fetchAllChampionStats();
  if (!fromUpdate) updateChampionSelect(data, true);
  return setRoute("/lol/in-game", undefined, undefined, true);
}

function updateQueue(data) {
  inGameState.queueId = data?.gameConfig?.queueId || 0;
}

function exitGame() {
  inGameState.currentState = null;
  const {
    settings: { lastLoggedInAccount, loggedInAccounts },
  } = readState;
  const hasAccount =
    lastLoggedInAccount && loggedInAccounts.lol[lastLoggedInAccount];
  // This should generally not occur since we should have detected a logged in
  // account to even play. This is mainly for debugging purposes.
  if (!hasAccount) {
    setRoute("/", undefined, undefined, true);
    return;
  }
  const [region, name] = lastLoggedInAccount.split(":");
  setRoute(`/lol/profile/${region}/${name}`, undefined, undefined, true);
}

function handleUpdateLobbyMembers(data) {
  const premadeNames = data.map((member) => member.summonerName);
  updateLobbyMembers(inGameState.region, premadeNames);
}

function updateBannableChampionIds(data) {
  inGameState.bannableChampionIds = data;
}

function updatePickableChampionIds(data) {
  inGameState.pickableChampionIds = data;
}

// High level APIs.
async function getSummonerById(summonerId) {
  const summoner = await lolClient.request(
    "get",
    `/lol-summoner/v1/summoners/${summonerId}`
  );
  return summoner;
}

export function GetLCUAvailable() {
  return lolClient.isConnected;
}

export function getLCUMatch(gameId) {
  return lolClient.request("get", `/lol-match-history/v1/games/${gameId}`);
}

export function getLCUMatchList(puuid) {
  return lolClient.request(
    "get",
    `/lol-match-history/v1/products/lol/${puuid}/matches`
  );
}

export async function getLCUSummonerProfile(name) {
  const summoner = await lolClient.request(
    "get",
    `/lol-summoner/v1/summoners?name=${name}`
  );

  const rankedStats = await lolClient.request(
    "get",
    `/lol-ranked/v1/ranked-stats/${summoner.puuid}`
  );

  return { summoner, rankedStats };
}

export async function getCurrSummonerCareer() {
  const { puuid } = await lolClient.request(
    "get",
    `/lol-summoner/v1/current-summoner`
  );

  // rio
  // puuid = `f7a7a007-9ce0-5e3f-a058-6387ec699e96`;

  const currSeason = puuid
    ? await lolClient.request(
        "get",
        `/lol-career-stats/v1/summoner-games/${puuid}`
      )
    : [];

  const ROLE_INDEX = {
    0: "TOP",
    1: "JUNGLE",
    2: "MID",
    3: "ADC",
    4: "SUPPORT",
  };
  // Huge list of career games/matches. Will need to filter out some queues etc
  const result = (currSeason || []).reduce((table, current) => {
    const {
      championId,
      stats: {
        "CareerStats.js": {
          position,
          csDiffAtLaningEnd,
          goldDiffAtLaningEnd,
          csScore,
          visionScore,
          kills,
          deaths,
          assists,
          victory,
          timePlayed,
        },
      },
    } = current;

    const role = ROLE_INDEX[position] || "ALL";

    if (!table[championId]) table[championId] = {};
    if (!table[championId][role])
      table[championId][role] = {
        games: 0,
        csDiff: 0,
        goldDiff: 0,
        csScore: 0,
        visionScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        wins: 0,
        timePlayed: 0,
      };
    if (!table[championId]["ALL"])
      table[championId]["ALL"] = {
        games: 0,
        csDiff: 0,
        goldDiff: 0,
        csScore: 0,
        visionScore: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        wins: 0,
        timePlayed: 0,
      };

    const hash = table[championId][role];
    hash.games += 1;
    hash.csDiff += csDiffAtLaningEnd;
    hash.goldDiff += goldDiffAtLaningEnd;
    hash.csScore += csScore;
    hash.visionScore += visionScore;
    hash.kills += kills;
    hash.deaths += deaths;
    hash.assists += assists;
    hash.wins += victory;
    hash.timePlayed += timePlayed / 1000 / 60; // mins

    const hashAll = table[championId]["ALL"];
    hashAll.games += 1;
    hashAll.csDiff += csDiffAtLaningEnd;
    hashAll.goldDiff += goldDiffAtLaningEnd;
    hashAll.csScore += csScore;
    hashAll.visionScore += visionScore;
    hashAll.kills += kills;
    hashAll.deaths += deaths;
    hashAll.assists += assists;
    hashAll.wins += victory;
    hashAll.timePlayed += timePlayed / 1000 / 60; // mins

    return table;
  }, {});

  return result;
}
