import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import { EXPECTED_LIFETIME, isPersistent } from "@/__main__/constants.mjs";
import { readData } from "@/__main__/get-data.mjs";
import initialState from "@/__main__/initial-state.mjs";
import clone from "@/util/clone.mjs";
import optionalMerge from "@/util/optional-merge.mjs";

// This file is for actions to update state, which are based on
// user input and not data fetching.

let hasInitialized = false;
export async function initSettings() {
  const cachedSettings = await readData(["settings"]);
  if (cachedSettings) {
    if (!hasInitialized) {
      hasInitialized = true;
      optionalMerge(cachedSettings, initialState.settings);
      cachedSettings[isPersistent] = EXPECTED_LIFETIME;
      writeState.settings = cachedSettings;
    }
    return;
  }
  const settings = clone(initialState.settings);
  // Basically never expire settings once created.
  settings[isPersistent] = EXPECTED_LIFETIME;
  writeState.settings = settings;
}

export function replaceSettingsAction(settings) {
  writeState.settings = settings;
}

export function toggleIsManualExpanded(isManualExpanded) {
  const settings = clone(readState.settings);
  Object.assign(settings, {
    isManualExpanded,
  });
  writeState.settings = settings;
}

export function updateRiotRegionAction(region) {
  const settings = clone(readState.settings);
  Object.assign(settings, {
    riotRegion: region,
  });
  writeState.settings = settings;
}

export function toggleGlobalSearchAction(shouldShowGlobalSearch) {
  writeState.volatile.shouldShowGlobalSearch = shouldShowGlobalSearch;
}

export function setPageTitle(val) {
  writeState.volatile.pageTitle = val;
}

export function clearPageTitle() {
  delete writeState.volatile.pageTitle;
}

export function setPageImage(val) {
  writeState.volatile.pageImage = val;
}

export function clearPageImage() {
  delete writeState.volatile.pageImage;
}

export function setPageHeaderVisibility(val) {
  writeState.volatile.pageHeaderVisible = val;
}

export function clearPageHeaderVisibility() {
  delete writeState.volatile.pageHeaderVisible;
}
