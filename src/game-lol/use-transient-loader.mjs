import router, { EVENT_LOADING_DATA } from "@/__main__/router.mjs";
import { getSearchParamsForChampions } from "@/game-lol/util.mjs";
import { useIsLoaded, useTransientRoute } from "@/util/router-hooks.mjs";

// Story. For better UI experience, we need to set the table opacity 0.5 while loading.
// We are using searchParams to get the table data.
// But once start loading, searchParams is changed so it's hart to keep the table contents while loading.
// To keep the table data while loading, I used previous Search Params with last event
// We have Loading, RouteChange, Loaded events
// So if last event is not Loading event, then use previous Search Params.
// Otherwise, use current Search Params.
// Following codes are for keeping table content while loading

function useTransientLoader(filters, isSynergies) {
  const { lastEvent } = router;
  const isLoaded = useIsLoaded();
  const { path: curPath, searchParams: curSearchParams } = useTransientRoute();
  const previousRoute = router.previousRoute;
  const { path: prevPath, searchParams: prevSearchParams } =
    previousRoute || {};

  let searchParams = curSearchParams;

  if (!isLoaded) {
    if (curPath === prevPath) {
      if (lastEvent && lastEvent !== EVENT_LOADING_DATA) {
        searchParams = prevSearchParams;
      }
    }
  }

  // if searchParams is empty, then set the searchParams from filter
  if (!searchParams || searchParams.toString() === "") {
    searchParams = getSearchParamsForChampions(isSynergies, filters);
  }

  return {
    isLoaded,
    searchParams,
  };
}

export default useTransientLoader;
