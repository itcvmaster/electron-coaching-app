import { computed, mount, observable, ref } from "s2-engine";

import { EVENTS } from "@/__main__/ipc-core.mjs";
import { pollingBlitzMessage } from "@/__main__/ipc-game-integrations.mjs";
import { INGAME_PHASES } from "@/game-lol/constants.mjs";
import { getChampionBuilds } from "@/game-lol/in-game-builds.mjs";
import { devError, devLog } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import lruObject from "@/util/lru-object.mjs";
import moduleRefs from "@/util/module-refs.mjs";

// "options" is just state that typically user-input via the ui
// This is a function because we need to be able to call
// it to reset back to the initial state for each consecutive game.
export const getInitialOptions = () => ({
  selectedTab: "suggestions",
  selectedTabAutoSwitched: false,
  selectedBuildKey: null,
  showBans: false,
  selectedRole: null,
  selectingRole: false,
  selectedOpponent: null,

  // Suggestions
  suggestionsSearch: "",
  suggestionsHoveredId: null,
  suggestionsClickedSearchId: null,
  suggestionsClickedBanId: null,
  suggestionsClickedPickId: null,
  declaredLaneCounterMore: false,
  declaredGameCounterMore: false,
  metaBansMore: false,
  laneCounterMore: false,
  gameCounterMore: false,
  careerMore: false,
  metaPicksMore: false,
});
export const options = getInitialOptions();
// This is intended to be shared, serializable state.
// Memory is manually managed here since it's not part of the app state, so be very
// careful not to leak.
// Why it's separate from app-state:
// - `state-cleanup` does not apply here, since it's separate from routing. We are
//   breaking the pattern of only doing data-fetching from the route here. This is
//   because this has to function independently of the current route.
const inGameState = observable(
  {
    // If remote, computeds should not run locally.
    // WARNING: if this is not set for a remote client, the following can happen:
    // - the remote client makes separate requests to our backend to fetch builds,
    //   which may conflict with what the other client sees.
    isRemote: false,

    // This is meant to contain only data that comes directly from the LCU.
    currentState: null,
    currentMvp: { cellId: null, score: 0 },
    region: null,
    queueId: null,
    localSummoner: null,
    summonerNamesByCellId: {},
    summonerAccountsByCellId: {},
    summonerChampionStatsByCellId: {},
    summonerTagsByCellId: [],
    summonerPlayStylesByCellId: {},
    summonerPremadesByCellId: {},
    championStats: null,
    championRoles: null,
    buildsUpdatedAt: null,
    lobbyMembersByCellId: {},
    bannableChampionIds: [],
    pickableChampionIds: [],

    options,

    // Suggestions data
    roleMatchups: {},
    synergies: {},
    suggestions: {},

    // Things in here take advantage of DB read/write.
    lolGameStatePersistedKeys: {
      builds: lruObject(ref({}), 80),
    },
  },
  true
);

// Private
const buildPromises = {};
let liveClientPolling;

// We will use computed properties to set keys on the observable state.
// https://gr0uch.github.io/s2/#computed-of-computed
computed({
  getLocalSummonerBuilds() {
    if (!inGameState.currentState || inGameState.isRemote) return;
    const {
      options,
      currentState: { summonersByCellId, localPlayerCellId },
    } = inGameState;
    const { championId, championPickIntent } =
      summonersByCellId[localPlayerCellId];
    const id = championId || championPickIntent;
    if (!id || buildPromises[id]) return;

    buildPromises[id] = getChampionBuilds(id)
      .catch((error) => {
        devError(`BUILD FETCH "${id}" FAILED`, error);
      })
      .finally(() => {
        delete buildPromises[id];
      });

    // Switch UI tab from suggestions to builds
    if (options.selectedTab !== "builds" && !options.selectedTabAutoSwitched) {
      options.selectedTabAutoSwitched = true;
      options.selectedTab = "builds";
    }
  },
  getLiveClientData() {
    if (!inGameState.currentState || inGameState.isRemote) return;
    const phaseType = inGameState.currentState?.phase?.type;

    // Temporarily using this string...
    if (phaseType !== INGAME_PHASES[4]) {
      clearTimeout(liveClientPolling);
      liveClientPolling = null;
      return;
    }

    if (!liveClientPolling) {
      pollLiveClientData();
    }
  },
})[mount]();

function pollLiveClientData() {
  liveClientPolling = setTimeout(async () => {
    pollLiveClientData();
    let leaguePort;
    try {
      leaguePort = await pollingBlitzMessage(EVENTS.LOL_GET_PORT_NUMBER);
      // Patching -1 from core to 2999 as default
      if (leaguePort === -1) leaguePort = 2999;
    } catch (error) {
      // Not really necessary to log this.
    }
    if (!leaguePort) return;
    const protocol = "https";
    const { lolClient } = moduleRefs;
    let data;
    try {
      data = await lolClient.request(
        "get",
        `${protocol}://127.0.0.1:${leaguePort}/liveclientdata/allgamedata`
      );
    } catch (error) {
      // Not really necessary to log this.
    }
    devLog("LIVE CLIENT DATA", data);
  }, 2500);
}

globals.__BLITZ_DEV__.lolGameState = inGameState;

export default inGameState;
