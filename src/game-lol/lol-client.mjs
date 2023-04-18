import EventEmitter from "event-lite";

import { __ONLY_WRITE_STATE_FROM_ACTIONS as writeState } from "@/__main__/app-state.mjs";
import { fetchRef } from "@/game-lol/in-game-external-api.mjs";
import { devDebug, devError } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import moduleRefs from "@/util/module-refs.mjs";
import symbolName from "@/util/symbol-name.mjs";

const CLIENT_USERNAME = "riot";
const SERVER_ADDRESS = "127.0.0.1";

export const EVENT_CONNECTION_INIT = symbolName("lcu-connection-init");
export const EVENT_LCU = symbolName("lcu-event");

export const events = new EventEmitter();

// This is intended to be a singleton, and it should only handle lower-level
// connection methods.
const lolClient = {
  _ws: null,

  get connectionInfo() {
    return this._connectionInfo;
  },

  set connectionInfo(connectionInfo) {
    this._connectionInfo = connectionInfo;
    if (connectionInfo) this.initializeConnection();
    else {
      writeState.volatile.currentSummoner = null;
    }
  },

  get isConnected() {
    return !!this._ws;
  },

  initializeConnection() {
    if (this._ws) return;

    // WebSocket config
    const {
      _connectionInfo: { password, port },
    } = this;
    const url = `wss://${CLIENT_USERNAME}:${password}@${SERVER_ADDRESS}:${port}`;
    this._ws = new WebSocket(url, "wamp");
    this._ws.addEventListener("open", () => {
      // Magic message for rito.
      const subscribeMessage = JSON.stringify([5, "OnJsonApiEvent"]);
      this._ws.send(subscribeMessage);

      // Application init
      events.emit(EVENT_CONNECTION_INIT, this._ws);
    });
    this._ws.addEventListener("error", (error) => {
      devError("LCU CONNECTION ERROR", error);
      this._connectionInfo = null;
      this._ws.close();
      this._ws = null;
    });
    this._ws.addEventListener("close", () => {
      devDebug("LCU CONNECTION CLOSED");
      this._connectionInfo = null;
      this._ws = null;
    });
    this._ws.addEventListener("message", this._messageHandler);
  },

  _messageHandler(message) {
    const [, , /*opCode*/ /*internalOpName*/ event] = JSON.parse(message.data);
    if (typeof event !== "object") return;
    devDebug("lcu event", event);
    events.emit(EVENT_LCU, event);
  },

  async request(method, endpoint, body) {
    const { protocol, port, password } = this.connectionInfo || {};
    const url = !endpoint.startsWith("http")
      ? `${protocol}://${SERVER_ADDRESS}:${port}${endpoint}`
      : endpoint;
    const options = {
      method,
      headers: {
        Authorization: `Basic ${btoa(`${CLIENT_USERNAME}:${password}`)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (body) options.body = JSON.stringify(body);

    const req = await fetchRef.fetch(url, options);
    let json;
    try {
      json = await req.json();
    } catch (e) {
      // Not always expected.
      json = null;
    }
    if (!req.ok) {
      const error = new Error(json?.message || "Empty message");
      Object.assign(error, json);
      throw error;
    }
    return json;
  },
};

moduleRefs.lolClient = lolClient;
globals.__BLITZ_DEV__.lolClient = lolClient;

export default lolClient;
