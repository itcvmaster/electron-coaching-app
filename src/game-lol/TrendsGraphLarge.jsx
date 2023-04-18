import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "clutch";

import { StatInfo } from "@/game-lol/Trends.style.jsx";
import SimpleLine from "@/shared/SimpleLineChart.jsx";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const Tooltip = ({ patch, value }) => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="type-overline">
        {t("lol:patchVersion", "Patch {{version}}", {
          version: patch,
        })}
      </span>
      <p className="type-subtitle2">
        {t("lol:percentWinrate", "{{winrate}}% Win Rate", {
          winrate: value,
        })}
      </p>
    </div>
  );
};

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
};

const numberOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const TrendGraphLarge = ({
  title,
  points,
  valueType = "percent",
  valueLabel,
  numIntervals,
  height,
  precision = 2,
}) => {
  const last = (points[points.length - 1] || {}).value;
  const secondLast = (points[points.length - 2] || {}).value;
  const trend = points.map((p) => ({ x: p.patch, y: p.value }));

  const valueOptions = valueType === "percent" ? percentOptions : numberOptions;
  const value = getLocaleString(last, valueOptions);
  const delta = getLocaleString(last - secondLast, valueOptions);
  const isPositive =
    points[points.length - 1]?.value >= points[points.length - 2]?.value;
  const chartConfig = {
    margin: { left: 70, right: 20, top: 20, bottom: 20 },
    xAxisConf: { visible: false },
    yAxisConf: {
      visible: true,
      ticks: numIntervals,
      tickRenderer: (yVal) => {
        return getLocaleString(yVal, valueOptions);
      },
    },
  };

  const tooltipContent = useCallback(
    (data) => {
      const precisionOptions = {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      };

      return (
        <Tooltip
          patch={data.x}
          value={getLocaleString(data.y, precisionOptions)}
        />
      );
    },
    [precision]
  );

  return (
    <Card title={title}>
      <div className="flex align-center">
        <StatInfo
          value={value}
          delta={delta}
          valueLabel={valueLabel}
          style={{ marginBottom: 16 }}
        />
      </div>
      <SimpleLine
        margin={chartConfig.margin}
        data={trend}
        xField="x"
        yField="y"
        height={height}
        xAxisConf={chartConfig.xAxisConf}
        yAxisConf={chartConfig.yAxisConf}
        color={isPositive ? "var(--blue)" : "var(--red)"}
        circleRadius={5}
        showGridLines={true}
        tooltipContent={tooltipContent}
      />
    </Card>
  );
};

export default TrendGraphLarge;
