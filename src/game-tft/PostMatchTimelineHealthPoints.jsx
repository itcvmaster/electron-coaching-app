import React from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  Content,
  Heading,
  SubTitle,
  Title,
} from "@/game-tft/CommonComponents.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";
import SimpleLineChart from "@/shared/SimpleLineChart.jsx";

function PostMatchTimelineHealthPoints() {
  // Hooks
  const { t } = useTranslation();
  const currentMatch = useMatch();
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const rounds = currentMatch.extra.Timeline.hpTimeline;
  const { graph, y } = rounds.reduce(
    (acc, cur, idx) => {
      acc.graph.push({
        x: idx,
        y: cur.hp,
        color: cur.isWinner ? "var(--blue)" : "var(--red)",
      });
      acc.y.push(idx % 4 === 0 ? cur.round.replace("_", "-") : "");
      return acc;
    },
    { graph: [], y: [] }
  );
  const hpPerRound = (
    (rounds[rounds.length - 1].hp - rounds[0].hp) /
    rounds.length
  ).toFixed(1);

  const chartConfig = {
    margin: { left: 60, right: 30, top: 30, bottom: 50 },
    xAxisConf: {
      visible: true,
      ticks: y,
    },
    yAxisConf: {
      visible: true,
      ticks: [100, 75, 50, 25, 0],
    },
  };

  // Render
  return (
    <Container>
      <Heading>
        <Title>{t("tft:common.hp", "HP")}</Title>
        <SubTitle>
          {t("tft:postmatchInsights.hpPerRound", "{{hpPerRound}} HP / Round", {
            hpPerRound,
          })}
        </SubTitle>
      </Heading>
      <Content height="260px">
        <SimpleLineChart
          data={graph}
          xField="x"
          yField="y"
          showGridLines
          margin={chartConfig.margin}
          xAxisConf={chartConfig.xAxisConf}
          yAxisConf={chartConfig.yAxisConf}
        />
      </Content>
    </Container>
  );
}

export default PostMatchTimelineHealthPoints;
