import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card, tablet } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { formatDuration } from "@/app/util.mjs";
import AbilityBreakdown from "@/game-val/AbilityBreakdown.jsx";
import { buildAccolades } from "@/game-val/BuildAccolades.jsx";
import { RANKS } from "@/game-val/constants.mjs";
import MissingDataBanner from "@/game-val/MissingDataBanner.jsx";
import {
  calcPlayerMatchPosition,
  getAbilityKills,
  getPlayerStatsFromMatch,
  getTeamStatsFromMatch,
} from "@/game-val/postmatch-helpers.mjs";
import RankHSAnalysis from "@/game-val/RankHSAnalysis.jsx";
import StatsBreakdownDataWrapper from "@/game-val/StatsBreakdownDataWrapper.jsx";
import TeamBreakdown from "@/game-val/TeamBreakdown.jsx";
import {
  calculateHitLocationPercents,
  getAgentImage,
  getMatchPositionText,
  getPlayerIdType,
  getQueueName,
} from "@/game-val/utils.mjs";
import WeaponStatsTable from "@/game-val/WeaponStatsTable.jsx";
import Container from "@/shared/ContentContainer.jsx";
import HitStats from "@/shared/HitStats.jsx";
import SharedMatch from "@/shared/Match.jsx";
// import PostMatchHeader from "@/shared/PostMatchHeader.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import PlayerPostStatsIcon from "@/shared/PlayerPostStatsIcon.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import { calcRate } from "@/util/helpers.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: var(--sp-12);
`;

const PageColumn = styled("div")`
  &.column-1 {
    grid-column: span 1 / auto;
    ${tablet} {
      grid-column: span 3 / auto;

      margin-bottom: var(--sp-2_5);
    }
  }

  &.column-2 {
    grid-column: span 2 / auto;
  }

  ${tablet} {
    width: 100%;
    padding: 0 var(--sp-3);
  }
`;

const HeaderContainer = styled("div")`
  width: 100%;
  margin: var(--sp-0) auto;
  max-width: var(--sp-container);

  .header-desc {
    text-transform: capitalize;
  }
  .postmatch-header {
    grid-column: span 1 / auto;
    margin-left: var(--sp-3);
    img {
      transform: scale(1);
    }
  }
`;

const MainContainer = styled(Container)`
  width: 100%;
  display: grid;
  grid-column: span 3 / auto;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: var(--sp-4);
  margin: var(--sp-0) auto;

  ${tablet} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Badges = styled("div")`
  display: flex;
  gap: var(--sp-3);

  &.nudge-left {
    margin-left: calc(var(--sp-4) * -1);
  }
`;

