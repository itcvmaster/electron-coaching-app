import React, { useState } from "react";
import { styled } from "goober";

import Chart from "@/shared/Chart.jsx";
import {
  AreaWithGradient,
  Line,
  VerticalCrossHair,
} from "@/shared/ComponentsForChart.jsx";

const Container = styled("div")`
  .headshot-line {
    stroke-width: var(--sp-0_5);
    stroke: rgb(73, 180, 255);
  }

  .crosshair {
    stroke-width: var(--sp-0);
    fill: #62626220;
    pointer-events: none;
  }

  @keyframes anim {
    from {
      stroke-width: var(--sp-0);
    }
    to {
      stroke-width: var(--sp-1_5);
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
    stroke-width: var(--sp-0_5);
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
  tooltipContent,
  xAxisConf,
  yAxisConf,
  images,
  tooltipConfig,
}) {
  const [hoverPoint, setHoverPoint] = useState(null);

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
          showGridLines={false}
          images={images}
          onMouseOver={handleChartMouseOver}
          onMouseOut={handleChartMouseOut}
          onMouseMove={handleChartMouseOver}
          showTooltipAtNearestX={true}
          tooltipContent={tooltipContent}
          tooltipConfig={tooltipConfig}
        >
          <AreaWithGradient
            data={data}
            xField={xField}
            yField={yField}
            className={"area-with-gradient"}
          />
          <Line data={data} className="headshot-line" />
          {hoverPoint && (
            <VerticalCrossHair
              className="crosshair"
              xStart={hoverPoint.xStart}
              xEnd={hoverPoint.xEnd}
              yStart={hoverPoint.yStart}
              yEnd={hoverPoint.yEnd}
            />
          )}
        </Chart>
      </div>
    </Container>
  );
}

export default GraphComponent;
