import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import {
  calcHeadshotPercent,
  getValorantRankImage,
} from "@/game-val/utils.mjs";
import CrossHairIcon from "@/inline-assets/accolade-crosshair.svg";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import ChevronDown from "@/inline-assets/chevron-down.svg";
import DeathIcon from "@/inline-assets/skull-and-crossbones.svg";
import DeathmatchIcon from "@/inline-assets/val-mode-deathmatch.svg";
import Spike from "@/inline-assets/val-spike.svg";
import { calcRate, displayRate } from "@/util/helpers.mjs";

const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }

  .deathmatch-text {
    padding: var(--sp-4) 0;
    text-align: center;
  }
`;

const CardHeader = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 -1px var(--shade3-15);
  background: var(--shade7)
    linear-gradient(to top, var(--shade5-15) 0%, transparent 100%);
  border-radius: var(--br);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0 var(--sp-6);
  min-height: var(--sp-14);

  .arrow {
    width: var(--sp-4);
    margin: 0 var(--sp-3);
    fill: var(--shade2);
  }

  > * {
    position: relative;
  }

  svg {
    color: var(--shade3);
  }

  .header-contents {
    position: relative;
  }

  @media screen and (max-width: 1024px) {
    padding: 0 var(--sp-4);
  }
`;

const AccoladeWrapper = styled("div")`
  display: flex;
  position: relative;
  --comparison-color: ${(props) => props.$color};
`;

const AccoladeIcon = styled("div")`
  align-self: flex-start;
  box-sizing: border-box;
  padding: var(--sp-1_5);
  border-radius: 50%;
  background: var(--shade9);
  color: ${(props) => (props.$didBetter ? "var(--turq)" : "#E44C4D")};
  transition: var(--transition);
  margin-right: var(--sp-5);

  svg {
    width: var(--sp-6_5);
    height: var(--sp-6_5);
  }
`;

const HeadshotPercentTag = styled("div")`
  display: flex;
  justify-content: space-between;
  flex: 1 1 0%;
  margin-bottom: var(--sp-0_5);
  padding: var(--sp-2) var(--sp-3);
  background: var(--shade9-50);
  border-radius: var(--br);
  background: var(--shade9-50);

  .arrow {
    color: ${(props) => props.$arrow};
    margin-left: var(--sp-2);
  }

  .percent-arrow-container {
    display: flex;
    align-items: center;
    color: ${(props) => (props.$color ? props.$color : "var(--white)")};
  }

  .dot-container {
    display: flex;
    align-items: center;
    color: ${(props) => (props.$color ? props.$color : "var(--white)")};
  }

  .dot {
    display: block;
    width: var(--sp-1_5);
    height: var(--sp-1_5);
    margin-right: var(--sp-2);
    border-radius: 50%;
    background: ${(props) => (props.$color ? props.$color : "var(--white)")};
  }
`;

const MainWrapper = styled("div")`
  flex: 1 1 0%;

  .accolade-header {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
  }

  .chevron {
    display: block;
  }

  .accolade-header-info {
    margin-top: var(--sp-1);
    margin-bottom: var(--sp-6);
    color: var(--shade1);
  }

  .header-body {
    width: 100%;
  }

  .highlight-text {
    color: var(--comparison-color);
  }

  .accolade-container {
    padding: var(--sp-4) var(--sp-5);
    display: flex;
  }
  .accolade-body {
    width: 100%;
  }
  .view--text {
    margin-top: var(--sp-4);
    text-align: left;
    text-decoration-line: underline;
    color: var(--shade1);
  }
`;

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
  .map-win-loss {
    text-transform: capitalize;
    color: var(--shade2);
  }
  .map-name {
    text-transform: capitalize;
  }
  & > a {
    width: 100%;
    min-height: var(--sp-16);
    box-sizing: border-box;
  }
  .you-text {
    color: var(--turq);
    margin-left: var(--sp-0_5);
  }
