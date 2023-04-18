import { subscribeKey } from "valtio/utils";

import { readState } from "@/__main__/app-state.mjs";
import updateUserSettings from "@/feature-auth/user-settings-client.mjs";
import diff from "@/util/diff.mjs";

export default class UserSettingsChangeListener {
  static #unsubCallback = undefined;
  static #previousSettings = {};
  static setup() {
    if (this.#isSetUp()) {
      this.teardown();
    }
    this.#unsubCallback = subscribeKey(
      readState,
      "settings",
      this.#onChange.bind(this)
    );
    this.#previousSettings = readState.settings;
  }

  static teardown() {
    if (this.#isSetUp()) {
      this.#unsubCallback();
      this.#unsubCallback = undefined;
    }
  }

  static #isSetUp() {
    return this.#unsubCallback !== undefined;
  }

  static #onChange(newSettings) {
    const changedUserSettings = diff(this.#previousSettings, newSettings);
    if (changedUserSettings) {
      updateUserSettings(changedUserSettings);
      this.#previousSettings = readState.settings;
    }
  }
}
