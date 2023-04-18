import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { RankDistributionListContainer } from "@/game-lol/CommonComponents.jsx";
import StaticLOL from "@/game-lol/static.mjs";
import {
  getCurrentPatchForStaticData,
  getDerivedId,
} from "@/game-lol/util.mjs";
import {
  Accordion,
  Box,
  HR,
  Label,
  OverallScore,
  OverallScoreHeading,
  PerformanceContainer,
  PerformanceItemScorePostMatchCard,
  Quick,
  QuickBox,
  QuickData,
  QuickHeading,
  QuickInfo,
  Title,
  TitleScore,
  Type,
} from "@/game-tft/CommonComponents.jsx";
import DistributionList from "@/game-tft/DistributionList.jsx";
import PostMatchPerformanceCoinLong from "@/game-tft/PostMatchPerformanceCoinLong.jsx";
import PostMatchPerformanceCoinShort from "@/game-tft/PostMatchPerformanceCoinShort.jsx";
import useDistribution from "@/game-tft/use-distribution.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function PostMatchPerformanceCoin() {
  // Hooks
  const { t } = useTranslation();
  const data = useData();
  const { distribution, highestValue } = useDistribution(data.distribution);
  const top4 = data.top4 || 0;
  const bot4 = data.bot4 || 0;
  const goldOnDeath = data.goldOnDeath || 0;
  // Memos
  const isUserEfficient = useMemo(() => goldOnDeath < 15, [goldOnDeath]);
  const { textContent } = useMemo(
    () => ({
      textContent: isUserEfficient ? "var(--turq)" : "var(--red)",
    }),
    [isUserEfficient]
  );
  return (
    <PerformanceContainer>
      <PerformanceItemScorePostMatchCard>
        <Title>
          {t("tft:postmatchInsights.goldOnDeath", "Gold on Death")}
          <TitleScore>{goldOnDeath}</TitleScore>
        </Title>
        <Accordion
          HeadingComponent={() => (
            <>
              <OverallScoreHeading>
                <OverallScore>{goldOnDeath}</OverallScore>
                <Label>
                  {t("tft:postmatchInsights.goldOnDeath", "Gold on Death")}
                </Label>
              </OverallScoreHeading>
              <RankDistributionListContainer>
                <DistributionList
                  maxRankValue={highestValue}
                  allScores={distribution}
                  $isPositive
                />
              </RankDistributionListContainer>
              <div>
                <Type highlight={textContent}>
                  {isUserEfficient ? (
                    <Trans i18nKey="tft:postmatchInsights.dyingWithLessGold">
                      <span>Good job - Keep it up!</span>
                    </Trans>
                  ) : data.placement !== 1 ? (
                    <Trans
                      i18nKey="tft:postmatchInsights.youDiedWithGold"
                      goldOnDeath={goldOnDeath}
                    >
                      You died with <span>{{ goldOnDeath }}</span> Gold at Round{" "}
                      <span>{data.lastRound}</span>.
                    </Trans>
                  ) : (
                    <Trans
                      i18nKey="tft:postmatchInsights.youWonWithGoldLeft"
                      goldOnDeath={goldOnDeath}
                    >
                      You won with <span>{{ goldOnDeath }}</span> Gold left to
                      spend.
                    </Trans>
                  )}
                </Type>
              </div>
            </>
          )}
          BodyComponent={() => (
            <ItemTierBody $isPadding={goldOnDeath >= 15}>
              {goldOnDeath < 15 ? (
                data.last20Matches.length >= 2 ? (
                  <PostMatchPerformanceCoinShort matches={data.last20Matches} />
                ) : (
                  <div>{t("common:notEnoughData", "Not enough data")}</div>
                )
              ) : (
                <PostMatchPerformanceCoinLong rounds={data.graphSliced} />
              )}
              {parseFloat(top4) === 0 && parseFloat(bot4) === 0 ? null : (
                <>
                  <HR />
                  <Quick
                    className={css`
                      display: grid;
                      grid-template-columns: repeat(2, 1fr);
                      gap: 16px;
                    `}
                  >
                    <QuickHeading>
                      {parseFloat(top4) !== 0 ? (
                        <Trans
                          i18nKey="tft:postmatchInsights.whenYourGoldOnDeathIsBelow"
                          top4={top4}
                        >
                          When your gold on death is below{" "}
                          <span>{{ top4 }}</span>, you&apos;re more likely to
                          place <span>top 4</span>.
                        </Trans>
                      ) : (
                        <Trans
                          i18nKey="tft:postmatchInsights.whenYourGoldOnDeathIsAbove"
                          bot4={bot4}
                        >
                          When your gold on death is above{" "}
                          <span>{{ bot4 }}</span>, you&apos;re more likely to
                          place <span>bot 4</span>.
                        </Trans>
                      )}
                    </QuickHeading>
                    <QuickData>
                      <QuickInfo>
                        {t(
                          "tft:postmatchInsights.goldOnDeathVsPlacement",
                          "Gold on Death vs Placement - Last 20 games"
                        )}
                      </QuickInfo>
                      <Box>
                        <QuickBox $isPositive>
                          <span>{t("tft:topFour", "Top 4")}</span>
                          <p>{top4 || "--"}</p>
                        </QuickBox>
                        <div>{t("common:vs", "vs")}</div>
                        <QuickBox $isNegative>
                          <span>
                            {t("tft:postmatchInsights.bottomFour", "Bottom 4")}
                          </span>
                          <p>{bot4 || "--"}</p>
                        </QuickBox>
                      </Box>
                    </QuickData>
                  </Quick>
                </>
              )}
            </ItemTierBody>
          )}
        />
      </PerformanceItemScorePostMatchCard>
    </PerformanceContainer>
  );
}

