import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import {
  END_OF_TIME,
  isPersistent,
  isVolatile,
} from "@/__main__/constants.mjs";
import getData from "@/__main__/get-data.mjs";
import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import noopModel from "@/data-models/no-op.mjs";
import {
  getLatestMacRelease,
  getLatestWindowsRelease,
} from "@/settings/utils.mjs";
import clone from "@/util/clone.mjs";
import { devError } from "@/util/dev.mjs";

export function updateSetting(key, value) {
  const settings = clone(readState.settings);
  settings[key] = value;
  settings[isPersistent] = END_OF_TIME;
  writeState.settings = settings;
}

export function updateLoLSetting(key, value) {
  const settings = clone(readState.settings);
  settings.lol[key] = value;
  settings[isPersistent] = END_OF_TIME;
  writeState.settings = settings;
}

export function removeLoLProfile(key) {
  const settings = clone(readState.settings);
  delete settings.loggedInAccounts.lol[key];
  settings[isPersistent] = END_OF_TIME;
  writeState.settings = settings;
}

export async function setOpenAtLogin(value) {
  try {
    await blitzMessage(
      value ? EVENTS.ENABLE_AUTOLAUNCH : EVENTS.DISABLE_AUTOLAUNCH
    );
  } catch (error) {
    devError(error);
  } finally {
    await syncLoginItemSettings();
  }
}

export async function syncLoginItemSettings() {
  await getData(
    async () => {
      const result = await blitzMessage(EVENTS.GET_LOGIN_ITEM_SETTINGS);
      result[isVolatile] = true;
      return result;
    },
    noopModel,
    ["volatile", "loginItemSettings"],
    { shouldFetchIfPathExists: true }
  );
}

export async function setHardwareAcceleration(value) {
  try {
    await blitzMessage(EVENTS.TOGGLE_HWA, value);
  } catch (error) {
    devError(error);
  } finally {
    await syncHardwareAccelation();
  }
}

export async function syncHardwareAccelation() {
  await getData(
    async () => {
      // TODO: we should refactor this to a primitive symbol when getData
      // is updated to handle primitives.
      return {
        enabled: await blitzMessage(EVENTS.TOGGLE_HWA),
        [isVolatile]: true,
      };
    },
    noopModel,
    ["volatile", "hardwareAcceleration"],
    { shouldFetchIfPathExists: true }
  );
}

export async function setAppForceCloseSetting(value) {
  try {
    await blitzMessage(EVENTS.APP_FORCE_CLOSE_SETTING, value);
  } catch (error) {
    devError(error);
  } finally {
    await syncAppForceCloseSetting();
  }
}

export async function syncAppForceCloseSetting() {
  await getData(
    async () => {
      // TODO: we should refactor this to a primitive symbol when getData
      // is updated to handle primitives.
      return {
        enabled:
          (await blitzMessage(EVENTS.DB_READ, "appForceClose")) === "true",
        [isVolatile]: true,
      };
    },
    noopModel,
    ["volatile", "appForceCloseSetting"],
    { shouldFetchIfPathExists: true }
  );
}

export async function syncAppVersion() {
  await getData(
    async () => {
      // TODO: we should refactor this to a primitive symbol when getData
      // is updated to handle primitives.
      return {
        value: await blitzMessage(EVENTS.APP_VERSION),
        [isVolatile]: true,
      };
    },
    noopModel,
    ["volatile", "appVersion"]
  );
}

export async function syncLatestWindowsRelease() {
  await getData(
    async () => {
      // TODO: we should refactor this to a primitive symbol when getData
      // is updated to handle primitives.
      return {
        value: await getLatestWindowsRelease(),
        [isVolatile]: true,
      };
    },
    noopModel,
    ["volatile", "latestWindowsRelease"]
  );
}

export async function syncLatestMacRelease() {
  await getData(
    async () => {
      // TODO: we should refactor this to a primitive symbol when getData
      // is updated to handle primitives.
      return {
        value: await getLatestMacRelease(),
        [isVolatile]: true,
      };
    },
    noopModel,
    ["volatile", "latestMacRelease"]
  );
}

export async function checkForUpdates() {
  try {
    await blitzMessage(EVENTS.CHECK_FOR_UPDATES);
  } catch (error) {
    devError(error);
  }
}

export async function restartApp() {
  try {
    await blitzMessage(EVENTS.APP_RESTART);
  } catch (error) {
    devError(error);
  }
}

export async function resetSessionData() {
  try {
    await blitzMessage(EVENTS.APP_RESET_SESSION_DATA);
  } catch (error) {
    devError(error);
  }
}

/**
 * Migrates data from the user object to in-app settings if
 * the setting value is defined on the user.
 */
export function migrateSettings(user) {
  const settings = clone(readState.settings);

  if (user?.preferences?.config?.app?.theme !== undefined) {
    settings.theme = user.preferences.config.app.theme;
  }

  if (user?.preferences?.config?.app?.disableAnimations !== undefined) {
    settings.disableAnimations = user.preferences.config.app.disableAnimations;
  }

  if (user?.preferences?.config?.app?.changeLanguageOnLoad !== undefined) {
    settings.lol.changeLanguage =
      user.preferences.config.app.changeLanguageOnLoad;
  }

  if (user?.preferences?.config?.app?.queuePopup !== undefined) {
    settings.lol.queuePopup = user.preferences.config.app.queuePopup;
  }

  if (user?.preferences?.config?.lol?.autopopup !== undefined) {
    settings.lol.displayPopup = user.preferences.config.lol.autopopup;
  }

  if (user?.preferences?.config?.lol?.allChampionItemSetEnabled !== undefined) {
    settings.lol.autoImportBuilds =
      user.preferences.config.lol.allChampionItemSetEnabled;
  }

  if (user?.preferences?.config?.lol?.autoImportRunes !== undefined) {
    settings.lol.autoImportRunes = user.preferences.config.lol.autoImportRunes;
  }

  if (user?.preferences?.config?.lol?.autoImportSpells !== undefined) {
    settings.lol.autoImportSpells =
      user.preferences.config.lol.autoImportSpells;
  }

  if (user?.preferences?.config?.lol?.tiltFreeMode !== undefined) {
    settings.lol.tiltFreeMode = user.preferences.config.lol.tiltFreeMode;
  }

  if (user?.preferences?.config?.lol?.preferredFlashLocation !== undefined) {
    settings.lol.defaultFlashPlacement =
      user.preferences.config.lol.defaultFlashPlacement;
  }

  settings[isPersistent] = END_OF_TIME;

  writeState.settings = settings;
}
