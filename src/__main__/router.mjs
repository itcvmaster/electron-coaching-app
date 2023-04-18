import EventEmitter from "event-lite";
import i18n from "i18next";

import {
  MAX_RECENT_PATHS,
  recentlyPersistedPaths,
} from "@/__main__/app-state.mjs";
import { featurePromises } from "@/__main__/feature-flags.mjs";
import { JS_FILE_EXTENSION } from "@/app/constants.mjs";
import MissingComponent from "@/app/Missing.jsx";
import i18nInit from "@/i18n/i18n.mjs";
import { isCatchAll } from "@/routes/constants.mjs";
import routes, { defaultRoute } from "@/routes/routes.mjs";
import { hasMarkup } from "@/util/constants.mjs";
import { NotFoundError } from "@/util/custom-errors.mjs";
import { devError, devWarn, IS_NODE, IS_NODE_HEADLESS } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import hookFetch from "@/util/hook-fetch.mjs";
import importBasePath from "@/util/import-base-path.mjs";
import InitialComponent from "@/util/InitialComponent.jsx";
import moduleRefs from "@/util/module-refs.mjs";
import scrollOnRouteChange from "@/util/scroll-route.mjs";
import {
  CONFIG,
  emitter as stateEmitter,
  EVENT_ADD_KEY,
  MAX_LENGTH,
} from "@/util/state-cleanup.mjs";

export { MissingComponent, NotFoundError };

// things to test:
// - guaranteed ordering of route transitions (no race conditions on loading)
// - events are emitted and handled

const APP_ROUTE_REGEXP = /^\/app\/([^/]*)(.*)/;

// Check if the initial pathname matches app.
const initialPathMatch = globals.location?.pathname?.match(APP_ROUTE_REGEXP);
export const APP_ROUTE_VERSION = initialPathMatch ? initialPathMatch[1] : null;
export const IS_APP_ROUTE = Boolean(initialPathMatch);

export const EVENT_CHANGE_ROUTE = "EVENT_CHANGE_ROUTE";
export const EVENT_CHANGE_ROUTE_COMPONENT = "EVENT_CHANGE_ROUTE_COMPONENT";
export const EVENT_LOADING_DATA = "EVENT_LOADING_DATA";
export const EVENT_LOADED_DATA = "EVENT_LOADED_DATA";

export const pathsWritten = [];

function defaultMeta() {
  return {
    title: ["common:blitz", "Blitz"],
    description: ["home:downloadLanding.description", "Play smart."],
  };
}

function missingMeta() {
  return {
    title: ["common:missing", "Page missing"],
    description: ["common:error.generalAppError.title", "Oops"],
  };
}

export const routesRef = { routes };
const componentCache = {};
const WrappedComponentMap = new WeakMap();

const router = {
  error: null,
  isLoaded: false,
  isBackwards: false,
  route: null,
  previousRoute: null,
  RouteComponent: () => InitialComponent,
  meta: defaultMeta,
  events: new EventEmitter(),
  lastEvent: null,
  refetchData() {},
};

function emitEvent(evt) {
  router.lastEvent = evt;
  router.events.emit(...arguments);
}

export function listenRouterEvents(rootNode = globals.document?.body) {
  globals.addEventListener("popstate", onPopstate);
  rootNode?.addEventListener("click", clickHandler);
}

export function unlistenRouterEvents(rootNode = globals.document?.body) {
  globals.removeEventListener("popstate", onPopstate);
  rootNode?.removeEventListener("click", clickHandler);
}

async function onPopstate() {
  const {
    location: { pathname, search },
  } = globals;
  try {
    await __setRoute(pathname, search);
  } catch (error) {
    devError("AUTOMATED SET ROUTE FAILED", error);
  }
}

async function clickHandler(event) {
  const { target } = event;
  const a = target.closest("a");
  if (!a) return;
  const { href } = a;
  const url = new URL(href);
  const { origin, pathname, search } = url;

  // differentiate app links from external links
  if (origin !== globals.location.origin) return;

  event.preventDefault();

  // ignore if same route
  if (url.href === globals.location.href) return;

  globals.history.pushState({}, "", href);
  try {
    await __setRoute(pathname, search);
  } catch (error) {
    devError("USER-INITIATED SET ROUTE FAILED", error);
  }
}

