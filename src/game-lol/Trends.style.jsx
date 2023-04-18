import React from "react";
import { styled } from "goober";

import { Body1, CaptionBold } from "@/game-lol/CommonComponents.jsx";

const StatValue = styled("div")`
  display: flex;
  align-items: center;
`;

const _StatDelta = ({ value, className }) => (
  <CaptionBold className={className}>
    ({parseFloat(value) > 0 && "+"}
    {value})
  </CaptionBold>
);
const StatDelta = styled(_StatDelta)`
  font-size: var(--sp-3);
  line-height: var(--sp-4);
  margin-left: 4px;
  color: ${(props) =>
    parseFloat(props.value) >= 0 ? "var(--blue)" : "var(--red)"};
`;

const StatSubtitle = styled("div")`
  font-size: var(--sp-3);
  line-height: var(--sp-4);
  color: var(--shade3);
`;

const StatValueLabel = styled("div")`
  font-size: 0.875rem;
  color: var(--shade0);
  margin-left: 6px;
  margin-right: 2px;
`;

export const StatInfo = ({
  value,
  delta,
  caption,
  valueLabel,
  isDrawer,
  ...props
}) => (
  <div {...props}>
    <StatValue>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Body1>{value}</Body1>
        {valueLabel && <StatValueLabel>{valueLabel}</StatValueLabel>}
      </div>
      {delta && <StatDelta value={delta} />}
    </StatValue>
    {!isDrawer && <StatSubtitle>{caption}</StatSubtitle>}
  </div>
);

export const GraphLegendItem = styled("div")`
  color: ${(props) => (props.active ? "var(--turq)" : "var(--shade2)")};
  font-size: 0.875rem;
  line-height: 1.5;
  padding-left: var(--sp-4);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background: ${(props) => (props.active ? "var(--turq)" : "var(--shade2)")};
    height: 8px;
    width: 8px;
    left: 0;
    top: 5px;
  }
`;