function useData() {
  const {
    parameters: [region, name, matchId],
  } = useRoute();
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const summoners = state.tft.summoners;
  const matches = state.tft.matches;
  const summoner = useMemo(
    () => Reflect.get(summoners, getDerivedId(region, name)) || {},
    [name, region, summoners]
  );
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const last20Matches = useMemo(() => {
    const results = [];
    if (
      Array.isArray(summoner.matchids) &&
      summoner.matchids.length &&
      typeof matches === "object"
    ) {
      let leftIdx = Array.prototype.indexOf.call(summoner.matchids, matchId);
      if (leftIdx === -1) return results;
      const rightIdx = Math.min(leftIdx + 20, summoner.matchids.length);
      for (let j = 0; leftIdx < rightIdx; leftIdx += 1) {
        const game =
          (Reflect.get(matches, summoner.matchids[leftIdx]) || [])[0] || {};
        if (!Array.isArray(game?.data)) continue;
        let player = game.data.find(({ puuid }) => summoner.puuid === puuid);
        const value = player?.gold_left;
        if (typeof value === "undefined") continue;
        j += 1;
        results.push({ x: j, y: value });
        player = null;
        if (j >= 20) break;
      }
    }
    return results;
  }, [summoner.matchids, summoner.puuid, matchId, matches]);
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const goldOnDeath = currentMatch.extra.Performance.goldOnDeath;
  const timelineHP = currentMatch.extra.Timeline.hpTimeline;
  const latestPatch = getCurrentPatchForStaticData();
  let graph = goldOnDeath.graph;
  // Detect which index the user has died
  let deathIndex = Array.prototype.findIndex.call(timelineHP, (i) => i.hp <= 0);
  if (deathIndex === -1) {
    deathIndex = graph.length;
  } else if (
    deathIndex !== -1 &&
    Array.isArray(timelineHP) &&
    timelineHP.length !== graph.length
  ) {
    // If we found a matching case but array sizes are different
    // If the array lengths are different, we don't care if we found a
    // matching case, we will use the last game as the death index instead.
    // We assume that both the arrays the same but if they're not we ignore.
    deathIndex = goldOnDeath.graph.length;
  }
  graph = graph.map((item, idx, arr) => {
    // Result
    const result = {
      round: item?.round?.replace("_", "-") || "-",
      value: item?.gold || 0,
      isWinner: item?.isWinner || false,
      isDeath: deathIndex === idx, // Only occurs once
    };
    // Add avatar
    let summoner = {};
    for (const key in summoners) {
      const i = summoners[key];
      if (RegExp(item.username, "i").test(i?.name)) {
        summoner = i;
      }
    }
    result.avatar =
      getRoundUrlByTarget(item?.round) ||
      StaticLOL.getProfileIcon(summoner.profileiconid || 29, latestPatch);
    // Add a comment / tooltip to the 3rd last item
    if (idx === arr.length - 3) {
      const round = result.round;
      result.comment = (
        <div>
          <Span>
            <Trans i18nKey="tft:para.spendGoldAtStage" round={round}>
              You should have spent your gold at Stage <span>{{ round }}</span>
            </Trans>
          </Span>
        </div>
      );
    }
    return result;
  });

  const startSliceIndex = graph.length - 20 < 0 ? 0 : graph.length - 20;

  const placement =
    currentMatch.data.players.find((player) => player.summonerName === name)
      ?.rank ||
    currentMatch.data.data.find((player) => player.puuid === summoner.puuid)
      ?.placement;
  return {
    goldOnDeath: goldOnDeath.goldOnDeath || 0,
    top4: goldOnDeath.last20Avg?.top4?.toFixed(1) || 0,
    bot4: goldOnDeath.last20Avg?.bot4?.toFixed(1) || 0,
    graph: graph.slice(startSliceIndex, graph.length),
    graphSliced: graph.slice(deathIndex - 7, deathIndex),
    distribution: goldOnDeath.distribution || {},
    placement: placement,
    lastRound: timelineHP[timelineHP.length - 1].round.replace("_", "-") || "-",
    last20Matches,
  };
}

export default PostMatchPerformanceCoin;

const ItemTierBody = styled("div")(({ $isPadding }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--sp-8)",
  paddingTop: $isPadding ? "var(--sp-10)" : "var(--sp-0)",
}));

const Span = styled("span")`
  color: var(--shade0);
  & > span {
    color: var(--red);
  }
`;
