import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { RankDistributionListContainer } from "@/game-lol/CommonComponents.jsx";
import { getTierIcon } from "@/game-lol/get-tier-icon.mjs";
import {
  Accordion,
  Box,
  CombinedItemImage,
  EffectivenessHeading,
  HR,
  ItemContainer,
  Label,
  OverallScore,
  OverallScoreHeading,
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
import ItemWithChampion from "@/game-tft/ItemWithChampion.jsx";
import MissingData from "@/game-tft/PostMatchMissingData.jsx";
import useDistribution from "@/game-tft/use-distribution.mjs";
import useItemTier from "@/game-tft/use-item-tier.mjs";
import useItemUrl from "@/game-tft/use-item-url.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useRoundInvalid from "@/game-tft/use-round-invalid.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";

function PostMatchPerformanceItemTier() {
  const data = useData();
  const { t } = useTranslation();
  const { distribution, highestValue } = useDistribution(data.distribution);
  const currentMatch = useMatch();
  const rounds = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.extra.Timeline.hpTimeline;
    return [];
  }, [currentMatch]);
  const isRoundInvalid = useRoundInvalid(rounds);
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const top4 = data.top4;
  const bot4 = data.bot4;

  const lowTierItems = data.items.filter((i) => i.tier > 2 && !i.trait);
  const highTierItems = data.items.filter((i) => i.tier === 1);
  return (
    <PerformanceItemScorePostMatchCard>
      <Title>
        {t("tft:postmatchInsights.itemTier", "Item Tier")}
        <TitleScore>
          <Trans
            i18nKey="tft:postmatchInsights.scoreFromFive"
            score={data.score}
          >
            {{ score: data.score }}
            <span>/ 5</span>
          </Trans>
        </TitleScore>
        {isRoundInvalid && <MissingData />}
      </Title>
      <Accordion
        HeadingComponent={() => (
          <>
            <OverallScoreHeading>
              <OverallScore>{data.score}</OverallScore>
              <Label>
                {t("tft:postmatchInsights.avgItemTier", "Avg. Item Tier")}
              </Label>
            </OverallScoreHeading>
            <RankDistributionListContainer>
              <DistributionList
                maxRankValue={highestValue}
                isPositive
                allScores={distribution}
              />
            </RankDistributionListContainer>
            <TierTip>
              {data.score <= 1.5 ? (
                <>
                  <Type>
                    {t(
                      "tft:postmatchInsights.highTierItemsCount",
                      "You made {{amount}} high-tier items",
                      {
                        amount: highTierItems.length,
                      }
                    )}
                  </Type>
                  <ItemTierTip>
                    {highTierItems.map(({ url, tier, tooltip }, idx) => {
                      const TierIcon = getTierIcon(tier);
                      return (
                        <ItemContainer key={idx}>
                          <CombinedItemImage src={url} data-tip={tooltip} />
                          <TierIcon />
                        </ItemContainer>
                      );
                    })}
                  </ItemTierTip>
                </>
              ) : (
                <>
                  <Type>
                    {t(
                      "tft:postmatchInsights.highTierItemsCount",
                      "You made {{amount}} low-tier items",
                      {
                        amount: lowTierItems.length,
                      }
                    )}
                  </Type>
                  <ItemTierTip>
                    {lowTierItems.map(({ url, tier, tooltip }, idx) => {
                      const TierIcon = getTierIcon(tier);
                      return (
                        <ItemContainer key={idx}>
                          <CombinedItemImage src={url} data-tip={tooltip} />
                          <TierIcon />
                        </ItemContainer>
                      );
                    })}
                  </ItemTierTip>
                </>
              )}
            </TierTip>
          </>
        )}
        BodyComponent={() => (
          <ItemTierBody>
            {data.components.length ? (
              <>
                <EffectivenessHeading>
                  <p>
                    {t(
                      "tft:postmatchInsights.yourComponents",
                      "Your Components"
                    )}
                  </p>
                  <ItemImages>
                    {data.components.map((component, idx) => (
                      <CombinedItemImage
                        key={idx}
                        src={component.url}
                        data-tip={component.tooltip}
                      />
                    ))}
                  </ItemImages>
                </EffectivenessHeading>
                <HR />
              </>
            ) : null}
            <GraphBox>
              <GraphContainer>
                <span>
                  {t("tft:postmatchInsights.lowTierItems", "Low-Tier Items")}
                </span>
                {lowTierItems.length ? (
                  <Items>
                    <Row>
                      <GraphTitle
                        className={css`
                          grid-column-start: 2;
                        `}
                      >
                        {t("lol:tier", "Tier")}
                      </GraphTitle>
                      <GraphTitle>{t("lol:winRate", "Win Rate")}</GraphTitle>
                      <GraphTitle>{t("tft:avgPlace", "Avg. Place")}</GraphTitle>
                      <GraphTitle>{t("tft:topFour", "Top 4")}</GraphTitle>
                    </Row>
                    <Rows>
                      {lowTierItems.map(
                        (
                          {
                            id,
                            tier,
                            url,
                            tooltip,
                            winRatePercentile,
                            avgPlace,
                            top4Percentile,
                          },
                          idx
                        ) => {
                          const TierIcon = getTierIcon(tier);
                          return (
                            <Row key={idx} $isPositive>
                              <Col>
                                <ItemWithChampion
                                  itemTooltip={tooltip}
                                  itemUrl={url}
                                  itemId={id}
                                />
                              </Col>
                              <Col>
                                <Tier>
                                  <TierIcon />
                                </Tier>
                              </Col>
                              <Col>{winRatePercentile}</Col>
                              <Col>{avgPlace}</Col>
                              <Col>{top4Percentile}</Col>
                            </Row>
                          );
                        }
                      )}
                    </Rows>
                  </Items>
                ) : (
                  <Items
                    className={css`
                      font-size: 12px;
                      font-weight: bold;
                      color: var(--shade1);
                      margin: 12px 0;
                      text-align: center;
                    `}
                  >
                    {t("tft:postmatchInsights.goodJobNone", "None - Good job!")}
                  </Items>
                )}
              </GraphContainer>
              <VerticalLine />
              <GraphContainer>
                <span>{t("common:suggestions", "Suggestions")}</span>
                <Items>
                  <Row>
                    <GraphTitle
                      className={css`
                        grid-column-start: 2;
                      `}
                    >
                      {t("lol:tier", "Tier")}
                    </GraphTitle>
                    <GraphTitle>{t("lol:winRate", "Win Rate")}</GraphTitle>
                    <GraphTitle>{t("tft:avgPlace", "Avg. Place")}</GraphTitle>
                    <GraphTitle>{t("tft:topFour", "Top 4")}</GraphTitle>
                  </Row>
                  <Rows>
                    {data.itemSuggestions.map(
                      ({
                        id,
                        tier,
                        url,
                        tooltip,
                        winRatePercentile,
                        avgPlace,
                        top4Percentile,
                      }) => {
                        const TierIcon = getTierIcon(tier);
                        return (
                          <Row key={id} $isPositive>
                            <Col>
                              <ItemWithChampion
                                itemTooltip={tooltip}
                                itemUrl={url}
                                itemId={id}
                                isHighTier
                              />
                            </Col>
                            <Col>
                              <Tier>
                                <TierIcon />
                              </Tier>
                            </Col>
                            <Col>{winRatePercentile}</Col>
                            <Col>{avgPlace}</Col>
                            <Col>{top4Percentile}</Col>
                          </Row>
                        );
                      }
                    )}
                  </Rows>
                </Items>
              </GraphContainer>
            </GraphBox>
            {top4 === 0 && bot4 === 0 ? null : (
              <>
                <HR />
                <Quick>
                  <QuickHeading>
                    {top4 !== 0 ? (
                      <Trans
                        i18nKey="tft:postmatchInsights.itemsAboveLikelyBench"
                        tier={top4}
                      >
                        When your average item tier is{" "}
                        <span>{{ tier: top4 }}</span> or better,
                        <br /> you’re more likely to place <span>top 4</span>.
                      </Trans>
                    ) : (
                      <Trans
                        i18nKey="tft:postmatchInsights.itemsBelowLikelyBench"
                        tier={bot4}
                      >
                        When your average item tier is{" "}
                        <span>{{ tier: bot4 }}</span> or worse,
                        <br /> you’re more likely to place <span>bot 4</span>.
                      </Trans>
                    )}
                  </QuickHeading>
                  <QuickData>
                    <QuickInfo>
                      {t(
                        "tft.postmatchPerformance.itemsOnBenchVsPlacement",
                        "Item Tier vs Placement - Last {{games}} games",
                        { games: 20 }
                      )}
                    </QuickInfo>
                    <Box>
                      <QuickBox $isPositive>
                        <span>{t("tft:topFour", "Top 4")}</span>
                        <p>{top4 || "--"}</p>
                      </QuickBox>
                      <div>{t("common:vs", "vs")}</div>
                      <QuickBox $isNegative>
                        <span>{t("tft:bottomFour", "Bottom 4")}</span>
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
  );
}

function useData() {
  // Hooks
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const selectedSet = useSetByMatch();
  const getItemTier = useItemTier();
  const { getItemById, getItemByKey, getItemUrlById, getItemUrlByKey } =
    useItemUrl();
  let itemTier = {},
    itemsTimeLine = [];
  if (currentMatch && !(currentMatch instanceof Error)) {
    itemTier = currentMatch.extra.Performance.itemScore.ItemTier;
    itemsTimeLine = currentMatch.extra.Timeline.itemsTimeLine;
  }
  const itemStats = useMemo(() => {
    if (Array.isArray(state.tft.stats.items)) {
      return state.tft.stats?.items;
    }
    return [];
  }, [state.tft.stats.items]);

  // Transformations
  const [componentsObtainedObj] = [
    ...itemsTimeLine.reduce(
      (acc, cur, idx) => {
        (cur.items || []).forEach((itemId) => {
          if (typeof acc[1][itemId] === "undefined") {
            acc[1][itemId] = true;
            const itemData = getItemById(itemId);
            if (itemData.kind === "basic") {
              acc[0].push({
                ...itemData,
                id: itemId,
                name: itemData.name || "",
                url: getItemUrlByKey(itemData.key),
                tooltip: itemData.bonus,
              });
            }
          }
        });
        if (idx === itemsTimeLine.length - 1) acc[1] = undefined;
        return acc;
      },
      [[], {}]
    ),
  ];
  let itemsToIgnoreForSuggestions = new Set();
  let items =
    Array.isArray(itemTier.items) && itemTier.items.length
      ? itemTier.items.reduce((acc, itemId) => {
          const result = getItemById(itemId);
          if (typeof result?.key === "undefined" || result.kind === "basic") {
            return acc;
          }
          if (!itemsToIgnoreForSuggestions.has(result.id)) {
            itemsToIgnoreForSuggestions.add(result.id);
          }
          let winRatePercentile = "0%",
            top4Percentile = "0%",
            avgPlace = 0;
          const res = itemStats.find(
            ([itemKey]) => Number(itemKey) === result.id
          );
          if (typeof res !== "undefined" && typeof res[1] !== "undefined") {
            if (typeof res[1].avgPlacement === "number") {
              avgPlace = (res[1].avgPlacement || 0).toFixed(1);
            }
            if (typeof res[1].winRate === "number") {
              winRatePercentile = Math.floor(res[1].winRate * 100) + "%";
            }
            if (typeof res[1].top4Rate === "number") {
              top4Percentile = (res[1].top4Rate * 100).toFixed(1) + "%";
            }
          }
          // Push
          acc.push({
            id: result.id,
            tier: getItemTier(result.id, selectedSet),
            url: getItemUrlById(result.id),
            tooltip: getItemById(result.id)?.bonus,
            winRatePercentile,
            avgPlace,
            top4Percentile,
            buildsFrom: result?.buildsFrom || [],
            kind: result.kind,
            trait: result.trait,
          });
          return acc;
        }, [])
      : [];
  if (items.length) items = items.sort((a, b) => a.tier - b.tier);

  let itemSuggestions = Object.create(null);
  componentsObtainedObj.forEach((component) => {
    if (Array.isArray(component?.buildsInto) && component.buildsInto.length) {
      component.buildsInto.forEach((itemKey) => {
        const itemData = getItemByKey(itemKey);
        if (
          typeof itemSuggestions[itemKey] === "undefined" &&
          itemData?.buildsFrom?.every((itemName) =>
            componentsObtainedObj.some((i) => i.key === itemName)
          )
        ) {
          itemSuggestions[itemKey] = itemData;
        }
      });
    }
  });

  itemSuggestions = Object.values(itemSuggestions).sort(
    (a, b) => a.tier - b.tier
  );
  itemSuggestions = itemSuggestions
    .map((i) => {
      const res = itemStats.find(([itemKey]) => Number(itemKey) === i.id);
      let winRatePercentile = "0%",
        top4Percentile = 0,
        avgPlace = "0%";
      if (typeof res !== "undefined" && typeof res[1] !== "undefined") {
        if (typeof res[1]?.top4Rate === "number") {
          top4Percentile = (res[1].top4Rate * 100).toFixed(1) + "%";
        }
        if (typeof res[1]?.winRate === "number") {
          winRatePercentile = Math.floor(res[1].winRate * 100) + "%";
        }
        if (typeof res[1]?.top4Rate === "number") {
          avgPlace = (res[1]?.avgPlacement || 0).toFixed(1);
        }
      }
      return {
        id: Number(i.id),
        tier: getItemTier(i.id, selectedSet),
        url: getItemUrlById(i.id),
        tooltip: getItemById(i.id)?.bonus,
        winRatePercentile,
        avgPlace,
        top4Percentile,
      };
    })
    .filter((i) => i.tier === 1);
  itemsToIgnoreForSuggestions = null;
  // Result
  return {
    score:
      typeof itemTier?.score === "number" && itemTier.score !== 0
        ? itemTier.score.toFixed(1)
        : 0,
    top4:
      typeof itemTier?.last20Avg?.top4 === "number" &&
      itemTier.last20Avg.top4 !== 0
        ? itemTier.last20Avg.top4.toFixed(1)
        : 0,
    bot4:
      typeof itemTier?.last20Avg?.bot4 === "number" &&
      itemTier.last20Avg.bot4 !== 0
        ? itemTier.last20Avg.bot4.toFixed(1)
        : 0,
    distribution: itemTier.distribution || {},
    components: componentsObtainedObj,
    itemSuggestions,
    items,
  };
}

export default PostMatchPerformanceItemTier;

const ItemTierBody = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-4)",
});

const ItemImages = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-flow: row wrap;
`;

const GraphBox = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  grid-gap: var(--sp-3);
`;

const VerticalLine = styled("div")`
  height: 100%;
  width: 1px;
  background-color: var(--shade6);
`;

const GraphContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-4)",
});

const GraphTitle = styled("div")({
  fontSize: "var(--sp-3)",
  fontWeight: "bold",
  color: "var(--shade1)",
  textAlign: "center",
});

const Items = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-1)",
});

const Rows = styled("div")({
  "& > *": {
    paddingTop: "var(--sp-1)",
    paddingBottom: "var(--sp-1)",
  },
  "& > *:nth-child(odd)": {
    background: "var(--shade8)",
    borderRadius: "var(--sp-1)",
  },
});

const Row = styled("div")(({ $isPositive, $isNegative }) => {
  let color = "var(--shade1)";
  if ($isPositive) color = "var(--turq)";
  if ($isNegative) color = "var(--red)";
  return {
    color,
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    alignItems: "center",
  };
});

const Col = styled("div")({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  fontSize: "var(--sp-3)",
});

const Tier = styled("div")({
  svg: {
    fontSize: "30px",
  },
});

const TierTip = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemTierTip = styled("div")`
  display: flex;
  gap: 8px;
`;
