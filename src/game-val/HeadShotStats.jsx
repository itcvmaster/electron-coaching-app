import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import GraphComponent from "@/game-val/GraphComponent.jsx";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import HitPercent from "@/shared/HitPercent.jsx";

const HeadShotStatsContainer = styled("div")`
  display: block;
  .avg-headshots {
    text-transform: uppercase;
    color: var(--shade2);
  }

  .graph-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(
      49.85% 100.62% at 0% 0%,
      #49b4ff0d 0%,
      #49b4ff00 100%
    );
  }
`;

const decreasedHsColor = "rgb(250, 77, 81)";
const increasedHsColor = "rgb(73, 180, 255)";
const TitleContainer = styled("div")`
  display: flex;
  color: var(--shade2);
  padding: var(--sp-4) 0 var(--sp-2);
  place-content: center;
  .headshot-caret-up {
    width: var(--sp-4);
    color: ${increasedHsColor};
  }
  .headshot-caret-down {
    width: var(--sp-4);
    color: ${decreasedHsColor};
  }
`;

const HeadShotStats = ({ matches }) => {
  const { t } = useTranslation();
  let topHeadshot = 0;
  const shootingDataTotals = {
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
  };

  const getHeadShotTitleText = (numberGames = 20) => {
    const numberOfGames = Math.min(numberGames, 20);
    return (
      <span className="type-overline avg-headshots">
        {t(
          "val:profile.headshotOverLast",
          "Avg. Headshot % - Last {{count}} Game",
          {
            count: numberOfGames,
          }
        )}
      </span>
    );
  };

  const matchData = [];
  if (matches)
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      if (match.queue !== "competitive") continue;
      const matchDate = match.matchDate;
      const hsPercent = match.hsStats.all.last20Avg;
      if (topHeadshot < hsPercent) {
        topHeadshot = hsPercent;
      }
      shootingDataTotals.headshots += match.headshots;
      shootingDataTotals.bodyshots += match.bodyshots;
      shootingDataTotals.legshots += match.legshots;
      matchData.push({
        index: i,
        matchDate,
        hsPercent,
        color: increasedHsColor,
      });
    }

  const increasedHeadshots =
    matchData?.[0]?.hsPercent >= matchData?.[1]?.hsPercent;

  const xAxisTickValues = [];
  const yAxisTickValues = [0, topHeadshot / 2, topHeadshot];
  const GRAPH_TOP_MARGIN = 10;
  const GRAPH_BOTTOM_MARGIN = 35;
  const GRAPH_CONTAINER_HEIGHT = 120;
  return (
    <HeadShotStatsContainer>
      <TitleContainer>{getHeadShotTitleText(matchData?.length)}</TitleContainer>
      <HitPercent
        side="left"
        size={52}
        stats={shootingDataTotals}
        hiddenLegshots={false}
        showColumnTitles={false}
        hideHits={true}
        showValueSubtitles={true}
      />
      <TitleContainer>
        <div>
          {increasedHeadshots ? (
            <CaretUp className="headshot-caret-up" />
          ) : (
            <CaretDown className="headshot-caret-down" />
          )}
        </div>

        {getHeadShotTitleText(matchData?.length)}
      </TitleContainer>
      <div className="graph-container">
        <GraphComponent
          data={matchData}
          xField={"index"}
          yField={"hsPercent"}
          height={GRAPH_CONTAINER_HEIGHT}
          width={300}
          margin={{
            left: 10,
            right: 10,
            top: GRAPH_TOP_MARGIN,
            bottom: GRAPH_BOTTOM_MARGIN,
          }}
          circleRadius={6}
          xAxisConf={{
            show: true,
            type: "linear",
            nice: true,
            tickValues: xAxisTickValues,
            tickFormat: (index) => {
              const time = matchData.find(
                (d) => d === matchData[index]
              )?.matchDate;
              if (!time) return null;
              const date = new Date(time);
              return date.getMonth() + 1 + "/" + date.getDate();
            },
          }}
          yAxisConf={{
            show: true,
            type: "linear",
            tickCount: yAxisTickValues.length,
            nice: false,
            tickValues: yAxisTickValues,
          }}
          images={[]}
          circleColor={() => {
            return "var(--blue)";
          }}
        />
      </div>
    </HeadShotStatsContainer>
  );
};

export default HeadShotStats;
