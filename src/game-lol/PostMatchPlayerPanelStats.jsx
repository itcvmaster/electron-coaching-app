import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import {
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
  ROLE_SYMBOLS,
  TILES_DELAY,
} from "@/game-lol/constants.mjs";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import PlayerCSStatTile from "@/game-lol/PostmatchPlayerCSStatTile.jsx";
import PlayerDamageStatTile from "@/game-lol/PostmatchPlayerDamageStatTile.jsx";
import PlayerKDAStatTile from "@/game-lol/PostmatchPlayerKDAStatTile.jsx";
// TODO: move this to `feature-pro`!
// import PlayerSupportTimerTile from "@/game-lol/PostmatchPlayerSupportTimerTile.jsx";
import PlayerVisionScoreStatTile from "@/game-lol/PostmatchPlayerVisionScoreStatTile.jsx";
import {
  getOneRankAbove,
  isRemakeGame,
  mapRoleToSymbol,
  translateLolRankedTier,
} from "@/game-lol/util.mjs";

export const refs = {
  PlayerSupportTimerTile: () => null,
};

const PlayerStatsPostMatch = ({
  match,
  currParticipant,
  matchListAgg,
  account,
  myChampion,
  myChampionIcon,
  queueObj,
  rankStats,
  rankStatsByRole,
  isWinner,
  isARAM,
  isLoadingRank,
  isLoadingByRole,
}) => {
  const { t } = useTranslation();
  let summonerRank = 0;
  if (!rankStats.length || !match) return null;

  if (!summonerRank) summonerRank = RANK_SYMBOLS.silver;

  const oneRankAbove = getOneRankAbove(summonerRank);

  summonerRank = RANK_SYMBOL_TO_STR[summonerRank].capped;

  const rankStr = translateLolRankedTier(t, summonerRank);
  const RankIcon = getHextechRankIcon(summonerRank);
  const NextRankIcon = getHextechRankIcon(oneRankAbove);
  const isSupport =
    mapRoleToSymbol(currParticipant.individualPosition) ===
    ROLE_SYMBOLS.support;
  const isRemake = match ? isRemakeGame(match?.gameDuration, true) : null;

  if (isRemake) return null;
  return (
    <>
      {isARAM ? (
        <PlayerKDAStatTile
          match={match}
          currParticipant={currParticipant}
          rankStats={rankStats}
          myChampion={myChampion}
          myChampionIcon={myChampionIcon}
          rankStr={rankStr}
          matchListAgg={matchListAgg}
          queueObj={queueObj}
          account={account}
          RankIcon={RankIcon}
          NextRankIcon={NextRankIcon}
          summonerRank={summonerRank}
          oneRankAbove={oneRankAbove}
          isWinner={isWinner}
          isLoading={isLoadingRank}
          isARAM={isARAM}
        />
      ) : (
        <PlayerVisionScoreStatTile
          match={match}
          currParticipant={currParticipant}
          rankStats={rankStats}
          myChampion={myChampion}
          myChampionIcon={myChampionIcon}
          rankStr={rankStr}
          matchListAgg={matchListAgg}
          queueObj={queueObj}
          account={account}
          RankIcon={RankIcon}
          NextRankIcon={NextRankIcon}
          summonerRank={summonerRank}
          oneRankAbove={oneRankAbove}
          isWinner={isWinner}
          isLoading={isLoadingByRole}
        />
      )}
      {!isARAM &&
        (isSupport ? (
          <refs.PlayerSupportTimerTile
            match={match}
            currParticipant={currParticipant}
            rankStats={rankStats}
            myChampion={myChampion}
            myChampionIcon={myChampionIcon}
            matchListAgg={matchListAgg}
            queueObj={queueObj}
            account={account}
            RankIcon={RankIcon}
            NextRankIcon={NextRankIcon}
            summonerRank={summonerRank}
            oneRankAbove={oneRankAbove}
            rankStr={rankStr}
            isWinner={isWinner}
            isLoading={isLoadingRank}
            delay={TILES_DELAY}
          />
        ) : (
          <PlayerCSStatTile
            match={match}
            currParticipant={currParticipant}
            rankStats={rankStats}
            rankStatsByRole={rankStatsByRole}
            myChampion={myChampion}
            myChampionIcon={myChampionIcon}
            matchListAgg={matchListAgg}
            queueObj={queueObj}
            account={account}
            RankIcon={RankIcon}
            NextRankIcon={NextRankIcon}
            summonerRank={summonerRank}
            oneRankAbove={oneRankAbove}
            rankStr={rankStr}
            isWinner={isWinner}
            isLoading={isLoadingRank}
            delay={TILES_DELAY}
          />
        ))}
      <PlayerDamageStatTile
        match={match}
        currParticipant={currParticipant}
        rankStats={rankStats}
        rankStatsByRole={rankStatsByRole}
        myChampion={myChampion}
        myChampionIcon={myChampionIcon}
        matchListAgg={matchListAgg}
        queueObj={queueObj}
        account={account}
        RankIcon={RankIcon}
        NextRankIcon={NextRankIcon}
        summonerRank={summonerRank}
        oneRankAbove={oneRankAbove}
        rankStr={rankStr}
        isWinner={isWinner}
        isLoading={isLoadingRank}
        isARAM={isARAM}
        delay={!(isARAM || isSupport) ? 2 * TILES_DELAY : TILES_DELAY}
      />
      {isARAM || isSupport ? <Placeholder /> : null}
    </>
  );
};

export default PlayerStatsPostMatch;

// A fake unused ad took up this space and prevented the next grid item to be
// slotted in. If this placeholder is removed it will stretch the first 2 items
// based off of the next grid item. The next grid item is very long.
const Placeholder = styled("div")`
  display: grid;
  grid-template-rows: 300px;
  gap: var(--sp-3);
`;
