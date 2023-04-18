import {
  // This is fine because this file is for actions.
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import {
  EXPECTED_LIFETIME,
  isPersistent,
  isVolatile,
  PATH_DELIMITER,
} from "@/__main__/constants.mjs";
import db from "@/__main__/db.mjs";
import { readData } from "@/__main__/get-data.mjs";
import {
  GAME_SHORT_NAMES,
  GAME_SYMBOL_BY_SHORT_NAME,
  GAME_SYMBOL_LOL,
} from "@/app/constants.mjs";
import {
  EVENT_LCU_REQUEST,
  replayEvents,
} from "@/feature-event-replay/mod.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import {
  EVENT_CONNECTION_INIT,
  EVENT_LCU,
  events as lolEvents,
} from "@/game-lol/lol-client.mjs";
import { devError, devLog } from "@/util/dev.mjs";
import lruObject from "@/util/lru-object.mjs";
import symbolName from "@/util/symbol-name.mjs";

export const MODE_IDLE = symbolName("idle");
export const MODE_RECORDING = symbolName("recording");
export const MODE_PLAYING = symbolName("playing");
export const MODE_PAUSED = symbolName("paused");

const initialRecording = null;

let timeoutId;

export const config = {
  skipTimeout: false,
};

export async function setupState() {
  const currentRecording = [];
  currentRecording[isVolatile] = true;
  const initialState = {
    mode: MODE_IDLE,
    currentStep: 0,
    totalSteps: 0,
    requestMap: lruObject({ [isVolatile]: true }),
    recordings: { [isVolatile]: true },
    currentRecording,
    selectedRecording: initialRecording,
    captureGql: false,
    [isVolatile]: true,
  };
  if (readState.eventReplay)
    Object.assign(writeState.eventReplay, initialState);
  else writeState.eventReplay = initialState;

  await readData(["eventReplay", "recordingIds"]);
}

export function teardownState() {
  delete writeState.eventReplay;
}

export async function getLatestRecording() {
  const latestRecordingIds = await readData([
    "eventReplay",
    "latestRecordingId",
  ]);
  const latestRecordingId = Object.keys(latestRecordingIds ?? [])[0];
  if (latestRecordingId) {
    setSelectedRecordng(latestRecordingId);
    fastForward(latestRecordingId);
  }
}

export async function fastForward(recordingId) {
  const latestStepsByRecordingId =
    (await readData(["eventReplay", "latestSteps"])) ?? {};
  const lastRecordedStep = latestStepsByRecordingId[recordingId];

  if (lastRecordedStep === undefined) return;

  const { selectedRecording } = readState.eventReplay;
  if (!selectedRecording) return;
  let step = 0;
  const t0 = Date.now();

  function run() {
    setTimeout(() => {
      const { recordingEventType, ...event } = selectedRecording.events[step];
      if (recordingEventType === "lcu-connection") {
        lolEvents.emit(EVENT_CONNECTION_INIT);
      } else if (recordingEventType === "lcu-event") {
        if (event.eventType === "Delete") return;
        lolEvents.emit(EVENT_LCU, event);
      } else if (recordingEventType === "lcu-request") {
        replayEvents.emit(
          EVENT_LCU_REQUEST,
          event.method,
          event.endpoint,
          event.body
        );
      }

      writeState.eventReplay.currentStep = step;

      if (step >= lastRecordedStep) {
        devLog(`fast-forwarding completed in ${Date.now() - t0}ms`);
        return;
      }

      step++;
      run();
    }, 0);
  }
  run();

  devLog(`fast-forwarding to step ${lastRecordedStep}`);
}

