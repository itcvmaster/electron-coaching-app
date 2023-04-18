import { isPersistent } from "@/__main__/constants.mjs";
import db from "@/__main__/db.mjs";
import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import { IS_APP } from "@/util/dev.mjs";

class AuthTokenHandler {
  async getToken() {
    return (await this.#getTokenObject())?.authToken;
  }

  async getTokenExpiry() {
    return (await this.#getTokenObject())?.authTokenExpiry;
  }

  unsetToken() {
    this.setToken(undefined, undefined);
  }

  setToken(authToken, authTokenExpiry) {
    if (!IS_APP) {
      const auth = {
        authToken,
        authTokenExpiry,
        [isPersistent]: new Date(authTokenExpiry).getTime(),
      };
      db.upsert([["auth", auth]]);
    } else {
      blitzMessage(EVENTS.SAVE_TOKEN, {
        authToken,
        authTokenExpiry,
      });
    }
  }

  async #getTokenObject() {
    let tokenObject;
    if (!IS_APP) {
      tokenObject = (await db.find("auth"))[0];
    } else {
      tokenObject = await blitzMessage(EVENTS.LOAD_TOKEN, null);
    }
    return tokenObject;
  }
}

export const authTokenHandler = new AuthTokenHandler();
