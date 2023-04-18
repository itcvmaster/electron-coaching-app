import React from "react";
import { styled } from "goober";

import { scoreColorStyle } from "@/game-val/utils.mjs";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";

export const View = styled("div")`
  display: flex;
  flex: ${(props) => (props.flex ? props.flex : 1)};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  justify-content: center;
  align-items: center;
`;

export const TitleText = styled("h4")`
  color: ${(props) => (props.color ? props.color : "var(--shade0)")};
  text-transform: capitalize;
`;

export const ValueText = styled("h4")`
  color: ${(props) => (props.color ? props.color : "var(--shade0)")};
  text-transform: capitalize;
`;

export const AgentImage = styled("img")`
  width: var(--sp-4);
  height: auto;
  border-radius: var(--br);
  background-image: url(${(props) => props.src});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  flex-shrink: 0;
`;

export const ComparisonArrow = ({ didBetter }) => {
  return didBetter ? <CaretUp /> : <CaretDown />;
};

export const ScoreText = styled("p")`
  color: ${(props) => scoreColorStyle(props.$score)};
`;