export async function setSelectedRecordng(recordingId) {
  const recordingData = await readData([
    "eventReplay",
    "recordings",
    recordingId,
  ]);

  if (!recordingData) {
    devError("Could not find recording", recordingId);
    return;
  }

  const totalTime = () => {
    const first = recordingData.events[0];
    const last = recordingData.events[recordingData.events.length - 1];
    return last.ts - first.ts;
  };

  const selectedRecording = {
    ...recordingData,
    lastAccessedTime: Date.now(),
    totalTime: totalTime(),
  };

  const recording = {
    ...selectedRecording,
    [isPersistent]: EXPECTED_LIFETIME,
  };

  selectedRecording[isVolatile] = true;

  const initialState = recordingData.events.find(
    (event) => event.recordingEventType === "initial-state"
  )?.initialState;

  if (!initialState) {
    devError("Could not find initial state");
  } else {
    Object.assign(inGameState, initialState);
  }

  const requests = recordingData.events.filter((event) =>
    ["lcu-request", "in-game-request", "gql-request"].includes(
      event.recordingEventType
    )
  );
  requests.forEach((event) => {
    const {
      method,
      endpoint,
      body,
      responseBody,
      requestKey,
      isErrorResponse,
    } = event;
    updateRequestMap(requestKey, {
      method,
      endpoint,
      body,
      responseBody,
      isErrorResponse,
    });
  });

  writeState.eventReplay.recordings[recordingId] = recording;
  writeState.eventReplay.selectedRecording = selectedRecording;
  writeState.eventReplay.totalSteps = selectedRecording.events.length - 1;
  writeState.eventReplay.mode = MODE_PAUSED;
}

export function uploadRecording(json) {
  let recordingData = json;
  if (typeof json === "string") {
    try {
      recordingData = JSON.parse(json);
    } catch (e) {
      devError("Could not parse JSON recording", e);
      return false;
    }
  }

  if (!recordingData.events) {
    devError("Recording does not have events");
    return false;
  }
  if (!recordingData.name) {
    devError("Recording does not have name");
    return false;
  }
  if (!recordingData.game) {
    devError("Recording does not have game");
    return false;
  }

  const totalTime = () => {
    const first = recordingData.events[0];
    const last = recordingData.events[recordingData.events.length - 1];
    return last.ts - first.ts;
  };

  const selectedRecording = {
    name: recordingData.name,
    game: recordingData.game,
    events: recordingData.events,
    totalTime,
    [isVolatile]: true,
  };

  const currentRecording = selectedRecording.events;
  currentRecording[isVolatile] = true;

  writeState.eventReplay.selectedRecording = selectedRecording;
  writeState.eventReplay.totalSteps = selectedRecording.events.length - 1;
  writeState.eventReplay.mode = MODE_PAUSED;

  writeState.eventReplay.currentRecording = currentRecording;
  saveCurrentRecording(recordingData.name, recordingData.game);

  return true;
}

export function clearSelectedRecording() {
  writeState.eventReplay.selectedRecording = initialRecording;
  writeState.eventReplay.mode = MODE_IDLE;
  writeState.eventReplay.currentStep = 0;
  writeState.eventReplay.totalSteps = 0;
}

export function play() {
  return new Promise((resolve) => {
    function doPlay() {
      const currentStep = readState.eventReplay.currentStep;
      const totalSteps = readState.eventReplay.totalSteps;
      const nextEvent =
        readState.eventReplay.selectedRecording.events[currentStep + 1];
      const currentEvent =
        readState.eventReplay.selectedRecording.events[currentStep];

      const isPlaying = readState.eventReplay.mode === MODE_PLAYING;
      const isPaused = readState.eventReplay.mode === MODE_PAUSED;

      if (!nextEvent) {
        if (isPaused) {
          rewind();
          doPlay();
        } else {
          pause();
          devLog("reach end of recording");
          resolve();
        }
        return;
      }

      if (!isPlaying || isPaused) {
        writeState.eventReplay.mode = MODE_PLAYING;
        if (currentStep === totalSteps) rewind();
        if (currentStep === 0) step(0, false);
      }

      const proceedToNextStep = step(1, false);

      if (proceedToNextStep) {
        timeoutId = setTimeout(
          () => {
            clearTimeout(timeoutId);
            doPlay();
          },
          config.skipTimeout || currentStep === totalSteps - 1
            ? 0
            : nextEvent.ts - currentEvent.ts
        );
      } else {
        pause();
      }
    }
    doPlay();
  });
}

export function rewind() {
  writeState.eventReplay.currentStep = 0;
  step(0);
}

export function pause() {
  clearTimeout(timeoutId);
  writeState.eventReplay.mode = MODE_PAUSED;
}

export function clear() {
  clearTimeout(timeoutId);
  clearCurrentRecording();
  setupState();
}

