import router, { MissingComponent } from "@/__main__/router.mjs";
import { appRoutes } from "@/routes/routes.mjs";
import { findGameSymbol } from "@/util/game-route.mjs";
import { useRouteComponent } from "@/util/router-hooks.mjs";

export function findAppRoute() {
  return appRoutes.find(({ path }) => {
    return path === router.route?.path;
  });
}

/**
 * This centralizes where the logic is for showing the app navigation. For
 * marketing routes, we don't want to show app nav, for in-app or game routes,
 * we should show navigation.
 */
export function useShouldShowAppNavigation() {
  const gameSymbol = findGameSymbol();
  const appRoute = findAppRoute();
  const RouteComponent = useRouteComponent();
  return Boolean(
    (gameSymbol || appRoute) && RouteComponent !== MissingComponent
  );
}