`;

const RowByRank = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  user-select: none;
  margin: var(--sp-0_5) 0;
  color: var(--shade3);
  height: var(--sp-6);

  .division-bar {
    position: relative;
    margin-right: var(--sp-5);
    margin-left: 0;
    height: var(--sp-1);
    flex: 7 1 0%;
    background: var(--shade9);
  }

  .division-bar-fill {
    position: absolute;
    border-radius: var(--br);
    left: 0;
    height: 100%;
    width: ${(props) => (props.$percent ? props.$percent : "100")}%;
    background: ${(props) =>
      props.$fillColor ? props.$fillColor : "var(--shade3)"};
  }
  .rank-img-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--sp-3);
  }
`;

const HeadShotRanks = styled("div")`
  background: var(--shade9-50);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--br);

  .headshot-title {
    color: var(--shade1);
  }
`;

const DataPointTag = ({ title, dataPoint, didBetter, showArrow = false }) => {
  let color = "var(--white)";
  if (showArrow) {
    color = didBetter ? "var(--turq)" : "#E44C4D";
  }

  return (
    <HeadshotPercentTag
      $color={color}
      $arrow={showArrow ? color : "transparent"}
    >
      <div className="dot-container">
        <div className="dot" />
        <span className="type-caption--bold">{title}</span>
      </div>
      <div className="percent-arrow-container">
        <span className="type-caption--bold">{dataPoint}</span>
        <div className="arrow">{didBetter ? <CaretUp /> : <CaretDown />}</div>
      </div>
    </HeadshotPercentTag>
  );
};

const DiedFirstInfo = ({
  neverDiedFirst,
  diedFirstLess,
  diedFirstPercentChange,
  numberOfMatches,
  queueType,
}) => {
  const { t } = useTranslation();
  let highlightedText = diedFirstLess
    ? t("val:diedless", "{{diedFirstPercentChange}} less", {
        diedFirstPercentChange,
      })
    : t("val:diedmore", "{{diedFirstPercentChange}} more", {
        diedFirstPercentChange,
      });

  if (neverDiedFirst) {
    highlightedText = t("val:NeverDiedFirst", "you never died first.");
  }
  return (
    <>
      {neverDiedFirst ? <span>{t("common:niceJob", "Nice Job,")}</span> : null}
      &nbsp;
      {
        <span
          className="type-caption--bold"
          style={{
            color: diedFirstLess ? "var(--turq)" : "#E44C4D",
          }}
        >
          {highlightedText}
        </span>
      }
      &nbsp;
      {neverDiedFirst
        ? t("common:keepItUp", "Keep it up!")
        : t(
            "val:thanyourrecent",
            "than your {{queueType}} recent {{numberOfMatches}} average",
            { numberOfMatches: numberOfMatches, queueType: queueType }
          )}
    </>
  );
};

const Accolade = ({ children, defaultShow = false, icon, background }) => {
  const [showBody, setShowBody] = useState(defaultShow);
  return (
    <div className="accolade-container" style={{ background }}>
      {icon ? icon : null}
      <div className="accolade-body">
        <div onClick={() => setShowBody(!showBody)}>{children?.[0]}</div>
        {showBody && children?.[1]}
      </div>
    </div>
  );
};

const AccoladeHeader = ({ handleClick, title, info, showChev = true }) => {
  return (
    <div className="accolade-header" onClick={handleClick}>
      <div className="header-body">
        <p className="type-caption--bold">{title}</p>
        <p className="accolade-header-info type-caption accolade-desc">
          {info}
        </p>
      </div>
      {showChev && (
        <div className="chevron">
          <ChevronDown />
        </div>
      )}
    </div>
  );
};

