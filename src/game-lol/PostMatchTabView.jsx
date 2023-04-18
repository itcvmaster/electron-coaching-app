import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "clutch";

import { TabView } from "@/game-lol/CommonComponents.jsx";
import PostMatchAdvancedStats from "@/game-lol/PostMatchAdvancedStats.jsx";
import PostmatchBansView from "@/game-lol/PostmatchBansView.jsx";
import PostMatchItemDetailedStats from "@/game-lol/PostMatchItemDetailedStats.jsx";
import PostMatchMatchTimeline from "@/game-lol/PostMatchMatchTimeline.jsx";
import {
  inferRolesFromChampions,
  isRemakeGame,
  sortParticipantsByRole,
  splitParticipantsByTeam,
} from "@/game-lol/util.mjs";

function PostMatchTabView(props) {
  const {
    match,
    timeline,
    account,
    myTeam,
    hasFrames,
    winningTeamId,
    playersRankings,
    championsReport,
    currParticipant,
    patch,
    champions,
    className,
    region,
  } = props;
  const { t } = useTranslation();

  if (!match) return null;

  const { participants, teams } = match;
  const participantTeams = splitParticipantsByTeam(participants, myTeam);

  if (participantTeams.t1.some((v) => !v.individualPosition)) {
    participantTeams.t1 = inferRolesFromChampions(
      participantTeams.t1,
      championsReport
    );
  }
  if (participantTeams.t2.some((v) => !v.individualPosition)) {
    participantTeams.t2 = inferRolesFromChampions(
      participantTeams.t2,
      championsReport
    );
  }
  const t1Participants = sortParticipantsByRole(participantTeams.t1);
  const t2Participants = sortParticipantsByRole(participantTeams.t2);

  const t1 = teams.find((team) => team?.teamId === myTeam);
  const t2 = teams.find((team) => team?.teamId !== myTeam);

  const isMyTeam = myTeam === t1?.teamId;

  const isRemake = match ? isRemakeGame(match?.gameDuration, true) : null;

  const overview = t("lol:postmatch.tabViewHeaders.overview", "Overview");
  const advancedStats = t(
    "lol:postmatch.tabViewHeaders.advancedStats",
    "Advanced Stats"
  );
  const goldGraph = t("lol:postmatch.tabViewHeaders.goldGraph", "Gold Graph");
  const tabs = [overview, advancedStats];
  if (hasFrames) tabs.push(goldGraph);

  return (
    <Card className={className} padding="0">
      <TabView
        data={tabs}
        defaultPosition={0}
        renderTabView={(_, i) => {
          switch (i) {
            case 0:
              return (
                <PostMatchItemDetailedStats
                  match={match}
                  t1Participants={t1Participants}
                  t2Participants={t2Participants}
                  t1={t1}
                  t2={t2}
                  account={account}
                  currParticipant={currParticipant}
                  duration={match.gameDuration}
                  isRemake={isRemake}
                  winningTeamId={winningTeamId}
                  playersRankings={playersRankings}
                  region={region}
                />
              );
            case 1:
              return (
                <PostMatchAdvancedStats
                  t1Participants={t1Participants}
                  t2Participants={t2Participants}
                  account={account}
                  myTeam={myTeam}
                  gameId={match.gameId}
                />
              );
            case 2:
              return (
                <PostMatchMatchTimeline
                  timeline={timeline}
                  myTeam={myTeam}
                  t1Length={t1Participants.length}
                  totalParticipants={participants.length}
                />
              );
            default:
              return null;
          }
        }}
        renderExtra={() => {
          return (
            <PostmatchBansView
              t1={t1}
              t2={t2}
              isMyTeam={isMyTeam}
              patch={patch}
              champions={champions}
            />
          );
        }}
      />
    </Card>
  );
}

export default PostMatchTabView;
