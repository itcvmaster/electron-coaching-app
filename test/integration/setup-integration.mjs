import { parseHTML } from "linkedom";
import fs from "node:fs/promises";

import {
  IntersectionObserver,
  IntersectionObserverEntry,
} from "./intersection-observer-ponyfill.mjs";

async function setupWindow() {
  const rawHTML = await fs.readFile("www/index.html");

  // IMPORTANT: this test setup must be run in isolation from all other tests,
  // since it mutates globalThis to pretend it's a browser.
  const root = parseHTML(rawHTML);
  for (const property of [
    "MutationObserver",
    "window",
    "document",
    "addEventListener",
    "removeEventListener",
    "Node",
    "navigator",
    "HTMLElement",
  ]) {
    globalThis[property] = root[property];
  }
  /* eslint-disable no-restricted-properties */
  globalThis.IntersectionObserver = IntersectionObserver;
  globalThis.IntersectionObserverEntry = IntersectionObserverEntry;
  globalThis.getComputedStyle = () => ({});
  globalThis.requestAnimationFrame = queueMicrotask;
  globalThis.cancelAnimationFrame = () => null;
  /* eslint-enable no-restricted-properties */

  return root;
}

async function initializeApp(route) {
  // This has to be a dynamic import, because we must mutate globals first.
  const app = await import("../../www/js/src/root.mjs");
  await app.mountApp(undefined, undefined, route);
  return app;
}

let app = null;

export default async function setupIntegration(route) {
  if (!app) {
    await setupWindow();
    app = await initializeApp(route);
  }
  const testDOM = await import("@testing-library/dom");
  return {
    ...testDOM,
    ...app,
  };
}
