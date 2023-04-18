import React, { useCallback, useMemo } from "react";
import { withTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile } from "clutch";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/game-lol/constants.mjs";
import { getGoldDiff } from "@/game-lol/util.mjs";
import Chart from "@/shared/Chart.jsx";
import PositiveNegativeGraph from "@/shared/PositiveNegativeGraph.jsx";

// Calculate axis and set up Graph

const chartConfig = {
  xAxisConf: {
    show: true,
    type: "linear",
  },
  yAxisConf: {
    show: true,
    type: "linear",
    nice: true,
    useD3Ticks: true,
    tickCount: 8,
    tickFormat: (v) => {
      const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];

      function abbreviateNumber(number) {
        // what tier? (determines SI symbol)
        const tier = (Math.log10(Math.abs(number)) / 3) | 0;

        // if zero, we don't need a suffix
        if (tier === 0) return number;

        // get suffix and determine scale
        const suffix = SI_SYMBOL[tier];
        const scale = Math.pow(10, tier * 3);

        // scale the number
        const scaled = number / scale;

        // format number and add suffix
        const decimals = scaled % 1 === 0 ? 0 : 1;
        return scaled.toFixed(decimals) + suffix;
      }
      return abbreviateNumber(v);
    },
  },
};

const PostMatchMatchTimeline = (props) => {
  const { timeline, t, t1Length, totalParticipants, myTeam, t: tfn } = props;
  const goldDiff = useMemo(() => {
    return getGoldDiff(
      timeline.frames,
      t1Length,
      totalParticipants,
      myTeam
    ).map((d) => {
      return { ...d, time: d.time / (60 * 1000) };
    });
  }, [timeline, t1Length, totalParticipants, myTeam]);

  const tooltipContent = useCallback(
    (data) => {
      const { diff: goldAmount, time } = data;
      const timeMins = `${Math.floor(time)}:00`;
      const content =
        goldAmount > 0
          ? tfn(
              `lol:graphAheadByGold`,
              `Ahead by {{goldAmount}} gold at {{time}}`,
              { time: timeMins, goldAmount }
            )
          : goldAmount < 0
          ? tfn(
              `lol:graphDownByGold`,
              `Down by {{goldAmount}} gold at {{time}}`,
              { time: timeMins, goldAmount }
            )
          : tfn("lol:graphEven", "Even at {{time}}", { time: timeMins });
      return content;
    },
    [tfn]
  );

  if (!timeline)
    return (
      <h1 className="type-h4">
        {t("lol:championData.dataNotAvailable", "Data not available.")}
      </h1>
    );

  return (
    <GoldGraph>
      <Chart
        data={goldDiff}
        xField="time"
        yField="diff"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        margin={{ left: 20, right: 20, top: 40, bottom: 40 }}
        xAxisConf={chartConfig.xAxisConf}
        yAxisConf={chartConfig.yAxisConf}
        tooltipContent={tooltipContent}
      >
        <PositiveNegativeGraph
          circleRadius={4}
          data={goldDiff}
        ></PositiveNegativeGraph>
      </Chart>
    </GoldGraph>
  );
};

export default withTranslation(["lol"])(PostMatchMatchTimeline);

const GoldGraph = styled("div")`
  ${mobile} {
    overflow-x: scroll;
    margin-right: var(--sp-2);
  }
`;
