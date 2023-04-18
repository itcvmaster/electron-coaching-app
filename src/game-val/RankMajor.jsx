import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Select } from "clutch";

import { winRatecolorRange } from "@/app/util.mjs";
import ActRankTriangle from "@/game-val/ActRankTriangle.jsx";
import { GAME_MODES, GAME_VAL_RANK_COLORS } from "@/game-val/constants.mjs";
import {
  calcAvgScore,
  calcHeadshotPercent,
  getActOptions,
  getValorantRankImage,
  translateValRankedTier,
} from "@/game-val/utils.mjs";
import { ValWinStreakBadge } from "@/game-val/WinStreakBadge.jsx";
import DefaultWinrate from "@/shared/DefaultWinrate.jsx";
import RadialProgress from "@/shared/RadialProgress.jsx";
import { calcRate, displayRate } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const RankMajorFrame = styled("div")`
  &:not(:last-of-type) {
    margin-bottom: var(--sp-6);
  }
`;

const StatsArea = styled("div")`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4) var(--sp-6);
  padding-bottom: var(--sp-4);
  text-transform: capitalize;
`;

const StatLine = styled("div")`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  .stat-name {
    color: var(--shade2);
    font-weight: 500;
    font-size: var(--sp-3);
  }
  .hs-stat {
    display: flex;
    color: var(--shade2);
    font-weight: 500;
    font-size: var(--sp-3);
  }
  .stat-data-point {
    font-weight: 700;
    font-size: var(--sp-3_5);
  }
`;

const RankInfo = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  margin: var(--sp-2_5) var(--sp-0) var(--sp-2_5) var(--sp-5);
  padding-bottom: ${(props) => (props.$last20 ? "" : "var(--sp-5)")};
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

const Points = styled("p")`
  font-size: var(--sp-3);
  color: var(--shade2);
  font-weight: bold;

  span {
    margin-left: var(--sp-2);
  }
`;

