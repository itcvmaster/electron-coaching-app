import React, { forwardRef, useMemo } from "react";
import { keyframes, styled } from "goober";

import useResizeObserver from "@/util/use-resize-observer.mjs";

const xAxisDefault = {
  visible: false,
  ticks: 0,
  tickRenderer: () => {},
};

const yAxisDefault = {
  visible: true,
  ticks: 7,
  tickRenderer: () => {},
};
const marginDefault = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
const genTicks = (conf, size, offset, toScreen, toValue) => {
  if (!conf) return [];
  if (!conf.visible) return [];

  if (Array.isArray(conf.ticks)) {
    if (typeof conf.ticks[0] === "number") {
      return conf.ticks.map((tick) => ({
        label: tick,
        pos: toScreen(tick),
      }));
    }
    return conf.ticks.map((tick, idx) => {
      return {
        label: tick,
        pos: (offset + (idx * size) / (conf.ticks.length - 1)).toFixed(0),
      };
    });
  }

  const tickCount = conf.ticks - 1 || 1;
  const tickWidth = size || 1;
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const tickPos = offset + i * (tickWidth / tickCount);
    ticks.push({
      label: conf.tickRenderer
        ? conf.tickRenderer(toValue(tickPos))
        : toValue(tickPos),
      pos: tickPos.toFixed(0),
    });
  }
  return ticks;
};

const SimpleLineChart = (props) => {
  const {
    data,
    yField,
    width,
    height,
    color,
    circleRadius = 6,
    showGridLines = false,
    margin = marginDefault,
    xAxisConf = xAxisDefault,
    yAxisConf = yAxisDefault,
  } = props;
  const [graphContainerRef, boundingClientRect] = useResizeObserver();

  // get container width and height
  const { graphWidth, graphHeight } = useMemo(() => {
    return {
      graphWidth: width || boundingClientRect?.width || 0,
      graphHeight: height || boundingClientRect?.height || 0,
    };
  }, [width, height, boundingClientRect]);

  // calc min and max of data.
  const { yMin, yMax } = useMemo(() => {
    let yValues = [];
    if (Array.isArray(yAxisConf.ticks)) {
      yValues = yAxisConf.ticks;
    } else {
      yValues = data?.map((v) => v[yField]) || [0];
    }

    return {
      yMin: Math.min(...yValues),
      yMax: Math.max(...yValues),
    };
  }, [data, yField, yAxisConf]);

  // calc graph points
  const [graphPoints, yAxisTicks, xAxisTicks] = useMemo(() => {
    const xStrength = data?.length - 1 || 1;
    const yStrength = yMax - yMin || 1;
    const { left = 0, right = 0, bottom = 0, top = 0 } = margin;
    const xScale = (graphWidth - left - right) / xStrength;
    const yScale = (graphHeight - top - bottom) / yStrength;

    const y2Screen = (yValue) =>
      graphHeight - bottom - (yValue - yMin) * yScale || 0;
    const y2Value = (yPos) => (graphHeight - bottom - yPos) / yScale + yMin;
    const x2Screen = (xValue) => left + xValue * xScale || 0;
    const x2Value = (xPos) => (xPos - left) / xScale;

    const yTicks = genTicks(
      yAxisConf,
      graphHeight - top - bottom,
      top,
      y2Screen,
      y2Value
    );
    const xTicks = genTicks(
      xAxisConf,
      graphWidth - left - right,
      left,
      x2Screen,
      x2Value
    );
    return [
      data?.map((v, idx) => {
        return {
          ...v,
          x: left + idx * xScale,
          y: y2Screen(v[yField]),
        };
      }),
      yTicks,
      xTicks,
    ];
  }, [
    graphWidth,
    graphHeight,
    yMin,
    yMax,
    yField,
    data,
    margin,
    yAxisConf,
    xAxisConf,
  ]);

  // get svg path
  const svgPath = graphPoints?.reduce(
    (acc, v, idx) => (idx === 0 ? `M${v.x},${v.y}` : `${acc}L${v.x},${v.y}`),
    ""
  );

  const svgDimensions = {
    width: width ? graphWidth : undefined,
    height: height ? graphHeight : undefined,
  };

  return (
    <GraphContainer ref={graphContainerRef}>
      <LinesContainer color={color ? color : "var(--shade3)"}>
        {/* Graph for Main LP data */}
        <svg {...svgDimensions} className="main-graph">
          <g className="y-axis">
            {yAxisConf?.visible &&
              yAxisTicks.map((v, i) => (
                <g key={i} className="tick">
                  <text x={margin?.left || 0} y={v.pos} dy={3}>
                    {v.label}
                  </text>
                </g>
              ))}
          </g>
          <g className="x-axis">
            {xAxisConf?.visible &&
              xAxisTicks.map((v, i) => (
                <g key={i} className="tick">
                  <text x={v.pos} y={graphHeight} dx={3}>
                    {v.label}
                  </text>
                </g>
              ))}
          </g>
          <g className="grid-lines" fill="none">
            {showGridLines &&
              yAxisTicks.map((v, i) => {
                const svgHorizLinePath = `M${margin?.left || 0},${v.pos} L${
                  graphWidth - margin?.right
                },${v.pos}`;
                return <path key={i} d={svgHorizLinePath} />;
              })}
          </g>
          <g className="graph-lines">
            {graphPoints?.length > 0 && <path d={svgPath} />}
          </g>
          <g className="circle-points">
            {graphPoints?.map((p, idx) => {
              const spread = {
                cx: p.x,
                cy: p.y,
                r: circleRadius,
              };
              if (typeof data[idx].color === "string") {
                spread.style = {
                  fill: data[idx].color,
                };
              }
              return <circle key={idx} {...spread} />;
            })}
          </g>
        </svg>
      </LinesContainer>
    </GraphContainer>
  );
};

export default SimpleLineChart;

const GraphContainer = styled("div", forwardRef)`
  display: flex;
  height: 100%;
  position: relative;
`;

const AnimStroke = keyframes`
  from {
    stroke-width: 0px;
  }
  to {
    stroke-width: 6px;
  }
`;

const LinesContainer = styled("div")`
  position: relative;
  display: flex;
  height: 100%;

  .main-graph {
    z-index: 1;
    overflow: visible;
    pointer-events: all;
    max-width: 100%;
  }

  .circle-points {
    fill: ${(props) => props.color};
    stroke-width: 2;
    stroke: #1e1e20;

    circle:hover {
      stroke: ${(props) => props.color};
      stroke-opacity: 0.3;
      stroke-width: 6;
      r: 4;
      animation: ${AnimStroke} 0.1s ease-in;
    }
  }

  .graph-lines {
    stroke: ${(props) => props.color};
    stroke-width: 2;
    fill: none;
  }

  .grid-lines {
    stroke: var(--shade6);
    stroke-width: 1px;
    stroke-dasharray: 2, 4;
  }

  .tick {
    letter-spacing: 2.3px;
    fill: var(--shade3);
    font-size: 16px;
  }

  .y-axis {
    text-anchor: end;
    transform: translateX(-12px);
  }

  .x-axis {
    text-anchor: middle;
    transform: translateY(-20px);
  }
`;
