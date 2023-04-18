// EXEMPT
// Centralized location for IPC polling.
import "@/game-lol/lol-client-api.mjs";
import "@/game-apex/handle-messages.mjs";

import blitzMessage, {
  __isPolling,
  EVENTS,
  initEvents,
} from "@/__main__/ipc-core.mjs";
import initApex from "@/game-apex/init.mjs";
import lolClient from "@/game-lol/lol-client.mjs";
import { IS_APP } from "@/util/dev.mjs";
import moduleRefs from "@/util/module-refs.mjs";

export const pollingBlitzMessage = (type, value) => {
  return blitzMessage(type, value, __isPolling);
};

const timers = {};
const POLLING_LCU = 3500;

// Poll for LCU connection info.
async function checkForLCU() {
  timers.checkForLCU = setTimeout(checkForLCU, POLLING_LCU);
  if (lolClient.connectionInfo) return;
  const connectionInfo = await pollingBlitzMessage(EVENTS.LCU_CONNECTION_INFO);
  lolClient.connectionInfo = connectionInfo;
}

if (IS_APP) {
  (async () => {
    await initEvents;
    checkForLCU();
    await moduleRefs.appInit;
    initApex();
  })();
}
