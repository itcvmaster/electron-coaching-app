import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { formatDuration } from "@/app/util.mjs";
import {
  NEGATIVE_VANITYTAG_QUEUE_WHITELIST,
  POSITIVE_VANITYTAG_QUEUE_WHITELIST,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  regionsList,
  ROLE_QUEUE_TYPES,
} from "@/game-lol/constants.mjs";
import PlayerScores from "@/game-lol/player-scores.mjs";
import PostMatchAccolades from "@/game-lol/PostMatchAccolades.jsx";
import PostMatchPlayerPanelStats from "@/game-lol/PostMatchPlayerPanelStats.jsx";
import PostMatchTabView from "@/game-lol/PostMatchTabView.jsx";
import Static from "@/game-lol/static.mjs";
import { translateQueueType } from "@/game-lol/translate-queue-type.mjs";
import { translateRoles } from "@/game-lol/translate-roles.mjs";
import useChampionsListOverview from "@/game-lol/use-champion-list-overview.mjs";
import {
  getChampion,
  getChampionDivStatsId,
  getCurrentPatchForStaticData,
  getDefaultedFilters,
  getDerivedId,
  getStaticData,
  isRemakeGame,
  isSameAccount,
  isWinningTeam,
  roleHumanize,
} from "@/game-lol/util.mjs";
import VanityTagsEngine from "@/game-lol/VanityTagsEngine.jsx";
import Container from "@/shared/ContentContainer.jsx";
import SharedMatch from "@/shared/Match.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import PlayerPostStatsIcon from "@/shared/PlayerPostStatsIcon.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const ICON_SHOW_INTERVAL = 0.2; // Interval to show icons, [s]

const PageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 30rem;
  padding-bottom: var(--sp-12);
`;

const MainContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);

  .span-1 {
    grid-column: span 1;
  }
  .span-2 {
    grid-column: span 2;
  }
  .span-3 {
    grid-column: span 3;
  }
`;

const Subtitle = styled("p")`
  display: flex;
  gap: var(--sp-3);
  color: var(--shade2);
  white-space: nowrap;
`;

const Badges = styled("div")`
  display: flex;
  gap: var(--sp-3);

  &.nudge-left {
    margin-left: calc(var(--sp-4) * -1);
  }
`;

