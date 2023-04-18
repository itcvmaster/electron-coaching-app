import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const pkg = JSON.parse(readFileSync(path.resolve("package.json")));

// This refers to the file extension used by esbuild output. By default,
// it is .js, but .mjs is preferred.
export const JS_FILE_EXTENSION = ".mjs";

export const STATIC_REGEXP =
  /^\/(js\/|assets\/|(.*?)\.html|robots\.txt|service-worker\.m?js)\/?/;
export const NAUGHTY_REGEXP =
  /lol|champion|participant|tft|valorant|fortnite|csgo|apex/i;
export const EXEMPT_REGEXP = /^\/\/ EXEMPT/;
export const CODE_EXT_REGEXP = /(?<!__.*?)\.m?jsx?$/;
export const SYMBOL_REGEXP = / Symbol\(/;
export const DIR_FEATURE_REGEXP = /feature-(.*)/;
export const DIR_GAME_REGEXP = /game-(.*)/;
export const FEATURE_IMPORT_REGEXP = /from "(.*?)feature-(.*?)\/(.*?)"/;
export const GAME_IMPORT_REGEXP = /from "(.*?)game-(.*?)\/(.*?)"/gm;
export const ROUTE_DIR_REGEXP = /^(routes|feature-)/;

// Exceptions:
// - URLs in single line comments
// - constants object: { "KEY_NAME": "https://..." }
// - actually required like in w3 namespaces
// - import/export from
export const HARDCODE_URL_REGEXP =
  /(?<!(?:\/\/|"?[A-Z_]+"?:\s*"|from ")\s*)https?:\/\/(?!www\.w3\.org)/g;

// DO NOT REMOVE - This is to enforce:
// - a flattened directory structure.
// - naming conventions.
export const WHITELIST_DIRECTORIES = new Set([
  "__main__",
  "app",
  "inline-assets",
  "data-models",
  "standalone",
  DIR_GAME_REGEXP,
  DIR_FEATURE_REGEXP,
  "i18n",
  "marketing",
  "dashboard",
  "settings",
  "routes",
  "shared",
  "util",
  "vendor",
]);

// Expand regexps into actual directories
export const expandDirectoriesPromise = (async () => {
  const regExps = [...WHITELIST_DIRECTORIES].filter((_) => _ instanceof RegExp);
  for (const regExp of regExps) {
    WHITELIST_DIRECTORIES.delete(regExp);
  }
  const listing = await fs.readdir("src/", { withFileTypes: true });
  const dirs = Array.prototype.filter.call(listing, (dirent) =>
    dirent.isDirectory()
  );
  for (const dir of dirs) {
    const match = regExps.find((regExp) => regExp.test(dir.name));
    if (match) WHITELIST_DIRECTORIES.add(dir.name);
  }
})();

// This list is not comprehensive.
export const BANNED_PACKAGES = {
  "@apollo/client": "It doesn't mesh with our state management.",
  "@loadable/component": "We are sticking with native ES modules.",
  axios: "Prefer native fetch.",
  "cookie-parser": "Cookies are banned as a storage mechanism in app.",
  "date-fns": "Use `@/shared/TimeAgo.jsx`, or native Date methods instead.",
  dotenv:
    "Environment variables have no business in our front-end build pipeline.",
  graphql:
    "We are hardcoding queries, which serves effectively as a whitelist of which queries front-end may make.",
  jasmine: "Please read `test/README.md`.",
  jest: "Please read `test/README.md`.",
  "js-cookie": "Cookies are banned as a storage mechanism in app.",
  lodash:
    "Most of the functions are trivial to implement or already exist as a language feature.",
  mocha: "Please read `test/README.md`.",
  moment: "Use `@/shared/TimeAgo.jsx`, or native Date methods instead.",
  polished: "We are using `goober`.",
  "prop-types": "Bad idea, not worth the overhead.",
  qs: "Prefer the native `URLSearchParams`.",
  // react: "We are using `preact`.",
  // "react-dom": "We are using `preact`.",
  "react-query": "There should not be competing frameworks to fetch data.",
  "react-router":
    "Does not have good support for dynamic imports. Use `@/__main__/router.mjs`.",
  "react-router-dom": "Use regular `href` attributes.",
  "react-scroll-parallax":
    "Please `useLayoutEffect`, and implement passive scroll listener and use manual DOM operations.",
  "react-tooltip":
    "Overengineered package + maintainers are unable to give proper instructions.",
  "react-visibility-sensor":
    "Does not use native `IntersectionObserver`. Use `shared/Sentinel.jsx`.",
  redux: "We are using `valtio`.",
  "styled-components": "We are using `goober`.",
  webpack:
    "There should not be competing build systems, and also webpack is too slow.",
  xstate:
    "Too easy to abuse and create infinite state machines with statecharts, extended state, etc. " +
    "Our use cases are not complicated enough to warrant that, learned the hard way.",
};

export const BANNER = `     /|
    /@|
   /@@|___
  /@@@@@@/   ${pkg.name} v${pkg.version}
     |@@/    Copyright (c) ${new Date().getFullYear()} ${pkg.author}
     |@/
     |/`;

export const LINK_ICON = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PG1hc2sgaWQ9ImMiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0yNS44MDIgMTQuMDQ0di4xMDNjMCAuMDM0IDAgMCAwIDAtLjAxNi4xNzMtLjA3My4zNC0uMTY1LjQ4N2wtLjEyLjE1NS0uOTY3IDEuMjgxLTEyLjA1NiAxNS42NjYtLjA2OC4wODhhLjU1LjU1IDAgMCAxLS4zODYuMTZoLS44MjdjLS41ODIgMC0xLjE0LS4yMzItMS41NTItLjY0N2EyLjIyIDIuMjIgMCAwIDEtLjY0My0xLjU2M3YtLjI1NGwuOTM4LTguNzE2YS44MDIuODAyIDAgMCAwIDAtLjExMi41NS41NSAwIDAgMC0uMzM2LS41MS41MzguNTM4IDAgMCAwLS4yMS0uMDRIMS45MzJhLjU1LjU1IDAgMCAxLS4zODctLjE2MWwtLjkyOC0xLjA4Ni0uMDgyLS4wODhhMS4xMjUgMS4xMjUgMCAwIDEtLjI0Mi0uNjk2di0uMTAzYzAtLjAzNCAwIDAgMCAwIC4wMTYtLjE3My4wNzMtLjM0LjE2NS0uNDg3bC4xMi0uMTU1Ljk2Ny0xLjI4MUwxMy42My40MTlsLjA2OC0uMDg4YS41NDkuNTQ5IDAgMCAxIC4zODYtLjE2aC43ODRjLjU4MiAwIDEuMTQuMjMyIDEuNTUxLjY0Ny40MTIuNDE1LjY0My45NzcuNjQzIDEuNTYzdi4yNTRsLS45MzggOC43MTZhLjgwNS44MDUgMCAwIDAgMCAuMTEyLjU0OC41NDggMCAwIDAgLjMzNy41MS41NC41NCAwIDAgMCAuMjEuMDRoNy4zNzFjLjI5LjAzLjU1NS4xNzQuNzQuNGwuNzI1Ljg0Ny4wODIuMDg4Yy4xNDYuMjAyLjIyLjQ0Ny4yMTMuNjk2eiIvPjwvbWFzaz48cGF0aCBkPSJNMjguNzU0IDE0LjA0NHYuMTAzYzAgLjAzNCAwIDAgMCAwLS4wMTYuMTczLS4wNzMuMzQtLjE2NS40ODdsLS4xMi4xNTUtLjk2NyAxLjI4MS0xMi4wNTYgMTUuNjY2LS4wNjguMDg4YS41NS41NSAwIDAgMS0uMzg2LjE2aC0uODI3Yy0uNTgyIDAtMS4xNC0uMjMyLTEuNTUyLS42NDdhMi4yMiAyLjIyIDAgMCAxLS42NDMtMS41NjN2LS4yNTRsLjkzOC04LjcxNmEuODAyLjgwMiAwIDAgMCAwLS4xMTIuNTUuNTUgMCAwIDAtLjMzNi0uNTEuNTM4LjUzOCAwIDAgMC0uMjEtLjA0SDQuODg0YS41NS41NSAwIDAgMS0uMzg3LS4xNjFsLS45MjgtMS4wODYtLjA4Mi0uMDg4YTEuMTI1IDEuMTI1IDAgMCAxLS4yNDItLjY5NnYtLjEwM2MwLS4wMzQgMCAwIDAgMCAuMDE2LS4xNzMuMDczLS4zNC4xNjUtLjQ4N2wuMTItLjE1NS45NjctMS4yODFMMTYuNTgyLjQxOWwuMDY4LS4wODhhLjU0OS41NDkgMCAwIDEgLjM4Ni0uMTZoLjc4NGMuNTgyIDAgMS4xNC4yMzIgMS41NTEuNjQ3LjQxMi40MTUuNjQzLjk3Ny42NDMgMS41NjN2LjI1NGwtLjkzOCA4LjcxNmEuODA1LjgwNSAwIDAgMCAwIC4xMTIuNTQ4LjU0OCAwIDAgMCAuMzM3LjUxLjU0LjU0IDAgMCAwIC4yMS4wNGg3LjM3MWMuMjkuMDMuNTU1LjE3NC43NC40bC43MjUuODQ3LjA4Mi4wODhjLjE0Ni4yMDIuMjIuNDQ3LjIxMy42OTZ6IiBmaWxsPSJ1cmwoI2EpIiBzdHlsZT0iZmlsbDp1cmwoI2EpIi8+PHBhdGggZD0iTTI1LjgwMiAxNC4xNDdoNkwxOS44MjUgMTMuNmw1Ljk3Ni41NDd6bS0uMTY1LjQ4NyA0Ljc0MiAzLjY3Ni4xODItLjIzNS4xNTktLjI1M3ptLS4xMi4xNTUtNC43NDItMy42NzYtLjAyNC4wMy0uMDI0LjAzMnptLS45NjcgMS4yODEgNC43NTUgMy42Ni4wMTctLjAyMy4wMTYtLjAyMnpNMTIuNDk0IDMxLjczNmw0Ljc1IDMuNjY1LjAwNS0uMDA2em0tLjA2OC4wODggNC4yMzggNC4yNDcuMjc1LS4yNzQuMjM4LS4zMDgtNC43NS0zLjY2NXptLS4zODYuMTZ2NmguMDExem0tLjgyNyAwdi02ek05LjAyIDI5LjUybC01Ljk2Ni0uNjQxLS4wMzQuMzJ2LjMyMXptLjkzNy04LjcxNiA1Ljk2Ni42NDEuMDEyLS4xMTIuMDA4LS4xMTJ6bTAtLjExMi02LS4wNTQtLjAwMi4yMzYuMDE3LjIzNXptLS41NDYtLjU1djZoLjAyN2wuMDI3LS4wMDEtLjA1NC02em0tNy40NzggMC0uMDExIDZoLjAxMXptLS4zODctLjE2MS00LjU2IDMuODk4LjE1NC4xOC4xNjkuMTd6bS0uOTI4LTEuMDg2IDQuNTYyLTMuODk4LS4wOS0uMTA2LS4wOTYtLjEwMnptLS4wODItLjA4OC00LjcwOSAzLjcxOC4xNTkuMjAxLjE3NS4xODd6bS0uMjQyLS42OTZoLTZ2LjAwNHptMC0uMTAzaC02bDExLjk3Ni41NDd6bS4xNjUtLjQ4Ny00Ljc0Mi0zLjY3Ny0uMTgyLjIzNi0uMTU5LjI1M0wuNDU4IDE3LjUyem0uMTItLjE1NSA0Ljc0MiAzLjY3Ni4wMjQtLjAzLjAyNC0uMDMyem0uOTY3LTEuMjgxLTQuNzUtMy42NjUtLjAyLjAyNS0uMDE4LjAyNXpNMTMuNjMuNDE5IDguODgtMy4yNDYgMTMuNjMuNDJ6bS4wNjgtLjA4OEw5LjQ2LTMuOTE2bC0uMjc2LjI3NC0uMjM3LjMwOCA0Ljc1IDMuNjY1em0uMzg2LS4xNnYtNmgtLjAxMXptLjc4NCAwdi02em0yLjE5NCAyLjQ2NCA1Ljk2Ni42NDEuMDM0LS4zMnYtLjMyMXptLS45MzggOC43MTYtNS45NjUtLjY0Mi0uMDEyLjExMi0uMDA4LjExM3ptMCAuMTEyIDYgLjA1NC4wMDItLjIzNi0uMDE2LS4yMzV6bS41NDcuNTV2LTZoLS4wNTV6bTcuMzcxIDAgLjYxMi01Ljk2OC0uMzA1LS4wMzFoLS4zMDd2NnptLjc0LjQtNC42NDggMy43OTQuMDQ0LjA1NC4wNDUuMDUzem0uNzI1Ljg0Ny00LjU2IDMuOTAxLjA4OS4xMDMuMDkyLjA5OXptLjA4Mi4wODggNC44NjEtMy41MTctLjIyMy0uMzA4LS4yNi0uMjc4em0tNS43ODcuNjk2di4xMDNoMTJ2LS4xMDN6bTAgLjEwM3YuMDE1aDEydi0uMDE2aC0xMnYuMDE2aDEydi0uMDE2aC0xMnptLjAyNC0uNTQ3Yy4wNy0uNzYyLjMxOC0xLjUuNzI5LTIuMTU1bDEwLjE2NSA2LjM3N2E3LjEwNSA3LjEwNSAwIDAgMCAxLjA1Ni0zLjEyOXptMS4wNy0yLjY0My0uMTIxLjE1NSA5LjQ4MyA3LjM1NC4xMi0uMTU2em0tLjE2OS4yMTgtLjk2NiAxLjI4IDkuNTc3IDcuMjMuOTY3LTEuMjh6bS0uOTMyIDEuMjM2TDcuNzM5IDI4LjA3N2w5LjUxIDcuMzE4TDI5LjMwNSAxOS43M2wtOS41MS03LjMxOHpNNy43NDMgMjguMDcxbC0uMDY3LjA4OCA5LjUwMSA3LjMzLjA2OC0uMDg4em0uNDQ2LS40OTVhNS40NTEgNS40NTEgMCAwIDEgMy44MzktMS41OTFsLjAyMyAxMmE2LjU0OSA2LjU0OSAwIDAgMCA0LjYxMy0xLjkxNEw4LjE5IDI3LjU3NnptMy44NS0xLjU5MWgtLjgyNnYxMmguODI3di0xMnptLS44MjYgMGMxLjAyNCAwIDEuOTk3LjQxIDIuNzA3IDEuMTI1bC04LjUxNyA4LjQ1NGE4LjE4NyA4LjE4NyAwIDAgMCA1LjgxIDIuNDJ2LTEyem0yLjcwNyAxLjEyNWEzLjc4IDMuNzggMCAwIDEgMS4wOTggMi42NjRoLTEyYTguMjIgOC4yMiAwIDAgMCAyLjM4NSA1Ljc5em0xLjA5OCAyLjY2NHYtLjIwNGgtMTJ2LjIwNHptMC0uMjA1di0uMDQ1aC0xMiAxMnYtLjAwNGgtMTJ2LjAwM2gxMi0xMnYuMDQ3aDEyem0tLjAzNC41OTMuOTM4LTguNzE3TDMuOTkgMjAuMTYybC0uOTM4IDguNzE3IDExLjkzMSAxLjI4M3ptLjk1OC04Ljk0YTYuODA3IDYuODA3IDAgMCAwIDAtLjk0OGwtMTEuOTcxLjgzNWE1LjE5MyA1LjE5MyAwIDAgMSAwLS43MjNsMTEuOTcuODM1em0uMDE0LS40NzdhNi41NSA2LjU1IDAgMCAwLS40OC0yLjUyMmwtMTEuMTIgNC41MTRhNS40NSA1LjQ1IDAgMCAxLS40LTIuMDk5em0tLjQ4LTIuNTIyYTYuNTQ1IDYuNTQ1IDAgMCAwLTEuNDItMi4xNDlMNS41NCAyNC41MjhhNS40NTUgNS40NTUgMCAwIDEtMS4xODItMS43OTF6bS0xLjQyLTIuMTQ5YTYuNTQgNi41NCAwIDAgMC0yLjE1LTEuNDRMNy4zMzQgMjUuNzNhNS40NTggNS40NTggMCAwIDEtMS43OTUtMS4yMDFsOC41MTctOC40NTR6bS0yLjE1LTEuNDRhNi41MzcgNi41MzcgMCAwIDAtMi41NS0uNDkybC4xMDggMTEuOTk5YTUuNDYxIDUuNDYxIDAgMCAxLTIuMTMtLjQxMnptLTIuNDk2LS40OTNIMS45MzJ2MTJIOS40MXptLTcuNDY2IDBhNS40NSA1LjQ1IDAgMCAxIDMuODQgMS41OTJsLTguNDc2IDguNDk1YTYuNTUgNi41NSAwIDAgMCA0LjYxMyAxLjkxM3ptNC4xNjMgMS45NDEtLjkyOC0xLjA4NS05LjEyMyA3Ljc5Ni45MjggMS4wODZ6TTQuOTkzIDE0Ljc5bC0uMDgyLS4wODgtOC43NTEgOC4yMTIuMDgyLjA4NyA4Ljc1LTguMjExem0uMjUxLjNhNC44NzUgNC44NzUgMCAwIDEgMS4wNSAzLjAxN2wtMTIgLjAxYTcuMTI1IDcuMTI1IDAgMCAwIDEuNTMyIDQuNDF6bTEuMDUgMy4wMjJ2LS4xMDRoLTEydi4xMDJoMTJ6bTAtLjEwM3YtLjAxNmgtMTJ2LjAxNmgxMnYtLjAxNmgtMTJ2LjAxNnptLS4wMjUuNTQ3YTQuODk1IDQuODk1IDAgMCAxLS43MjggMi4xNTVsLTEwLjE2Ni02LjM3N2E3LjEwNiA3LjEwNiAwIDAgMC0xLjA1NyAzLjEyOWwxMS45NSAxLjA5M3ptLTEuMDcgMi42NDMuMTIxLS4xNTYtOS40ODMtNy4zNTMtLjEyLjE1NXptLjE2OS0uMjE4Ljk2Ni0xLjI4LTkuNTc3LTcuMjMtLjk2NyAxLjI4em0uOTI4LTEuMjNMMTguMzgxIDQuMDgzIDguODc5LTMuMjQ2LTMuMjA1IDEyLjQybDkuNTAxIDcuMzN6TTE4LjM4MSA0LjA4NGwuMDY3LS4wODgtOS41MDEtNy4zMy0uMDY4LjA4OHptLS40NDYuNDk1YTUuNDUxIDUuNDUxIDAgMCAxLTMuODQgMS41OTFsLS4wMjItMTJBNi41NDkgNi41NDkgMCAwIDAgOS40Ni0zLjkxNnptLTMuODUgMS41OTFoLjc4MnYtMTJoLS43ODN2MTJ6bS43ODIgMGEzLjgxNCAzLjgxNCAwIDAgMS0yLjcwNi0xLjEyNWw4LjUxNi04LjQ1NGE4LjE4NiA4LjE4NiAwIDAgMC01LjgxLTIuNDJ2MTJ6bS0yLjcwNi0xLjEyNWEzLjc4IDMuNzggMCAwIDEtMS4wOTktMi42NjRoMTJhOC4yMiA4LjIyIDAgMCAwLTIuMzg1LTUuNzl6TTExLjA2MiAyLjM4di4yMDZoMTJ2LS4yMDVoLTEyem0wIC4yMDV2LjA0NWgxMi0xMnYuMDA0aDEyVjIuNjNoLTEyIDEydi0uMDQ1em0uMDM1LS41OTMtLjkzOCA4LjcxNiAxMS45MyAxLjI4NC45MzktOC43MTd6bS0uOTU4IDguOTRhNi44MDcgNi44MDcgMCAwIDAgMCAuOTQ4bDExLjk3LS44MzVjLjAxNy4yNC4wMTcuNDgyIDAgLjcyM2wtMTEuOTctLjgzNXptLS4wMTUuNDc3YTYuNTUgNi41NSAwIDAgMCAuNDgxIDIuNTIybDExLjExOS00LjUxNGE1LjQ1IDUuNDUgMCAwIDEgLjQgMi4wOTl6bS40ODEgMi41MjJjLjMyNS44LjgwNiAxLjUzIDEuNDIgMi4xNDlsOC41MTYtOC40NTRhNS40NTQgNS40NTQgMCAwIDEgMS4xODMgMS43OXptMS40MiAyLjE0OWE2LjUzOSA2LjUzOSAwIDAgMCAyLjE1IDEuNDRsNC41NzEtMTEuMDk2YTUuNDYgNS40NiAwIDAgMSAxLjc5NSAxLjIwMmwtOC41MTcgOC40NTR6bTIuMTUgMS40NGMuODA4LjMzMyAxLjY3NS41IDIuNTUuNDkybC0uMTA5LTEyYTUuNDYyIDUuNDYyIDAgMCAxIDIuMTMuNDEzem0yLjQ5NS40OTNoNy4zNzJ2LTEySDE2LjY3em02Ljc2LS4wMzJhNC45IDQuOSAwIDAgMS0zLjI5Ni0xLjc3NUwyOS40MyA4LjYyYTcuMSA3LjEgMCAwIDAtNC43NzYtMi41NzRMMjMuNDMgMTcuOTgyem0tMy4yMDctMS42NjguNzI1Ljg0NyA5LjExNy03LjgwMi0uNzI1LS44NDd6bS45MDUgMS4wNDkuMDgzLjA4OCA4Ljc1Ni04LjIwNi0uMDgyLS4wODd6bS0uNC0uNDk4YTQuODc1IDQuODc1IDAgMCAxLS45MjMtMy4wMTZsMTEuOTkzLjM5QTcuMTI2IDcuMTI2IDAgMCAwIDMwLjQ1IDkuODNsLTkuNzIzIDcuMDM0eiIgZmlsbD0idXJsKCNiKSIgbWFzaz0idXJsKCNjKSIgc3R5bGU9ImZpbGw6dXJsKCNiKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi45NTIpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMjEuNjQ2IiB5MT0iMjAuNDQ4IiB4Mj0iNi44ODYiIHkyPSI4LjA1MiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi45NTIpIj48c3RvcCBzdG9wLWNvbG9yPSIjQ0UwRjUwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkUxMTJEIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxMy4wNDgiIHkxPSIuMTciIHgyPSIxMy4wNDgiIHkyPSIzMS45ODUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkYwMDNEIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkYwMDNEIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=" />`;

export const CSS_FONTS = `@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7SUc.woff2) format('woff2');unicode-range:U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7SUc.woff2) format('woff2');unicode-range:U+1F00-1FFF}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2) format('woff2');unicode-range:U+0370-03FF}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7SUc.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2) format('woff2');unicode-range:U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7SUc.woff2) format('woff2');unicode-range:U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7SUc.woff2) format('woff2');unicode-range:U+1F00-1FFF}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2) format('woff2');unicode-range:U+0370-03FF}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7SUc.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2) format('woff2');unicode-range:U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7SUc.woff2) format('woff2');unicode-range:U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7SUc.woff2) format('woff2');unicode-range:U+1F00-1FFF}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2) format('woff2');unicode-range:U+0370-03FF}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7SUc.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2) format('woff2');unicode-range:U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/inter/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD} @font-face {font-family: 'Druk Condensed'; src: url('https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/DrukCond-SuperItalic.ttf') format('truetype'); font-weight: 700; font-style: normal; font-display: swap;} @font-face {font-family: 'Vanguard'; src: url('https://blitz-cdn-plain.blitz.gg/blitz/ui/fonts/VanguardCF-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap;}`;