function Postmatch() {
  const state = useSnapshot(readState);
  const { t } = useTranslation();

  const route = useRoute((prev, next) => {
    return prev.currentPath === next.currentPath;
  });

  const {
    parameters: [profileId, actId, matchId],
  } = route;

  const lowercaseName = profileId.toLowerCase();
  const profile = state.val?.profiles?.[lowercaseName];
  const matchInfo = state.val?.postmatch?.[matchId];
  const playerStatsProxy = state.val?.playerStats;

  const playerType = profile ? getPlayerIdType(profile) : null;
  const { name, tag } = profile || {};
  const playerId = profile?.[playerType];
  const currentPlayerStats =
    matchInfo && profile
      ? matchInfo?.players?.find(
          (p) => p.gameName === name && p.tagLine === tag
        )
      : null;

  const abilityKillData = matchInfo
    ? getAbilityKills(matchInfo, playerId)
    : null;
  const matchStats = matchInfo
    ? getPlayerStatsFromMatch(
        matchInfo,
        profile?.[playerType],
        null,
        playerType
      )
    : null;

  const playersMatchStats = {};
  for (const player of Object.values(matchInfo?.players || [])) {
    playersMatchStats[player?.[playerType]] = getPlayerStatsFromMatch(
      matchInfo,
      player?.[playerType]
    );
  }

  const playerStatsKey =
    matchInfo?.season && playerStatsProxy
      ? Object.keys(playerStatsProxy).find(
          (key) => key.includes(playerId) && key.includes(actId)
        )
      : null;
  const playerStats = playerStatsProxy?.[playerStatsKey];

  const queueName = matchInfo?.queue === "" ? "custom" : matchInfo?.queue;
  const isDeathmatch = queueName === "deathmatch";
  const isEscalation = queueName === "ggteam";
  const isAnyDeathMatch = isDeathmatch || isEscalation;
  const last20 = playerStats?.[queueName]?.last20;

  const valConstants = state.val?.constants;
  const divisionStats = state.val?.meta?.division;

  const playersTeam = matchInfo?.teams?.find(
    (team) => team.teamId === currentPlayerStats?.teamId
  );
  const isVictory = playersTeam?.won;
  const dot_str = "·";

  const agentId =
    matchStats?.agentsStats && Object.keys(matchStats?.agentsStats)?.[0];

  const agentName =
    valConstants?.agents &&
    valConstants.agents.find((agentObj) => agentObj.id === agentId)?.name;

  const hitPositionPercents = matchStats
    ? calculateHitLocationPercents(matchStats.damageStats)
    : null;

  const recentHitPositionPercents = last20
    ? calculateHitLocationPercents(last20.damageStats)
    : null;

  const matchDuration = matchInfo
    ? formatDuration(matchInfo.length, "mm:ss")
    : "—";

  const teamStats =
    matchInfo && getTeamStatsFromMatch(matchInfo, playerId, playerType);

  const { teamPosition, position: matchPosition } =
    matchInfo && currentPlayerStats
      ? calcPlayerMatchPosition(
          currentPlayerStats,
          matchInfo.players,
          playerType
        )
      : {};

  const competitiveTier = currentPlayerStats?.competitiveTier ?? null;
  const tierName = competitiveTier
    ? RANKS[competitiveTier]?.tier?.toLowerCase()
    : null;

  const queueDisplayName = getQueueName(queueName);

  //division stats for the division the current player is in
  const userDivisionStats = divisionStats?.[tierName];
  const accolades = useMemo(() => {
    if (!matchInfo) return {};
    return buildAccolades({
      t,
      playerType,
      matchStats,
      last20: last20,
      divisionStats: userDivisionStats,
      radiantDivisionStats: divisionStats?.radiant,
      queueName: queueName,
      teamStats,
      playerId,
      teamId: currentPlayerStats?.teamId,
      teamPosition,
      matchData: matchInfo,
      isAnyDeathMatch: isAnyDeathMatch,
      isSpikeRush: false,
      isEscalation: false,
    });
  }, [
    t,
    playerType,
    matchStats,
    last20,
    userDivisionStats,
    divisionStats,
    queueName,
    matchInfo,
    teamStats,
    playerId,
    currentPlayerStats,
    teamPosition,
    isAnyDeathMatch,
  ]);

  const DamageBreakdownWrapper = ({ isDeathmatch }) => {
    if (isDeathmatch) {
      return <MissingDataBanner style={{ marginBottom: "var(--sp-2_5)" }} />;
    }

    const getFormatedStatsObj = (stats) => {
      if (!stats) return null;
      const matches = stats.matches;
      const roundsPlayed = stats.roundsPlayed;
      const dmg = stats.damageStats.damage;
      const avgDamage = calcRate(dmg, roundsPlayed, 1);
      const bodyshotsPerMatch = calcRate(
        stats.damageStats.bodyshots,
        matches,
        1
      );
      const damagePerMatch = calcRate(stats.damageStats.damage, matches, 1);
      const headshotsPerMatch = calcRate(
        stats.damageStats.headshots,
        matches,
        1
      );
      const legshotsPerMatch = calcRate(stats.damageStats.legshots, matches, 1);

      const statsObj = {
        avgDamagePerRound: avgDamage,
        matches: matches,
        weaponHits: {
          bodyshots: bodyshotsPerMatch,
          damage: damagePerMatch,
          headshots: headshotsPerMatch,
          legshots: legshotsPerMatch,
        },
      };
      return statsObj;
    };

    const damageMatchStats = matchStats
      ? getFormatedStatsObj(matchStats)
      : null;

    const recentMatchStats = last20 ? getFormatedStatsObj(last20) : null;

    return (
      <div style={{ marginBottom: "var(--sp-2_5)" }}>
        <HitStats
          matchStats={damageMatchStats}
          comparisonStats={recentMatchStats}
          hasDmgPerRound
          hasLegshots
        ></HitStats>
      </div>
    );
  };

  const getHeadertitle = () => {
    if (isDeathmatch)
      return t("common:match.position", "{{position}} Place", {
        position: getMatchPositionText(t, matchPosition),
      });
    return isVictory
      ? t("common:victory", "Victory")
      : t("common:defeat", "Defeat");
  };

  return (
    <PageContainer>
      <SharedMatch match={matchInfo}>
        {matchInfo && currentPlayerStats && accolades && (
          <HeaderContainer>
            <>
              <PageHeader
                className="postmatch-header"
                title={getHeadertitle()}
                image={getAgentImage(agentName, "header")}
                imageLink={`/valorant/profile/${currentPlayerStats.gameName}-${currentPlayerStats.tagLine}`}
                fancyTags={accolades?.fancy || []}
                underTitle={
                  <>
                    <span className="header-desc">
                      {t("common:queue.name", "{{queue}}", {
                        queue: queueDisplayName,
                      })}
                    </span>
                    <span className="header-desc">{dot_str}</span>
                    {matchDuration}
                    <span className="header-desc">{dot_str}</span>
                    <TimeAgo date={matchInfo.startedAt} />
                  </>
                }
              />
              <Badges className="nudge-left">
                {(accolades?.fancy || [])
                  .slice(0, 10)
                  .map((accolade, index) => {
                    return (
                      <PlayerPostStatsIcon
                        key={accolade.title}
                        accolade={accolade}
                        delay={index * 0.2}
                        tooltip={accolade.description}
                      />
                    );
                  })}
              </Badges>
            </>
          </HeaderContainer>
        )}

        <MainContainer>
          <PageColumn className="column-1">
            {matchStats?.damageStats && divisionStats && last20 ? (
              <Card style={{ padding: 0, justifyContent: "start" }}>
                <RankHSAnalysis
                  recentStats={last20}
                  matchStats={matchStats}
                  matchInfo={matchInfo}
                  divisionStats={divisionStats}
                />
              </Card>
            ) : (
              <Card style={{ height: 600 }} />
            )}
          </PageColumn>

          <PageColumn className="column-2">
            {!isEscalation && matchStats && last20 && (
              <DamageBreakdownWrapper isDeathmatch={isDeathmatch} />
            )}
            <Card>
              {matchStats && currentPlayerStats && last20 ? (
                <StatsBreakdownDataWrapper
                  recentStats={last20}
                  playerGameStats={currentPlayerStats}
                  matchStats={matchStats}
                  hitPositionPercents={hitPositionPercents}
                  recentHitPositionPercents={recentHitPositionPercents}
                  isAnyDeathMatch={isAnyDeathMatch}
                />
              ) : null}
            </Card>

            {matchStats && last20 && (
              <Card
                style={{ marginTop: "var(--sp-2_5)", padding: "29 24 35 24" }}
              >
                <WeaponStatsTable
                  weaponConstants={valConstants.weapons}
                  weaponStats={matchStats.weaponDamageStats}
                  weaponKDStats={matchStats.weaponKDStats}
                  weaponRangeStats={matchStats.weaponStats}
                  matchStats={matchStats}
                  recentStats={last20}
                  isDeathmatch={isDeathmatch}
                  agentName={agentName}
                />
              </Card>
            )}

            {!isAnyDeathMatch &&
              (matchInfo && currentPlayerStats ? (
                <Card style={{ marginTop: "var(--sp-2_5)" }}>
                  <AbilityBreakdown
                    agentId={currentPlayerStats.characterId}
                    abilityKillData={abilityKillData}
                    agentConstants={valConstants.agents}
                    agentName={agentName}
                  />
                </Card>
              ) : (
                <Card style={{ height: 270 }} />
              ))}

            {matchInfo &&
              playersMatchStats &&
              currentPlayerStats &&
              valConstants && (
                <Card
                  style={{ marginTop: "var(--sp-2_5)", padding: "0 0 0 0" }}
                >
                  <TeamBreakdown
                    currentPlayerStats={currentPlayerStats}
                    TeamBreakdown={TeamBreakdown}
                    players={matchInfo.players}
                    matchInfo={matchInfo}
                    playersMatchStats={playersMatchStats}
                    allAgents={valConstants.agents}
                    isDeathmatch={isDeathmatch}
                    isEscalation={isEscalation}
                  />
                </Card>
              )}
          </PageColumn>
        </MainContainer>
      </SharedMatch>
    </PageContainer>
  );
}

export function meta(info) {
  const userName = info[0];
  return {
    title: [
      `val:postmatch`,
      `{{userName}}'s Postmatch Stats – Valorant – Blitz val`,
      { userName: userName },
    ],
    description: [
      `val:postmatch`,
      `postmatch for {{userName}}`,
      { userName: userName },
    ],
  };
}

export default Postmatch;
