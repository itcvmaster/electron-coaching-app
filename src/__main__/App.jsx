import "@/i18n/i18n.mjs";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { setup } from "goober";
import { prefix } from "goober/prefixer";
import EventEmitter from "event-lite";
import { useSnapshot } from "valtio";

import {
  Container,
  Content,
  ContentBody,
  RouteWrapper,
} from "@/__main__/App.style.jsx";
import { readState } from "@/__main__/app-state.mjs";
import router, {
  initializeRoute,
  listenRouterEvents,
  unlistenRouterEvents,
} from "@/__main__/router.mjs";
import AppNavigation from "@/app/AppNavigation.jsx";
import ContentHeader from "@/app/ContentHeader.jsx";
import ErrorBoundary from "@/app/ErrorBoundary.jsx";
import GlobalStyles from "@/app/global-styles.mjs";
import GlobalNetworkActivity from "@/app/GlobalNetworkActivity.jsx";
import GlobalSearchBox from "@/app/GlobalSearchBox.jsx";
import PageBackdrop from "@/app/PageBackdrop.jsx";
import WindowControls from "@/app/WindowControls.jsx";
import { defaultRoute } from "@/routes/routes.mjs";
import { registerSettingsSubscriptions } from "@/settings/subscriptions.mjs";
import { useShouldShowAppNavigation } from "@/util/app-route.mjs";
import { appContainer, hasMarkup } from "@/util/constants.mjs";
import { devDebug, devError, devRefs, IS_NODE_HEADLESS } from "@/util/dev.mjs";
import { CONTAINER_ID, OBSERVE_CLASS } from "@/util/exit-transitions.mjs";
import {
  observe as observeFallbackImg,
  unobserve as unobserveFallbackImg,
} from "@/util/fallback-img.mjs";
import {
  EVENT_GAME_CHANGE,
  findGameSymbol,
  gameRouteEvents,
} from "@/util/game-route.mjs";
import moduleRefs from "@/util/module-refs.mjs";
import {
  observe as observeLinks,
  unobserve as unobserveLinks,
} from "@/util/process-links.mjs";
import { useRouteComponent } from "@/util/router-hooks.mjs";
import makeStrictKeysObject from "@/util/strict-keys-object.mjs";
import { attachListeners, removeListeners } from "@/util/tooltip.mjs";
import useThemeStyle from "@/util/use-theme-style.mjs";

// This seems to be required by goober.
setup(React.createElement, prefix, undefined, (props) => {
  // Props prefixed with "$" will be passed to the styled component but removed
  // before being passed to the DOM element.
  // https://stackoverflow.com/a/66170576
  for (const prop in props) {
    if (!prop.startsWith("$")) continue;
    delete props[prop];
  }
});

// Needed since React v18 doesn't return anything from root.render.
const appEvents = new EventEmitter();
const EVENT_APP_RENDER = "EVENT_APP_RENDER";

export const refs = makeStrictKeysObject({
  // This is primarily used as an entry point for ads to shift the layout.
  ContentWrapper: ({ children }) => children,
  HeaderWrapper: ({ children }) => children,
  NavigationWrapper: ({ children }) => children,
  floatingElements: [],
  forceRender: () => null,
});

devRefs.appRefs = refs;

