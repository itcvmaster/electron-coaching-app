import React from "react";
import EventEmitter from "event-lite";

import { refs } from "@/__main__/App.jsx";
import { fetchRef as gqlFetchRef } from "@/__main__/get-data.mjs";
import * as lolActions from "@/feature-event-replay/lol-actions.mjs";
import {
  fetchInterceptor,
  gqlFetchInterceptor,
  handleLcuConnection,
  handleRecording,
} from "@/feature-event-replay/lol-api.mjs";
import RecordingToolbar from "@/feature-event-replay/RecordingToolbar.jsx";
import { fetchRef as inGameFetchRef } from "@/game-lol/in-game-external-api.mjs";
import {
  EVENT_CONNECTION_INIT,
  EVENT_LCU,
  events as lolEvents,
} from "@/game-lol/lol-client.mjs";
import symbolName from "@/util/symbol-name.mjs";

export const replayEvents = new EventEmitter();
export const EVENT_LCU_REQUEST = symbolName("lcu-request");

export const originals = {};

const element = React.createElement(RecordingToolbar);

const wrapFetch = (method, endpoint, body) =>
  fetchInterceptor(endpoint, { method, body });

export function setup() {
  lolActions.setupState();

  originals.inGameFetch = inGameFetchRef.fetch;
  originals.gqlFetch = gqlFetchRef.fetch;

  refs.floatingElements.push(element);

  inGameFetchRef.fetch = fetchInterceptor;
  gqlFetchRef.fetch = gqlFetchInterceptor;
  refs.forceRender();

  lolEvents.on(EVENT_CONNECTION_INIT, handleLcuConnection);
  lolEvents.on(EVENT_LCU, handleRecording);
  replayEvents.on(EVENT_LCU_REQUEST, wrapFetch);
}

export function teardown() {
  lolActions.teardownState();

  const index = refs.floatingElements.indexOf(element);
  refs.floatingElements.splice(index, 1);

  inGameFetchRef.fetch = originals.inGameFetch;
  gqlFetchRef.fetch = originals.gqlFetch;
  refs.forceRender();

  lolEvents.off(EVENT_CONNECTION_INIT, handleLcuConnection);
  lolEvents.off(EVENT_LCU, handleRecording);
  replayEvents.off(EVENT_LCU_REQUEST, wrapFetch);
}

// Re-exporting for tests.
export { lolActions };