const noop = () => {};

function rewriteAppRoute(pathname) {
  return `/app/${APP_ROUTE_VERSION}${pathname}`;
}

// This is the external function which will call the history API.
export async function setRoute(
  pathname,
  search = "",
  state,
  // The only reason to suppress the warning is if we expect that
  // a route transition can happen during another route transition.
  suppressWarning = false
) {
  await moduleRefs.appInit;
  if (IS_APP_ROUTE) {
    pathname = rewriteAppRoute(pathname);
  }
  const query = `${search.toString() ? "?" : ""}${search}`;
  const lPathname = globals.location?.pathname;
  const lSearch = globals.location?.search;
  if (!IS_NODE_HEADLESS && (pathname !== lPathname || lSearch !== query)) {
    globals.history.pushState(state, "", `${pathname}${query}`);
  }
  if (!router.isLoaded && !suppressWarning) {
    devWarn(
      `A route transition has been initiated while the previous route was ` +
        `still loading. If this happened because a network request took too long, ` +
        `it is safe to ignore this warning. However, if this is 100% reproducible, ` +
        `this is indicative of an anti-pattern where React components change ` +
        `the route after fetching data, which is the wrong thing to do! The ` +
        `correct way is to set the route to fetch new data, instead of the reverse.`
    );
  }
  return __setRoute(...arguments);
}

export async function updateRoute(pathname, search = "", state) {
  if (!state) state = {};
  state.isUpdate = true;

  if (!state.isRedirect) {
    await moduleRefs.appInit;
  }

  if (IS_APP_ROUTE) {
    pathname = rewriteAppRoute(pathname);
  }
  const query = `${search.toString() ? "?" : ""}${search}`;
  if (!IS_NODE_HEADLESS) {
    globals.history.replaceState(state, "", `${pathname}${query}`);
  }
  return __setRoute(pathname, search, state);
}

const specialRouteMapping = {
  // Default route should be zero length.
  "/.*/": "",
};

export function matchRoutes(pathname) {
  const matches = routesRef.routes
    .map((route) => {
      const { path } = route;
      if (typeof path === "string")
        return path === pathname
          ? {
              ...route,
              parameters: [],
            }
          : false;

      if (path instanceof RegExp) {
        const match = pathname.match(path);
        if (!match) return false;
        return {
          ...route,
          // Omit the 0 index which is just the string itself.
          parameters: match
            .slice(1)
            .filter((_) => _ && !_.startsWith("/"))
            .map((_) => decodeURIComponent(_)),
        };
      }

      return false;
    })
    .filter(Boolean);

  // Sort by longest matched route (more specific) first.
  matches.sort((a, b) => {
    let a1 = a.path.toString();
    let b1 = b.path.toString();
    if (specialRouteMapping.hasOwnProperty(a1)) a1 = specialRouteMapping[a1];
    if (specialRouteMapping.hasOwnProperty(b1)) b1 = specialRouteMapping[b1];

    let aPriority = a1.length;
    let bPriority = b1.length;

    // Catch-all routes should always be last.
    if (a[isCatchAll]) aPriority -= 1000;
    if (b[isCatchAll]) bPriority -= 1000;

    return bPriority - aPriority;
  });

  return matches;
}

function setMissingComponent() {
  router.RouteComponent = () => MissingComponent;
  emitEvent(EVENT_CHANGE_ROUTE_COMPONENT, router.RouteComponent);
  emitEvent(EVENT_CHANGE_ROUTE, router.route);
}

let countKeys = 0;
let seenKeys = {};

// We need to dynamically resize the MAX_LENGTH based on the number of keys populated
// from a single route. This prevents accidental errors from occuring when keys
// get deleted unexpectedly.
stateEmitter.on(EVENT_ADD_KEY, (key) => {
  if (seenKeys[key]) return;
  seenKeys[key] = true;
  countKeys++;
  if (countKeys > MAX_LENGTH) {
    CONFIG.MAX_LENGTH = countKeys;
  }
});