const HeadshotRowByRank = ({ hsData, topPercent }) => {
  const { t } = useTranslation();
  let fillColor = null;
  if (hsData.division === "you") fillColor = "var(--turq)";
  if (hsData.division === "radiant") fillColor = "var(--white);";
  const fillPercent = calcRate(hsData.hsPercent, topPercent, 2) * 100;

  const rankImg = getValorantRankImage({
    tier: hsData.division,
    rank: 0,
    size: "small",
  });

  const fixedHsPercent = parseFloat(hsData.hsPercent).toFixed(1);
  return (
    <RowContainer>
      <RowByRank $percent={fillPercent} $fillColor={fillColor}>
        <div className="rank-img-container">
          {hsData.division === "you" ? (
            <p className="type-caption--bold you-text">
              {t("common:you", "You")}
            </p>
          ) : (
            <img src={rankImg}></img>
          )}
        </div>
        <div className="division-bar">
          <div className="division-bar-fill"></div>
        </div>
        <div className="type-caption--bold">
          {t("val:hsPercent", "{{hsPercent}}%", {
            hsPercent: fixedHsPercent,
          })}
        </div>
      </RowByRank>
    </RowContainer>
  );
};

const Header = ({ title, isDeathmatch }) => (
  <CardHeader>
    <span>{title}</span>
    {isDeathmatch ? <DeathmatchIcon /> : <Spike />}
  </CardHeader>
);

