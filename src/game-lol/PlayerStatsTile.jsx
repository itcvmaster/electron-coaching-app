import React, { useMemo } from "react";
import { css, styled } from "goober";

import {
  Divider,
  PlayerStatWrapper,
  RankDistributionListContainer,
} from "@/game-lol/CommonComponents.jsx";
import { STAT_TILE_COLORS, STAT_TILE_TYPES } from "@/game-lol/constants.mjs";
import { mapRankToSymbol } from "@/game-lol/util.mjs";
import DistributionList from "@/game-tft/DistributionList.jsx";

export const refs = {
  showRankDistribution: false,
};

const PlayerStatTile = (props) => {
  const {
    title,
    TitleIcon,
    stats,
    MyPlacementRankIcon,
    MyPlacementRankIcon2,
    isPositive,
    isPositive2,
    tips,
    tipGrade,
    allScores,
    allScores2,
    scoreTrendLabel,
    itemLabel,
    itemLabel2,
    yourRank,
    yourRank2,
    maxRankValue,
    maxRankValue2,
    isExtTile,
    tiletype,
    delay = 0,
    proLockInfo,
  } = props;
  const { tileColorType, tileColor, tileColor2 } = useMemo(() => {
    const myScore = stats?.myScore;
    let tileColorType = STAT_TILE_COLORS.red;
    let tileColorType2 = STAT_TILE_COLORS.red;

    if (isExtTile) {
      const isSGrade = myScore?.grade?.includes("S");
      // If Damage or KDA tile
      if (isSGrade) {
        tileColorType = STAT_TILE_COLORS.gold;
      } else if (isPositive) {
        tileColorType = STAT_TILE_COLORS.green;
      }
    } else {
      // If Vision or CS tile
      const isChallenger =
        mapRankToSymbol(yourRank) === mapRankToSymbol("challenger");
      if (isChallenger) {
        tileColorType = STAT_TILE_COLORS.gold;
      } else if (isPositive) {
        tileColorType = STAT_TILE_COLORS.green;
      }
      if (yourRank2) {
        const isChallenger2 =
          mapRankToSymbol(yourRank2) === mapRankToSymbol("challenger");
        if (isChallenger2) {
          tileColorType2 = STAT_TILE_COLORS.gold;
        } else if (isPositive2) {
          tileColorType2 = STAT_TILE_COLORS.green;
        }
      }
    }

    const tileColor = tileColorType.color;
    const tileColor2 = tileColorType2.color;

    return {
      myScore,
      tileColorType: yourRank2 ? tileColorType2 : tileColorType,
      tileColor,
      tileColor2,
    };
  }, [stats.myScore, isExtTile, yourRank, yourRank2, isPositive, isPositive2]);

  return (
    <PlayerStatWrapper tilebgcolor={tileColorType.bgColor}>
      <header>
        <TileTitle>
          {TitleIcon && <TitleIcon />}
          <span className="type-subtitle2 title">{title}</span>
        </TileTitle>
        <ScoreInfo>
          <ScoreTrendWrapper color={tileColor} hasheader={itemLabel}>
            <p className="score">
              {stats.scoreLabelIcon ? (
                <img src={stats.scoreLabelIcon} alt={stats.scoreLabelIcon} />
              ) : null}
              <span className="type-h4 label">
                {itemLabel ? (
                  <span className="label-header">{itemLabel}</span>
                ) : null}
                <span>
                  {stats.myStatPerMinLabel ||
                    (typeof stats?.myStatPerMin === "number" &&
                      stats.myStatPerMin.toFixed(
                        tiletype === STAT_TILE_TYPES.damage ||
                          tiletype === STAT_TILE_TYPES.visionScore
                          ? 0
                          : 1
                      ))}
                </span>
              </span>
              &nbsp;
              {scoreTrendLabel ? (
                <span className="type-h6">{scoreTrendLabel}</span>
              ) : null}
            </p>
            <RoleIconWrapper color={stats?.myScore?.fillColor}>
              {MyPlacementRankIcon}
            </RoleIconWrapper>
          </ScoreTrendWrapper>
          {stats?.myStatPerMin2 ? (
            <ScoreTrendWrapper color={tileColor2} hasheader={itemLabel2}>
              <p className="score">
                {stats.scoreLabelIcon2 ? (
                  <img
                    src={stats.scoreLabelIcon2}
                    alt={stats.scoreLabelIcon2}
                  />
                ) : null}
                <span className="type-h4 label">
                  {itemLabel2 ? (
                    <span className="label-header">{itemLabel2}</span>
                  ) : null}
                  <span>
                    {stats.myStatPerMin2Label ||
                      (typeof stats?.myStatPerMin2 === "number" &&
                        stats.myStatPerMin2.toFixed(
                          tiletype === STAT_TILE_TYPES.damage ? 0 : 1
                        ))}
                  </span>
                </span>
              </p>{" "}
              <RoleIconWrapper color={stats?.myScore?.fillColor}>
                {MyPlacementRankIcon2}
              </RoleIconWrapper>
            </ScoreTrendWrapper>
          ) : null}
          <p className="type-body2 tag-name">{tips[tipGrade]?.tag}</p>
        </ScoreInfo>
      </header>
      <div>
        <Divider />
        {proLockInfo && !refs.showRankDistribution ? (
          <ProInfo>
            <h4>{proLockInfo.title}</h4>
            <p
              className={css`
                font-size: var(--sp-3);
                margin-top: var(--sp-3);
              `}
            >
              {proLockInfo.info}
            </p>
            <ProBtn
              onClick={(event) => {
                // TODO: this should have never passed review!!
                event.preventDefault();
              }}
            >
              {proLockInfo.btnText}
            </ProBtn>
          </ProInfo>
        ) : (
          <RankDistributionListContainer>
            {[
              [allScores, maxRankValue, isPositive, yourRank],
              [allScores2, maxRankValue2, isPositive2, yourRank2],
            ].map(([allScores, maxRankValue, isPositive, yourRank], idx) => {
              if (typeof allScores === "undefined") return null;
              const props = {
                allScores,
                maxRankValue,
                isPositive,
                yourRank,
                delay,
              };
              return <DistributionList key={idx} {...props} />;
            })}
          </RankDistributionListContainer>
        )}
      </div>
    </PlayerStatWrapper>
  );
};