const ShowRoute = ({ renderValue, isStandalone }) => {
  const RouteComponent = useRouteComponent();
  const gameSymbol = findGameSymbol();
  const { ContentWrapper, HeaderWrapper, floatingElements } = refs;

  useEffect(() => {
    gameRouteEvents.emit(EVENT_GAME_CHANGE, gameSymbol);
  }, [RouteComponent]); // eslint-disable-line react-hooks/exhaustive-deps

  const randomKey = useMemo(() => {
    return `${(Math.random() * Number.MAX_SAFE_INTEGER) >>> 0}`;
  }, [RouteComponent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check the type of the RouteComponent. If it is a DOM node,
  // wrap it in a container.
  let routeContainer;
  const containerRef = useRef();
  if (RouteComponent.nodeType) {
    routeContainer = <div ref={containerRef} />;
  } else {
    routeContainer = <RouteComponent />;
  }

  useLayoutEffect(() => {
    if (RouteComponent.nodeType) {
      containerRef.current?.appendChild(RouteComponent);
    }
  }, [RouteComponent]); // eslint-disable-line react-hooks/exhaustive-deps

  // This wrapper is used for implementing custom exit transitions.
  // See `exit-transitions.mjs`.
  const WrapperComponent = useMemo(() => {
    const Wrapper = () => [
      <RouteWrapper key={randomKey} className={OBSERVE_CLASS}>
        <ContentWrapper>{routeContainer}</ContentWrapper>
      </RouteWrapper>,
    ];
    return Wrapper;
  }, [randomKey, renderValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const shouldShowWrapper = useShouldShowAppNavigation();

  return (
    <Content>
      <PageBackdrop />
      {!isStandalone ? (
        <HeaderWrapper>
          <ContentHeader />
        </HeaderWrapper>
      ) : null}
      <ContentBody
        id={CONTAINER_ID}
        $isStandalone={isStandalone}
        $shouldShowWrapper={shouldShowWrapper}
      >
        <ErrorBoundary routeComponent={RouteComponent}>
          {shouldShowWrapper ? <WrapperComponent /> : routeContainer}
        </ErrorBoundary>
      </ContentBody>
      {floatingElements.map((element) => {
        return (
          <React.Fragment key={element.type.name}>{element}</React.Fragment>
        );
      })}
    </Content>
  );
};

const App = ({ isStandalone }) => {
  useThemeStyle();
  const { NavigationWrapper } = refs;
  const [renderValue, forceRender] = useState();
  refs.forceRender = useCallback(() => {
    const t0 = Date.now();
    forceRender(t0);
    devDebug(`re-render took ${Date.now() - t0}ms`);
  }, []);
  const {
    settings: { disableAnimations },
  } = useSnapshot(readState);

  const showRoute = (
    <ShowRoute renderValue={renderValue} isStandalone={isStandalone} />
  );

  useLayoutEffect(() => {
    appEvents.emit(EVENT_APP_RENDER);
  }, []);

  // TODO: Turn on React.StrictMode
  // The only reason why it's disabled is because of one (1) dependency
  // @headless/react breaks in React 18 w/ strict mode
  // https://github.com/tailwindlabs/headlessui/issues/681
  return (
    <div className={`${disableAnimations ? "disable-animations" : ""}`}>
      <GlobalStyles />
      <GlobalNetworkActivity />
      {isStandalone ? (
        showRoute
      ) : (
        <>
          <Container>
            <NavigationWrapper>
              <AppNavigation />
            </NavigationWrapper>
            <GlobalSearchBox />
            {showRoute}
          </Container>
          <WindowControls />
        </>
      )}
    </div>
  );
};

export const appInstance = <App />;

export async function mountApp(
  app = appInstance,
  container = appContainer,
  pathname,
  search,
  state
) {
  const didRender = new Promise((resolve) => {
    appEvents.once(EVENT_APP_RENDER, resolve);
  });
  const initialRoutePromise = initializeRoute(pathname, search, state);
  moduleRefs.appInit = initialRoutePromise;

  try {
    await initialRoutePromise;
  } catch (error) {
    devError("MOUNT ERROR", error);
    if (IS_NODE_HEADLESS) throw error;
  }

  observeFallbackImg(container);
  observeLinks(container);
  attachListeners(container);
  listenRouterEvents(container);

  registerSettingsSubscriptions(readState);

  if (hasMarkup) {
    hydrateRoot(container, app, {
      onRecoverableError(error) {
        devError("HYDRATE ERROR", error);
      },
    });
  } else {
    createRoot(container).render(app);
  }

  // This is needed because root.render is async and doesn't return anything...
  await didRender;

  // Finally call default fetchData after rendering.
  // This is to guarantee that the client doesn't hydrate w/ local data.
  if (hasMarkup) {
    const { route } = router;
    const { parameters, searchParams, state } = route;
    await defaultRoute.fetchData.call(route, parameters, searchParams, state);
  }
}

export function unmountApp(container) {
  unobserveFallbackImg();
  unobserveLinks();
  removeListeners(container);
  unlistenRouterEvents(container);
}

export default App;
