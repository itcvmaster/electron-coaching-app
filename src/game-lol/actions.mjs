import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import { isPersistent, isVolatile } from "@/__main__/constants.mjs";
import { getRitoLanguageCodeFromBCP47 } from "@/app/util.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import clone from "@/util/clone.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import pruneKeys from "@/util/prune-keys.mjs";

// This is a kludge to temporarily set the current patch to something else.
export function updateCurrentPatchAction(patch) {
  if (patch !== readState.lol?.currentPatch?.patch) {
    writeState.lol.currentPatch = {
      patch,
      [isPersistent]: true,
    };
  }
}

export function updateRecentlySearchedAccounts(region, name, profile) {
  const derivedId = getDerivedId(region, name);
  if (readState.settings.recentlySearchedAccounts.lol[derivedId]) return;
  const { summonerName, profileIconId } = profile;
  const settings = clone(readState.settings);
  settings.recentlySearchedAccounts.lol[derivedId] = {
    summonerName,
    profileIconId,
  };
  // prune object with unbounded keys
  pruneKeys(settings.recentlySearchedAccounts.lol, 10);
  writeState.settings = settings;
}

export function updateLoggedInSummonerSettings(region, summoner) {
  const { displayName } = summoner;
  const derivedId = getDerivedId(region, displayName);
  writeState.volatile.currentSummoner = derivedId;
  const settings = clone(readState.settings);
  settings.lastLoggedInAccount = derivedId;
  settings.loggedInAccounts.lol[derivedId] = { region, ...summoner };
  writeState.settings = settings;
}

export function updateRuneDetails(patch, runeDetails) {
  const lang = getLocale();
  const ritoLanguageCode = getRitoLanguageCodeFromBCP47(lang);
  runeDetails[isVolatile] = true;
  writeState.lol.staticData[ritoLanguageCode][patch].runeDetails = runeDetails;
}

export function updateLobbyMembers(region, lobbyMembers) {
  const currentSummoner = readState.settings.lastLoggedInAccount;
  const othersInLobby = lobbyMembers
    .map((member) => getDerivedId(region, member))
    .filter((member) => member !== currentSummoner);

  writeState.lol.lobbyMembers = othersInLobby;
}
