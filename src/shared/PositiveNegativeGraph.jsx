/* eslint-disable i18next/no-literal-string */
import React from "react";
import { styled } from "goober";
import { easeLinear } from "d3-ease";
import { transition } from "d3-transition";

import { Area, Circle, Line } from "@/shared/ComponentsForChart.jsx";
import { useD3 } from "@/util/use-d3.mjs";

const AreaPositive = styled(Area)`
  fill: var(--turq);
  opacity: 0.15;
`;
const AreaNegative = styled(Area)`
  fill: var(--red);
  opacity: 0.15;
`;

export default function PositiveNegativeGraph({
  data,
  xField,
  yField,
  xScale,
  yScale,
  width,
  height,
  circleRadius,
  onMouseOver,
  onMouseOut,
}) {
  const commonProps = { xField, yField, xScale, yScale, data };
  const transitionDuration = 350;
  const animate = (clipPath) => {
    const t = transition().duration(transitionDuration).ease(easeLinear);

    clipPath.transition(t).attr("width", width + 5);
  };

  return (
    <>
      <g>
        <clipPath id="positiveLine">
          <rect
            ref={useD3(animate)}
            x={0}
            y={0}
            width={0}
            height={yScale(0) + 1}
          ></rect>
        </clipPath>
        <clipPath id="negativeLine">
          <rect
            ref={useD3(animate)}
            x={0}
            y={yScale(0) + 1}
            width={0}
            height={height - yScale(0)}
          ></rect>
        </clipPath>
        <clipPath id="plotArea">
          <rect
            ref={useD3(animate)}
            x={0}
            y={0}
            width={0}
            height={height + 5}
          ></rect>
        </clipPath>
      </g>
      <Line
        className="line-positive-group"
        clipPathId="positiveLine"
        {...commonProps}
      ></Line>
      <Line
        className="line-negative-group"
        clipPathId="negativeLine"
        {...commonProps}
      ></Line>
      <AreaPositive
        className="area-positive-group"
        clipPathId="positiveLine"
        {...commonProps}
      />
      <AreaNegative
        className="area-negative-group"
        clipPathId="negativeLine"
        {...commonProps}
      />
      <Circle
        clipPathId="plotArea"
        radius={circleRadius}
        className="circle-group"
        color={(d) => (yField && d[yField] >= 0 ? "var(--turq)" : "var(--red)")}
        style={{ stroke: "none" }}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        {...commonProps}
      ></Circle>
    </>
  );
}
