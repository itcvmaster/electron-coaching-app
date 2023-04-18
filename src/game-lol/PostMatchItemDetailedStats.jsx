import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption, CaptionBold } from "@/game-lol/CommonComponents.jsx";
import MatchItemDetailedStatsPlayer from "@/game-lol/PostMatchItemDetailedStatsPlayer.jsx";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import HextechIncome from "@/inline-assets/hextech-income.svg";
import HextechInhibitor from "@/inline-assets/hextech-inhibitor.svg";
import HextechBaron from "@/inline-assets/hextech-monster-baron.svg";
import HextechDragon from "@/inline-assets/hextech-monster-dragon.svg";
import HextechRiftHerald from "@/inline-assets/hextech-monster-riftherald.svg";
import HextechTurret from "@/inline-assets/hextech-turret.svg";

const TeamHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--sp-4);
  height: var(--sp-8);

  .team-title {
    color: var(--red);
  }

  &.my-team {
    .team-title {
      color: var(--blue);
    }
  }

  .team-header-stats {
    display: flex;

    .team-header-stat {
      display: flex;
      align-items: center;
      margin: 0 var(--sp-2);
    }
  }

  svg {
    height: var(--sp-4);
    width: var(--sp-4);
    fill: var(--shade4);
    margin-right: var(--sp-1);
  }
`;
const MatchItemDetailedStatsTeam = ({
  team,
  isMyTeam,
  participants,
  duration,
  patch,
  match,
  otherParticipants,
  queueType,
  winningTeamId,
  playersRankings,
  currParticipant,
  account,
  region,
}) => {
  const { t } = useTranslation();

  const teamSide = isMyTeam
    ? `${t("lol:postmatch.team1", "Team 1")}`
    : `${t("lol:postmatch.team2", "Team 2")}`;
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalGold = 0;
  let highestDamage = 0;
  let totalTowers = 0;

  for (const participant of participants) {
    totalKills += participant.kills;
    totalDeaths += participant.deaths;
    totalAssists += participant.assists;
    totalGold += participant.goldEarned;
    totalTowers += participant.turretKills || 0;
    if (participant.totalDamageDealtToChampions >= highestDamage) {
      highestDamage = participant.totalDamageDealtToChampions;
    }
  }

  for (const participant of otherParticipants) {
    if (participant.totalDamageDealtToChampions >= highestDamage) {
      highestDamage = participant.totalDamageDealtToChampions;
    }
  }
  return (
    <div>
      <TeamHeader className={isMyTeam && "my-team"}>
        <CaptionBold className="team-title">{teamSide}</CaptionBold>
        <div className="team-header-stats">
          <CaptionBold className="team-header-stat">
            {t("lol:displayKDA", "{{kills}} / {{deaths}} / {{assists}}", {
              kills: totalKills,
              deaths: totalDeaths,
              assists: totalAssists,
            })}
          </CaptionBold>
        </div>
        <div className="team-header-stats">
          <div className="team-header-stat">
            <HextechTurret />
            <Caption>
              {totalTowers === 0 ? team.objectives.tower.kills : totalTowers}
            </Caption>
          </div>
          {team.objectives.inhibitor.kills !== null ? (
            <div className="team-header-stat">
              <HextechInhibitor />
              <Caption>{team.objectives.inhibitor.kills}</Caption>
            </div>
          ) : null}
        </div>
        {["CLASSIC", "ONEFORALL", "ARSR", "GAMEMODEX", "URF"].includes(
          match.gameMode
        ) ? (
          <div className="team-header-stats">
            {team.objectives.baron.kills !== null ? (
              <div className="team-header-stat">
                <HextechBaron />
                <Caption>{team.objectives.baron.kills}</Caption>
              </div>
            ) : null}
            {team.objectives.riftHerald.kills !== null ? (
              <div className="team-header-stat">
                <HextechRiftHerald />
                <Caption>{team.objectives.riftHerald.kills}</Caption>
              </div>
            ) : null}
            {team.objectives.dragon.kills !== null ? (
              <div className="team-header-stat">
                <HextechDragon />
                <Caption>{team.objectives.dragon.kills}</Caption>
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="team-header-stats">
          <div className="team-header-stat">
            <HextechIncome />
            <Caption>
              {t("lol:thousandsOfGold", "{{amount}}k", {
                amount: parseFloat((totalGold / 1000).toFixed(1)),
              })}
            </Caption>
          </div>
        </div>
      </TeamHeader>
      {(participants || []).map((participant, i) => {
        return (
          <MatchItemDetailedStatsPlayer
            key={
              `match-stats-player-${participant?.summonerId}` ||
              `match-stats-player-${i}`
            }
            account={account}
            isMyTeam={isMyTeam}
            duration={duration}
            participant={participant}
            currParticipant={currParticipant}
            highestDamage={highestDamage}
            totalKills={totalKills}
            patch={patch}
            queueType={queueType}
            platformId={match.platformId}
            winningTeamId={winningTeamId}
            playersRankings={playersRankings}
            region={region}
          />
        );
      })}
    </div>
  );
};

const MatchItemDetailedStats = ({
  match,
  t1Participants,
  t2Participants,
  t1,
  t2,
  account,
  currParticipant,
  duration,
  isRemake,
  winningTeamId,
  playersRankings,
  region,
}) => {
  const latestPatch = getCurrentPatchForStaticData();

  if (!latestPatch) return null;

  const gamePatch = latestPatch;

  return (
    <div className="flex column gap-sp-4">
      <MatchItemDetailedStatsTeam
        currParticipant={currParticipant}
        participants={t1Participants}
        team={t1}
        isMyTeam={true}
        otherParticipants={t2Participants}
        duration={duration}
        patch={gamePatch}
        match={match}
        isRemake={isRemake}
        queueType={match.queueId}
        winningTeamId={winningTeamId}
        playersRankings={playersRankings}
        account={account}
        region={region}
      />
      <MatchItemDetailedStatsTeam
        currParticipant={currParticipant}
        participants={t2Participants}
        team={t2}
        isMyTeam={false}
        otherParticipants={t1Participants}
        duration={duration}
        patch={gamePatch}
        match={match}
        isRemake={isRemake}
        queueType={match.queueId}
        winningTeamId={winningTeamId}
        playersRankings={playersRankings}
        account={account}
        region={region}
      />
    </div>
  );
};

export default MatchItemDetailedStats;
