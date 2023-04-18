import React from "react";
import ReactDOMServer from "react-dom/server";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

import { updateRoute } from "@/__main__/router.mjs";
import { COACHING_IMAGES } from "@/game-val/constants.mjs";
import SimpleLineChart from "@/game-val/SimpleLineChart.jsx";
import { useRoute } from "@/util/router-hooks.mjs";
//import SimpleLineChart  from "@/Shared/SimpleLineChart";

const StatsRow = (props) => {
  const { title, value } = props;
  return (
    <StatsRowContainer>
      <StatsRowTitle>{title}</StatsRowTitle>
      <StatsRowValue>{value}</StatsRowValue>
    </StatsRowContainer>
  );
};

const StatsBlitzRow = (props) => {
  const { title } = props;

  const goToPro = () => {
    updateRoute("/pro/subscription/landing-page");
  };

  const blitzLockTooltip = ReactDOMServer.renderToStaticMarkup(
    <DataNotRecordedTooltip>
      <Trans i18nKey="val:postmatch.unlock_blitz_pro.tooltip">
        Unlock with Blitz Pro
      </Trans>
    </DataNotRecordedTooltip>
  );

  return (
    <StatsRowContainer>
      <StatsBlitzRowTitle>{title}</StatsBlitzRowTitle>
      <StatsBlitzRowValue>
        <BlitzRegion onClick={goToPro}>
          <img
            src={COACHING_IMAGES.yellow_lock}
            data-tip={blitzLockTooltip}
            width={"14"}
            height={"14"}
          />
        </BlitzRegion>
      </StatsBlitzRowValue>
    </StatsRowContainer>
  );
};

