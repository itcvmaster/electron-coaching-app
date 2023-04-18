// Main entry point to the app.
// Init desktop app.
import "@/__main__/ipc-core.mjs";
import "@/__main__/ipc-game-integrations.mjs";
import "@/app/handle-messages.mjs";
import "@/util/obscure-globals.mjs";

import { mountApp } from "@/__main__/App.jsx";
// Internal dependencies.
import router, { APP_ROUTE_VERSION } from "@/__main__/router.mjs";
import { IS_NODE_HEADLESS } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";

// Used for SSR.
export { appInstance } from "@/__main__/App.jsx";
export { waitForFeatureFlags } from "@/__main__/feature-flags.mjs";
export { extractMeta, setRoute } from "@/__main__/router.mjs";
export { i18n } from "@/i18n/i18n.mjs";
export { extractCss } from "goober";
export { default as React } from "react";
export { default as ReactDOMServer } from "react-dom/server";

// Used for integration testing.
export { mountApp, router };

// Used for acceptance testing.
export { default as routes } from "@/routes/routes.mjs";

// Render the client-side app.
if (!IS_NODE_HEADLESS) {
  mountApp();
}

// Register the service worker.
if (globals.navigator?.serviceWorker) {
  const {
    navigator: { serviceWorker },
  } = globals;
  const SW_PATH = `/${
    APP_ROUTE_VERSION ? `app/${APP_ROUTE_VERSION}/` : ""
  }service-worker.mjs`;
  (async () => {
    const registrations = await serviceWorker.getRegistrations();
    for (const registration of registrations) {
      const { active } = registration;
      if (!active) continue;
      const { scriptURL } = active;
      if (!scriptURL.endsWith(SW_PATH)) {
        registration.unregister();
      }
    }
    const scope = APP_ROUTE_VERSION ? `/app/${APP_ROUTE_VERSION}/` : "/";
    const registration = await serviceWorker.register(SW_PATH, {
      scope,
    });
    await registration.update();
  })();
}
