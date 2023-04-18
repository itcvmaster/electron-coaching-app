import { __ONLY_WRITE_STATE_FROM_ACTIONS as writeState } from "@/__main__/app-state.mjs";
import { EVENTS, handleMessage, initEvents } from "@/__main__/ipc-core.mjs";

(async () => {
  await initEvents;
  const { APP_VISIBLE, APP_SCREEN } = EVENTS;

  // This is a no-op, because we get same info from APP_SCREEN.
  handleMessage(APP_VISIBLE, () => {});

  handleMessage(APP_SCREEN, ({ focused }) => {
    writeState.volatile.isFocused = focused;
  });
})();