const WinRate = styled("span")`
  color: var(--shade1);
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

const RankIcon = ({ rank, tier, radialPercent, radialColor }) => {
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
        <img src={getValorantRankImage({ tier, rank })} width="72" />
      </PlayerRankIcon>
    </PlayerRank>
  );
};

const RankIconWrapper = ({
  rank,
  tier,
  radialPercent,
  radialColor,
  seasonValue,
  activeSeasonId,
  selectedRankObj,
}) => {
  if (seasonValue === "lifetime" || seasonValue === activeSeasonId) {
    return (
      <RankIcon
        rank={rank}
        tier={tier}
        radialColor={radialColor}
        radialPercent={radialPercent}
      />
    );
  }
  return <ActRankTriangle actRank={selectedRankObj} />;
};

function isTierString(tier) {
  if (typeof tier === "string") return true;
  return false;
}

const rankTitle = (t, tier) => {
  if (tier && isTierString(tier)) {
    return translateValRankedTier(t, tier);
  }
  return t("val:ranks.unrated", "Unrated");
};

function RankMajor({
  queue,
  seasonValue,
  last20,
  setSeason,
  queueName,
  setQueue,
  winstreak,
  // supportedQueues,
  // name,
  winRateColor,
  actRanks,
  actData,
  activeSeasonId,
  hideActRank,
}) {
  const { t } = useTranslation();

  const selectedRankObj = actRanks?.find(
    (actObj) => actObj.actID === seasonValue
  );

  const currentRank = selectedRankObj?.rank || queue?.rank;
  const currentTier = selectedRankObj?.tier || queue?.tier;

  const damagePerRound = last20
    ? calcRate(last20.damageStats.damage, last20.roundsPlayed, 1)
    : null;

  const kd = last20 ? calcRate(last20.kills, last20.deaths, 1) : null;

  const econScore = last20
    ? calcRate(last20.economy, last20.damageStats.damage, 1)
    : null;

  const hsPercent = last20 ? calcHeadshotPercent(last20.damageStats) : null;
  const combatScore = getLocaleString(
    last20 ? calcAvgScore(last20.score, last20.roundsPlayed) : null
  );

  const isDeathmatch = queueName === "deathmatch";
  const games = 0;
  const wins = queue?.wins;
  const losses = queue?.losses;

  const colors = GAME_VAL_RANK_COLORS;

  const queueWinrate = displayRate(wins, losses + wins);
  const rankName = currentTier?.toLowerCase();

  const winRateColors =
    winRateColor ||
    (wins !== undefined &&
      winRatecolorRange(100 * (wins / (wins + losses || 1))));

  let radialPercent = 0;
  if (queue) {
    if (currentTier === "radiant") radialPercent = 1;
    else if (queue.rankedRating !== null && queue.rankedRating !== undefined) {
      radialPercent = queue.rankedRating / 100;
    }
  }

  const radialColor =
    queue && isTierString(currentTier)
      ? colors[rankName].fill
      : "var(--shade6)";

  const titleColor =
    queue && isTierString(currentTier)
      ? colors[rankName].text
      : "var(--shade3)";

  const tierTitle = rankTitle(t, currentTier);

  const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const getGameModes = () =>
    GAME_MODES.map((modeName) => {
      return {
        disabled: false,
        text: titleCase(modeName),
        value: modeName,
      };
    });

  const modes = getGameModes();
  const acts = getActOptions(actData);
  acts.push({
    disabled: false,
    text: t("val:lifetime", "Lifetime"),
    value: "lifetime",
  });

  let currentRR = 0;
  if (queue?.rankedRating)
    currentRR = queue.rankedRating >= 0 ? queue.rankedRating : 0;
  return (
    <RankMajorFrame>
      <FilterSelectContainer>
        <Select selected={queueName} options={modes} onChange={setQueue} />
        <Select selected={seasonValue} options={acts} onChange={setSeason} />
      </FilterSelectContainer>
      <RankInfo $last20={last20}>
        {queue ? (
          <RankIconWrapper
            queue={queue}
            rank={currentRank}
            tier={currentTier}
            radialColor={radialColor}
            radialPercent={radialPercent}
            selectedRankObj={selectedRankObj}
            hideActRank={hideActRank}
            seasonValue={seasonValue}
            activeSeasonId={activeSeasonId}
          />
        ) : (
          <DefaultWinrate wins={wins} games={games} />
        )}
        <PlayerRankDetails>
          <div>
            {/* {isRanked && ( */}
            <>
              <RankContainer>
                <RankTier color={titleColor}>
                  {tierTitle} {queue && currentRank}
                </RankTier>
                &nbsp;&nbsp;
                {winstreak > 1 && activeSeasonId === seasonValue && (
                  <ValWinStreakBadge
                    streakCount={winstreak}
                    streakType="win"
                    showTooltip
                  />
                )}
              </RankContainer>
              {queue?.rankedRating ? (
                <Points>
                  {t("val:rankedRating", "{{points}} RR", {
                    points: currentRR,
                  })}
                </Points>
              ) : null}
            </>
            <Points>
              {wins !== undefined &&
                losses !== undefined &&
                t("val:winsAndLosses", "{{wins}}W {{losses}}L", {
                  wins: wins || 0,
                  losses: losses || 0,
                })}
              <WinRate style={{ color: winRateColors }}>
                {t("val:winPercent", "{{percent}}", {
                  percent: queueWinrate,
                })}
              </WinRate>
            </Points>
          </div>
        </PlayerRankDetails>
      </RankInfo>
      {last20 && (
        <StatsArea>
          <StatLine>
            <p className="stat-name">
              {t("val:stats.killsDeath", "Kills/Death")}
            </p>
            <p className="stat-data-point">{kd}</p>
          </StatLine>

          {!isDeathmatch && (
            <StatLine>
              <p className="stat-name">
                {t("val:stats.dmgPerRound", "Dmg/Round")}
              </p>
              <p className="stat-data-point">{damagePerRound}</p>
            </StatLine>
          )}

          {!isDeathmatch && (
            <StatLine>
              <p className="hs-stat">
                {t("common:stats.hs", "HS")}
                {/* <HeadShotHelpIcon /> */}
              </p>
              <p className="stat-data-point">
                {t("val:hsPercent", "{{hsPercent}}%", { hsPercent: hsPercent })}
              </p>
            </StatLine>
          )}
          <StatLine>
            <p className="stat-name">
              {t("val:stats.combatScore", "Combat Score")}
            </p>
            <p className="stat-data-point">{combatScore}</p>
          </StatLine>
          {!isDeathmatch && (
            <StatLine>
              <p className="stat-name">
                {t("val:stats.econScore", "Econ Score")}
              </p>
              <p className="stat-data-point">{econScore}</p>
            </StatLine>
          )}
        </StatsArea>
      )}
    </RankMajorFrame>
  );
}
export default RankMajor;
