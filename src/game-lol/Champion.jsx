import React, { useEffect, useMemo } from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { updateCurrentPatchAction } from "@/game-lol/actions.mjs";
import ChampionHeader from "@/game-lol/ChampionHeader.jsx";
import ChampionMatchups from "@/game-lol/ChampionMatchups.jsx";
import ChampionOverview from "@/game-lol/ChampionOverview.jsx";
import ChampionProbuilds from "@/game-lol/ChampionProbuilds.jsx";
import ChampionTrends from "@/game-lol/ChampionTrends.jsx";
import {
  commonMatchups,
  getChampionRoleById,
  getCurrentPatchForStaticData,
  getDefaultedFiltersForChampion,
  getLatestPatchForChampions,
  getSearchParamsForChampion,
  getSpecificMatchupStats,
  getStaticChampionByKey,
  losingMatchups,
} from "@/game-lol/util.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import Container from "@/shared/ContentContainer.jsx";
import { useIsLoaded, useRoute } from "@/util/router-hooks.mjs";

const LoadingContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(var(--sp-22) * 3);

  svg {
    width: 7rem;
    height: 7rem;
  }
`;

function Champion() {
  // lol/champions/:championKey/:tab/:matchupChampionKey
  // tab is one of "overview", "probuilds", "trends", "counters"
  const {
    parameters: [championKey, tabKey, matchupChampionKey],
    searchParams,
  } = useRoute();
  const isLoaded = useIsLoaded();
  const tab = tabKey || "overview";
  const state = useSnapshot(readState);
  const patch = getCurrentPatchForStaticData();
  const champion = getStaticChampionByKey(championKey, patch);
  const matchupChampion = getStaticChampionByKey(matchupChampionKey, patch);
  const championId = champion?.id;
  const matchupChampionId = matchupChampion?.id;
  const defaultRole = getChampionRoleById(championId);
  const filters = getDefaultedFiltersForChampion(searchParams, defaultRole);
  const urlParams = getSearchParamsForChampion(filters);
  const allChampionsStats = state.lol?.championStats?.[btoa(urlParams)] || [];
  const championStats =
    state.lol?.championPage?.[championId]?.[btoa(urlParams)]?.[0];
  const matchupChampionStats =
    state.lol?.championPage?.[matchupChampionId]?.[btoa(urlParams)]?.[0];
  const championBuilds =
    state.lol?.championBuilds?.[championId]?.[btoa(urlParams)];

  const matchups = useMemo(() => {
    return championStats?.matchups || [];
  }, [championStats]);

  const specificMatchupStats = getSpecificMatchupStats({
    champion,
    matchupChampion,
    allChampionsStats,
  });

  const viableMatchups = commonMatchups(championStats, matchups);
  const losesAgainst = losingMatchups(viableMatchups).slice(0, 5);

  useEffect(() => {
    return () => {
      // We should keep the current patch as latest one.
      // But in Champion page, we need to change the current patch.
      // In Champion Filter, we change the current patch.
      // So when dismount the Champion component,
      // we should reset the current patch as latest one.
      updateCurrentPatchAction(getLatestPatchForChampions());
    };
  }, []);

  let InnerComponent = null;
  switch (tab) {
    case "probuilds":
      InnerComponent = (
        <ChampionProbuilds
          champion={champion}
          championStats={championStats}
          matchupChampion={matchupChampion}
          matchupChampionStats={matchupChampionStats}
        />
      );
      break;
    case "trends":
      InnerComponent = (
        <ChampionTrends
          champion={champion}
          championStats={championStats}
          matchupChampion={matchupChampion}
          matchupChampionStats={matchupChampionStats}
        />
      );
      break;
    case "counters":
      InnerComponent = (
        <ChampionMatchups
          champion={champion}
          championStats={championStats}
          matchupChampion={matchupChampion}
          matchupChampionStats={matchupChampionStats}
          matchups={matchups}
          specificMatchupStats={specificMatchupStats}
        />
      );
      break;
    case "overview":
    default: {
      InnerComponent = InnerComponent = (
        <ChampionOverview
          champion={champion}
          championStats={championStats}
          championBuilds={championBuilds}
          matchupChampion={matchupChampion}
          specificMatchupStats={specificMatchupStats}
          matchups={matchups}
        />
      );
    }
  }

  if (!isLoaded && !champion && !championStats)
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );

  return (
    <>
      <ChampionHeader
        champion={champion}
        championStats={championStats}
        matchupChampion={matchupChampion}
        matchupChampionStats={matchupChampionStats}
        matchups={losesAgainst}
        tab={tab}
      />
      <Container>
        <div className="flex column gap-sp-4">{InnerComponent}</div>
      </Container>
    </>
  );
}

export function meta(params) {
  let titleFallback = "";
  let descriptionFallback = "";
  let season = "";

  const patch = getCurrentPatchForStaticData();
  const champion = getStaticChampionByKey(params[0], patch);
  const tab = params.length >= 2 ? params[1] : "";
  const tabName = tab ? ` ${tab}` : "";
  const seasons = readState?.lol?.seasons;
  if (seasons) {
    const seasonNumber = Object.values(seasons)
      .reverse()[0]
      .match(/\d+/)
      .shift();
    season = ` S${seasonNumber}`;
  }
  const isMatchup = params.length >= 3;
  const matchupChampionName = isMatchup
    ? getStaticChampionByKey(params[2], patch).name
    : "";
  if (isMatchup) {
    switch (tab) {
      case "counters":
        titleFallback = `{{championName}} vs. {{matchupChampionName}} {{season}} Matchup & Counters – Blitz LoL`;
        descriptionFallback = `{{championName}}'s build and guide against {{matchupChampionName}}. How to beat {{matchupChampionName}} as {{championName}}.`;
        break;
      case "probuilds":
        titleFallback = `{{championName}} Pro Builds vs. {{matchupChampionName}} {{season}} Guides, Stats, Runes – Blitz LoL`;
        descriptionFallback = `{{championName}}'s probuilds against {{matchupChampionName}}. How to beat {{matchupChampionName}} as {{championName}}.`;
        break;
      case "trends":
        titleFallback = `{{championName}} vs. {{matchupChampionName}} {{season}} Stats & Trends – Blitz LoL`;
        descriptionFallback = `{{championName}}'s stat trends against {{matchupChampionName}}. How to beat {{matchupChampionName}} as {{championName}}.`;
        break;
      default:
        titleFallback = `{{championName}} vs. {{matchupChampionName}} {{season}} – Blitz LoL`;
        descriptionFallback = `{{championName}}'s build and guide against {{matchupChampionName}}. How to beat {{matchupChampionName}} as {{championName}}.`;
        break;
    }
  } else {
    switch (tab) {
      case "counters":
        titleFallback = `{{championName}} {{season}} Counters & Matchups – Blitz LoL`;
        descriptionFallback = `{{championName}} counters - League of Legends guides, builds, stats, counters, runes, & skill order for top, jungle, mid, adc, support.`;
        break;
      case "probuilds":
        titleFallback = `{{championName}} {{season}} Pro Builds,  Guides, Stats, Runes – Blitz LoL`;
        descriptionFallback = `{{championName}} probuilds - League of Legends guides, builds, stats, counters, runes, & skill order for top, jungle, mid, adc, support.`;
        break;
      case "trends":
        titleFallback = `{{championName}} {{season}} Trends, Pro Builds, Guides, Stats, Runes – Blitz LoL`;
        descriptionFallback = `{{championName}} trends - League of Legends guides, builds, stats, counters, runes, & skill order for top, jungle, mid, adc, support`;
        break;
      default:
        titleFallback = `{{championName}} {{season}} Stats, Pro Builds, Guides, Runes, Counter, Matchups – Blitz LoL`;
        descriptionFallback = `{{championName}} - League of Legends guides, builds, probuilds, stats, counters, runes, & skill order for top, jungle, mid, adc, support.`;
        break;
    }
  }

  return {
    title: [
      `lol:Champion`,
      titleFallback,
      {
        championName: champion?.name ? champion.name : "",
        tabName: tabName,
        season: season,
        matchupChampionName: matchupChampionName,
        interpolation: { escapeValue: false },
      },
    ],
    description: [
      `lol:Champion`,
      descriptionFallback,
      {
        championName: champion?.name ? champion.name : "",
        tabName: tabName,
        season: season,
        interpolation: { escapeValue: false },
      },
    ],
  };
}

export default Champion;
