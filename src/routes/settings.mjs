import { pathToRegexp } from "path-to-regexp";

import { GAME_SHORT_NAMES, GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import {
  syncAppForceCloseSetting,
  syncAppVersion,
  syncHardwareAccelation,
  syncLatestMacRelease,
  syncLatestWindowsRelease,
  syncLoginItemSettings,
} from "@/settings/actions.mjs";

export const settingsTabs = {
  GENERAL: "general",
  LOL: GAME_SHORT_NAMES[GAME_SYMBOL_LOL],
};

const SettingsTabs = Object.values(settingsTabs).join("|");

export const settingsRoute = {
  path: pathToRegexp(`/settings/:panel(${SettingsTabs})`),
  component: "settings/Settings.jsx",
  async fetchData() {
    await Promise.allSettled([
      syncLoginItemSettings(),
      syncHardwareAccelation(),
      syncAppForceCloseSetting(),
      syncAppVersion(),
      syncLatestWindowsRelease(),
      syncLatestMacRelease(),
    ]);
  },
};

const routes = [
  {
    path: "/settings",
    redirect: `/settings/${settingsTabs.GENERAL}`,
  },
  settingsRoute,
];

export default routes;
