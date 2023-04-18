import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { getGraphPoints, meanBy } from "@/game-val/utils.mjs";
import BlitzCaretDown from "@/inline-assets/caret-down.svg";
import BlitzCaretUp from "@/inline-assets/caret-up.svg";

const GRAPH_POINTS = 10;
const GRAPH_TOP_MARGIN = 5; // [px]
const GRAPH_BOTTOM_MARGIN = 5; // [px]
const CONTAINER_BORDER_RADIUS = 0; // [px]

const Link = styled("a")``;

const SimpleLineChart = (props) => {
  const {
    type,
    data,
    /*xKey,*/ yKey,
    /*yRenderer,*/ color,
    idx,
    ...restProps
  } = props;
  let realData;
  if (data.length > GRAPH_POINTS) {
    realData = data.slice(data.length - GRAPH_POINTS);
  } else {
    realData = data;
  }
  const { t } = useTranslation();
  const [tooltipVisible, setTooltipVisible] = useState({
    visible: false,
    point: null,
    index: null,
  });
  const {
    values: graphValues,
    avgValue,
    maxValue,
    minValue,
  } = useMemo(() => {
    if (!realData)
      return {
        avgValue: 0,
        maxValue: 0,
        maxIndex: 0,
        minValue: 0,
      };

    const values = realData.map((v) => v[yKey] || 0);
    const minValue = Math.min(...values);
    const minIndex = values.indexOf(minValue);
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    const avgValue = values.length > 0 ? meanBy(values) : 0;

    return {
      values,
      avgValue,
      maxValue,
      maxIndex,
      minValue,
      minIndex,
    };
  }, [realData, yKey]);
  const { graphPoints, graphWidth, graphHeight, avgPoint, showGraphPoints } =
    useMemo(() => {
      const graphBoundingclientRect = { width: 332, height: 80 };
      if (graphValues) {
        const { width, height } = graphBoundingclientRect;

        const { graphPoints, startPoint, endPoint, avgPoint } = getGraphPoints({
          graphHeight: height,
          graphWidth: width,
          pointCount: GRAPH_POINTS,
          graphValues,
          isStretch: false,
          isReversedX: false,
          margin: {
            marginTop: GRAPH_TOP_MARGIN,
            marginBottom: GRAPH_BOTTOM_MARGIN,
          },
          limits: {
            maxValue,
            minValue,
            avgValue,
          },
          isLeftAligned: true,
        });

        return {
          graphPoints,
          graphWidth: width,
          graphHeight: height,
          avgPoint,
          startPoint,
          endPoint,
          showGraphPoints: [startPoint, ...graphPoints],
          hightlightPts: [],
        };
      }

      return {
        graphPoints: null,
        showGraphPoints: null,
        graphWidth: 0,
        graphHeight: 0,
        avgPoint: { posX: 0, posY: 0 },
        startPoint: { posX: 0, posY: 0 },
        endPoint: { posX: 0, posY: 0 },
      };
    }, [graphValues, maxValue, minValue, avgValue]);

  const { tooltipLabel, tooltipUnit } = useMemo(() => {
    let label = "";
    let unit = "";

    switch (type) {
      case "crosshair-placement":
        label = t("val:avgHeadshotPercent", "Avg.Dist");
        unit = "%";
        break;
      case "spray-control":
        label = t("val:avgHeadshotPercent", "Avg.Acc");
        unit = "%";
        break;
      default:
        label = t("val:avgHeadshotPercent", "Avg.HS");
        unit = "%";
    }

    return {
      tooltipLabel: label,
      tooltipUnit: unit,
    };
  }, [type, t]);

  const polyPoints = useMemo(() => {
    if (!showGraphPoints || showGraphPoints.length <= 1) return "";
    return showGraphPoints.length >= GRAPH_POINTS
      ? showGraphPoints
          .map((point) => `${point.posX || 0},${point.posY || 0}`)
          .join(",")
      : showGraphPoints
          .map((point) => `${point.posX || 0},${point.posY || 0}`)
          .join(",");
  }, [showGraphPoints]);

  if (!realData) return null;

  return (
    <ChartContainer {...restProps}>
      <ChartWrapper>
        <GraphContainer>
          {/* Dash Line for Your Rank */}
          <DashLine
            avggold={avgPoint.posY}
            style={{ top: (avgPoint.posY || 32) + "px !important" }}
          />

          <LinesContainer>
            {/* Background Gradient Tiles */}
            <GridBackground>
              {Array(GRAPH_POINTS)
                .fill(0)
                .map((val, index) => {
                  if (
                    realData &&
                    index < realData.length &&
                    realData[index].link
                  ) {
                    return (
                      <GridItem
                        key={index}
                        href={realData[index].link}
                        as={Link}
                        onMouseEnter={() => {
                          setTooltipVisible({
                            visible: true,
                            point: showGraphPoints[index],
                            index,
                          });
                        }}
                        onMouseLeave={() => {
                          setTooltipVisible({ visible: false });
                        }}
                      />
                    );
                  }
                  return <GridNoneItem key={index} />;
                })}
            </GridBackground>

            {/* Graph for Main LP data */}
            <svg height={graphHeight} width={graphWidth} className="main-graph">
              <defs>
                <filter id={"filter" + idx} x="0" y="0">
                  <feDropShadow
                    dx="0"
                    dy="100"
                    stdDeviation="80"
                    floodColor={color}
                    floodOpacity="0.57"
                  />
                  <feDropShadow
                    dx="0"
                    dy="41"
                    stdDeviation="33"
                    floodColor={color}
                    floodOpacity="0.40"
                  />
                  <feDropShadow
                    dx="0"
                    dy="22"
                    stdDeviation="17"
                    floodColor={color}
                    floodOpacity="0.33"
                  />
                  <feDropShadow
                    dx="0"
                    dy="12"
                    stdDeviation="10"
                    floodColor={color}
                    floodOpacity="0.29"
                  />
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="5"
                    floodColor={color}
                    floodOpacity="0.23"
                  />
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="2"
                    floodColor={color}
                    floodOpacity="0.16"
                  />
                </filter>
              </defs>

              {showGraphPoints && showGraphPoints.length > 1 && (
                <polyline
                  fill="none"
                  stroke={color ? color : "var(--shade3)"}
                  strokeWidth="2"
                  points={polyPoints}
                  filter={`url(#filter${idx})`}
                  className="line-graph-path"
                />
              )}
            </svg>
          </LinesContainer>

          {/* Dot Points of Graph Line */}
          <LineGraphPoints>
            {graphPoints &&
              graphPoints.map((point, index) => {
                return (
                  <React.Fragment key={index}>
                    {tooltipVisible.visible &&
                      tooltipVisible.index === index &&
                      realData[index].tooltipData && (
                        <>
                          <GraphPoint
                            style={{
                              top: point.posY - 6 + "px",
                              left: point.posX - 6 + "px",
                              background: color,
                            }}
                          />

                          <MatchTooltip
                            style={{
                              top: point.posY + 32 + "px",
                              left: point.posX + "px",
                            }}
                          >
                            <AvgHS>
                              <AvgHSLabel>{tooltipLabel}</AvgHSLabel>
                              <AvgHSValue>
                                {parseInt(
                                  realData[index].tooltipData[yKey].avg
                                )}
                                {tooltipUnit}
                              </AvgHSValue>
                            </AvgHS>
                            <CurrentHS>
                              <ProfileIcon
                                src={realData[index].tooltipData.playerIcon}
                              />
                              <TrendBg
                                className={
                                  realData[index].tooltipData[yKey].current >=
                                  realData[index].tooltipData[yKey].avg
                                    ? ""
                                    : "red"
                                }
                              >
                                <CurrentHSValue>
                                  {parseInt(
                                    realData[index].tooltipData[yKey].current
                                  )}
                                  {tooltipUnit}
                                </CurrentHSValue>
                                <TrendHighlightIcon>
                                  {data[index].tooltipData[yKey].current >=
                                  data[index].tooltipData[yKey].avg ? (
                                    <BlitzCaretUp />
                                  ) : (
                                    <BlitzCaretDown />
                                  )}
                                </TrendHighlightIcon>
                              </TrendBg>
                            </CurrentHS>
                          </MatchTooltip>
                        </>
                      )}
                  </React.Fragment>
                );
              })}
          </LineGraphPoints>
        </GraphContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default SimpleLineChart;

const ChartContainer = styled("div")`
  width: 100%;
  height: 100%;
`;

const ChartWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const GraphContainer = styled("div")`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${CONTAINER_BORDER_RADIUS}px;
`;

const DashLine = styled("div")`
  position: absolute;
  width: 100%;
  border-top: 1px dashed var(--shade3);
  opacity: 0.2;
`;

const LinesContainer = styled("div")`
  position: relative;
  display: flex;
  height: 100%;

  & > svg {
    z-index: 1;
  }
`;
const ProfileIcon = styled("div")`
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  background: var(--shade9);
  background: ${(props) => `url(${props.src})`} no-repeat center;
  background-size: cover;
  border-radius: var(--br) var(--sp-0) var(--sp-0) var(--br);
  object-fit: cover;
  object-position: var(--sp-0) var(--sp-0);
`;
const MatchTooltip = styled("div")`
  position: absolute;
  background: rgba(7, 8, 14, 0.9);
  box-shadow: var(--sp-0) var(--sp-1_5) var(--sp-1_5) rgba(7, 14, 29, 0.22),
    var(--sp-0) var(--sp-2_5) var(--sp-5) rgba(7, 14, 29, 0.14);
  border-radius: var(--br);
  padding: var(--sp-2_5) var(--sp-1) var(--sp-1) var(--sp-1);
  width: 128px;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
`;
const AvgHS = styled("div")`
  display: flex;
  padding-left: var(--sp-2);
  padding-right: var(--sp-2);
`;
const AvgHSValue = styled("span")`
  margin-left: auto;
  float: right;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  font-weight: bold;
  letter-spacing: -0.009em;
  padding-left: var(--sp-3);
  color: var(--shade1);
`;
const AvgHSLabel = styled("span")`
  float: left;
  font-weight: bold;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  color: var(--shade0);
  letter-spacing: -0.009em;
`;
const CurrentHS = styled("div")`
  display: flex;
  margin-top: var(--sp-1_5);
`;
const CurrentHSValue = styled("span")`
  font-weight: bold;
  font-size: var(--sp-3);
  letter-spacing: -0.009em;
  padding-left: var(--sp-2_5);
  margin-top: auto;
  margin-bottom: auto;
`;
const TrendHighlightIcon = styled("span")`
  padding-top: var(--sp-0);
  padding-left: var(--sp-0);
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: var(--sp-3_5);
`;
const TrendBg = styled("div")`
  display: flex;
  flex: 1;
  background: linear-gradient(90deg, #30d9d41a 0%, #30d9d400 100%);
  color: #30d9d4;

  &.red {
    background: linear-gradient(90deg, #e44c4d1a 0%, #e44c4d00 100%);
    color: #e44c4d;
  }
`;

const GridBackground = styled("div")`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const GridItem = styled("div")`
  width: calc(100% / ${GRAPH_POINTS});
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  z-index: 0;

  &:hover {
    background: linear-gradient(
      180deg,
      rgba(34, 37, 43, 0) 0%,
      #22252b 100%
    ) !important;
    opacity: 0.4 !important;
  }
`;
const GridNoneItem = styled("div")`
  width: calc(100% / ${GRAPH_POINTS});
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: auto;
  z-index: 0;
`;
const LineGraphPoints = styled("div")``;
const GraphPoint = styled("div")`
  display: flex;
  position: absolute;
  width: var(--sp-3);
  height: var(--sp-3);
  border-radius: 50%;
  border: 2px solid #181b21;
  cursor: pointer;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
`;
