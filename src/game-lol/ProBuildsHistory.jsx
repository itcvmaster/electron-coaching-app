import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card, Select } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import router, { setRoute } from "@/__main__/router.mjs";
import { FILTER_SYMBOLS, ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import ProMatchesList from "@/game-lol/ProMatchesList.jsx";
import Static from "@/game-lol/static.mjs";
import { getDefaultedFiltersForProBuilds } from "@/game-lol/util.mjs";
import ExclamationIcon from "@/inline-assets/exclamation-mark.svg";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import parseSearchParams from "@/util/parse-search-params.mjs";
import { useIsLoaded, useTransientRoute } from "@/util/router-hooks.mjs";

export const PlaceholderContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(var(--sp-22) * 3);

  svg {
    width: 7rem;
    height: 7rem;
  }
`;

const navigateToRoute = (urlParams) => {
  const path = router?.route?.currentPath;
  setRoute(path, urlParams);
};

const History = () => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const { searchParams } = useTransientRoute();
  const isLoaded = useIsLoaded();
  const defaultFilter = getDefaultedFiltersForProBuilds(searchParams);

  const filter = useMemo(() => {
    return {
      role: defaultFilter.role,
      team: defaultFilter.team,
    };
  }, [defaultFilter]);

  const doFilter = useCallback((filterParams) => {
    if (!filterParams.role) delete filterParams.role;
    if (!filterParams.team) delete filterParams.team;
    const urlParams = parseSearchParams(filterParams);
    navigateToRoute(urlParams);
  }, []);

  const setFilter = useCallback(
    (key, val) => {
      switch (key) {
        case FILTER_SYMBOLS.role:
          doFilter({ ...filter, role: val });
          break;
        case FILTER_SYMBOLS.team:
          doFilter({ ...filter, team: val });
          break;
      }
    },
    [filter, doFilter]
  );

  const {
    lol: { proBuildTeams, proBuildMatchlist: matchlist },
  } = state;

  const hasError = isLoaded instanceof Error;
  if (!isLoaded || hasError) {
    return (
      <Card>
        <PlaceholderContainer>
          {hasError ? <ExclamationIcon /> : <LoadingSpinner />}
        </PlaceholderContainer>
      </Card>
    );
  }

  const filteredTeams = proBuildTeams.filter((team) => {
    return team.region && team.players?.length >= 5;
  });

  const roles = Object.getOwnPropertySymbols(ROLE_SYMBOL_TO_STR).map((key) => {
    const roleData = ROLE_SYMBOL_TO_STR[key];
    const Icon = getRoleIcon(roleData.key);

    return {
      value: roleData.gql,
      text: t(roleData.t.name, roleData.t.fallback),
      icon: Icon && <Icon />,
    };
  });

  const teams = [
    {
      id: null,
      name: "Teams",
      pictureUrl: null,
    },
    ...filteredTeams,
  ].map((team) => ({
    value: team.id,
    text: team.name,
    image: team.pictureUrl && Static.getProTeamIamge(team.pictureUrl),
  }));

  return (
    <Card className="flex column gap-sp-2">
      <div className="flex wrap gap-sp-2">
        <Select
          selected={filter.role}
          options={roles}
          onChange={(val) => setFilter(FILTER_SYMBOLS.role, val)}
        />
        {teams.length ? (
          <Select
            selected={filter.team}
            options={teams}
            onChange={(val) => setFilter(FILTER_SYMBOLS.team, val)}
          />
        ) : null}
      </div>
      <ProMatchesList matches={matchlist} />
    </Card>
  );
};

export default History;
