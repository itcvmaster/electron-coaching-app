import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { updateRoute } from "@/__main__/router.mjs";
import AgentStats from "@/game-val/AgentStats.jsx";
import { RANKS } from "@/game-val/constants.mjs";
import HeadShotStats from "@/game-val/HeadShotStats.jsx";
import MapsStats from "@/game-val/MapsStats.jsx";
import MatchHistoryHeader from "@/game-val/MatchHistoryHeader.jsx";
import MatchListRow from "@/game-val/MatchListRow.jsx";
import RankMajor from "@/game-val/RankMajor.jsx";
import ShowMorePanelFooter from "@/game-val/ShowMorePanelFooter.jsx";
import { getActData } from "@/game-val/utils.mjs";
import WeaponStats from "@/game-val/WeaponStats.jsx";
import { MatchesNotFound, MatchList, MatchTile } from "@/shared/Profile.jsx";
import { ProfileBox, ProfileColumn } from "@/shared/Profile.style.jsx";
import { useTransientRoute } from "@/util/router-hooks.mjs";

const MatchListFooter = styled("div")`
  padding: var(--sp-4);
`;

function ProfileOverview({ profileId, actName, season }) {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const route = useTransientRoute();

  const getInitialQueueState = () => {
    if (!season || season === "lifetime") return "overall";
    return season;
  };
  const [queueName, setQueue] = useState(getInitialQueueState());
  const [seasonValue, setSeason] = useState(actName || "lifetime");

  const isDeathmatch = queueName === "deathmatch";

  const defaultMatchRef = {
    fetchCount: 0,
    matches: [],
    updateMatches: true,
  };
  const matchesRef = useRef(defaultMatchRef);

  const loadMoreMatches = () => {
    matchesRef.current.fetchCount += 1;
    matchesRef.current.updateMatches = true;

    updateRoute(route.currentPath, route.searchParams, {
      visibleMatches: route.visibleMatches,
      softUpdate: true,
      offset: matchesRef?.current.matches.length || 0,
    });
  };

  const updateQueue = (queue) => {
    const searchQ = queue !== "overall" ? queue : "lifetime";
    const search = `actName=${seasonValue}&queue=${searchQ}`;

    updateRoute(route.currentPath, search, {
      visibleMatches: route.visibleMatches,
      softUpdate: true,
      offset: null,
    });
    setQueue(queue);
  };

  const updateSeason = (season) => {
    const searchQ = queueName !== "overall" ? queueName : "lifetime";
    const search = `actName=${season}&queue=${searchQ}`;
    matchesRef.current = defaultMatchRef;

    updateRoute(route.currentPath, search, {
      visibleMatches: route.visibleMatches,
      softUpdate: true,
      offset: null,
    });
    setSeason(season);
  };

  const lowercaseName = profileId.toLowerCase();
  const profile = state.val?.profiles?.[lowercaseName];
  const { name, rank, rankedRating, seasonRanks, puuid } = profile || {};

  const rankInfo = RANKS?.[rank];
  const valConstants = state.val?.constants;

  const actData = getActData(valConstants);

  let activeSeasonId = null;
  const actRanksFormatted =
    valConstants?.acts && seasonRanks
      ? Object.keys(seasonRanks).map((actId) => {
          const actName = actData[actId]?.name;
          if (actData[actId]?.isActive) activeSeasonId = actId;
          const actRankNumber = seasonRanks[actId]?.topMatches?.[0]?.rank || 0;
          return {
            actName: actName,
            actID: actId,
            rankNumber: actRankNumber,
            rankKey: RANKS[actRankNumber]?.key,
            tier: RANKS[actRankNumber]?.tier,
            rank: RANKS[actRankNumber].rank,
            ...seasonRanks[actId],
          };
        })
      : null;

  const allAgents = valConstants?.agents;
  const allWeapons = valConstants?.weapons;

  const playerStatsProxy = state.val?.playerStats;
  const playerStatsKey = playerStatsProxy
    ? Object.keys(playerStatsProxy).find(
        (key) => key.includes(seasonValue) && key.includes(puuid)
      )
    : null;

  const playerStats = playerStatsProxy?.[playerStatsKey];

  const last20 = playerStats?.[queueName]?.last20;
  const career = playerStats?.[queueName]?.career;

  const agentCareerStats = career?.agentsStats;
  const mapCareerStats = career?.mapStats;

  const matchListProxy = state.val?.matchStats?.[seasonValue];

  if (
    puuid &&
    matchListProxy &&
    !matchesRef.current.updateMatches &&
    Object.keys(matchListProxy).some((k) => !k.includes(puuid))
  ) {
    matchesRef.current = defaultMatchRef;
  }

  const matchListKeys = matchListProxy
    ? Object.keys(matchListProxy).filter((key) => key.includes(puuid))
    : null;

  const matchListKey = matchListKeys
    ? matchListKeys[matchesRef.current.fetchCount]
    : null;
  const matchList = matchListProxy?.[matchListKey];

  const sanitizedMatchList =
    matchList && !(matchList instanceof Error) ? matchList : [];

  const isEndOfMatchList =
    sanitizedMatchList?.length === 0 || !sanitizedMatchList?.[0].matchId;

  if (matchesRef.current?.updateMatches && sanitizedMatchList?.length) {
    matchesRef.current.matches = [
      ...matchesRef.current.matches,
      ...sanitizedMatchList,
    ];
    matchesRef.current.updateMatches = false;
  }

  const numWins = career?.wins;
  const numMatches = career?.matches;
  const numLosses = numMatches - (numWins + (career?.ties || 0));

  const queue =
    rankInfo && playerStats
      ? {
          wins: numWins,
          losses: numLosses,
          tier: rankInfo.tier,
          rank: rankInfo.rank,
          rankedRating: rankedRating,
        }
      : null;

  const sortDate = (a, b) => new Date(b.matchDate) - new Date(a.matchDate);
  const renderedMatchList =
    queueName === "overall"
      ? matchesRef.current.matches?.sort(sortDate)
      : matchesRef.current.matches
          .filter((match) => {
            return match.queue === queueName;
          })
          .sort(sortDate);

  let winstreak = 0;
  renderedMatchList.some((match) => {
    if (match?.winStatus !== "win") return true;
    winstreak += 1;
    return false;
  });

  return (
    <>
      <ProfileColumn className="flex column gap-sp-4 sidebar">
        <Card>
          <RankMajor
            queue={queue}
            seasonValue={seasonValue}
            last20={last20}
            winstreak={winstreak}
            setSeason={updateSeason}
            queueName={queueName}
            setQueue={updateQueue}
            supportedQueues={[]}
            name={name}
            actRanks={actRanksFormatted}
            activeSeasonId={activeSeasonId}
            actData={actData}
          />
        </Card>
        {!isDeathmatch && last20 && renderedMatchList?.length !== 0 ? (
          <Card padding="0">
            <HeadShotStats
              profileId={profileId}
              last20Stats={last20}
              matches={[...renderedMatchList]}
            />
          </Card>
        ) : null}
        {!isDeathmatch && Boolean(renderedMatchList?.length) && (
          <Card title={t("common:agents", "Agents")} padding="0">
            <AgentStats agentStats={agentCareerStats} allAgents={allAgents} />
          </Card>
        )}{" "}
        {renderedMatchList?.length ? (
          <Card title={t("common:maps", "Maps")}>
            <MapsStats mapStats={mapCareerStats} isDeathmatch={isDeathmatch} />
          </Card>
        ) : null}
        {!isDeathmatch && Boolean(renderedMatchList?.length) && (
          <Card title={t("common:weapons", "Weapons")}>
            <WeaponStats allWeapons={allWeapons} last20={last20} />
          </Card>
        )}{" "}
      </ProfileColumn>

      <ProfileColumn className="main">
        {matchList && last20 && renderedMatchList?.length ? (
          <MatchHistoryHeader
            stats={playerStats}
            matchList={[...renderedMatchList]}
            allAgents={allAgents}
          />
        ) : (
          <ProfileBox style={{ height: "var(--sp-px) * 95)" }}></ProfileBox>
        )}

        <ProfileBox className="match-list">
          <MatchList matchList={matchList ? renderedMatchList : undefined}>
            {renderedMatchList?.length ? null : <MatchesNotFound />}
            {renderedMatchList.map((match) => {
              const matchId = match?.matchId;
              const hasMatch = match && matchId && !(match instanceof Error);
              return hasMatch ? (
                <MatchTile
                  height={128}
                  id={matchId}
                  key={matchId}
                  match={match}
                  matchRoute={`/valorant/match/${profileId}/${match.season}/${matchId}`}
                >
                  <MatchListRow match={match} allAgents={allAgents} />
                </MatchTile>
              ) : null;
            })}
          </MatchList>

          {renderedMatchList?.length ? (
            <MatchListFooter>
              <ShowMorePanelFooter
                hasMore={!isEndOfMatchList}
                setShowMore={() => loadMoreMatches()}
              ></ShowMorePanelFooter>
            </MatchListFooter>
          ) : null}
        </ProfileBox>
      </ProfileColumn>
    </>
  );
}

export default ProfileOverview;
