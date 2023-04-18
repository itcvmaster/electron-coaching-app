import React, { useLayoutEffect, useRef, useState } from "react";
import { styled } from "goober";
import { bisectCenter } from "d3-array";
import { pointer } from "d3-selection";

import {
  HorizontalGridLines,
  Tooltip,
  TooltipPortal,
  XAxis,
  YAxis,
} from "@/shared/ComponentsForChart.jsx";
import { getPointValue, prepareScales } from "@/util/helpers.mjs";

const Container = styled("div")`
  .chart-container-parent {
    font-family: "Inter", Arial, Helvetica, sans-serif;

    .horizontal-gridlines {
      stroke: var(--shade6);
      stroke-dasharray: 2, 4;
      stroke-width: 1px;
    }
  }

  .simple-line path {
    stroke-width: 2px;
  }

  .circle-overlay circle {
    stroke-width: 2px;
    stroke: hsl(240, 3%, 12%);
  }

  .circle-group {
    cursor: pointer;
    stroke-width: 3;
    stroke: var(--shade7);
  }

  .crosshair {
    stroke-width: 0;
    fill: #62626220;
    pointer-events: none;
  }

  .anchor-highlight {
    stroke-width: 7;
    fill: var(--shade3);
    stroke: var(--shade3);
  }

  .anchor-highlight circle {
    fill-opacity: 0;
    stroke-opacity: 0.3;
    -webkit-animation: anim 0.1s ease-in;
    animation: anim 0.1s ease-in;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    pointer-events: none;
  }

  .line {
    stroke-width: 2px;
    stroke: #62626250;
  }
  . @keyframes anim {
    from {
      stroke-width: 0px;
    }
    to {
      stroke-width: 7px;
    }
  }

  .anchor-highlight circle {
    fill-opacity: 0;
    stroke-opacity: 0.3;
    animation: anim 0.1s ease-in;
    animation-fill-mode: forwards;
    pointer-events: none;
  }

  .x-axis text {
    fill: var(--shade3);
    font-size: var(--sp-2_5);
  }
`;

/**
 * Renders a chart with x and y axis. The plot elements like line, area or circle which shows inside the visualization needs
 * to be passed in props.children. It creates horizontal gridlines and also shows a tooltip when provided a tooltipContent
 * function.
 * @param {Object} props - Chart properties
 * @param {Array<Object>} props.data - Chart data
 * Example:
 * data = [
 *    {
 *        Region: 'West',
 *        Sales: 200
 *    },
 *    {
 *        Region: 'South',
 *        Sales: 200
 *    }
 * ]
 * @param {string} props.xField - Name of the x-axis field. The data of this field will be used to derive
 * the domain of the x-axis and the x-positions of the plot elements.
 * @param {string} props.yField - Name of the y-axis field. The data of this field will be used to derive the domain
 * of the y-axis and the y positions of the plot elements.
 * @param {JSX.Element} React elements which will be rendered inside the chart.
 * @param {Object} xAxisConf - X Axis configuration
 * @param {string} xAxisConf.type - Type of xaxis scale - point, linear or time.
 * 1. Point scales are used for discrete string data.
 * 2. Linear scales are used for numerical data.
 * 3. Time scales are used for temporal data.
 * @param {number} xAxisConf.tickCount - Number of ticks
 * @param {boolean} xAxisConf.nice - Extends the domain for readability purpose.
 * @param {Function} xAxisConf.tickFormat - This function should return the formatted value of tick labels.
 * @param {Object} yAxisConf - Y Axis configuration. Configuration props are same as xaxis.
 * @param {boolean} showTooltipAtNearestX - Shows tooltip when mouse position is closest to any x-axis value.
 * @param {Object} tooltipConfig - Tooltip configuration.
 * @param {string} tooltipConfig.placement - Placement of tooltip. Currently, it can be placed only in left or top.
 * @param {boolean} tooltipConfig.showArrow - Show or hide the tooltip arrow.
 * @param {Function} tooltipContent - This function is called with the hovered data point. It should return a react element
 * which will be rendered in tooltip.
 */