const OverviewTile = ({
  type,
  icon,
  video,
  title,
  value,
  color,
  matchData,
  detailData,
  link,
  idx,
  openTour,
  matchValueField,
  comingSoon,
  notes,
}) => {
  const { t } = useTranslation();

  const route = useRoute((prev, next) => {
    const prevPerformanceId = prev.searchParams.get("performanceId");
    const nextPerformanceId = next.searchParams.get("performanceId");

    const prevSkillKey = prev.searchParams.get("skillKey");
    const nextSkillKey = next.searchParams.get("skillKey");

    const prevQueue = prev.searchParams.get("queue");
    const nextQueue = next.searchParams.get("queue");
    return (
      prev.currentPath === next.currentPath &&
      prevPerformanceId === nextPerformanceId &&
      prevSkillKey === nextSkillKey &&
      prevQueue === nextQueue
    );
  });

  let tooltipHtml;
  if (!value) {
    tooltipHtml = ReactDOMServer.renderToStaticMarkup(
      <DataNotRecordedTooltip className={"type-body2"}>
        <Trans i18nKey="val:postmatch.noDataRecorded.tooltip">
          Play more games with Blitz running to view a full analysis.
        </Trans>
      </DataNotRecordedTooltip>
    );
  }
  if (comingSoon) {
    tooltipHtml = ReactDOMServer.renderToStaticMarkup(
      <DataNotRecordedTooltip>
        <Trans i18nKey="val:postmatch.noDataRecorded.tooltip">
          Coming Soon
        </Trans>
      </DataNotRecordedTooltip>
    );
  }

  function playVideo(event) {
    event.currentTarget.getElementsByTagName("video")[0].play();
  }

  function pauseVideo(event) {
    event.currentTarget.getElementsByTagName("video")[0].pause();
    event.currentTarget.getElementsByTagName("video")[0].currentTime = 1;
  }

  function visitAnalysis() {
    const search = `performanceId=crosshair`;
    updateRoute(route.currentPath, search, {
      visibleMatches: route.visibleMatches,
      softUpdate: true,
      offset: null,
    });
  }

  // const chartConfig = {
  //   margin: { left: 8, right: 5, top: 5, bottom: 5 },
  //   xAxisConf: { type: "point", show: false },
  //   yAxisConf: { type: "linear", show: false },
  // };

  return (
    <>
      {comingSoon && (
        <TileContainer
          data-tooltip={tooltipHtml}
          className={openTour ? "open-tour" : ""}
          style={{ cursor: "pointer" }}
          onMouseEnter={playVideo}
          onMouseLeave={pauseVideo}
          id="status-panel"
        >
          <TileHeader>
            <TitleBgWrapper>
              <TitleBg>
                <video
                  loop
                  preload="metadata"
                  controlsList="nodownload"
                  muted="muted"
                >
                  <source src={`${video}#t=1`} type="video/mp4"></source>
                </video>
                <AlphBg></AlphBg>
              </TitleBg>

              <TileStats>
                <TileIcon>
                  <img src={icon} width={"34"} height={"34"} />
                </TileIcon>

                <TileTitle color={value ? "var(--shade0)" : "var(--shade1)"}>
                  {title}
                </TileTitle>
                <TileStatus>
                  <span>{notes}</span>
                </TileStatus>
              </TileStats>
            </TitleBgWrapper>
          </TileHeader>
          <TileComingSoonBody>
            <ComingSoonNote>
              {t(
                "val:fullPerformanceAnalysisComingSoon",
                "Full performance analysis coming soon"
              )}
            </ComingSoonNote>
          </TileComingSoonBody>
          <TileFooter></TileFooter>
        </TileContainer>
      )}
      {!comingSoon && (
        <TileContainer
          data-tooltip={tooltipHtml}
          className={openTour ? "open-tour" : ""}
          style={{ cursor: value ? "auto" : "pointer" }}
          onMouseEnter={playVideo}
          onMouseLeave={pauseVideo}
          id="status-panel"
        >
          <TileHeader>
            <TitleBgWrapper>
              <TitleBg>
                <video
                  loop
                  preload="metadata"
                  controlsList="nodownload"
                  muted="muted"
                >
                  <source src={`${video}#t=1`} type="video/mp4"></source>
                </video>
                <AlphBg></AlphBg>
              </TitleBg>

              <TileStats
                style={{ cursor: "pointer" }}
                onClick={() => visitAnalysis()}
              >
                <TileIcon>
                  <img src={icon} width={"34"} height={"34"} />
                </TileIcon>

                <TileTitle color={value ? "var(--shade0)" : "var(--shade1)"}>
                  {title}
                </TileTitle>
                <TileStatus>{notes}</TileStatus>
              </TileStats>
            </TitleBgWrapper>
            <TileGraphStats>
              <SimpleLineChart
                type={type}
                data={matchData}
                yKey={matchValueField}
                color={color}
                idx={idx}
              />
              {/* <SimpleLineChart
                showGridLines={false}
                margin={chartConfig.margin}
                width={332}
                height={80}
                circleRadius={5}
                data={matchData}
                xAxisConf={chartConfig.xAxisConf}
                yAxisConf={chartConfig.yAxisConf}
                xField={"date"}
                yField={matchValueField}
                color={color}
                idx={idx}
              /> */}
            </TileGraphStats>
          </TileHeader>
          <SpLine />
          <TileBody>
            {detailData.map((data, index) => {
              if (data.isBlitz) {
                return (
                  <StatsRow key={index} title={data.title} value={data.value} />
                );
              }
              return <StatsBlitzRow key={index} title={data.title} />;
            })}
          </TileBody>

          <TileFooter>
            <BtnAnalysis
              disabled={!value}
              href={value ? link : ""}
              text={t(
                "val:fullPerformanceAnalysis",
                "Full Performance Analysis"
              )}
            />
          </TileFooter>
        </TileContainer>
      )}
    </>
  );
};

