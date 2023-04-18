import React from "react";

import { H6 } from "@/game-lol/CommonComponents.jsx";
import { getWinRateColor } from "@/game-lol/util.mjs";
import { calcRate } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const WinRateText = ({
  wins,
  total,
  precision = 1,
  overrideColor,
  ...restProps
}) => {
  const percentOptions = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    style: "percent",
  };

  let winrate = calcRate(wins, total);
  if (total === 0) {
    winrate = "-";
  }

  const getColor = () => {
    if (overrideColor) {
      return overrideColor;
    } else if (total === 0) {
      return "var(--shade0)";
    }
    return getWinRateColor(winrate * 100);
  };

  return (
    <H6 style={{ color: getColor() }} {...restProps}>
      {winrate === "-"
        ? winrate
        : getLocaleString(winrate, percentOptions) + "%"}{" "}
    </H6>
  );
};

export default WinRateText;
