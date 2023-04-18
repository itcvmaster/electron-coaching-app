import { subscribeKey } from "valtio/utils";

import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import { i18n } from "@/root.mjs";
import { devError } from "@/util/dev.mjs";
import subscriptionStateDiff from "@/util/subscription-state-diff.mjs";

/**
 * Add subscriptions for our settings object here.
 */
export function registerSettingsSubscriptions(readState) {
  subscribeKey(
    readState,
    "settings",
    subscriptionStateDiff(onSettingsChange, readState.settings)
  );
}

/**
 * Sets the application language when settings are changed.
 */
export function onSettingsChange(prevSettings, nextSettings) {
  if (!prevSettings || !nextSettings) return;

  if (prevSettings.selectedLanguage !== nextSettings.selectedLanguage) {
    setLanguage(nextSettings.selectedLanguage);
  }
}

export function setLanguage(language) {
  blitzMessage(EVENTS.CHANGE_LANGUAGE, language).catch((error) => {
    devError(error);
  });
  i18n.changeLanguage(language);
}
