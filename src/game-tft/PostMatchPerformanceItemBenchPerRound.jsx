import React, { useMemo } from "react";
import { renderToString } from "react-dom/server";
import { Trans, useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { appURLs } from "@/app/constants.mjs";
import { RankDistributionListContainer } from "@/game-lol/CommonComponents.jsx";
import StaticLOL from "@/game-lol/static.mjs";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import {
  Accordion,
  Box,
  CombinedItemImage,
  HR,
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
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import useScrollSwap from "@/game-tft/use-scroll-swap.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import isEmpty from "@/util/is-empty.mjs";

function PostMatchPerformanceItemBenchPerRound() {
  // Hooks
  const { t } = useTranslation();
  const data = useData();
  const { distribution, highestValue } = useDistribution(data.distribution);
  const refScrollSwap = useScrollSwap();
  const isWarning = useRoundInvalid(data.graph);
  const top4 = data.top4;
  const bot4 = data.bot4;
  const handleNavigate = (idx) => () => {
    return idx;
  };

  return (
    <PerformanceItemScorePostMatchCard>
      <Title>
        {t("tft:postmatchInsights.itemBenchPerRound", "Items on Bench / Round")}
        <TitleScore>{data.score}</TitleScore>
        {isWarning && <MissingData />}
      </Title>
      <Accordion
        HeadingComponent={() => (
          <>
            <OverallScoreHeading>
              <OverallScore>{data.score}</OverallScore>
              <Label>
                {t(
                  "tft:postmatchInsights.itemBenchPerRound",
                  "Items on Bench / Round"
                )}
              </Label>
            </OverallScoreHeading>
            <RankDistributionListContainer>
              <DistributionList
                isPositive
                allScores={distribution}
                maxRankValue={highestValue}
              />
            </RankDistributionListContainer>
            <Type>
              {data.finalHp <= 0 ? (
                t(
                  "tft:postmatchInsights.reduceHPLoss",
                  "You should have made items with your components to reduce HP loss."
                )
              ) : data.score >= 2 ? (
                t(
                  "tft:postmatchInsights.fewStrongItems",
                  "You could have made a few strong items early on."
                )
              ) : (
                <>
                  {t("tft:postmatchInsights.goodJob", "Good job - Keep it up!")}
                  <br />
                  {t(
                    "tft:postmatchInsights.effectiveBench",
                    "You used items on your bench effectively."
                  )}
                </>
              )}
            </Type>
          </>
        )}
        BodyComponent={() => (
          <Lorem>
            {Array.isArray(data.strongItems) && data.strongItems.length > 0 ? (
              <div
                className={css`
                  overflow: hidden;
                `}
              >
                <ItemLabel>
                  <div
                    className={css`
                      flex-shrink: 0;
                    `}
                  >
                    {t(
                      "tft:postmatchInsights.strongEarlyItems",
                      "Strong Early Items:"
                    )}
                  </div>
                  <Items>
                    {data.strongItems.map((item, idx) => (
                      <ItemWithChampion
                        key={idx}
                        itemUrl={item.url}
                        itemTooltip={item.tooltip}
                        itemId={item.id}
                        isHighTier
                      />
                    ))}
                  </Items>
                </ItemLabel>
              </div>
            ) : null}
            <RoundGraph ref={refScrollSwap}>
              {data.graph.length ? (
                <GraphHeading>
                  <span>{t("tft:round", "Round")}</span>
                  <div>
                    {t("tft:postmatchInsights.itemsOnBench", "Items on Bench")}
                  </div>
                </GraphHeading>
              ) : null}
              {data.graph.map((item, idx) => {
                const isLast = idx === data.graph.length - 1;
                // Render disconnected or broken data point
                if (item.round === "-") {
                  return (
                    <Data
                      key={idx}
                      data-tip={renderToString(
                        <DataTip>
                          <DataTipTitle>
                            {t("common:dataUnavailable", "Data unavailable")}
                          </DataTipTitle>
                          <DataTipSubtitle>
                            {t(
                              "tft:postmatchInsights.runBlitzWithTFT",
                              "Run Blitz while playing TFT"
                            )}
                          </DataTipSubtitle>
                        </DataTip>
                      )}
                    >
                      <RoundContainer>
                        <RoundImageBroken>
                          <img
                            src={`${appURLs.CDN_WEB}/DisconnectedMatchIcon.svg`}
                            alt={t("common:noData", "No data")}
                          />
                          {isLast ? null : <ConnectTheDots />}
                        </RoundImageBroken>
                      </RoundContainer>
                    </Data>
                  );
                }
                // Render graph data point
                return (
                  <Data
                    key={idx}
                    aria-label="button"
                    onClick={handleNavigate(idx)}
                  >
                    <RoundContainer>
                      <span>{item.round?.replace("_", "-")}</span>
                      <RoundImage src={item.src}>
                        {isLast ? null : <ConnectTheDots />}
                      </RoundImage>
                    </RoundContainer>
                    <BenchedItems>
                      {item.benchedItems.map(
                        ({ tooltip, url }, idx) =>
                          url && (
                            <CombinedItemImage
                              key={idx}
                              src={url}
                              data-tip={tooltip}
                            />
                          )
                      )}
                    </BenchedItems>
                  </Data>
                );
              })}
            </RoundGraph>
            {top4 === 0 && bot4 === 0 ? null : (
              <>
                <HR />
                <Quick>
                  <QuickHeading>
                    {top4 !== 0 ? (
                      <Trans
                        i18nKey="tft.postmatchPerformance.itemsBelowLikelyItems"
                        place={top4}
                      >
                        When your items on bench is below{" "}
                        <span>{{ place: top4 }}</span>,<br /> you’re more likely
                        place <span>top 4</span>.
                      </Trans>
                    ) : (
                      <Trans
                        i18nKey="tft.postmatchPerformance.itemsAboveLikelyItems"
                        place={top4}
                      >
                        When your items on bench is above{" "}
                        <span>{{ place: top4 }}</span>,<br /> you’re more likely
                        to place <span>top 4</span>.
                      </Trans>
                    )}
                  </QuickHeading>
                  <QuickData>
                    <QuickInfo>
                      {t(
                        "tft:postmatchInsights.itemsOnBenchVsPlacement",
                        "Items on Bench vs Placement - Last {{games}} games",
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
          </Lorem>
        )}
      />
    </PerformanceItemScorePostMatchCard>
  );
}

export default PostMatchPerformanceItemBenchPerRound;

function useData() {
  // Hooks
  const state = useSnapshot(readState);
  const getItemTier = useItemTier();
  const currentMatch = useMatch();
  const itemBenchPerRound = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error)) {
      return currentMatch.extra.Performance.itemScore.ItemsOnBenchEachRound;
    }
    return {};
  }, [currentMatch]);
  const summoners = state.tft.summoners;
  const selectedSet = useSetByMatch();
  const latestPatch = getCurrentPatchForStaticData();
  const { getItemUrlById, getItemById, getItemByKey, getItemUrlByKey } =
    useItemUrl();
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const hpTimeline = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.extra.Timeline.hpTimeline;
    return [];
  }, [currentMatch]);
  const finalHp = useMemo(() => {
    if (hpTimeline.length) return hpTimeline[hpTimeline?.length - 1].hp;
    return 0;
  }, [hpTimeline]);
  // Mapping
  let strongItems = new Set();
  let strongItemsExclude = new Set();
  const graph =
    itemBenchPerRound?.graph?.map((item) => {
      const benchedItems = [];
      if (!isEmpty(item.items)) {
        Object.values(item.items).forEach((id) => {
          const item = getItemById(id);
          benchedItems.push({
            id: id,
            url: getItemUrlById(id),
            tooltip: item?.bonus,
          });
        });
      }
      let summoner = {};
      for (const key in summoners) {
        const i = summoners[key];
        if (new RegExp(item?.opponent, "i").test(i?.name)) {
          summoner = i;
        }
      }
      const benchedItemsArr = benchedItems.map(
        (item) => getItemById(item.id)?.key
      );
      const remove = (arr, val) => {
        const index = arr.indexOf(val);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
      };
      benchedItems.forEach((item) => {
        getItemById(item.id).buildsInto?.forEach((potentialItem) => {
          if (
            benchedItemsArr.includes(
              getItemByKey(potentialItem)?.buildsFrom?.[0]
            ) &&
            remove(
              [...benchedItemsArr],
              getItemByKey(potentialItem)?.buildsFrom?.[0]
            ).includes(getItemByKey(potentialItem)?.buildsFrom?.[1])
          )
            strongItems.add(potentialItem);
        });
      });

      return {
        round: item?.round || "-",
        src:
          getRoundUrlByTarget(item?.round) ||
          StaticLOL.getProfileIcon(summoner?.profileiconid || 29, latestPatch),
        benchedItems,
      };
    }) || [];
  strongItems = [...strongItems.values()].reduce((acc, key) => {
    if (strongItemsExclude.has(key)) return acc;
    const item = getItemByKey(key);
    if (getItemTier(item.id, selectedSet) !== 1) return acc;
    const url = getItemUrlByKey(key);

    acc.push({
      id: Number(item.id),
      tooltip: item?.bonus,
      url,
    });
    return acc;
  }, []);
  strongItemsExclude = null;
  return {
    score:
      (itemBenchPerRound?.score || 0).toLocaleString(getLocale(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) || 0,
    graph,
    strongItems,
    distribution: itemBenchPerRound.distribution || {},
    top4:
      (itemBenchPerRound?.last20Avg?.top4 || 0).toLocaleString(getLocale(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) || 0,
    bot4:
      (itemBenchPerRound?.last20Avg?.bot4 || 0).toLocaleString(getLocale(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) || 0,
    finalHp,
  };
}

const Lorem = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-3)",
});
const ItemLabel = styled("div")({
  padding: "var(--sp-1) var(--sp-3)",
  borderRadius: "5px",
  backgroundColor: "var(--shade5)",
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--sp-2)",
});
const Items = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-2)",
});
const GraphHeading = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding-top: 39px;
  gap: 32px;
  font-size: 12px;
  color: var(--shade1);
  & > div {
    width: 54px;
  }