async function __setRoute(pathname, search = "", state) {
  // Normalize /app/ routes.
  const appMatch = pathname.match(APP_ROUTE_REGEXP);
  if (appMatch) pathname = appMatch[2] || "/";

  const matches = matchRoutes(pathname);

  const fetchDataFunctions = matches.map((route) => {
    // Handle special case.
    if (
      state?.isInitializing &&
      route.fetchData === defaultRoute.fetchData &&
      hasMarkup
    )
      return noop;

    return route.fetchData || noop;
  });

  // Less specific to more specific order.
  fetchDataFunctions.reverse();

  // `decodeURIComponent` is needed here because there is a platform difference
  // between Electron and browsers. Electron seems to call this internally while
  // Node.js and browsers do not.
  const getPathname = () =>
    !IS_NODE_HEADLESS
      ? decodeURIComponent(globals.location.pathname)
      : pathname;

  const prevPathname = getPathname();
  const t0 = Date.now();
  const searchParams =
    typeof search === "string" ? new URLSearchParams(search) : search;

  let route = matches[0];
  // Handle redirect route.
  if (route.redirect) {
    if (IS_NODE_HEADLESS) {
      const error = new Error(`Redirect! ${route.redirect}`);
      error.statusCode = 303;
      error.redirect = route.redirect;
      throw error;
    }

    // This is used to whitelist redirects.
    if (!state) state = {};
    state.isRedirect = true;

    return updateRoute(route.redirect, search, state);
  }

  // Handle 404 by showing 404 component and bailing out.
  if (!route || route[isCatchAll]) {
    route = {
      path: pathname,
      currentPath: decodeURIComponent(pathname),
      state,
      searchParams,
      parameters: [],
    };
    router.route = route;
    router.meta = missingMeta.bind(null, route.parameters, searchParams);
    extractMeta();

    setMissingComponent();

    throw new NotFoundError(`Route not found! ${pathname}`);
  }

  route.currentPath = decodeURIComponent(pathname);
  route.state = state;
  // Attach search params to current route.
  route.searchParams = searchParams;

  router.isBackwards = router.previousRoute?.currentPath === route.currentPath;

  // Start loading data, don't have to wait for the module :)
  router.isLoaded = false;
  // Execute fetch functions serially.
  let dataError = null;
  const fetchAllData = () =>
    fetchDataFunctions
      .reduce((chain, fn) => {
        return chain.then(async () => {
          try {
            await fn.call(route, route.parameters, searchParams, state);
          } catch (error) {
            if (error instanceof NotFoundError) {
              setMissingComponent();
            }
            devError("ROUTE FETCH FAILED", error);
            throw error;
          }
        });
      }, Promise.resolve())
      .catch((error) => {
        dataError = error;
      });

  // This can be used to re-fetch data for the current route.
  router.refetchData = fetchAllData;

  if (router.route && router.route?.currentPath !== route.currentPath) {
    countKeys = 0;
    seenKeys = {};
    CONFIG.MAX_LENGTH = MAX_LENGTH;
  }

  const dataPromise = fetchAllData();

  emitEvent(EVENT_LOADING_DATA);
  const initialPathsWritten = recentlyPersistedPaths.length;

  let DefaultComponent = null;
  let meta = null;

  const firstRouteWithComponent = matches.find((_) => {
    return _.component;
  });
  if (firstRouteWithComponent) {
    let mod;
    const { component } = firstRouteWithComponent;

    switch (typeof component) {
      case "string": {
        mod = componentCache[component];
        if (!mod) {
          const modulePath = `${importBasePath(
            import.meta.url
          )}src/${component.replace(/\.jsx$/, JS_FILE_EXTENSION)}`;

          // Hook for fetch is called here so that we can show loading state for
          // importing route component.
          hookFetch(modulePath);

          mod = componentCache[component] = await import(modulePath);
        }
        break;
      }
      case "object": {
        mod = component;
        break;
      }
      default:
        throw new Error(`Invalid component definition: ${component}`);
    }

    ({ default: DefaultComponent, meta } = mod);
  }

  if (!meta) {
    meta = defaultMeta;
    if (firstRouteWithComponent) {
      const name =
        typeof firstRouteWithComponent.component === "object"
          ? firstRouteWithComponent.component.default?.name
          : firstRouteWithComponent.component;
      devWarn(
        `Missing meta function for "${name}" component! ` +
          `Meta strings are important for search engine indexing and setting the globals title.`
      );
    }
  }

  // ensure latest route before proceeding, because after this point, it sets
  // the actual route.
  const currPathname = getPathname();
  if (currPathname !== prevPathname || route.searchParams !== searchParams) {
    devWarn(
      `Route changed while loading module! (${Date.now() - t0}ms)
- Current  : ${currPathname}
- Previous : ${prevPathname}`
    );
    return null;
  }

  router.previousRoute = router.route;
  router.route = route;

  const previousRouteComponent = router.RouteComponent;
  if (DefaultComponent) {
    if (!WrappedComponentMap.has(DefaultComponent)) {
      WrappedComponentMap.set(DefaultComponent, () => DefaultComponent);
    }
    router.RouteComponent = WrappedComponentMap.get(DefaultComponent);
  }

  emitEvent(EVENT_CHANGE_ROUTE, route);
  if (previousRouteComponent !== router.RouteComponent) {
    emitEvent(EVENT_CHANGE_ROUTE_COMPONENT, router.RouteComponent);
  }

  // This should run unconditionally, even if there was an error in
  // dataPromise, because we want to set the loading state regardless
  // of error.
  await dataPromise;

  // Curry the `meta` function to accept the same parameters as `fetchData`.
  router.meta = meta.bind(null, route.parameters, searchParams);

  extractMeta();

  router.error = dataError;
  router.isLoaded = true;
  emitEvent(EVENT_LOADED_DATA);

  pathsWritten.push([
    pathname,
    recentlyPersistedPaths.length - initialPathsWritten,
  ]);
  delete pathsWritten[pathsWritten.length - MAX_RECENT_PATHS - 1];

  if (dataError) return Promise.reject(dataError);
}

