import React, { Fragment, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { styled } from "goober";

import { Button, ButtonGroup, mobile, mobileSmall, tablet } from "clutch";

import ChampionMatchupCell from "@/game-lol/ChampionMatchupCell.jsx";
import ChampionMatchupStatsHeader from "@/game-lol/ChampionMatchupStatsHeader.jsx";
import { Caption, View } from "@/game-lol/CommonComponents.jsx";
import DownloadBlitzHorizontal from "@/game-lol/DownloadBlitzHorizontal.jsx";
import MatchupRowStats from "@/game-lol/MatchupRowStats.jsx";
import Static from "@/game-lol/static.mjs";
import { getStaticData } from "@/game-lol/util.mjs";
import Close from "@/inline-assets/close.svg";
import Menu from "@/inline-assets/menu.svg";
import { calcRate } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const MatchupStatsTitle = styled("div")`
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: var(--sp-2);
  text-align: center;
`;

const ChampionMatchupHeaderBg = styled("div")`
  display: flex;
  height: 270px;
  opacity: 0.25;
  position: absolute;
  top: 0;
  width: 100%;

  > div {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    position: relative;
    width: 50%;

    &:before {
      bottom: 0;
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 1;
    }

    &:first-child:before {
      background: linear-gradient(
        90deg,
        rgba(32, 43, 67, 0.0001) 0%,
        var(--shade7) 100%
      );
    }

    &:last-child:before {
      background: linear-gradient(
        90deg,
        var(--shade7) 0%,
        rgba(32, 43, 67, 0.0001) 100%
      );
    }
  }

  &:before {
    background: linear-gradient(
      180deg,
      rgba(32, 43, 67, 0.0001) 0%,
      var(--shade7) 100%
    );
    bottom: 0;
    content: "";
    height: 150px;
    left: 0;
    position: absolute;
    right: 0;
    width: 100%;
    z-index: 1;
  }
`;
const EnemyChampionsListContainer = styled("div")`
  ${mobile},
  ${mobileSmall} {
    position: absolute;
    top: 0;
    left: 0;
    transition: var(--transition);
    z-index: 2;

    ${({ $isOpen }) =>
      $isOpen
        ? `
            width: calc(100vw - 16px);
            background-color: var(--shade9-25);
            transform: translateX(0);
            ${mobile} {
              width: calc(100vw - 8px);
            }

            ${mobileSmall} {
              width: calc(100vw - 4px);
            }
          `
        : `
            transform: translateX(-103%);
          `}
  }
`;
const EnemyChampionsListWrapper = styled("div")`
  background: var(--shade8);
  border-radius: var(--br) 0 0 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 320px;
  ${mobileSmall} {
    width: 280px;
  }
`;
const EnemyChampionsButtonContainer = styled("div")`
  padding: var(--sp-6);
  ${tablet} {
    padding: var(--sp-4);
  }
`;
const CaptionContainer = styled(View)`
  padding: var(--sp-3) 1.875rem;
  justify-content: space-between;

  ${tablet} {
    padding: var(--sp-3) var(--sp-4);
  }
`;
const ListViewContainer = styled(View)`
  max-height: 460px;
  margin-right: 4px;

  &.scroll {
    overflow: hidden auto;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  ${tablet} {
    max-height: 325px;
  }

  ${mobile} {
    max-height: 290px;
  }

  ${mobileSmall} {
    max-height: 297px;
  }
  .champion-matchup-list {
    padding: "var(--sp-0) var(--sp-1) var(--sp-0) var(--sp-2)";
  }
`;

const ContentContainer = styled("div")`
  background: var(--shade7);
  flex-grow: 1;
  width: 680px;
  border-radius: 0 5px 5px 0;
  position: relative;
  overflow: hidden;
`;
const MatchupStatsContainer = styled("div")`
  padding: var(--sp-6);
  ${tablet} {
    padding: var(--sp-4);
  }
  ${mobile} {
    padding: 0;
  }

  .matchup-row-stats {
    font-size: 0.875rem;
    padding: var(--sp-3) var(--sp-20);
    ${mobile} {
      padding: var(--sp-3) var(--sp-7);
    }
  }
`;

const IconWrapper = styled(Button)`
  position: absolute;
  top: var(--sp-4);
  left: 0;
  z-index: 2;
  transition: var(--transition);
  background-color: transparent;
  display: none;

  & > svg {
    width: var(--sp-6);
    height: var(--sp-6);
  }

  ${mobile},
  ${mobileSmall} {
    display: flex;

    ${({ $isOpen }) =>
      $isOpen
        ? `
            transform: translateX(320px);
            ${mobileSmall} {
              transform: translateX(275px);
            }
          `
        : `
            transform: translateX(0);
          `}
  }

  ${mobile} {
    top: var(--sp-2);
  }
`;

const labels = [
  "damageEfficiency",
  "damageToChampions",
  "ccApplied",
  "goldEarned",
  "visionScore",
  "damageToObjectives",
];

const ChampionSpecificMatchupTab = ({
  sort,
  setSort,
  filterKey,
  matchups,
  champion,
  championStats,
  specificMatchupStats,
  matchupChampion,
  t,
  loading,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawerOpen = () => setDrawerOpen((b) => !b);

  const champions = getStaticData("champions");

  // Translated labels must correspond 1:1 to labels array.
  const translatedLabels = [
    t("lol:specificMatchup.damageEfficency", "Damage Efficency"),
    t("lol:specificMatchup.dmgToChampions", "Damage to Champions"),
    t("lol:specificMatchup.ccApplied", "CC Applied"),
    t("lol:specificMatchup.goldEarned", "Gold Earned"),
    t("lol:specificMatchup.visionScore", "Vision Score"),
    t("lol:specificMatchup.dmgToObjectives", "Damage to Objectives"),
  ];

  const sortedMatchups = matchups.sort((a, b) => {
    return a[filterKey] / (a.games || 1) - b[filterKey] / (b.games || 1);
  });

  return (
    <View style={{ position: "relative" }}>
      <EnemyChampionsListContainer $isOpen={isDrawerOpen}>
        <div className={"enemy-champ-list"}>
          <EnemyChampionsListWrapper>
            <EnemyChampionsButtonContainer>
              <ButtonGroup block>
                <Button
                  onClick={() => setSort("laneWins")}
                  active={sort === "laneWins"}
                  text={t("lol:viewByLane", "View By Lane")}
                />
                <Button
                  onClick={() => setSort("wins")}
                  active={sort === "wins"}
                  text={t("lol:viewByGame", "View By Game")}
                />
              </ButtonGroup>
            </EnemyChampionsButtonContainer>
            <CaptionContainer>
              <Caption>
                {t("lol:specificMatchup.enemyChampion", "Enemy Champion")}
              </Caption>
              <Caption>{t("lol:winRate", "Win Rate")}</Caption>
            </CaptionContainer>
            <ListViewContainer className="scroll">
              <div className="champion-matchup-list">
                {sortedMatchups.map((item, i) => {
                  return (
                    <ChampionMatchupCell
                      key={
                        `matchup-cell-${champion?.id}-${item.opponentChampionId}` ||
                        i
                      }
                      role={championStats?.role}
                      championId={champion?.id}
                      matchupChampionId={`${item.opponentChampionId}`}
                      winRate={calcRate(item[filterKey], item.games)}
                      matches={getLocaleString(item.games)}
                      detailType="1COLUMN"
                      championImageSize={36}
                      noBackgroundImg
                      hideLaneIcon
                      onClick={toggleDrawerOpen}
                    />
                  );
                })}
              </div>
            </ListViewContainer>
            <DownloadBlitzHorizontal />
          </EnemyChampionsListWrapper>
        </div>
      </EnemyChampionsListContainer>

      <ContentContainer>
        {loading ? (
          <Fragment>
            <HeaderLoader />
            {[...Array(6).keys()].map((e, i) => (
              <RowLoader key={i} inverse={i % 2 === 0} />
            ))}
          </Fragment>
        ) : !specificMatchupStats ? (
          <EmptyMatchup />
        ) : (
          <Fragment>
            <IconWrapper onClick={toggleDrawerOpen} $isOpen={isDrawerOpen}>
              {isDrawerOpen ? <Close /> : <Menu />}
            </IconWrapper>
            <ChampionMatchupStatsHeader
              champion={champion}
              matchupChampion={matchupChampion}
              specificMatchupStats={specificMatchupStats}
              filterKey={filterKey}
              style={{
                position: "relative",
                zIndex: 1,
              }}
            />
            <ChampionMatchupHeaderBg>
              <div
                style={{
                  backgroundImage: `url(${Static.getChampionSplashImageById(
                    champions,
                    champion.id
                  )})`,
                  left: 0,
                }}
              />
              <div
                style={{
                  backgroundImage: `url(${Static.getChampionSplashImageById(
                    champions,
                    matchupChampion.id
                  )})`,
                  right: 0,
                }}
              />
            </ChampionMatchupHeaderBg>
            <MatchupStatsContainer>
              <MatchupStatsTitle>
                {t(
                  "lol:specificMatchup.gameMatchupStats",
                  "Game Matchup Stats"
                )}
              </MatchupStatsTitle>
              {Object.entries(specificMatchupStats)
                .filter(([label]) => labels.includes(label))
                .map(([statsLabel, stats], index) => (
                  <MatchupRowStats
                    statsLabel={translatedLabels[index]}
                    stats={stats}
                    row={index % 2 === 0 ? "even" : "odd"}
                    key={statsLabel}
                    className="matchup-row-stats"
                  />
                ))}
            </MatchupStatsContainer>
          </Fragment>
        )}
      </ContentContainer>
    </View>
  );
};

export default withTranslation(["lol"])(ChampionSpecificMatchupTab);

const ContentLoader = styled("div")`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
`;

const HeaderLoader = () => (
  <ContentLoader
    height={291}
    width={680}
    style={{
      background: "var(--shade7)",
    }}
  >
    <circle cx="143" cy="100" r="51" />
    <rect x="103" y="169" rx="0" ry="0" width="80" height="20" />
    <rect x="95" y="195" rx="0" ry="0" width="96" height="15" />
    <circle cx="538" cy="100" r="51" />
    <rect x="498" y="169" rx="0" ry="0" width="80" height="20" />
    <rect x="490" y="195" rx="0" ry="0" width="96" height="15" />
    <rect
      x="340"
      y="111"
      rx="0"
      ry="0"
      width="34"
      height="34"
      transform="rotate(45, 340, 111)"
    />
    <rect x="300" y="195" rx="0" ry="0" width="80" height="15" />
    <rect x="264" y="262" rx="0" ry="0" width="150" height="25" />
  </ContentLoader>
);
const RowLoader = () => (
  <ContentLoader
    height={42}
    width={632}
    style={{
      margin: "0 24px -4px 24px",
    }}
  >
    <rect x="248" y="13" rx="0" ry="0" width="135" height="16" />
    <rect x="86" y="13" rx="0" ry="0" width="60" height="16" />
    <rect x="486" y="13" rx="0" ry="0" width="60" height="16" />
  </ContentLoader>
);

const EmptyMatchupContainer = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-bottom: 80px;

  .no-matchup-data {
    font-size: var(--sp-5);
    font-weight: 700;
    margin-top: var(--sp-6);
    line-height: var(--sp-8);
    letter-spacing: 0var (--sp-6);
    color: var(--shade0);
  }

  .another-champion {
    font-size: 0.875rem;
    margin-top: var(--sp-3);
    color: var(--shade2);
  }

  .m-auto {
    margin: auto;
  }
`;

const EmptyMatchup = () => {
  const { t } = useTranslation();
  return (
    <EmptyMatchupContainer>
      <div className="m-auto">
        <div className="no-matchup-data">
          {t("lol:noMatchDataFound", "No Matchup Data Found")}
        </div>
        <div className="another-champion">
          {t("lol:tryAnotherChampion", "Try another champion.")}
        </div>
      </div>
    </EmptyMatchupContainer>
  );
};
