import React, { useState } from "react";
import { styled } from "goober";

import Chart from "@/shared/Chart.jsx";
import { Circle, Line, Triangle } from "@/shared/ComponentsForChart.jsx";

const Container = styled("div")`
  .line {
    stroke-width: 2px;
    stroke: #62626250;
  }

  .crosshair {
    stroke-width: 0px;
    fill: #62626220;
    pointer-events: none;
  }

  @keyframes anim {
    from {
      stroke-width: 0px;
    }
    to {
      stroke-width: 6px;
    }
  }

  .anchor-highlight circle {
    fill-opacity: 0;
    stroke-opacity: 0.3;
    animation: anim 0.1s ease-in;
    animation-fill-mode: forwards;
    pointer-events: none;
  }

  .circle-overlay circle {
    stroke-width: 2px;
    stroke: hsl(240, 3%, 12%);
  }
`;

function GraphComponent({
  data,
  xField,
  yField,
  height,
  width,
  margin,
  circleRadius,
  tooltipContent,
  xAxisConf,
  yAxisConf,
  images,
  circleColor,
  tooltipConfig,
}) {
  const [hoverPoint, setHoverPoint] = useState(null);
  const [hoverPointData, setHoverPointData] = useState(null);

  const handleChartMouseOver = ({ xScale, dataPoint }) => {
    if (dataPoint) {
      const step = xAxisConf.type === "point" ? xScale.step() : 0;
      setHoverPoint({
        data: dataPoint,
        xStart: xScale(dataPoint[xField]) - step / 2,
        xEnd: xScale(dataPoint[xField]) + step / 2,
        yStart: 0,
        yEnd: height,
      });
    } else {
      setHoverPoint(null);
    }
  };

  const handleChartMouseOut = () => {
    setHoverPoint(null);
  };

  const chartMargin = { ...margin, left: margin.left };

  return (
    <Container>
      <div className="binary-chart">
        <Chart
          data={data}
          xField={xField}
          yField={yField}
          xAxisConf={xAxisConf}
          yAxisConf={yAxisConf}
          width={width}
          height={height}
          margin={chartMargin}
          showGridLines={true}
          images={images}
          onMouseOver={handleChartMouseOver}
          onMouseOut={handleChartMouseOut}
          onMouseMove={handleChartMouseOver}
          showTooltipAtNearestX={false}
          tooltipContent={tooltipContent}
          tooltipConfig={tooltipConfig}
          circleColor={circleColor}
        >
          <Line className="line" data={data} />
          <Circle
            data={data}
            className="circle-group"
            radius={circleRadius}
            color={circleColor}
            onMouseOver={({ data: pointData }) => {
              setHoverPointData(pointData);
              setHoverPoint(pointData);
            }}
            onMouseOut={() => {
              setHoverPointData(null);
              setHoverPoint(null);
            }}
          />

          <Triangle data={data} imageSize={16} dy={10} />
          <Circle
            className="anchor-highlight"
            radius={10}
            xField={xField}
            yField={yField}
            data={hoverPoint ? [hoverPoint] : []}
            css={`
              stroke-width: 7;
              fill: ${hoverPointData
                ? circleColor(hoverPointData)
                : "var(--shade3)"};
              stroke: ${hoverPointData
                ? circleColor(hoverPointData)
                : "var(--shade3)"};
            `}
          />
        </Chart>
      </div>
    </Container>
  );
}

export default GraphComponent;
