import { bisect, max, min, range as d3range } from "d3-array";
import { scaleBand, scaleLinear, scalePoint, scaleTime } from "d3-scale";

const scaleTypes = {
  point: scalePoint,
  band: scaleBand,
  time: scaleTime,
  linear: scaleLinear,
};

export const createScale = (scaleType, { domain, range, nice, tickCount }) => {
  const scale = scaleTypes[scaleType]().domain(domain).rangeRound(range);
  if (tickCount) scale.ticks(tickCount);
  if (nice !== undefined && nice !== false && scale.nice) scale.nice();
  // scale && scale.padding(padding);
  return scale;
};

export function toFixedNumber(number, precision) {
  return Number(number.toFixed(precision));
}

export function sanitizeNumber(number) {
  return Number.isNaN(number) ? 0 : number;
}

export function calcRate(num, total, fraction = 0) {
  const result = num / (total > 0 ? total : 1);
  const sanitized = sanitizeNumber(result);
  return fraction ? toFixedNumber(sanitized, fraction) : sanitized;
}

export function displayRate(count, totalCount, tiesCount = 0, fraction = 0) {
  if (totalCount > 0) {
    const rate = calcRate(count + tiesCount * 0.5, totalCount);
    return rate.toLocaleString("en", {
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
      style: "percent",
    });
  }
  return "-";
}

// KDA
export function calcKDA(kills, deaths, assists, fraction = 1) {
  return calcRate(kills + assists, deaths, fraction);
}

export function convertQueryToWriteStatePath(data) {
  const urlParams = new URLSearchParams(data);
  return urlParams.toString();
}

export const formatGameTime = (sec) =>
  `${~~(sec / 60)}:${`00${~~(sec % 60)}`.slice(-2)}`;

const DEFAULT_PADDING = 0.2;
const getMostSignificant = (num) =>
  Math.log(num) < 0 ? Math.ceil(Math.abs(Math.log10(num))) : 0;

const getChartConfigs = ([min, max]) => {
  const padding = DEFAULT_PADDING;
  let places = getMostSignificant(max);
  places = places > 1 ? 2 : places;
  const offset = (max - min) * padding;
  max += offset;
  min -= offset;
  return [max, min, max - min, places];
};

const getTickValues = (yDomain, numIntervals = 8) => {
  const [, min, amplitude] = getChartConfigs(yDomain);
  const interval = amplitude / (numIntervals - 1);

  let ticks = [];
  for (let i = 0; i < numIntervals; i++) {
    const value = min + i * interval;
    ticks.push(value);
  }
  ticks = ticks.map((tick) => Number(tick % 1 === 0 ? tick : tick));
  return ticks;
};

function scalePointPosition(xScale, xPos) {
  const domain = xScale.domain();
  const range = xScale.range();
  const rangePoints = d3range(
    range[0] - xScale.step() / 2,
    range[1] + xScale.step() / 2,
    xScale.step()
  );
  const yPos = domain[bisect(rangePoints, xPos) - 1];
  return yPos;
}

const getPointValue = (mousePos, xScale, xAxisConf) => {
  const x = mousePos[0];
  const xValue =
    xAxisConf.type === "point"
      ? scalePointPosition(xScale, x)
      : xScale.invert(x);
  return xValue;
};

const prepareXScale = ({ xAxisConf, xField, data, xRange }) => {
  const xDomain =
    xAxisConf.type === "linear" || xAxisConf.type === "time"
      ? [min(data, (d) => d[xField]), max(data, (d) => d[xField])]
      : [...new Set(data.map((d) => d[xField]))];
  return createScale(xAxisConf.type, {
    domain: xDomain,
    range: xRange,
    nice: false,
    tickCount: xAxisConf.tickCount,
  });
};

const prepareYScale = ({ yAxisConf, yField, data, yRange }) => {
  const yDomain =
    yAxisConf.type === "linear" || yAxisConf.type === "time"
      ? [min(data, (d) => d[yField]), max(data, (d) => d[yField])]
      : [...new Set(data.map((d) => d[yField]))];
  const tickValues =
    yAxisConf.tickValues ||
    (yAxisConf.tickCount && !yAxisConf.useD3Ticks
      ? getTickValues(yDomain, yAxisConf.tickCount)
      : null);

  return {
    yScale: createScale(yAxisConf.type, {
      domain: tickValues
        ? [min([...tickValues, yDomain[0]]), max([...tickValues, yDomain[1]])]
        : yDomain,
      range: yRange,
      nice: yAxisConf.nice,
      tickCount: yAxisConf.tickCount,
    }),
    tickValues,
  };
};

const prepareScales = ({
  xAxisConf,
  yAxisConf,
  data,
  xField,
  yField,
  xRange,
  yRange,
}) => {
  const xScale = prepareXScale({ xAxisConf, xField, data, xRange });
  const { yScale, tickValues } = prepareYScale({
    yAxisConf,
    yField,
    data,
    yRange,
  });

  return {
    xScale,
    yScale,
    yTicks: tickValues || yScale.ticks(yAxisConf.tickCount),
  };
};

function msToHMS(ms) {
  let seconds = ms / 1000;
  const hours = parseInt(seconds / 3600);
  seconds = parseInt(seconds % 60);
  const minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);
  const hoursStr = ("00" + hours).slice(-2);
  const minutesStr = ("00" + minutes).slice(-2);
  const secondsStr = ("00" + seconds).slice(-2);
  return hoursStr + ":" + minutesStr + ":" + secondsStr;
}

// https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707#gistcomment-3677597
function camelCaseToKebabCase(string) {
  return string
    .replace(/\B([A-Z])(?=[a-z])/g, "-$1")
    .replace(/\B([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  camelCaseToKebabCase,
  delay,
  getPointValue,
  getTickValues,
  msToHMS,
  prepareScales,
};
