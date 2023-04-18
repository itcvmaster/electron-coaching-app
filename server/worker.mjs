import cluster from "node:cluster";
import http from "node:http";
import nodeFetch from "node-fetch";

import { STATIC_REGEXP } from "../build-scripts/constants.mjs";
import createQueue from "../src/util/create-queue.mjs"; // This import works because there's no dependencies.
import staticProxy from "./proxy.mjs";
import serveRoute from "./serve-route.mjs";
import serveStatic from "./serve-static.mjs";

// We will emulate `fetch` in the Node.js environment to make the browser
// method work.
globalThis.fetch = nodeFetch; // eslint-disable-line no-restricted-properties

// Because the SSR app is stateful, make sure there is zero concurrency,
// i.e. no two requests changing the route in the same app at the same time.
// An alternate, safer but slower approach would be to use another context
// or child process.
const renderQueue = createQueue();

const BLITZ_WEB_PORT = process.env.BLITZ_WEB_PORT || 8080;
const BLITZ_WEB_STATIC_URL =
  process.env.BLITZ_WEB_STATIC_URL || "https://blitz-desktop.blitz.gg";
export const server = http.createServer(listener);

const APP_ROUTE_REGEXP = /^\/app\/([^/]*)(.*)/;
const ASSET_EXT_REGEXP = /\.(m?js|map)$/;

const appProxy = staticProxy(BLITZ_WEB_STATIC_URL, (pathname) => {
  const appMatch = pathname.match(APP_ROUTE_REGEXP);
  const isAsset = pathname.match(ASSET_EXT_REGEXP);

  // Serve the current app version, mainly for testing.
  // DO NOT USE THIS ON PRODUCTION. CACHE WON'T BE INVALIDATED.
  if (appMatch?.[1] === "current") {
    return `localhost${isAsset ? appMatch[2] : "/"}`;
  }

  return appMatch
    ? `/${appMatch[1]}${isAsset ? appMatch[2] : "/index.html"}`
    : null;
});

function listener(req, res) {
  const { url: pathname } = req;

  const isAppRoute = pathname.match(APP_ROUTE_REGEXP);
  if (isAppRoute) {
    return appProxy(req, res);
  }
  // TODO: use fs.readdir to handle top level static assets.
  if (STATIC_REGEXP.test(pathname)) {
    return serveStatic(req, res);
  }

  return renderQueue.push(() => serveRoute(req, res));
}

if (cluster.isWorker) {
  server.listen(BLITZ_WEB_PORT);
}
