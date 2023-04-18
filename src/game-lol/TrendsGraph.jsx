import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { StatInfo } from "@/game-lol/Trends.style.jsx";
import SimpleLine from "@/shared/SimpleLineChart.jsx";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const Container = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-9);
  padding-right: var(--sp-2_5);

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const StatTitle = styled("div")`
  font-size: var(--sp-3_5);
  color: var(--shade1);
`;

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

const chartConfig = {
  margin: { left: 8, right: 5, top: 5, bottom: 5 },
  xAxisConf: { visible: false },
  yAxisConf: { visible: false },
};

const percentOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
};

const TrendGraph = ({ title, points, precision = 2, hideGraph, isDrawer }) => {
  const { t } = useTranslation();
  const last = (points[points.length - 1] || {}).value;
  const secondLast = (points[points.length - 2] || {}).value;
  const trend = points.map((p) => ({ x: p.patch, y: p.value }));

  const value = getLocaleString(last, percentOptions);
  const delta = getLocaleString(last - secondLast, percentOptions);
  const isPositive =
    points[points.length - 1]?.value >= points[points.length - 2]?.value;

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
    <Container isdrawer={isDrawer}>
      <div>
        <StatTitle isdrawer={isDrawer}>{title}</StatTitle>
        <StatInfo
          isdrawer={isDrawer}
          value={value}
          delta={delta}
          caption={t("lol:championsPage.vsLastPatch", "vs last patch")}
        />
      </div>
      {hideGraph ? null : (
        <SimpleLine
          showGridLines={false}
          margin={chartConfig.margin}
          data={trend}
          xField="x"
          yField="y"
          width={105}
          height={35}
          xAxisConf={chartConfig.xAxisConf}
          yAxisConf={chartConfig.yAxisConf}
          color={isPositive ? "var(--blue)" : "var(--red)"}
          circleRadius={5}
          tooltipContent={tooltipContent}
        />
      )}
    </Container>
  );
};

export default TrendGraph;
