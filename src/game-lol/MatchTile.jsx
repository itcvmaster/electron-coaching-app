import React from "react";

import {
  ARAM_QUEUE_TYPES,
  QUEUE_SYMBOL_TO_STR,
  ROLE_QUEUE_TYPES,
} from "@/game-lol/constants.mjs";
import getHextechRoleIcon from "@/game-lol/lol-icons.mjs";
import Stats from "@/game-lol/MatchTileStats.jsx";
import PlayerScores from "@/game-lol/player-scores.mjs";
import { ProfileMatch } from "@/game-lol/ProfileMatch.jsx";
import Static from "@/game-lol/static.mjs";
import {
  correctRoleName,
  isWinningTeam,
  roleHumanize,
  roleImgFilter,
} from "@/game-lol/util.mjs";
import ARAM from "@/inline-assets/lol-role-aram.svg";

function MatchTileContainer({ match, profile, champions, lp }) {
  const {
    queueId: queue,
    gameDuration,
    gameId,
    participants,
    teams,
    gameCreation,
  } = match;

  if (!participants) {
    return null;
  }
  const queueId = Number(QUEUE_SYMBOL_TO_STR[queue]?.key);
  const isRemake = gameDuration <= 300;
  const isARAM = ARAM_QUEUE_TYPES.includes(queueId);
  const isScorable = ROLE_QUEUE_TYPES.includes(queueId);

  const participantInfo = participants.find(
    (p) => p.summonerName === profile.summonerName
  );
  if (!participantInfo) {
    return null;
  }

  const tileImage = Static.getChampionImageById(
    champions,
    participantInfo.championId
  );

  const playersRankings = isScorable ? PlayerScores(match) : null;

  const userRanking =
    playersRankings &&
    playersRankings.findIndex(
      (p) =>
        p.championId === participantInfo.championId &&
        p.teamId === participantInfo.teamId
    ) + 1;

  const userPoints =
    userRanking &&
    playersRankings.find(
      (p) =>
        p.championId === participantInfo.championId &&
        p.teamId === participantInfo.teamId
    );

  const winningTeamId = teams?.find((team) => isWinningTeam(team))?.teamId;
  const bestWinner = playersRankings?.find((p) => p.teamId === winningTeamId);
  const isMVP =
    participantInfo?.teamId === bestWinner?.teamId &&
    participantInfo?.championId === bestWinner?.championId;

  const role = participantInfo.teamPosition;

  const roleImageName = roleHumanize(
    role ? correctRoleName(role) : roleImgFilter("", participantInfo.role)
  ).toLowerCase();

  const icon = isARAM ? "aram" : roleImageName;
  const RoleIcon = isARAM ? ARAM : getHextechRoleIcon(icon);
  const roleName = role && !isARAM ? roleHumanize(role) : "";
  const statsData = {
    queueId,
    gameDuration,
    gameId,
    participants,
    ownData: participantInfo,
    gameCreation,
    deltaLp: lp,
  };

  return (
    <ProfileMatch image={tileImage}>
      <Stats
        stats={statsData}
        userRanking={userRanking}
        userPoints={userPoints}
        role={role}
        isMVP={isMVP}
        isRemake={isRemake}
        queue={queueId}
        isARAM={isARAM}
        win={
          isScorable
            ? !!(userPoints && userPoints.victory)
            : participantInfo.win
        }
        RoleIcon={RoleIcon}
        roleName={roleName}
        deltaLp={lp}
      />
    </ProfileMatch>
  );
}
export default MatchTileContainer;