function Chart({
  data,
  xField,
  yField,
  children,
  width,
  height,
  margin = { left: 20, right: 20, top: 20, bottom: 20 },
  xAxisConf,
  yAxisConf,
  className,
  onMouseMove = () => {},
  onMouseOver = () => {},
  onMouseOut = () => {},
  onClick = () => {},
  showTooltipAtNearestX = false,
  tooltipConfig = {},
  tooltipContent,
  viewMode = "desktop",
  showGridLines = true,
}) {
  const [tooltipState, setTooltipState] = useState({});
  const containerRef = useRef();
  const [boundingClientRect, setBoundingClientRect] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      setBoundingClientRect(container.getBoundingClientRect());
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  const containerWidth = width || boundingClientRect.width;
  const containerHeight = height || boundingClientRect.height;

  const innerWidth = containerWidth - margin.left - margin.right;
  const innerHeight = containerHeight - margin.top - margin.bottom;

  const yAxisWidth = yAxisConf.show ? 20 : 0;
  const axisGap = yAxisConf.show ? 15 : 0;
  const xRange = [margin.left + yAxisWidth + axisGap, innerWidth + margin.left];
  const yRange = [innerHeight + margin.top, margin.top];

  const { xScale, yScale, yTicks } = prepareScales({
    data,
    xAxisConf,
    yAxisConf,
    xField,
    yField,
    xRange,
    yRange,
  });

  const setTooltipProps = (dataPoint, pos) => {
    setTooltipState({
      visible: true,
      position: {
        left: pos.left,
        top: pos.top,
      },
      data: dataPoint,
    });
  };

  const chartMouseHandler = (eventType, targetType = "chart") => {
    return (event, targetData) => {
      const eventHandlers = {
        mouseover: onMouseOver,
        mousemove: onMouseMove,
        click: onClick,
      };
      const fn = eventHandlers[eventType];
      if (targetType === "chart") {
        const mousePos = pointer(event);
        const xValue = getPointValue(mousePos, xScale, xAxisConf);
        if (showTooltipAtNearestX) {
          let dataIndex;
          if (xAxisConf.type === "point" || xAxisConf.type === "band") {
            dataIndex = data.findIndex((d) => d[xField] === xValue);
          } else {
            dataIndex =
              xValue !== undefined
                ? bisectCenter(
                    data.map((d) => d[xField]),
                    xValue
                  )
                : -1;
          }
          if (dataIndex >= 0) {
            const boundBox = event.currentTarget.getBoundingClientRect();
            const dataPoint = data[dataIndex];
            const posX = mousePos[0];
            setTooltipProps(dataPoint, {
              left: boundBox.left + posX,
              top: boundBox.top + yScale(dataPoint[yField]),
            });

            fn({ xValue, xScale, yScale, dataPoint, event });
          }
        }
      } else {
        const boundBox = event.target.getBoundingClientRect();
        setTooltipProps(targetData, {
          left: boundBox.left,
          top: boundBox.top - 4,
        });
      }
    };
  };

  const handleChartMouseOut = (event) => {
    setTooltipState({ visible: false });
    onMouseOut(event);
  };

  const dimensions = width
    ? { width: `${containerWidth}px`, height: `${containerHeight}px` }
    : { width: "100%", height: height || "100%" };

  const xOffset =
    xAxisConf.orientation === "top"
      ? yScale.range()[1] - 5
      : yScale.range()[0] + 5;

  return (
    <Container>
      <div
        ref={containerRef}
        className="chart-container-parent"
        style={{
          ...dimensions,
          overflow:
            viewMode === "tablet" || viewMode === "mobile"
              ? "scroll"
              : "visible",
        }}
      >
        <svg
          width={containerWidth}
          height={containerHeight}
          className={className}
          style={{ overflow: "visible", pointerEvents: "all" }}
          onMouseOver={chartMouseHandler("mouseover")}
          onMouseMove={chartMouseHandler("mousemove")}
          onMouseOut={handleChartMouseOut}
          onClick={chartMouseHandler("click")}
        >
          {xAxisConf.show && (
            <XAxis
              xScale={xScale}
              xAxisConf={xAxisConf}
              offset={xOffset}
              className="x-axis"
            ></XAxis>
          )}
          {yAxisConf.show && (
            <YAxis
              yScale={yScale}
              yAxisConf={yAxisConf}
              offset={yAxisWidth + margin.left}
              tickValues={yTicks}
              className="y-axis"
            ></YAxis>
          )}
          {showGridLines && (
            <HorizontalGridLines
              xScale={xScale}
              yScale={yScale}
              ticks={yTicks}
              className="horizontal-gridlines"
            ></HorizontalGridLines>
          )}
          {React.Children.toArray(children).map((child, i) => {
            return (
              <child.type
                key={i}
                {...child.props}
                {...{
                  xScale,
                  yScale,
                  width: containerWidth,
                  height: containerHeight,
                  xField,
                  yField,
                  margin,
                  xAxisConf,
                  yAxisConf,
                  onMouseOver: (...params) => {
                    chartMouseHandler("mouseover", "plot")(
                      params[0].event,
                      params[0].data
                    );
                    if (child.props.onMouseOver)
                      child.props.onMouseOver(...params);
                  },
                  onMouseOut: (...params) => {
                    handleChartMouseOut(...params);
                    if (child.props.onMouseOut)
                      child.props.onMouseOut(...params);
                  },
                }}
              />
            );
          })}
        </svg>
        {tooltipState.visible && tooltipContent ? (
          <TooltipPortal>
            <Tooltip
              position={tooltipState.position}
              showArrow={tooltipConfig.showArrow}
              placement={tooltipConfig.placement}
              offsetX={tooltipConfig.offsetX}
              offsetY={tooltipConfig.offsetY}
            >
              {tooltipContent(tooltipState.data)}
            </Tooltip>
          </TooltipPortal>
        ) : null}
      </div>
    </Container>
  );
}

export default Chart;
