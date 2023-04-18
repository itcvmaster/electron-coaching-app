import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { EmptyContentContainer } from "@/game-lol/CommonComponents.jsx";
import { QUEUE_SYMBOLS } from "@/game-lol/constants.mjs";
import TrendsGraph from "@/game-lol/TrendsGraph.jsx";
import { getSearchParamsForChampion } from "@/game-lol/util.mjs";

const EmptyContent = () => {
  const { t } = useTranslation();
  return (
    <EmptyContentContainer>
      {t("lol:notFound.trends", "No trends data found for this champion.")}
    </EmptyContentContainer>
  );
};

const ChampionOverviewTrends = ({ champion, filters, queue }) => {
  const { t } = useTranslation();
  const championId = champion?.id;
  const urlParams = getSearchParamsForChampion(filters);
  const championTrends =
    readState.lol?.championStatsTrends?.[championId]?.[btoa(urlParams)] || [];

  return (
    <Card
      title={t("lol:championsPage.championsTrends", `{{champion}}'s Trends`, {
        champion: champion?.name,
      })}
      titleLink={`/lol/champions/${champion?.key}/trends`}
    >
      {!championTrends.length ? (
        <EmptyContent />
      ) : (
        <>
          <TrendsGraph
            title={t("lol:winRate", "Win Rate")}
            points={championTrends.map((stats) => ({
              patch: stats.patch,
              value: stats.wins / (stats.games || 1),
            }))}
            valueLabel={t("lol:winRate", "Win Rate")}
            t={t}
          />
          <TrendsGraph
            title={t("lol:pickRate", "Pick Rate")}
            points={championTrends.map((stats) => ({
              patch: stats.patch,
              value: stats.pickRate,
            }))}
            valueLabel={t("lol:pickRate", "Pick Rate")}
            t={t}
          />
          {queue !== QUEUE_SYMBOLS.aram ? (
            <TrendsGraph
              title={t("lol:banRate", "Ban Rate")}
              points={championTrends.map((stats) => ({
                patch: stats.patch,
                value: stats.banRate,
              }))}
              valueLabel={t("lol:banRate", "Ban Rate")}
              t={t}
            />
          ) : null}
        </>
      )}
    </Card>
  );
};

export default ChampionOverviewTrends;
