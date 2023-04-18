import { devWarn, IS_APP } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import symbolName from "@/util/symbol-name.mjs";

// Only standalone root uses __BLITZ_MESSAGE__ global var.
const memoizedBlitzMessage = IS_APP
  ? globals.__BLITZ_MESSAGE__ ?? globals.__BLITZ__.getBlitzMessage()
  : () => Promise.resolve();

const memoizedHandleMessage = IS_APP
  ? globals.__BLITZ__.handleMessage
  : () => {};

let lastReadEvent = null;
const _events = {};
export const EVENTS = new Proxy(_events, {
  get(target, key) {
    lastReadEvent = key;
    return Reflect.get(...arguments);
  },
});

export const initEvents = memoizedBlitzMessage("meta/EVENT_TYPES").then(
  (result) => {
    if (!result) return;
    for (const key in result) {
      _events[key] = result[key];
    }
  }
);

// This is to keep track of messages to see if they are repeating on a set interval.
// The idea is that we should centralize all code that we have which polls into one
// place, so that it's clear how much polling we do and that we don't have to hunt down
// where polling exists.
const lastMessages = [];
const MESSAGES_LIMIT = 10;

function checkMessages(type) {
  // Need at least 3 timestamps to check for repetition.
  const ts = [];
  for (let i = lastMessages.length - 1; i > 0; i--) {
    const [e, t] = lastMessages[i];
    if (e !== type) continue;
    ts.push(t);
  }
  const intervals = ts.reduce((acc, t, i) => {
    if (i > 0) {
      acc.push(ts[i] - ts[i - 1]);
    }
    return acc;
  }, []);
  if (intervals.some((interval) => intervals.includes(interval)))
    devWarn(
      `Calling blitzMessage on an interval (polling) must belong in ipc-game-integrations.mjs.`
    );
}

// Do not import, meant for private use.
export const __isPolling = symbolName("is-polling");

export function handleMessage() {
  return memoizedHandleMessage(...arguments);
}

export default async function blitzMessage(type, value, symbol) {
  const memoEvent = lastReadEvent;
  await initEvents;
  const memoValue = _events[memoEvent];

  if (!type) throw new Error(`Event type "${memoEvent}" is missing.`);
  if (type && type !== memoValue)
    throw new Error(
      `Hard-coding event type "${type}" is not allowed, must read from EVENTS. Last read event: "${memoEvent}"`
    );

  if (symbol !== __isPolling) {
    lastMessages.push([type, Date.now()]);
    if (lastMessages.length > MESSAGES_LIMIT) {
      lastMessages.shift();
    }
  }
  checkMessages(type);
  return memoizedBlitzMessage(type, value);
}
