import { useEffect, useRef, useState } from "react";

import router, {
  EVENT_CHANGE_ROUTE,
  EVENT_CHANGE_ROUTE_COMPONENT,
  EVENT_LOADED_DATA,
  EVENT_LOADING_DATA,
} from "@/__main__/router.mjs";

export function useRouteComponent() {
  const [rc, setRc] = useState(router.RouteComponent);

  useEffect(() => {
    function changeListener(newRC) {
      setRc(newRC);
    }
    router.events.on(EVENT_CHANGE_ROUTE_COMPONENT, changeListener);
    return () => {
      router.events.off(EVENT_CHANGE_ROUTE_COMPONENT, changeListener);
    };
  }, []);

  return rc;
}

/**
 * This accepts an optional `compareFn` mainly used to suppress
 * updates to prevent unnecessary re-renders.
 */
export function useRoute(compareFn) {
  const [currentRoute, setCurrentRoute] = useState(router.route);
  const mountedRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    function changeListener(newRoute) {
      setTimeout(() => {
        // This should not run on an unmounted component.
        if (!mountedRef.current) return;
        let shouldUpdate = true;
        if (compareFn) {
          shouldUpdate = !compareFn(router.previousRoute, newRoute);
        }
        if (shouldUpdate) {
          setCurrentRoute(newRoute);
        }
      }, 0);
    }

    router.events.on(EVENT_CHANGE_ROUTE, changeListener);

    return () => {
      mountedRef.current = false;
      router.events.off(EVENT_CHANGE_ROUTE, changeListener);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return currentRoute;
}

// This is a version of useRoute that doesn't trigger re-render.
const transientRoute = {};
export function useTransientRoute() {
  Object.assign(transientRoute, router.route);
  return transientRoute;
}

export function useIsLoaded() {
  const [isLoaded, setIsLoaded] = useState(router.isLoaded);

  useEffect(() => {
    // Edge case for initialization.
    setIsLoaded(router.isLoaded);

    function onLoadingData() {
      setIsLoaded(false);
    }

    function onLoadedData() {
      setIsLoaded(router.error ?? true);
    }

    router.events.on(EVENT_LOADING_DATA, onLoadingData);
    router.events.on(EVENT_LOADED_DATA, onLoadedData);

    return () => {
      router.events.off(EVENT_LOADING_DATA, onLoadingData);
      router.events.off(EVENT_LOADED_DATA, onLoadedData);
    };
  }, []);

  return isLoaded;
}