function PostMatch() {
  const route = useRoute();
  const {
    parameters: [region, name, matchId],
  } = route;
  const gameId = matchId;
  const { t } = useTranslation();
  const state = useSnapshot(readState);

  const account = state.lol?.profiles?.[getDerivedId(region, name)];

  const matchData = state.lol.matches[`${region?.toUpperCase()}_${matchId}`];
  const timeline = state?.lol?.matchTimeline?.[matchId];
  const patch = getCurrentPatchForStaticData();
  const champions = getStaticData("champions");
  const championsReport = state.lol?.championsReport;
  const hasFrames = timeline?.frames?.length;
  const decodedProMatchData = null;
  const { participants, teams, queueId, gameDuration } = matchData || {};

  const {
    myTeamId,
    currParticipant = {},
    winningTeamId,
    isWinner,
    myChampion,
    myChampionIcon,
    rankStatsByRole,
    roleStr,
  } = useMemo(() => {
    let currParticipantTeam,
      enemyTeam,
      myTeamId,
      winningTeamId,
      isWinner,
      myChampion,
      myChampionName,
      myChampionIcon,
      myChampionId,
      playerRole,
      roleStr;
    let currParticipant = {};
    if (account && participants && teams) {
      currParticipant = participants.find((p) =>
        decodedProMatchData
          ? p.goldEarned === decodedProMatchData.gold &&
            p.championId === decodedProMatchData.champion
          : isSameAccount(p, account)
      );

      myChampionId = currParticipant?.championId;
      myChampion = getChampion(myChampionId);
      myChampionName = champions?.keys?.[myChampionId];
      myChampionIcon = Static.getChampionImageById(champions, myChampionId);
      playerRole = currParticipant?.individualPosition;
      roleStr = translateRoles(t, playerRole);

      currParticipantTeam = teams.find(
        (team) =>
          team && currParticipant && team.teamId === currParticipant?.teamId
      );

      enemyTeam = teams.find(
        (team) =>
          team && currParticipant && team.teamId !== currParticipant?.teamId
      );

      winningTeamId = teams.find((team) => isWinningTeam(team))?.teamId;
      myTeamId = currParticipantTeam?.teamId;
      isWinner = winningTeamId === myTeamId;
    }
    return {
      myTeamId,
      enemyTeamId: enemyTeam?.teamId,
      currParticipant,
      winningTeamId,
      isWinner,
      myChampion,
      myChampionName,
      myChampionIcon,
      myChampionId,
      playerRole,
      roleStr,
    };
  }, [account, participants, teams, champions, t, decodedProMatchData]);

  const icon_url = Static.getChampionImage(currParticipant.championName);
  const isScorable = ROLE_QUEUE_TYPES.includes(
    Number(QUEUE_SYMBOL_TO_STR[queueId]?.key)
  );
  const queueStr = Number(QUEUE_SYMBOL_TO_STR[queueId]?.key);
  const playersRankings = isScorable ? PlayerScores(matchData) : null;
  const hideAd = true;
  // const isSummonersRift =
  //   queueId === 400 || queueId === 420 || queueId === 430 || queueId === 440;
  const queueSymbol = queueId;
  const isARAM = queueSymbol === QUEUE_SYMBOLS.aram;
  const queueObj = QUEUE_SYMBOL_TO_STR[queueSymbol];
  const championsThisPatch = getStaticData("champions");
  const itemsThisPatch = getStaticData("items");
  const bestWinner = playersRankings?.find((p) => p.teamId === winningTeamId);
  const isMVP = isSameAccount(bestWinner?.player, currParticipant);
  const gameStatus = !matchData
    ? t("common:loading", "Loading...")
    : isWinner
    ? t("lol:postmatch.victory", "Victory")
    : t("lol:postmatch.defeat", "Defeat");
  const queueType = queueObj ? translateQueueType(t, queueObj?.key) : "—";
  const duration = matchData
    ? formatDuration(matchData?.gameDuration * 1000, "mm:ss")
    : "—";
  const creation = matchData ? matchData?.gameCreation : "—";

  const isRemake = matchData ? isRemakeGame(gameDuration, true) : null;

  const roleName = currParticipant
    ? roleHumanize(currParticipant?.role)?.toUpperCase()
    : "";

  const divStatsId = getChampionDivStatsId({
    ...(isARAM ? {} : { role: roleName }),
    championId: currParticipant?.championId,
    queue: isARAM ? "HOWLING_ABYSS_ARAM" : "RANKED_SOLO_5X5",
  });
  const divStats = state?.lol?.championDivStats?.[divStatsId];
  const data = divStats?.divisionStats;

  const rankStats = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const clone = data.slice();
      // Force a linear trend for stats shown by rank, sometimes higher ranks have lower numbers than lower ranks which we do not want.
      [
        { stat: "creepScoreByMinute" },
        { stat: "visionScorePerMinute" },
        { stat: "supportItemQuestCompletionTime", lowerIsBetter: true },
      ].forEach(({ stat, lowerIsBetter }) => {
        if (clone[0][stat])
          for (const [key, value] of Object.entries(clone[0][stat])) {
            const mean = value?.mean;
            let currValue = mean;
            let i = 1;
            while (i < clone.length) {
              const rankMean = clone?.[i]?.[stat]?.[key]?.mean;
              if (!currValue && rankMean) {
                currValue = lowerIsBetter
                  ? rankMean + rankMean * 0.05 * (i + 1)
                  : rankMean - rankMean * 0.05 * (i + 1);
                i = 0;
                continue;
              } else if (
                (rankMean &&
                  (lowerIsBetter
                    ? rankMean > currValue
                    : rankMean < currValue)) ||
                !rankMean
              ) {
                clone[i][stat] = clone[i][stat] || {};
                clone[i][stat][key] = clone[i][stat][key] || {};
                clone[i][stat][key].mean = lowerIsBetter
                  ? (currValue -= currValue * 0.05)
                  : (currValue += currValue * 0.05);
              } else {
                currValue = rankMean;
              }
              i++;
            }
          }
      });
      return clone;
    }
    return [];
  }, [data]);

  const { championsList } = useChampionsListOverview({
    variables: getDefaultedFilters({
      queue: queueObj?.enum,
      patch,
    }),
    skip: !isARAM,
  });
  const tags = useMemo(() => {
    if (!matchData || isRemake) return {};
    const positivePlaystyleTags =
      POSITIVE_VANITYTAG_QUEUE_WHITELIST.indexOf(queueStr) >= 0
        ? VanityTagsEngine.getVanityTags({
            t,
            match: matchData,
            account,
            timeline,
            champions,
            championsList,
            championsReport,
            championsThisPatch,
            itemsThisPatch,
            isScorable,
            isMVP,
            rankStats,
          }) || []
        : [];
    const negativePlaystyleTags =
      NEGATIVE_VANITYTAG_QUEUE_WHITELIST.indexOf(queueStr) >= 0
        ? VanityTagsEngine.getVanityTags({
            t,
            match: matchData,
            account,
            timeline,
            isPositive: false,
            champions,
            championsList,
            championsReport,
            championsThisPatch,
            itemsThisPatch,
            rankStats,
          }) || []
        : [];

    const fancyTagIndexes = positivePlaystyleTags?.reduce((arr, tag, i) => {
      if (tag.fancyTag && !tag.fancyIcon) arr.push(i);
      return arr;
    }, []);

    const fancyTags = positivePlaystyleTags.filter((t) => t.fancyIcon);
    if (isMVP)
      fancyTags.unshift({
        fancyIcon: "MVP_Icon",
        title: "MVP",
        flare: "Gold",
      });

    const fancyTag =
      fancyTagIndexes?.length &&
      positivePlaystyleTags.splice(
        fancyTagIndexes[parseInt(gameId) % fancyTagIndexes.length],
        1
      )[0];

    return {
      positivePlaystyleTags,
      negativePlaystyleTags,
      fancyTag,
      fancyTags,
    };
  }, [
    queueStr,
    matchData,
    isRemake,
    t,
    account,
    timeline,
    champions,
    championsList,
    championsReport,
    championsThisPatch,
    itemsThisPatch,
    isScorable,
    isMVP,
    gameId,
    rankStats,
  ]);

  return (
    <PageContainer>
      <SharedMatch match={matchData}>
        <MainContainer>
          <PageHeader
            title={gameStatus}
            image={icon_url}
            className="span-3"
            underTitle={
              <Subtitle className="type-body2">
                <span>{queueType}</span>
                <span>{duration}</span>
                <TimeAgo date={creation} />
              </Subtitle>
            }
          />
          <Badges className="span-3 nudge-left">
            {(tags.fancyTags || []).slice(0, 10).map((accolade, index) => {
              return (
                <PlayerPostStatsIcon
                  key={accolade.title}
                  accolade={accolade}
                  delay={index * ICON_SHOW_INTERVAL}
                  tooltip={accolade.title}
                />
              );
            })}
          </Badges>
          <PostMatchPlayerPanelStats
            match={matchData}
            currParticipant={currParticipant}
            timeline={timeline}
            negativePlaystyleTags={tags.negativePlaystyleTags}
            championsList={championsList}
            myChampion={myChampion}
            myChampionIcon={myChampionIcon}
            account={account}
            queueObj={queueObj}
            rankStats={rankStats}
            rankStatsByRole={rankStatsByRole}
            hideAd={hideAd}
            roleStr={roleStr}
            isWinner={isWinner}
            isARAM={isARAM}
            isLoadingRank={false}
            isLoadingByRole={false}
          />
          <PostMatchAccolades
            positivePlaystyleTags={tags.positivePlaystyleTags}
            negativePlaystyleTags={tags.negativePlaystyleTags}
            isARAM={isARAM}
            timeline={timeline}
            matchData={matchData}
            account={account}
            currParticipant={currParticipant}
          />
          <div className="span-2">
            <PostMatchTabView
              match={matchData}
              timeline={timeline}
              account={account}
              currParticipant={currParticipant}
              myTeam={myTeamId}
              hasFrames={hasFrames}
              championsReport={championsReport}
              playersRankings={playersRankings}
              winningTeamId={winningTeamId}
              patch={patch}
              champions={champions}
              region={region}
            />
          </div>
        </MainContainer>
      </SharedMatch>
    </PageContainer>
  );
}

export function meta(info) {
  const userName = info[1];
  const region = regionsList.find((region) => region.id === info[0]);
  return {
    title: [
      `lol:postmatch`,
      `{{userName}}'s Postmatch Stats {{regionName}} – League of Legends – Blitz LoL`,
      { userName: userName, regionName: region.name },
    ],
    description: [
      `lol:postmatch`,
      `postmatch for {{userName}}, {{regionName}}`,
      { userName: userName, regionName: region.name },
    ],
  };
}

export default PostMatch;
