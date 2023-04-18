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

function PostMatchTimelineCoin() {
  const { t } = useTranslation();
  const currentMatch = useMatch();
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const timeline = currentMatch.extra.Timeline.goldTimeLine;

  const { graph, y } = timeline.reduce(
    (acc, cur, idx) => {
      acc.graph.push({
        x: idx,
        y: cur.gold,
      });
      acc.y.push(idx % 4 === 0 ? cur.round.replace("_", "-") : "");
      return acc;
    },
    { graph: [], y: [] }
  );

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

  return (
    <Container>
      <Heading>
        <Title>{t("lol:gold", "Gold")}</Title>
        <SubTitle>
          {t(
            "tft:postmatchInsights.interestPerRound",
            "{{interestPerRound}} Interest / Round",
            {
              interestPerRound: timeline.goldInterest?.toFixed(1) || 0,
            }
          )}
        </SubTitle>
      </Heading>
      <Content height="260px">
        <SimpleLineChart
          data={graph}
          xField="x"
          yField="y"
          color="var(--yellow)"
          showGridLines
          margin={chartConfig.margin}
          xAxisConf={chartConfig.xAxisConf}
          yAxisConf={chartConfig.yAxisConf}
        />
      </Content>
    </Container>
  );
}

export default PostMatchTimelineCoin;
