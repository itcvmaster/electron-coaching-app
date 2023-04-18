import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import { isPersistent } from "@/__main__/constants.mjs";
import clone from "@/util/clone.mjs";

const DEFAULT_AUTH_EXPIRY_6_MONTHS = Date.now() + 1000 * 60 * 60 * 24 * 30 * 6;

export function setUserAction(user) {
  user[isPersistent] = DEFAULT_AUTH_EXPIRY_6_MONTHS;
  writeState.user = user;
}

export function setConfigBlitzAppAction(settings) {
  if (readState?.user?.preferences?.config) {
    const user = clone(readState.user);
    user.preferences.config.blitzApp = clone(settings);
    user[isPersistent] = DEFAULT_AUTH_EXPIRY_6_MONTHS;
    writeState.user = user;
  }
}
