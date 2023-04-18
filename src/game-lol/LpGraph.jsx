import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import {
  GAME_LOL_RANK_COLORS,
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
} from "@/game-lol/constants.mjs";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import GraphComponent from "@/game-lol/GraphComponent.jsx";

const GRAPH_TOP_MARGIN = 10;
const GRAPH_BOTTOM_MARGIN = 35;
const GRAPH_CONTAINER_HEIGHT = 120;
const GRAPH_POINTS = -10;

function capitalize(string) {
  const str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const LpGraph = (props) => {
  const { lpdata, minGraphValue, maxGraphValue } = props;

  const { t } = useTranslation();

  let rankType = true;
  const isUnranked = !rankType || rankType === "UNRANKED";
  if (isUnranked) {
    rankType = RANK_SYMBOL_TO_STR[RANK_SYMBOLS.silver].capped;
  }

  const lpDataWithIndex = lpdata
    .sort((a, b) => a.gameCreation - b.gameCreation)
    .slice(GRAPH_POINTS)
    .map((d, index) => {
      const tier = d.tier || rankType;
      return { index, ...d, tier };
    });

  const allDates = lpDataWithIndex.map((d) => {
    const date = new Date(d.gameCreation);
    const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return str;
  });

  const xAxisTickValues = [...new Set(allDates)].map((d) =>
    allDates.lastIndexOf(d)
  );

  return (
    <GraphComponent
      data={lpDataWithIndex}
      xField={"index"}
      yField={"absLp"}
      height={GRAPH_CONTAINER_HEIGHT}
      xAxisConf={{
        show: true,
        type: "linear",
        nice: true,
        tickValues: xAxisTickValues,
        tickFormat: (index) => {
          const time = lpDataWithIndex.find(
            (d) => d === lpDataWithIndex[index]
          )?.gameCreation;
          if (!time) return null;
          const date = new Date(time);
          return date.getMonth() + 1 + "/" + date.getDate();
        },
      }}
      circleColor={(d) => {
        return d.tier
          ? GAME_LOL_RANK_COLORS[d.tier.toLowerCase()].fill
          : "var(--shade3)";
      }}
      yAxisConf={{
        show: false,
        type: "linear",
        tickCount: 1,
        nice: false,
        tickValues: [(minGraphValue + maxGraphValue) / 2],
      }}
      margin={{
        left: 10,
        right: 10,
        top: GRAPH_TOP_MARGIN,
        bottom: GRAPH_BOTTOM_MARGIN,
      }}
      circleRadius={6}
      images={[]}
      tooltipConfig={{
        placement: "top",
        showArrow: true,
        offsetY: -6,
      }}
      tooltipContent={(d) => {
        const RankIcon = getHextechRankIcon(d.tier);
        return (
          <Tooltip>
            <div className="lp-tier">
              <RankIcon />
              <div>
                {d.tier ? capitalize(d.tier) : null} {d.divisionNumber}
              </div>
            </div>
            <div>
              {t("lol:leaguePoints", "{{points}} LP", {
                points: d.tierAbsLp !== null ? d.tierAbsLp : "-",
              })}
            </div>
          </Tooltip>
        );
      }}
    />
  );
};

export default LpGraph;

const Tooltip = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--br);

  .lp-tier {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: var(--br);
  }

  svg {
    width: var(--sp-5);
    height: var(--sp-5);
  }
`;