export default React.memo(PlayerStatTile);

const TileTitle = styled("div")`
  display: flex;
  width: 100%;
  margin-bottom: var(--sp-4_5);
  color: var(--shade1);
  align-items: center;
  svg {
    font-size: var(--sp-5);
  }
  .title {
    margin-left: var(--sp-3);
  }
`;

const ScoreInfo = styled("div")`
  display: flex;
  width: 100%;
  flex-direction: column;
  grid-gap: var(--sp-1);
`;

const RoleIconWrapper = styled("div")`
  display: flex;
  width: var(--sp-13);
  height: var(--sp-13);
  align-items: center;
  justify-content: center;
  background: var(--shade9);
  border-radius: var(--sp-3);
  color: ${({ color }) => color};
  span {
    font-weight: 700;
    font-size: calc(var(--sp-px) * 24);
    line-height: 1.4;
  }
  svg {
    width: 1em;
    height: 1em;
    font-size: var(--sp-8);
  }
`;

const ScoreTrendWrapper = styled("div")`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;

  .score {
    white-space: nowrap;
    color: ${({ color }) => color};
    display: flex;
    ${({ hasheader }) => (hasheader ? "" : "align-items: center;")};
  }

  .label {
    display: flex;
    flex-direction: column;
    .label-header {
      color: var(--shade0);
      line-height: var(--sp-2);
      font-size: var(--sp-2_5);
      text-transform: uppercase;
    }
  }

  .tag-name {
    margin-top: var(--sp-1);
    color: var(--shade0);
    &[data-hidden="true"] {
      visibility: hidden;
    }
  }
  img {
    border-radius: var(--br-sm);
    height: 40px;
    width: 40px;
    margin-right: var(--sp-2);
  }
  ${RoleIconWrapper} {
    ${({ hasHeader }) =>
      hasHeader
        ? "width: var(--sp-10); height: var(--sp-10); svg {font-size: var(--sp-7);}"
        : ""};
  }
`;

const ProBtn = styled("button")`
  margin-top: var(--sp-3);
  color: var(--white);
  width: 100%;
  background: var(--pro-gradient);
  &:hover {
    background: linear-gradient(45deg, #9f8046 0%, #e0b96f 100%);
  }
  p {
    font-weight: 600;
  }
`;

const ProInfo = styled("div")`
  height: 140px;
  display: flex;
  flex-direction: column;
  margin: var(--sp-3) 0;
`;
