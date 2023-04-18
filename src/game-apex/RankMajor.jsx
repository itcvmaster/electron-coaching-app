import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import ApexColor from "@/game-apex/colors.mjs";
import FilterModes from "@/game-apex/FilterModes.jsx";
import FilterSeasons from "@/game-apex/FilterSeasons.jsx";
import ApexUnrankedLg from "@/inline-assets/apex-unranked-lg.svg";
import { ProfileStats } from "@/shared/Profile.jsx";
import RadialProgress from "@/shared/RadialProgress.jsx";

const RankMajorFrame = styled("div")`
  &:not(:last-of-type) {
    margin-bottom: var(--sp-6);
  }
`;

const RankInfo = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0 10px 20px;
  padding-bottom: ${(props) => (props.las20 ? "" : "20px")};
`;

const PlayerRank = styled("div")`
  position: relative;
  margin-top: var(--sp-3);
  display: flex;
`;

const PlayerRankIcon = styled("div")`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 0;
  svg {
    width: 72px;
    height: 72px;
  }
`;

const PlayerRankDetails = styled("div")`
  margin-left: var(--sp-4);
  color: var(--shade0);
`;

const Body1FormActive = styled((props) => (
  <p {...props} className={`type-body1-form--active ${props.className}`} />
))``;

const RankTier = styled(Body1FormActive)`
  color: ${({ color }) => (color ? color : "inherit")};
`;

const FilterSelectContainer = styled("div")`
  display: flex;
  margin-bottom: var(--sp-6);
  gap: var(--sp-2);
`;

const RankContainer = styled("div")`
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--sp-1);
`;

const RankIcon = ({ split }) => {
  const { iconLg: Icon, rankedRating, key } = split || {};
  const radialPercent = rankedRating / 100;
  const radialColor = ApexColor.ranks[key]?.fill;
  return (
    <PlayerRank>
      <RadialProgress
        size={108}
        background={"var(--shade6)"}
        data={[radialPercent]}
        colors={[radialColor ? radialColor : "var(--shade6)"]}
        strokeWidth={4}
      />
      <PlayerRankIcon>
        {Icon ? <Icon /> : <ApexUnrankedLg color="var(--shade6)" />}
      </PlayerRankIcon>
    </PlayerRank>
  );
};

function RankMajor({
  splitStats,
  seasonValue,
  setSeason,
  queueName,
  setMode,
  stats,
}) {
  const { t } = useTranslation();

  const { firstSplit, secondSplit } = splitStats;

  return (
    <RankMajorFrame>
      <FilterSelectContainer>
        <FilterModes selected={queueName} onChange={setMode} />
        <FilterSeasons selected={seasonValue} onChange={setSeason} />
      </FilterSelectContainer>
      <RankInfo>
        <RankIcon split={firstSplit} />
        <PlayerRankDetails>
          <RankContainer>
            {firstSplit ? (
              <RankTier>
                {t(firstSplit.tKey, firstSplit.tDefault, {
                  tier: firstSplit.rank,
                })}
              </RankTier>
            ) : null}
          </RankContainer>
        </PlayerRankDetails>
      </RankInfo>
      {secondSplit ? (
        <RankInfo>
          <RankIcon split={secondSplit} />
          <PlayerRankDetails>
            <RankContainer>
              <RankTier>
                {t(secondSplit.tKey, secondSplit.tDefault, {
                  tier: secondSplit.rank,
                })}
              </RankTier>
            </RankContainer>
          </PlayerRankDetails>
        </RankInfo>
      ) : null}
      <ProfileStats stats={stats} />
    </RankMajorFrame>
  );
}
export default RankMajor;
