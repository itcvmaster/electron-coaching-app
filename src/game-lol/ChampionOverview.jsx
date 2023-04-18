import React from "react";

import ChampionBuilds from "@/game-lol/ChampionBuilds.jsx";
import ChampionMatchupAppliedStats from "@/game-lol/ChampionMatchupAppliedStats.jsx";
import ChampionMatchupsOverview from "@/game-lol/ChampionMatchupsOverview.jsx";
import ChampionMostPlayedChampions from "@/game-lol/ChampionMostPlayedChampions.jsx";
import ChampionOverviewTrends from "@/game-lol/ChampionOverviewTrends.jsx";
import ChampionPlayingAgainst from "@/game-lol/ChampionPlayingAgainst.jsx";
import { Column, LayoutColumns } from "@/game-lol/CommonComponents.jsx";
import { QUEUE_SYMBOLS } from "@/game-lol/constants.mjs";
import useChampionFilter from "@/game-lol/useChampionFilter.jsx";

const ChampionOverview = (props) => {
  const { champion, championStats, matchupChampion, specificMatchupStats } =
    props;
  const matchups = championStats?.matchups || [];
  const viewMode = "desktop";
  // const matchupName = matchupChampion && `vs ${matchupChampion.name}`;
  const mostPlayedChamps = [];
  const { FilterBar, ...filters } = useChampionFilter(
    "overview",
    champion,
    matchupChampion
  );
  const { queue, role } = filters || {};

  return (
    <>
      {FilterBar}
      <ChampionBuilds championId={champion.id} championRole={role} />
      <LayoutColumns>
        <Column className="flex column gap-sp-4 col-md-8 col-sm-12">
          {mostPlayedChamps && mostPlayedChamps.length ? (
            <ChampionMostPlayedChampions
              champion={champion}
              mostPlayedChamps={mostPlayedChamps}
              viewMode={viewMode}
            />
          ) : null}
          {queue !== QUEUE_SYMBOLS.aram ? (
            <ChampionMatchupsOverview
              champion={champion}
              championStats={championStats}
              filters={filters}
              matchupChampion={matchupChampion}
              matchups={matchups}
              viewMode={viewMode}
            />
          ) : null}
        </Column>
        <Column className="flex column gap-sp-4 col-md-4 col-sm-12">
          {matchupChampion && specificMatchupStats && (
            <ChampionMatchupAppliedStats
              champion={champion}
              matchupChampion={matchupChampion}
              filters={filters}
              specificMatchupStats={specificMatchupStats}
            />
          )}
          <ChampionOverviewTrends
            queue={queue}
            champion={champion}
            filters={filters}
          />
          <ChampionPlayingAgainst
            champion={champion}
            championStats={championStats}
            matchups={matchups}
            filters={filters}
            viewMode={viewMode}
          />
        </Column>
      </LayoutColumns>
    </>
  );
};

export default ChampionOverview;
