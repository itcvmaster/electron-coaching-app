import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { RankDistributionListContainer } from "@/game-lol/CommonComponents.jsx";
import {
  Accordion,
  Label,
  OverallScore,
  OverallScoreHeading,
  PerformanceItemScorePostMatchCard,
  Title,
  TitleScore,
  Type,
} from "@/game-tft/CommonComponents.jsx";
import DistributionList from "@/game-tft/DistributionList.jsx";
import getUnitItemStats from "@/game-tft/get-unit-item-stats.mjs";
import MissingData from "@/game-tft/PostMatchMissingData.jsx";
import PostMatchPerformanceItemBuildPerformance from "@/game-tft/PostMatchPerformanceItemBuildPerformance.jsx";
import useDistribution from "@/game-tft/use-distribution.mjs";
import useItemUrl from "@/game-tft/use-item-url.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";

const INCREMENT_AMOUNT = 3;

function PostMatchPerformanceItemEffectiveness() {
  // Hooks
  const { t } = useTranslation();
  const data = useData();
  const { distribution, highestValue } = useDistribution(data.distribution);
  const [showCount, setShowCount] = React.useState(INCREMENT_AMOUNT);

  // Memos
  const highestDmgDealingUnit = Math.max(
    data.sortedDamageDealt[0]?.userDamageDealt,
    data.items[0]?.recommendedDamageDealt || 0,
    data.items[1]?.recommendedDamageDealt || 0,
    data.items[2]?.recommendedDamageDealt || 0
  );

  const carryName = data.items.map((item) => item?.unit?.champion);
  const carryDamage = data.items.map((item) => item?.userDamageDealt);
  const carryRecommendedDamage = data.items.map(
    (item) => item?.recommendedDamageDealt
  );
  const carryDamageLess = carryRecommendedDamage.map((damage, i) =>
    (((damage - carryDamage[i]) / damage) * 100).toFixed(0)
  );

  // Methods
  const handleLoadMore = React.useCallback(() => {
    setShowCount((prev) => {
      return Math.min(prev + INCREMENT_AMOUNT, data.items.length);
    });
  }, [data.items.length]);

  // Constants
  const isWarning = data.score === 0 || data.score === "-";

  // Render
  return (
    <PerformanceItemScorePostMatchCard>
      <Title>
        {t("tft:postmatchInsights.itemEffectiveness", "Item Effectiveness")}
        <TitleScore>
          <Trans i18nKey="tft:postmatchInsights.scoreFromHundred">
            {{ score: data.score }}
            <span>/ 100</span>
          </Trans>
        </TitleScore>
        {isWarning && <MissingData />}
      </Title>
      <Accordion
        HeadingComponent={() => (
          <>
            <OverallScoreHeading>
              <OverallScore>{data.score}</OverallScore>
              <Label>
                {t(
                  "tft:postmatchInsights.itemEffectivenessScore",
                  "Item Effectiveness Score"
                )}
              </Label>
            </OverallScoreHeading>
            <RankDistributionListContainer>
              <DistributionList
                allScores={distribution}
                isPositive
                maxRankValue={highestValue}
              />
            </RankDistributionListContainer>
            <Type>
              {isWarning ? (
                t(
                  "tft:postmatchInsights.playTFTWithInsights",
                  "Play TFT with Blitz for advanced Insights and Statistics!"
                )
              ) : carryDamage[0] < carryRecommendedDamage[0] &&
                carryDamageLess[0] >= 10 ? (
                t(
                  "tft:postmatchInsights.lessDmgThanRecommended",
                  "Your {{champion}} dealt {{percentile}}% less damage than the recommended build.",
                  {
                    champion: carryName[0],
                    percentile: carryDamageLess[0],
                  }
                )
              ) : carryDamage[1] < carryRecommendedDamage[1] &&
                carryDamageLess[1] >= 10 ? (
                t(
                  "tft:postmatchInsights.lessDmgThanRecommended",
                  "Your {{champion}} dealt {{percentile}}% less damage than the recommended build.",
                  {
                    champion: carryName[1],
                    percentile: carryDamageLess[1],
                  }
                )
              ) : carryDamage[2] < carryRecommendedDamage[2] &&
                carryDamageLess[2] >= 10 ? (
                t(
                  "tft:postmatchInsights.lessDmgThanRecommended",
                  "Your {{champion}} dealt {{percentile}}% less damage than the recommended build.",
                  {
                    champion: carryName[2],
                    percentile: carryDamageLess[2],
                  }
                )
              ) : (
                <>
                  {t("tft:postmatchInsights.goodJob", "Good job - Keep it up!")}
                  <br />
                  {t(
                    "tft:postmatchInsights.effectiveItems",
                    "You used your items effectively."
                  )}
                </>
              )}
            </Type>
          </>
        )}
        BodyComponent={
          isWarning
            ? null
            : () => (
                <>
                  {data.items.length ? (
                    data.items
                      .slice(0, showCount)
                      .map(
                        ({
                          id,
                          unit,
                          userBuild,
                          userDamageDealt,
                          userDamageTaken,
                          labels,
                          rating,
                          recommendedBuild,
                          recommendedDamageDealt,
                          recommendedDamageTaken,
                        }) => {
                          // Percentages for the bar graph to user
                          const dmg = userDamageDealt / highestDmgDealingUnit;
                          const dmgDealtPct = Number.isNaN(dmg)
                            ? "0%"
                            : `${dmg * 100}%`;
                          const recDmg =
                            recommendedDamageDealt / highestDmgDealingUnit;
                          const recDmgDealtPct = Number.isNaN(recDmg)
                            ? "0%"
                            : `${recDmg * 100}%`;
                          const taken = userDamageTaken / highestDmgDealingUnit;
                          const dmgTakenPct = Number.isNaN(taken)
                            ? "0%"
                            : `${taken * 100}%`;
                          const recTaken =
                            recommendedDamageTaken / highestDmgDealingUnit;
                          const recDmgTakenPct = Number.isNaN(recTaken)
                            ? "0%"
                            : `${recTaken * 100}%`;
                          return (
                            <ChampionGraph key={id}>
                              <PostMatchPerformanceItemBuildPerformance
                                userBuild={userBuild}
                                labels={labels}
                                rating={rating}
                                recommendedBuild={recommendedBuild}
                                recommendedDamageDealt={recommendedDamageDealt}
                                recommendedDamageDealtPct={recDmgDealtPct}
                                unit={unit}
                                userDamageDealt={userDamageDealt}
                                userDamageDealtPct={dmgDealtPct}
                                userDamageTaken={userDamageTaken}
                                userDamageTakenPct={dmgTakenPct}
                                recommendedDamageTaken={recommendedDamageTaken}
                                recommendedDamageTakenPct={recDmgTakenPct}
                              />
                            </ChampionGraph>
                          );
                        }
                      )
                  ) : (
                    <div>{t("common:notEnoughData", "Not enough data")}</div>
                  )}
                  {data.items.length > 3 && showCount !== data.items.length ? (
                    <LoadMore onClick={handleLoadMore}>
                      {t("common:loadMore", "Load More")}
                    </LoadMore>
                  ) : null}
                </>
              )
        }
      />
    </PerformanceItemScorePostMatchCard>
  );
}

