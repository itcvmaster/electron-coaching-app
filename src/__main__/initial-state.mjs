// EXEMPT
import { ref } from "valtio";

import { isInitial } from "@/__main__/constants.mjs";
import featureFlags from "@/__main__/feature-flags.mjs";
import { GAME_SHORT_NAMES, THEME_DARK } from "@/app/constants.mjs";
import {
  FLASH_PLACEMENT_RIGHT,
  REGIONS_TO_SERVICES,
} from "@/game-lol/constants.mjs";
import { defaultLanguage } from "@/i18n/i18n.mjs";

// What belongs here: mainly empty objects which contain keys that are persisted.
// This is the original state which should *not* be cloned.
const initialState = {
  lol: {
    patches: [],
    staticData: {},
    profiles: {},
    matches: {},
    matchlists: {},
    championStats: {},
    championStatsTrends: {},
    championBuilds: {},
    championDivStats: {},
    championSynergies: {},
    championTips: {},
    championPage: {},
    currentPatch: {},
    matchups: {},
    live: {},
    championRoles: {},
    playerStyle: {},
    playerChampionStats: {},
    proBuildPros: [],
    proBuildTeams: [],
    lpMatches: {},
    matchTimeline: {},
    lobbyMembers: [],
  },
  val: {},
  apex: {
    profiles: {},
    matchlists: {},
    matches: {},
    meta: {},
    playerStats: {},
    live: null,
  },
  tft: {
    patches: {},
    staticData: {},
    profiles: {},
    matches: {},
    matchlists: {},
    stats: {
      filters: {},
      items: {},
      champions: {},
    },
    probuilds: {
      summoners: {},
      matches: {},
    },
    champions: {},
    summoners: {},
    items: {},
    localizedItems: {},
    classes: {},
    origins: {},
  },
  unknown: {
    matches: {},
    profiles: {},
    matchLists: {},
  },
  user: undefined,
  settings: {
    riotRegion: REGIONS_TO_SERVICES.NA,
    isManualExpanded: false,
    lastLoggedInAccount: null,
    // This is mainly used for search history.
    recentlySearchedAccounts: makeHashByGames(),
    loggedInAccounts: makeHashByGames(),
    selectedLanguage: defaultLanguage,
    theme: THEME_DARK,
    disableAnimations: false,
    lol: {
      displayPopup: true,
      autoImportBuilds: true,
      autoImportRunes: true,
      autoImportSpells: false,
      tiltFreeMode: false,
      queuePopup: true,
      changeLanguage: false,
      defaultFlashPlacement: FLASH_PLACEMENT_RIGHT,
    },
  },
  volatile: {},
  features: ref(featureFlags),
};

export function makeHashByGames() {
  return Object.getOwnPropertySymbols(GAME_SHORT_NAMES).reduce(
    (hash, symbol) => {
      hash[GAME_SHORT_NAMES[symbol]] = {};
      return hash;
    },
    {}
  );
}

// Recursively apply `isInitial` symbol on all objects in the initial state.
function applyIsInitial(obj) {
  obj[isInitial] = true;
  if (!obj[isInitial]) return;
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === "object") {
      applyIsInitial(value);
    }
  }
}

applyIsInitial(initialState);

export default initialState;