const StatsBlitzRowValue = styled("div")`
  text-align: right;
`;
const BlitzRegion = styled("div")`
  width: var(--sp-5_5);
  height: var(--sp-5_5);
  background: linear-gradient(
    45deg,
    rgba(146, 113, 60, 0.15) 0%,
    rgba(219, 176, 99, 0.15) 100%
  );
  border-radius: var(--br);
  display: grid;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StatsBlitzRowTitle = styled("div")`
  flex: 1;
  font-size: var(--sp-4);
  font-weight: 500;
  line-height: var(--sp-7);
  letter-spacing: -0.009em;

  background-color: yellow;
  background-image: linear-gradient(45deg, #92713c 0%, #dbb063 100%);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

const ComingSoonNote = styled("span")`
  width: 200px;
  font-weight: 500;
  font-size: var(--sp-3_5);
  line-height: var(--sp-6);
  letter-spacing: -0.009em;
  color: var(--shade3);
`;
const SpLine = styled("hr")`
  width: 100%;
  padding: 0;
  margin: 0;
  height: var(--sp-px);
  background-color: var(--shade8);
  border: none;
`;

const TitleBg = styled("div")`
  position: relative;
  & > video {
    position: relative;
    border-radius: var(--sp-3) var(--sp-3) 0 0;
  }
  & > video:hover {
  }
`;
const AlphBg = styled("div")`
  width: 100%;
  height: 202px;
  position: absolute;
  top: var(--sp-0);
  border-radius: var(--sp-3) var(--sp-3) 0 0;
  background: linear-gradient(180deg, rgba(24, 27, 33, 0.4) 0%, #181b21 100%);
`;

const TileContainer = styled("div")`
  border-radius: var(--sp-3);
  position: relative;
  display: flex;
  flex-direction: column;
`;
const TitleBgWrapper = styled("div")`
  border-radius: var(--sp-3) var(--sp-3) 0 0;
  overflow: hidden;
  position: relative;
  height: 202px;
  background: var(--shade7);
`;
const TileHeader = styled("div")`
  border-radius: var(--sp-3) var(--sp-3) 0 0;

  border-bottom: ${(props) =>
    props.color ? `var(--sp-px) solid var(--shade8)` : `0`};
  box-shadow: inset var(--sp-0) var(--sp-px) var(--sp-0)
    rgba(227, 229, 234, 0.05);
`;
const TileStats = styled("div")`
  display: block;
  padding: var(--sp-6) var(--sp-6) var(--sp-6) var(--sp-6);
  position: relative;
  top: -209px;
`;

const TileStatus = styled("div")`
  display: flex;
  color: ${(props) => props.color || "var(--shade2)"};
  line-height: var(--sp-6);
  font-size: var(--sp-3_5);
  font-weight: 600;
  letter-spacing: -0.009em;
  border-radius: var(--br);
  width: fit-content;
  margin-top: var(--sp-2);
  span {
    margin-right: var(--sp-1);
  }

  & > div {
    margin-top: var(--br-sm);
  }
`;
const TileTitle = styled("div")`
  color: var(--shade0);
  font-weight: 600;
  font-size: var(--sp-4_5);
  line-height: var(--sp-7);
  letter-spacing: -0.009em;
  margin-top: var(--sp-11);
`;
const TileIcon = styled("div")`
  background: rgba(19, 22, 28, 0.75);
  border-radius: var(--sp-3);
  width: 52px;
  height: 52px;
  padding: var(--sp-0);
  justify-content: center;
  display: flex;
  backdrop-filter: blur(8px);
  align-items: center;
`;
const TileGraphStats = styled("div")`
  width: 100%;
  height: 80px;
  background: var(--shade7);
`;
const TileBody = styled("div")`
  padding: var(--sp-4) var(--sp-6);
  background: ${(props) => (props.bgcolor ? props.bgcolor : "var(--shade7)")};
  flex: 1;
`;

const TileComingSoonBody = styled("div")`
  justify-content: center;
  display: flex;
  text-align: -webkit-center;
  padding: var(--sp-4) var(--sp-6);
  align-items: center;
  background: ${(props) => (props.bgcolor ? props.bgcolor : "var(--shade7)")};
  flex: 1;
`;
const TileFooter = styled("div")`
  padding: var(--sp-4) var(--sp-6);
  background: ${(props) => props.bgcolor || "var(--shade7)"};
  border-radius: 0 0 var(--sp-3) var(--sp-3);
`;

const BtnAnalysis = styled(Button)`
  width: 100%;
`;

const StatsRowContainer = styled("div")`
  display: flex;
  &:not(:last-child) {
    margin-bottom: var(--sp-4);
  }
`;
const StatsRowTitle = styled("div")`
  flex: 1;
  font-size: var(--sp-4);
  font-weight: 500;
  line-height: var(--sp-7);
  letter-spacing: -0.009em;
  color: var(--shade2);
`;
const StatsRowValue = styled("div")`
  font-size: var(--sp-4);
  font-weight: bold;
  line-height: var(--sp-7);
  letter-spacing: -0.009em;
  color: var(--shade1);
  text-align: right;
`;
const DataNotRecordedTooltip = styled("p")`
  color: var(--shade0);
`;
export default OverviewTile;