function useData() {
  // Hooks
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const itemEffectiveness = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.extra.Performance.itemScore.ItemEffectiveness;
    return null;
  }, [currentMatch]);
  const itemsStaticData = state.tft.items;
  const champions = state.tft.champions;
  const selectedSet = useSetByMatch();
  const { getItemById, getItemUrlById } = useItemUrl();
  const { t } = useTranslation();
  let recommended = [],
    sortedDamageDealt = [],
    sortedDamageReceived = [],
    score = "-",
    distribution = {};
  const items = [];

  if (itemEffectiveness) {
    recommended = itemEffectiveness.recommendedBuilds.sort(
      (a, b) => b.avgDamageDealt - a.avgDamageDealt
    );
    sortedDamageDealt = [...itemEffectiveness.damageDealt].sort(
      (a, b) => b.userDamageDealt - a.userDamageDealt
    );
    sortedDamageReceived = [...itemEffectiveness.damageDealt].sort(
      (a, b) => b.userDamageTaken - a.userDamageTaken
    );
    score = Math.floor(itemEffectiveness.score);
    distribution = itemEffectiveness.distribution;
  }

  const fixItemsAndStar = (unitObj) => {
    return {
      ...unitObj,
      unit: {
        ...unitObj.unit,
        items: itemEffectiveness.damageDealt
          .filter((unit) => unit.id === unitObj.id)
          .reduce(
            (a, b) => {
              return Object.values(a.unit.items).length >
                Object.values(b.unit.items).length
                ? a
                : b;
            },
            { unit: { items: {} } }
          )?.unit?.items,
      },
      stars: itemEffectiveness.damageDealt
        .filter((unit) => unit.id === unitObj.id)
        .reduce((a, b) => (a.stars >= b.stars ? a : b), { stars: 0 })?.stars,
    };
  };

  let set = new Set(); // Duplicate id check
  sortedDamageDealt.forEach((unit) => {
    if (set.has(unit.id)) return;
    set.add(unit.id);
    items.push(fixItemsAndStar(unit)); // Transform
  });
  set.clear();
  set = null;

  return {
    score,
    distribution,
    items: items.map((item) => {
      const userBuildItems = Object.values(item.unit.items);
      const recommendedUnit = recommended.find(
        (unit) => unit.id === item.id
      )?.unit;
      const recommendedBuildItems = recommendedUnit?.carryItems?.split(",");
      const labels = [];
      if (recommendedBuildItems?.every((i) => userBuildItems.includes(i))) {
        labels.push({
          label: t("tft:postmatchInsights.perfectItems", "Perfect Items"),
        });
      }
      if (item.stars === 3) {
        labels.push({
          label: t("tft:postmatchInsights.threeStar", "3 Star"),
        });
      }
      if (item.stars === 1) {
        labels.push({
          label: t("tft:postmatchInsights.notUpgraded", "Not Upgraded"),
        });
      }
      if (item.userDamageDealt >= 4500) {
        labels.push({
          label: t("tft:postmatchInsights.tonsOfDamage", "Tons of Damage"),
        });
      }

      // Recommended items
      let unitItemStats =
        getUnitItemStats(
          champions,
          itemsStaticData,
          selectedSet,
          item.unit?.championKey
        ) || {};
      unitItemStats = unitItemStats[item.unit?.championKey] || [];

      return {
        ...item,
        unit: { champion: item.unit?.championKey },
        userBuild: userBuildItems.map((item) => ({
          url: getItemUrlById(item),
          ...getItemById(item),
        })),
        labels: labels,
        userDamageDealt: Math.round(item.userDamageDealt),
        userDamageTaken: Math.round(item.userDamageTaken),
        rating: item.stars,
        recommendedBuild: unitItemStats.slice(0, 3).map(({ id }) => {
          const num = Number(id);
          return {
            url: getItemUrlById(num),
            ...getItemById(num),
          };
        }),
        recommendedDamageDealt: Math.round(
          recommended.find((unit) => unit.id === item.id)?.avgDamageDealt
        ),
        recommendedDamageTaken: Math.round(
          recommended.find((unit) => unit.id === item.id)?.avgDamageTaken
        ),
      };
    }),
    sortedDamageDealt,
    sortedDamageReceived,
  };
}

export default PostMatchPerformanceItemEffectiveness;

const ChampionGraph = styled("div")({
  borderBottom: "1px solid var(--shade6)",
  padding: "var(--sp-4) 0",
  "&:last-child": {
    paddingBottom: 0,
    borderBottom: "none",
  },
  "&:first-child": {
    paddingTop: 0,
  },
});

const LoadMore = styled("button")`
  background: var(--shade6);
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  text-align: center;
  margin-top: var(-sp-6);
  box-sizing: border-box;
  color: var(--shade1);
  &:hover {
    background: var(--shade5);
    color: var(--shade0);
  }
`;
