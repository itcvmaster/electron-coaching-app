import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button, Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import ChampionLPStats from "@/game-lol/ChampionLPStats.jsx";
import { computeChampionStats } from "@/game-lol/compute-champion-stats.mjs";
import { getDerivedId, getDerivedQueue } from "@/game-lol/util.mjs";

const ContentLoader = styled("div")`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
`;

const BtnFrame = styled("div")`
  padding: var(--sp-6);
  padding-top: 0;
`;

const ChampionStatsLoader = () => (
  <ContentLoader height={60} width={320}>
    <circle cx="42" cy="30" r="18" />
    <rect x="74" y="14" rx="0" ry="0" width="104" height="12" />
    <rect x="74" y="34" rx="0" ry="0" width="65" height="12" />
    <rect x="231" y="14" rx="0" ry="0" width="65" height="12" />
    <rect x="252" y="34" rx="0" ry="0" width="44" height="12" />
  </ContentLoader>
);

const INIT_SHOW_COUNT = 5;

const ChampionStats = ({ name, region, queue, history, champions }) => {
  const state = useSnapshot(readState);
  const { t } = useTranslation();
  const [limitToShow, setLimitToShow] = useState(INIT_SHOW_COUNT);
  const containerTitle = t("common:performance", "Performance");

  const championStatsData =
    state?.lol?.playerChampionStats?.[
      getDerivedQueue(getDerivedId(region, name), queue)
    ];
  const championStatsError =
    championStatsData instanceof Error ? championStatsData : null;
  const championStatsForPlayer = championStatsData || [];

  const showMoreData = () => {
    const showVal = limitToShow + INIT_SHOW_COUNT;
    if (showVal > championStatsForPlayer.length) {
      setLimitToShow(championStatsForPlayer.length);
    } else {
      setLimitToShow(showVal);
    }
  };

  const showLessData = () => {
    setLimitToShow(INIT_SHOW_COUNT);
  };

  if (championStatsError) return null;

  const champStats = computeChampionStats(championStatsForPlayer, limitToShow);
  const hasMore = championStatsForPlayer.length > INIT_SHOW_COUNT;

  if (!champStats || champStats.length === 0) return null;
  if (!championStatsForPlayer) return null;

  return (
    <Card
      title={containerTitle}
      // This will be add when the feature are implemented for the future
      // titleLink={`/lol/profile/${region}/${name}/champions/champion_pool?queue=${queue}`}
      padding="0"
    >
      {!championStatsForPlayer ? (
        <>
          {[...Array(5)].map((e, i) => (
            <ChampionStatsLoader key={i} />
          ))}
        </>
      ) : (
        <ChampionLPStats
          champions={champStats}
          name={name}
          queue={queue}
          region={region}
          history={history}
          allchamps={champions}
        />
      )}
      {championStatsForPlayer &&
        hasMore &&
        limitToShow !== championStatsForPlayer.length && (
          <BtnFrame>
            <Button
              onClick={() => showMoreData()}
              text={t("common:more", "More")}
              block
            />
          </BtnFrame>
        )}
      {championStatsForPlayer &&
        championStatsForPlayer.length > 5 &&
        hasMore &&
        limitToShow === championStatsForPlayer.length && (
          <BtnFrame>
            <Button
              onClick={() => showLessData()}
              text={t("common:showLess", "Show less")}
              block
            />
          </BtnFrame>
        )}
    </Card>
  );
};

export default ChampionStats;
