import "@/__main__/ipc-core.mjs";
import "@/__main__/ipc-game-integrations.mjs";
import "@/app/handle-messages.mjs";

import React from "react";

import App from "@/__main__/App.jsx";
import globals from "@/util/global-whitelist.mjs";

export const { __BLITZ_DEV__ } = globals;

export const standaloneApp = React.createElement(App, { isStandalone: true });

export { mountApp, unmountApp } from "@/__main__/App.jsx";
