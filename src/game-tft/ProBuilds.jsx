import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";

import { Button, ButtonGroup, Card } from "clutch";

import { updateRoute } from "@/__main__/router.mjs";
import { LoadingContainer } from "@/game-lol/TierList.style.jsx";
import ProBuildsMatch from "@/game-tft/ProBuildsMatch.jsx";
import useProBuilds from "@/game-tft/use-probuilds.mjs";
import useProBuildsFilter from "@/game-tft/use-probuilds-filter.jsx";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import ProBuildsIcon from "@/inline-assets/pro-builds-icon.svg";
import Container from "@/shared/ContentContainer.jsx";
import { EmptyListProxy } from "@/shared/EmptyListProxy.jsx";
import { FlexContainer } from "@/shared/InfiniteTable.style.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useIsLoaded, useRoute } from "@/util/router-hooks.mjs";

function ProBuilds() {
  const { currentPath, searchParams, state } = useRoute();
  const { t } = useTranslation();
  const isLoaded = useIsLoaded();
  const { FilterBar, ...filters } = useProBuildsFilter();
  const matches = useProBuilds({ filters });
  const handleLoadMore = useCallback(
    () =>
      updateRoute(currentPath, searchParams, {
        offset: (state?.offset ?? 0) + 20,
      }),
    [currentPath, searchParams, state?.offset]
  );
  const TableView = useMemo(() => {
    if (!isLoaded && !matches.length) return null;
    if (matches.length)
      return (
        <>
          {matches.map(({ game, summoner, player }, idx) => (
            <ProBuildsMatch
              key={idx}
              summoner={summoner}
              player={player}
              game={game}
            />
          ))}
          <ButtonGroup block>
            <Button onClick={handleLoadMore}>{t("common:more", "More")}</Button>
          </ButtonGroup>
        </>
      );
    return (
      <EmptyListProxy
        text={t("tft:noDataFound", "No games played of this game type.")}
        subtext={t("lol:anotherFilter", "Try another filter.")}
      />
    );
  }, [handleLoadMore, isLoaded, matches, t]);
  return (
    <>
      <PageHeader
        title={t("lol:proBuilds", "Pro builds")}
        icon={<ProBuildsIcon />}
      />
      <Container
        className={css`
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        `}
      >
        <Card
          className={css`
            padding: 0 !important;
          `}
        >
          {FilterBar}
        </Card>
        <FlexContainer opacity={isLoaded ? 1 : 0.5}>
          <Card>
            <ol>{TableView}</ol>
          </Card>
        </FlexContainer>
        {!isLoaded && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}
      </Container>
    </>
  );
}

export function meta() {
  return {
    title: [
      "tft:helmet.probuilds.title",
      "TFT Probuilds, Best Comps, Pros, Profiles, Tier List – Blitz TFT",
    ],
    description: [
      "tft:helmet.probuilds.description",
      "TFT Probuilds, Profiles, Stats, Leaderboards, Ranking, TFT Databases, CheatSheet, Synergies, Builder, Guide, Items, Champion Stats for Teamfight Tactics.",
    ],
  };
}

export default ProBuilds;