`;
const DataTip = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
`;
const DataTipTitle = styled("div")`
  font-size: 12px;
  color: var(--shade0);
`;
const DataTipSubtitle = styled("div")`
  font-size: 11px;
  color: var(--shade1);
`;
const RoundGraph = styled(
  "div",
  React.forwardRef
)({
  display: "flex",
  gap: "var(--sp-6)",
  overflow: "hidden",
  overflowX: "auto",
});
const ConnectTheDots = styled("div")({
  height: "2px",
  width: "var(--sp-6)",
  backgroundColor: "var(--shade3)",
  position: "absolute",
  top: "50%",
  left: "100%",
});
const Data = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-3)",
  flexDirection: "column",
});
const RoundContainer = styled("div")({
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  gap: "var(--sp-4)",
  span: {
    fontSize: "var(--sp-3)",
  },
});
const RoundImage = styled("div")(({ src }) => {
  const result = {
    position: "relative",
    width: "var(--sp-9)",
    height: "var(--sp-9)",
    flexShrink: 0,
    backgroundColor: "var(--shade5)",
    backgroundSize: "cover",
    outline: "2px solid var(--shade6)",
    borderRadius: "100%",
    boxSizing: "border-box",
  };
  if (src) result.backgroundImage = `url(${src})`;
  return result;
});
const BenchedItems = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "var(--sp-1)",
});
const RoundImageBroken = styled("div")({
  position: "relative",
  width: "var(--sp-4)",
  height: "var(--sp-4)",
  flexShrink: 0,
  borderRadius: "100%",
  boxSizing: "border-box",
  marginTop: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
