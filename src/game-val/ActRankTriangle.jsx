import React from "react";
import { styled } from "goober";

import { RANKS } from "@/game-val/constants.mjs";
import { rankColor } from "@/game-val/utils.mjs";
import ValActBorderLevel0 from "@/inline-assets/ValActBorderLevel0.svg";
import ValActBorderLevel1 from "@/inline-assets/ValActBorderLevel1.svg";
import ValActBorderLevel2 from "@/inline-assets/ValActBorderLevel2.svg";
import ValActBorderLevel3 from "@/inline-assets/ValActBorderLevel3.svg";
import ValActBorderLevel4 from "@/inline-assets/ValActBorderLevel4.svg";
import ValActBorderLevel5 from "@/inline-assets/ValActBorderLevel5.svg";
import ValActDown0 from "@/inline-assets/ValActDown0.svg";
import ValActDown1 from "@/inline-assets/ValActDown1.svg";
import ValActDown2 from "@/inline-assets/ValActDown2.svg";
import ValActDown3 from "@/inline-assets/ValActDown3.svg";
import ValActRadiantDown from "@/inline-assets/ValActRadiantDown.svg";
import ValActRadiantUp from "@/inline-assets/ValActRadiantUp.svg";
import ValActUp0 from "@/inline-assets/ValActUp0.svg";
import ValActUp1 from "@/inline-assets/ValActUp1.svg";
import ValActUp2 from "@/inline-assets/ValActUp2.svg";
import ValActUp3 from "@/inline-assets/ValActUp3.svg";

function getLevel(numberOfCompetitiveMatchesWon) {
  if (numberOfCompetitiveMatchesWon > 100) {
    return 5;
  } else if (numberOfCompetitiveMatchesWon > 75) {
    return 4;
  } else if (numberOfCompetitiveMatchesWon > 50) {
    return 3;
  } else if (numberOfCompetitiveMatchesWon > 25) {
    return 2;
  } else if (numberOfCompetitiveMatchesWon > 9) {
    return 1;
  }
  return 0;
}

const ActTrianglesRow = styled("div")`
  position: relative;
  height: var(--sp-7);
`;

const ActTriangles = styled("div")`
  height: var(--sp-21);
  width: var(--sp-24);
  position: absolute;
  left: var(--sp-0);
  right: var(--sp-0);
  top: var(--sp-0);
  bottom: var(--sp-0);
  margin-left: auto;
  margin-right: auto;
  margin-top: var(--sp-5);
  margin-bottom: auto;
`;

const TriangleContainer = styled("div")`
  .triangle-tile {
    width: auto;
    fill: ${(props) => props.$fillColor};
  }
`;

const BorderContainer = styled("div")`
  max-width: calc(var(--sp-1) * 31.25);
  .rank-border {
    position: absolute;
    width: ${(props) => (props.$width ? `${props.$width}` : "auto")};
    height: ${(props) => (props.height ? `${props.height}` : "auto")};
    fill: transparent;
    left: 0;
    right: 0;
    top: ${(props) => (props.$top ? `${props.$top}` : "0")};
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    stroke-width: initial;
    stroke: initial;
  }
`;

const Container = styled("div")`
  margin-top: var(--sp-3);
  position: relative;
  height: var(--sp-31);
  width: calc(var(--sp-1) * 34);
`;

const ActTriangle = ({ match, column, type }) => {
  const rank = RANKS[match?.rank || 0];
  const fillColor = rankColor[rank.tier];

  let Triangle;
  if (rank.key === "radiant") {
    if (type === "up") {
      Triangle = ValActRadiantUp;
    } else {
      Triangle = ValActRadiantDown;
    }
  } else if (rank.rank === 3) {
    if (type === "up") {
      Triangle = ValActUp3;
    } else {
      Triangle = ValActDown3;
    }
  } else if (rank.rank === 2) {
    if (type === "up") {
      Triangle = ValActUp2;
    } else {
      Triangle = ValActDown2;
    }
  } else if (rank.rank === 1) {
    if (type === "up") {
      Triangle = ValActUp1;
    } else {
      Triangle = ValActDown1;
    }
  } else if (type === "up") {
    Triangle = ValActUp0;
  } else {
    Triangle = ValActDown0;
  }
  return (
    <TriangleContainer
      style={{
        position: "absolute",
        height: 32,
        width: 32,
        strokeWidth: "initial",
        stroke: "initial",
        left: column * 16,
        opacity: rank.key === RANKS[0].key ? 0.3 : 1,
      }}
      $fillColor={fillColor}
    >
      <Triangle className="triangle-tile" />
    </TriangleContainer>
  );
};
const Border = ({ level }) => {
  let Comp, style;
  if (level === 1) {
    Comp = ValActBorderLevel1;
    style = {
      width: "var(--sp-28)",
      top: "var(--sp-1)",
    };
  } else if (level === 2) {
    Comp = ValActBorderLevel2;
    style = {
      width: "var(--sp-28)",
      top: "var(--sp-1)",
    };
  } else if (level === 3) {
    Comp = ValActBorderLevel3;
    style = {
      width: "var(--sp-29)",
      top: "var(--sp-2)",
    };
  } else if (level === 4) {
    Comp = ValActBorderLevel4;
    style = {
      width: "var(--sp-33)",
      top: "var(--sp-2_5)",
    };
  } else if (level === 5) {
    Comp = ValActBorderLevel5;
    style = {
      width: "var(--sp-34_5)",
      top: "var(--sp-4)",
    };
  } else {
    Comp = ValActBorderLevel0;
    style = {
      width: "var(--sp-28)",
      top: "var(--sp-1)",
    };
  }

  return (
    <BorderContainer
      $top={style.top}
      $width={style.width}
      $height={style.height}
    >
      <Comp className="rank-border" />
    </BorderContainer>
  );
};

const ActRankTriangle = ({ actRank }) => {
  const topMatches = actRank?.topMatches || [];
  const level = getLevel(actRank?.nonPlacementMatchesWon || 0);
  return (
    <Container>
      <Border level={level} />
      <ActTriangles>
        <ActTrianglesRow>
          <ActTriangle match={topMatches?.[0]} column={2} type={"up"} />
        </ActTrianglesRow>
        <ActTrianglesRow>
          <ActTriangle match={topMatches?.[1]} column={1} type={"up"} />
          <ActTriangle match={topMatches?.[2]} column={2} type={"down"} />
          <ActTriangle match={topMatches?.[3]} column={3} type={"up"} />
        </ActTrianglesRow>
        <ActTrianglesRow>
          <ActTriangle match={topMatches?.[4]} column={0} type={"up"} />
          <ActTriangle match={topMatches?.[5]} column={1} type={"down"} />
          <ActTriangle match={topMatches?.[6]} column={2} type={"up"} />
          <ActTriangle match={topMatches?.[7]} column={3} type={"down"} />
          <ActTriangle match={topMatches?.[8]} column={4} type={"up"} />
        </ActTrianglesRow>
      </ActTriangles>
    </Container>
  );
};

export default ActRankTriangle;
