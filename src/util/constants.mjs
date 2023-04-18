import globals from "@/util/global-whitelist.mjs";

export const appSelector = "#app";

export const appContainer = globals.document?.querySelector(appSelector);

// Omit loading video from result.
export const hasMarkup = Boolean(
  Array.prototype.filter.call(
    appContainer?.children ?? [],
    (element) => element.tagName !== "VIDEO"
  ).length
);
