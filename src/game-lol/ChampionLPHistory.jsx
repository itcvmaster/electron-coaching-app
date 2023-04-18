import React from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { calculateLPGraphs } from "@/game-lol/lol-calculate-lp-graph.mjs";
import LpGraph from "@/game-lol/LpGraph.jsx";
import { getDerivedId } from "@/game-lol/util.mjs";

const PlayerLpHistory = styled("div")`
  display: flex;
  flex-direction: column;

  .chart-container-parent {
    padding-bottom: 20px;
  }
  .x-axis {
    transform: translate(0, 105px);
  }
`;

function ChampionLPHistory(props) {
  const { region, name } = props;
  const state = useSnapshot(readState);

  const matches = state?.lol?.lpMatches?.[getDerivedId(region, name)];
  if (matches instanceof Error) return null;

  const { lpdata, queueObj, minGraphValue, maxGraphValue } = calculateLPGraphs({
    ...props,
    matches,
  });
  const isHideLp = queueObj?.hideRank;
  const isUnranked = !queueObj?.key;
  if (isHideLp || isUnranked || !lpdata || !maxGraphValue || !minGraphValue)
    return null;

  return (
    <PlayerLpHistory>
      <LpGraph
        lpdata={lpdata}
        queueObj={queueObj}
        minGraphValue={minGraphValue}
        maxGraphValue={maxGraphValue}
      />
    </PlayerLpHistory>
  );
}

export default ChampionLPHistory;
