import React, { createRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { updateRoute } from "@/__main__/router.mjs";
import Account from "@/inline-assets/account.svg";
import ExclamationIcon from "@/inline-assets/exclamation-mark.svg";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import Match from "@/shared/Match.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import {
  MatchesNotFoundContainer,
  MatchListEmptyContainer,
  MatchTileContainer,
  ProfileContainer,
  StatLine,
  StatsArea,
} from "@/shared/Profile.style.jsx";
import debounce from "@/util/debounce.mjs";
import { useTransientRoute } from "@/util/router-hooks.mjs";

const MatchListLoading = () => {
  return (
    <MatchListEmptyContainer>
      <LoadingSpinner />
    </MatchListEmptyContainer>
  );
};

const MatchListError = () => {
  return (
    <MatchListEmptyContainer>
      <ExclamationIcon width={40} height={40} />
    </MatchListEmptyContainer>
  );
};

export function MatchList({ children, matchList }) {
  const matchListError = matchList instanceof Error ? matchList : null;
  const isLoading = !matchList;

  return (
    <>
      {isLoading ? (
        <MatchListLoading />
      ) : matchListError ? (
        <MatchListError />
      ) : (
        children
      )}
    </>
  );
}

const debouncedUpdateRoute = debounce((pathname, searchParams, state) => {
  updateRoute(pathname, searchParams, state);
}, 16); // 60hz

export const MatchTileWrapper = React.forwardRef(
  ({ match, matchRoute, children, height }, ref) => (
    <div ref={ref}>
      <MatchTileContainer $height={height}>
        <Match match={match} matchRoute={matchRoute}>
          {children}
        </Match>
      </MatchTileContainer>
    </div>
  )
);
MatchTileWrapper.displayName = "MatchTileWrapper";

export const MatchTile = React.memo(
  function MatchTile({ children, height, id, match, matchRoute }) {
    const elementRef = useMemo(() => createRef(), []);
    const route = useTransientRoute();

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry], observer) => {
          if (!elementRef.current) {
            observer.disconnect();
            return;
          }

          if (!route.visibleMatches) route.visibleMatches = {};
          route.visibleMatches[id] = entry.isIntersecting;
          debouncedUpdateRoute(route.currentPath, route.searchParams, {
            visibleMatches: route.visibleMatches,
            softUpdate: true,
          });
        },
        {
          threshold: 0.01,
        }
      );
      observer.observe(elementRef.current);

      return () => {
        observer.disconnect();
      };
    }, [id, route, elementRef]);

    return (
      <MatchTileWrapper
        ref={elementRef}
        height={height}
        match={match}
        matchRoute={matchRoute}
      >
        {children}
      </MatchTileWrapper>
    );
  },
  (prev, next) => {
    // Advanced optimization: don't try this at home, kids!
    // We are deliberately skipping `props.children`, assuming that
    // there's no conditional logic that would cause re-render here.
    for (const key in prev) {
      if (key === "children") continue;
      if (prev[key] !== next[key]) return false;
    }
    return true;
  }
);

export function UnknownPlayerHeader() {
  const { t } = useTranslation();
  return (
    <PageHeader
      icon={<Account />}
      title={t("common:error.generalAppError.title", "Oops")}
      style={{ gridArea: "header" }}
    />
  );
}

export function MatchesNotFound() {
  const { t } = useTranslation();
  const errorDescription = t("common:noMatchesFound", "No matches found");
  return (
    <MatchesNotFoundContainer>
      <ErrorComponent description={errorDescription} />
    </MatchesNotFoundContainer>
  );
}

export function ProfileStats({ stats }) {
  return (
    <StatsArea>
      {stats?.map((stat) => {
        const { title, value } = stat;
        return (
          <StatLine key={title}>
            <p className="stat-name type-caption">{title}</p>
            <p className="type-subtitle2">{value}</p>
          </StatLine>
        );
      })}
    </StatsArea>
  );
}

function Profile({ children }) {
  return <ProfileContainer>{children}</ProfileContainer>;
}

export default Profile;
