import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import { isVolatile } from "@/__main__/constants.mjs";
import { makeHashByGames } from "@/__main__/initial-state.mjs";
import clone from "@/util/clone.mjs";

export function createArenaPath() {
  writeState.arena = {
    [isVolatile]: true,
    gameRecords: makeHashByGames(),
    eventList: [],
    eventDetails: {},
    joinResult: {},
    modal: {},
  };
}

export function removeArenaPath() {
  delete writeState["arena"];
}

export function subscribe(optedIn) {
  writeState.settings = Object.assign(clone(readState.settings), {
    optedInToArenaMarketingEmails: optedIn,
  });
}

export function clearError(id) {
  writeState.arena.joinResult[id] = null;
}

export function showModal(renderContent, options) {
  writeState.arena.modal = {
    visible: true,
    renderContent,
    options,
    [isVolatile]: true,
  };
}

export function hideModal() {
  writeState.arena.modal = {
    visible: false,
    [isVolatile]: true,
  };
}
