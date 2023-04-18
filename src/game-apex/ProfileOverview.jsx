import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { updateRoute } from "@/__main__/router.mjs";
import LegendsStats from "@/game-apex/LegendsStats.jsx";
import ApexLiveTile from "@/game-apex/LiveTile.jsx";
import MatchHistoryHeader from "@/game-apex/MatchHistoryHeader.jsx";
import MatchTile from "@/game-apex/MatchTile.jsx";
import RankMajor from "@/game-apex/RankMajor.jsx";
import { getSplitRanksByPlayerSeason } from "@/game-apex/utils.mjs";
import WeaponsStats from "@/game-apex/WeaponsStats.jsx";
import {
  MatchesNotFound,
  MatchList as SharedMatchList,
  MatchTile as SharedMatchTile,
  MatchTileWrapper,
} from "@/shared/Profile.jsx";
import { ProfileBox, ProfileColumn } from "@/shared/Profile.style.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function ProfileOverview() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const {
    parameters: [profileId],
    searchParams,
    visibleMatches,
    currentPath,
  } = useRoute();
  const seasonParam = searchParams.get("season") || "all";
  const modeParam = searchParams.get("mode") || "all";
  const state = useSnapshot(readState);
  //   const profile = state.apex?.profiles?.[profileId];
  const playerSeasonStats = state.apex?.playerStats?.[profileId]?.[seasonParam];
  const playerStats = playerSeasonStats?.[modeParam];
  const liveGame = state.apex?.liveGame;
  const loggedInAccountId = state.settings.loggedInAccounts.apex;
  const matches =
    state.apex?.matchlists?.[profileId]?.[seasonParam]?.[modeParam] || [];
  const splitStats = getSplitRanksByPlayerSeason(
    playerSeasonStats,
    modeParam,
    t
  );

  const stats = useMemo(() => {
    if (playerStats?.games_played) {
      const { assists, kills, games_played, damage_done, wins } = playerStats;
      return [
        {
          title: t("common:stats.wins", "Wins"),
          value: wins?.toLocaleString(language, {
            maximumFractionDigits: 1,
          }),
        },
        {
          title: t("common:stats.dmgPerMatch", "Dmg / Match"),
          value: (damage_done / (games_played || 1))?.toLocaleString(language, {
            maximumFractionDigits: 1,
          }),
        },
        {
          title: t("apex:stats.kills", "Kills"),
          value: kills?.toLocaleString(language),
        },
        {
          title: t("common:stats.killsPerMatch", "Kills / Match"),
          value: (kills / (games_played || 1))?.toLocaleString(language, {
            maximumFractionDigits: 1,
          }),
        },
        {
          title: t("common:stats.assists", "Assists"),
          value: assists?.toLocaleString(language),
        },
        {
          title: t("common:stats.assistsPerMatch", "Assists / Match"),
          value: (assists / (games_played || 1))?.toLocaleString(language, {
            maximumFractionDigits: 1,
          }),
        },
      ];
    }
  }, [playerStats, t, language]);

  const updateSeason = (season) => {
    const search = `season=${season}&mode=${modeParam}`;
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  const updateMode = (mode) => {
    const search = `season=${seasonParam}&mode=${mode}`;
    updateRoute(currentPath, search, {
      visibleMatches: visibleMatches,
      softUpdate: true,
      offset: null,
    });
  };

  return (
    <>
      <ProfileColumn className="flex column gap-sp-4 sidebar ad-align">
        <Card>
          {splitStats ? (
            <RankMajor
              splitStats={splitStats}
              seasonValue={seasonParam}
              setSeason={updateSeason}
              setMode={updateMode}
              queueName={modeParam}
              stats={stats}
            />
          ) : null}
        </Card>
        <Card padding="0" title={t("common:legends", "Legends")}>
          <LegendsStats
            season={seasonParam}
            mode={modeParam}
            profileId={profileId}
          />
        </Card>
        <Card padding="0" title={t("common:weapons", "Weapons")}>
          <WeaponsStats
            season={seasonParam}
            mode={modeParam}
            profileId={profileId}
          />
        </Card>
      </ProfileColumn>
      <ProfileColumn className="main">
        {matches?.length ? (
          <MatchHistoryHeader
            matchList={matches}
            selectedAccountId={profileId}
          />
        ) : null}
        {liveGame && parseInt(profileId) === loggedInAccountId ? (
          <MatchTileWrapper height={128} match={liveGame}>
            <ApexLiveTile match={liveGame} profileId={profileId} />
          </MatchTileWrapper>
        ) : null}
        <ProfileBox className="match-list">
          <SharedMatchList matchList={matches}>
            {matches?.length ? (
              matches.map((match) => {
                const matchId = match?.matchId;
                const hasMatch = matchId && !(match instanceof Error);
                return hasMatch ? (
                  <SharedMatchTile
                    height={128}
                    id={matchId}
                    key={matchId}
                    match={match}
                    matchRoute={`/apex/match/${profileId}/${matchId}`}
                  >
                    <MatchTile match={match} profileId={profileId} />
                  </SharedMatchTile>
                ) : null;
              })
            ) : (
              <MatchesNotFound />
            )}
          </SharedMatchList>
          {/* {matches?.length ? (
            <MatchListFooter className="match-list-footer">
              <ShowMorePanelFooter
                hasMore={!isEndOfMatchList}
                setShowMore={() => loadMoreMatches()}
              ></ShowMorePanelFooter>
            </MatchListFooter>
          ) : null} */}
        </ProfileBox>
      </ProfileColumn>
    </>
  );
}

export function meta(info) {
  const userName = info[1];
  return {
    title: [
      `apex:profile`,
      `{{userName}}'s Match Stats – Apex – Blitz Apex`,
      { userName: userName },
    ],
    description: [
      `apex:profile`,
      `profile for {{userName}}`,
      { userName: userName },
    ],
  };
}

export default ProfileOverview;