const RankHSAnalysis = ({
  recentStats,
  matchStats,
  matchInfo,
  divisionStats,
}) => {
  const { t } = useTranslation();
  const [showDistribution, setShowDistribution] = useState(true);

  const isDeathmatch = matchInfo?.queue === "deathmatch";
  if (isDeathmatch) {
    return (
      <CardContainer>
        <Header
          isDeathmatch={isDeathmatch}
          title={t("common:analysis", "analysis")}
        />
        <p className="type-body2 deathmatch-text">
          {t("common:no.analysis", "No analysis data")}
        </p>
      </CardContainer>
    );
  }
  const damageStats = matchStats.damageStats;
  const avgFirstDied = calcRate(
    recentStats.firstBloodsGiven,
    recentStats?.matches,
    1
  );
  const diedFirstLess = avgFirstDied > matchStats.firstBloodsGiven;
  const diedFirstPercentChange = displayRate(
    matchStats.firstBloodsGiven - avgFirstDied,
    avgFirstDied || 1
  );

  const neverDiedFirst = matchStats.firstBloodsGiven === 0;
  // recentStats.firstBloodsGiven - matchStats.firstBloodsGiven;
  const recentHeadshotPercent = calcHeadshotPercent(recentStats.damageStats);
  const headshotPercent = calcHeadshotPercent(damageStats);
  const hsDifference = (headshotPercent - recentHeadshotPercent).toFixed(1);
  const hsPercentChange = displayRate(
    Math.abs(hsDifference),
    recentHeadshotPercent || 1
  );
  const betterHs = hsDifference > 0;

  const hsData = Object.entries(divisionStats)
    .map(([division, { weaponDamageStats }]) => {
      const weaponsStats = Object.values(weaponDamageStats);
      const hsSum = weaponsStats.reduce(
        (acc, weaponStats) => acc + Number(calcHeadshotPercent(weaponStats)),
        0
      );
      const hsPercent = calcRate(hsSum, weaponsStats.length, 1);
      return {
        division,
        hsPercent,
      };
    })
    .filter((divisionDataPoint) => divisionDataPoint.division !== "unrated");
  hsData.push({ division: "you", hsPercent: headshotPercent });

  const sortedHsData = hsData.sort((a, b) => b.hsPercent - a.hsPercent);
  const topPercent = sortedHsData[0].hsPercent;

  //for getting summary
  const getSummaryDivisions = (fullHsData) => {
    const playerIndex = fullHsData.findIndex(
      (divisionStats) => divisionStats.division === "you"
    );

    if (playerIndex === fullHsData.length - 1)
      return (fullHsData = fullHsData.slice(fullHsData.length - 3));

    if (playerIndex === 0) return fullHsData.slice(0, 3);

    return fullHsData.slice(playerIndex - 1, playerIndex + 2);
  };
  const renderItems = showDistribution
    ? getSummaryDivisions(sortedHsData)
    : sortedHsData;

  let firstToDieTitle = diedFirstLess
    ? t("val:firsttodiedecreased", "First to Die Decreased")
    : t("val:firsttoIncreased", "First to Die Increased");
  if (neverDiedFirst)
    firstToDieTitle = t("val:FirstOneToDie", `First One to Die`);

  return (
    <CardContainer>
      <Header
        isDeathmatch={isDeathmatch}
        title={t("common:analysis", "analysis")}
      />
      {!RankHSAnalysis ? (
        <></>
      ) : (
        <AccoladeWrapper $color={betterHs ? "var(--turq)" : "#E44C4D"}>
          <MainWrapper>
            <Accolade
              background={`var(--shade8-75)`}
              defaultShow
              icon={
                <AccoladeIcon $didBetter={betterHs}>
                  <CrossHairIcon />
                </AccoladeIcon>
              }
            >
              <AccoladeHeader
                title={
                  betterHs
                    ? t("val:increasedheadshotpercent", "Increased Headshot %")
                    : t("val:decreasedheadshotpercent", "Decreased Headshot %")
                }
                info={
                  <>
                    <span className="type-caption--bold highlight-text">
                      {betterHs
                        ? t(
                            "val:betterHsDifference",
                            "{{hsDifference}} better",
                            {
                              hsDifference: hsPercentChange,
                            }
                          )
                        : t("val:worseHsDifference", "{{hsDifference}} Worse", {
                            hsDifference: hsPercentChange,
                          })}
                    </span>{" "}
                    <span className="type-caption">
                      {t(
                        "val:compare.recent.nMatches",
                        "than your Competitive recent {{numberOfMatches}} average.",
                        { numberOfMatches: recentStats?.matches }
                      )}
                    </span>
                  </>
                }
                handleClick={() => setShowDistribution(!showDistribution)}
              />
              <>
                <DataPointTag
                  title={t("common:thismatch", "This Match")}
                  dataPoint={t("val:hsPercent", "{{hsPercent}}%", {
                    hsPercent: headshotPercent,
                  })}
                  didBetter={betterHs}
                  showArrow
                ></DataPointTag>
                <DataPointTag
                  title={t("common:recentavg", "Recent Avg.")}
                  dataPoint={t("val:hsPercent", "{{hsPercent}}%", {
                    hsPercent: recentHeadshotPercent,
                  })}
                ></DataPointTag>
                <HeadShotRanks>
                  <p className="type-caption--bold headshot-title">
                    {t("common:hs.by.rank", "HS% by Rank")}
                  </p>
                  {renderItems.map((hsDataRow) => (
                    <HeadshotRowByRank
                      hsData={hsDataRow}
                      topPercent={topPercent}
                      key={hsDataRow.division}
                    />
                  ))}
                </HeadShotRanks>
                <p
                  className="type-caption--bold view--text"
                  onClick={() => setShowDistribution(!showDistribution)}
                >
                  {showDistribution
                    ? t("common:viewDistribution", "View Distribution")
                    : t("common:viewSummary", "View Summary")}
                </p>
              </>
            </Accolade>
            <Accolade
              icon={
                <AccoladeIcon $didBetter={diedFirstLess}>
                  <DeathIcon />
                </AccoladeIcon>
              }
              didBetter={diedFirstLess}
            >
              <AccoladeHeader
                showChev={!neverDiedFirst}
                title={firstToDieTitle}
                info={
                  <DiedFirstInfo
                    neverDiedFirst={neverDiedFirst}
                    diedFirstLess={diedFirstLess}
                    diedFirstPercentChange={diedFirstPercentChange}
                    numberOfMatches={recentStats?.matches}
                    queueType={matchInfo.queue}
                  />
                }
              />
              {!neverDiedFirst ? (
                <>
                  <DataPointTag
                    title={t("common:thismatch", "This Match")}
                    dataPoint={matchStats.firstBloodsGiven}
                    didBetter={diedFirstLess}
                    showArrow
                  />
                  <DataPointTag
                    title={t("common:recentavg", "Recent Avg.")}
                    dataPoint={avgFirstDied}
                    didBetter={diedFirstLess}
                  />
                </>
              ) : null}
            </Accolade>
          </MainWrapper>
        </AccoladeWrapper>
      )}
    </CardContainer>
  );
};

export default RankHSAnalysis;