/**
 * This function extracts meta for the current route. The return value is used
 * only for SSR, otherwise it will set meta-info on the current document.
 */
export async function extractMeta() {
  await i18nInit;

  const { title: rawTitle, description: rawDescription } = await router.meta();

  // Enforce i18n
  const title = i18n.t(...rawTitle) || rawTitle[1];
  const description = i18n.t(...rawDescription) || rawDescription[1];

  if (!IS_NODE_HEADLESS) {
    // CSR mode, need to set the document title.
    globals.document.title = title;
  }

  // SSR mode, building the string.
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
  `;
}

export const initializeRoute = async (pathname, search, state) => {
  if (!state) state = {};
  state.isInitializing = true;

  await Promise.all(Object.values(featurePromises));
  if (IS_NODE) return;
  await new Promise((resolve, reject) => {
    // If there is no SSR'd page, then render immediately. If there is SSR content,
    // then render later.
    const eventName = hasMarkup ? EVENT_LOADED_DATA : EVENT_CHANGE_ROUTE;
    router.events.once(eventName, () => {
      resolve();
    });

    const lPathname = globals.location?.pathname;
    const lSearch = globals.location?.search;

    // We want to trigger a side effect (event) here.
    __setRoute(pathname ?? lPathname, search ?? lSearch, state).catch(
      (error) => {
        devError("INITIAL SET ROUTE FAILED", error);
        return reject(error);
      }
    );
  });
};

if (!IS_NODE_HEADLESS) {
  scrollOnRouteChange(router, EVENT_CHANGE_ROUTE);
}

globals.__BLITZ_DEV__.router = router;
globals.__BLITZ_DEV__.setRoute = setRoute;

export default router;
