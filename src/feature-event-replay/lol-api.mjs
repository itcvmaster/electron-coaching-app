import { readState } from "@/__main__/app-state.mjs";
import {
  MODE_PAUSED,
  MODE_PLAYING,
  MODE_RECORDING,
  recordCurrentEvent,
} from "@/feature-event-replay/lol-actions.mjs";
import { originals } from "@/feature-event-replay/mod.mjs";
import { lcuEventHandlers } from "@/game-lol/lol-client-api.mjs";
import { getLolEndpointKey } from "@/game-lol/util.mjs";

function filterEvents(event) {
  const { eventType, uri } = event;
  const fn = lcuEventHandlers[eventType]?.[uri];
  return typeof fn === "function";
}

export function handleLcuConnection(event) {
  const { mode } = readState.eventReplay;
  if (mode !== MODE_RECORDING) return;

  event.ts = Date.now();

  recordCurrentEvent("lcu-connected", event);
}

export function handleRecording(event) {
  const { mode } = readState.eventReplay;
  if (mode !== MODE_RECORDING) return;
  if (!filterEvents(event)) return;

  event.ts = Date.now();

  recordCurrentEvent("lcu-event", event);
}

export async function fetchInterceptor() {
  const { mode } = readState.eventReplay;

  const [url, opts] = arguments;
  const method = opts?.method ?? "get";
  const endpoint = getLolEndpointKey(url);
  const requestKey = `${method} ${endpoint}`;
  const requestMap = readState.eventReplay.requestMap ?? {};
  const ts = Date.now();

  let rawResponse;
  let responseBody;
  let isErrorResponse;
  const request = requestMap[requestKey];

  if (mode === MODE_PLAYING || mode === MODE_PAUSED) {
    if (request) {
      // If we're in playback or paused (stepped) mode, we need to replay the request from the request map.
      responseBody = request.responseBody;
      isErrorResponse = request.isErrorResponse;
    } else {
      return Promise.reject(
        new Error(`replay lol-ingame request missing: ${requestKey}`)
      );
    }
  }
  if (!responseBody) {
    // If we're not in playback mode, we need to fetch the request normally
    /* eslint-disable no-invalid-this */
    rawResponse = await originals.inGameFetch.apply(this, arguments);
    isErrorResponse = !rawResponse.ok;
    /* eslint-enable no-invalid-this */
    // https://stackoverflow.com/questions/53511974/javascript-fetch-failed-to-execute-json-on-response-body-stream-is-locked
    try {
      responseBody = await rawResponse.clone().json();
    } catch (e) {
      // JSON response body is not always expected.
      responseBody = null;
    }
  }

  const event = {
    method,
    endpoint,
    responseBody,
    requestKey,
    isErrorResponse,
    ts,
  };

  if (mode === MODE_RECORDING) {
    // If we're in recording mode, we need to record the request in the request map.
    recordCurrentEvent("in-game-request", event);
  }

  return rawResponse
    ? rawResponse
    : Promise.resolve({ json: () => responseBody, ok: !isErrorResponse });
}

const postQueryRegex = /mutation\s([a-zA-Z]*)/;
function getGQLQuery(url, queryOpts) {
  if (!url.includes("/graphql")) return [];

  let query;
  let args;
  if (queryOpts?.method?.toLowerCase() === "post") {
    query = postQueryRegex.exec(queryOpts.body.query)[1];
    args = JSON.stringify(queryOpts.body.variables ?? {});
  } else {
    const { searchParams } = new URL(url);
    query = searchParams.get("query");
    args = searchParams.get("variables");
  }

  return [query, args];
}

// Will only record gql queries when `captureGql` is true, otherwise it will just pass them through
export async function gqlFetchInterceptor() {
  const [url, opts] = arguments;
  const method = opts?.method ?? "GET";
  const [query, args] = getGQLQuery(url, opts);
  const isGqlQuery = !!query;
  const requestKey = `${method} ${query} ${args}`;
  const ts = Date.now();

  let rawResponse;
  let responseBody;
  const { mode, captureGql, requestMap } = readState.eventReplay;
  if (
    isGqlQuery &&
    captureGql &&
    (mode === MODE_PLAYING || mode === MODE_PAUSED)
  ) {
    const request = requestMap[requestKey];
    if (!request) {
      return Promise.reject(
        new Error(`replay gql request missing: ${requestKey}`)
      );
    }

    responseBody = request.responseBody;
  } else {
    rawResponse = await originals.gqlFetch.apply(this, arguments); // eslint-disable-line no-invalid-this
    try {
      responseBody = await rawResponse.clone().json();
    } catch (e) {
      responseBody = null;
    }
  }

  const event = {
    method,
    endpoint: query,
    responseBody,
    requestKey,
    ts,
  };
  if (isGqlQuery && captureGql && mode === MODE_RECORDING)
    recordCurrentEvent("gql-request", event);

  return rawResponse
    ? rawResponse
    : Promise.resolve({ json: () => responseBody, ok: true });
}