export function step(dir = 1, forcePause = true) {
  const currentStep = readState.eventReplay.currentStep;
  const totalSteps = readState.eventReplay.totalSteps;
  const nextStep = currentStep + dir;

  if (nextStep < 0 || nextStep > totalSteps) {
    if (forcePause) {
      pause();
    }
    return false;
  }

  const game = readState.eventReplay.selectedRecording.game;
  const name = readState.eventReplay.selectedRecording.name;
  const currentEvent = readState.eventReplay.selectedRecording.events[nextStep];
  const { recordingEventType, ...event } = currentEvent;
  const gameSymbol =
    typeof game === "string" ? GAME_SYMBOL_BY_SHORT_NAME[game] : game;

  switch (gameSymbol) {
    case GAME_SYMBOL_LOL: {
      if (recordingEventType === "lcu-connected") {
        devLog("replay lcu connection", event);
        lolEvents.emit(EVENT_CONNECTION_INIT, event);
      } else if (recordingEventType === "lcu-event") {
        devLog("replay lcu event", event);
        lolEvents.emit(EVENT_LCU, event);
      } else if (recordingEventType === "lcu-request") {
        replayEvents.emit(
          EVENT_LCU_REQUEST,
          event.method,
          event.endpoint,
          event.body
        );
      }
      break;
    }
    default:
      devError("Unknown game", game);
  }

  const key = `${GAME_SHORT_NAMES[gameSymbol]}:${name}`;
  const latestRecordingId = { [key]: true, [isPersistent]: true };

  const latestSteps = {
    ...readState.eventReplay.latestSteps,
    [key]: nextStep,
    [isPersistent]: Date.now() + 1000 * 60 * 60, // Persist for 1 hour
  };
  writeState.eventReplay.currentStep = nextStep;
  writeState.eventReplay.latestSteps = latestSteps;
  writeState.eventReplay.latestRecordingId = latestRecordingId;
  return true;
}

export function toggleRecording(isRecording) {
  writeState.eventReplay.mode =
    typeof isRecording !== "boolean"
      ? readState.eventReplay.mode === MODE_RECORDING
        ? MODE_IDLE
        : MODE_RECORDING
      : isRecording
      ? MODE_RECORDING
      : MODE_IDLE;

  // This is a quick and dirty hack to initialize the state from
  // before the recording began.
  //
  // Why is this a hack? Because these requests are made before recording
  // starts, and also what triggers these requests come from blitz-core,
  // the websocket connection init.
  //
  // A proper solution here would be to capture these requests before
  // recording and also emit the connection init event, but it would
  // probably be a lot more code and more complex.
  if (readState.eventReplay.mode === MODE_RECORDING) {
    const { region = "na1", localSummoner } = inGameState;
    const {
      eventReplay: { currentRecording },
    } = readState;
    currentRecording.push({
      initialState: { region, localSummoner },
      recordingEventType: "initial-state",
    });
  }
}

export function recordCurrentEvent(recordingEventType, event) {
  const currentRecording = readState.eventReplay.currentRecording;
  currentRecording.push({ ...event, recordingEventType });
  currentRecording[isVolatile] = true;
  writeState.eventReplay.currentRecording = currentRecording;
}

export function updateRequestMap(requestKey, requestObject) {
  const requestMap = {
    ...readState.eventReplay.requestMap,
    [requestKey]: requestObject,
    [isVolatile]: true,
  };
  writeState.eventReplay.requestMap = requestMap;
}

export async function clearCurrentRecording() {
  const id = ["eventReplay", "latestRecordingId"].join(PATH_DELIMITER);
  await db.upsert([[id, {}]]);

  const currentRecording = [];
  currentRecording[isVolatile] = true;

  writeState.eventReplay.currentRecording = currentRecording;
}

export async function saveCurrentRecording(name, _game) {
  const game = typeof _game === "string" ? _game : GAME_SHORT_NAMES[_game];
  const key = `${game}:${name}`;
  const recordingIds = (await readData(["eventReplay", "recordingIds"])) ?? [];
  recordingIds.push(key);
  recordingIds[isPersistent] = EXPECTED_LIFETIME;

  writeState.eventReplay.recordingIds = recordingIds;

  const currentRecording = readState.eventReplay.currentRecording ?? [];

  writeState.eventReplay.recordings[key] = {
    name,
    game,
    lastAccessedTime: Date.now(),
    events: currentRecording,
    [isPersistent]: EXPECTED_LIFETIME,
  };

  clearCurrentRecording();
  setSelectedRecordng(key);
  return Promise.resolve();
}

// TODO: move out of lol-actions when other games are added
export function toggleCaptureGqlRequests() {
  writeState.eventReplay.captureGql = !readState.eventReplay.captureGql;
}
