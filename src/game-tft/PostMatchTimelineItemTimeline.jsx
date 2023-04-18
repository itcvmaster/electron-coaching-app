import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import Static from "@/game-lol/static.mjs";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import {
  Container,
  Content,
  Heading,
  Title,
} from "@/game-tft/CommonComponents.jsx";
import ItemWithChampion from "@/game-tft/ItemWithChampion.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import useItemUrl from "@/game-tft/use-item-url.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import useScrollSwap from "@/game-tft/use-scroll-swap.mjs";
import isEmpty from "@/util/is-empty.mjs";

const ROUND_WIDTH = 66;

function PostMatchTimelineItemTimeline() {
  // Hooks
  const { t } = useTranslation();
  const rounds = useData();
  const refScrollSwap = useScrollSwap();
  // Render
  return (
    <Container>
      <Heading>
        <Title>
          {t("tft:postmatchInsights.itemTimeline", "Item Timeline")}
        </Title>
      </Heading>
      <Content>
        <Rounds ref={refScrollSwap}>
          <Round style={{ flexBasis: "80px" }}>
            <Label style={{ marginTop: "40px" }}>
              {t("tft:round", "Round")}
            </Label>
            <Label style={{ marginTop: "6px" }}>
              {t("tft:postmatchInsights.itemsAcquired", "Items Acquired")}
            </Label>
          </Round>
          {rounds.length > 1 ? (
            <RoundHorizontalRule rounds={rounds.length} />
          ) : null}
          {rounds.map(({ round, isWinner, items, opponentAvatar }, idx) => (
            <Round key={idx}>
              <RoundContent>
                <Score>{round.replace("_", "-")}</Score>
                <Avatar
                  url={opponentAvatar}
                  $isWin={isWinner}
                  $isLoss={!isWinner}
                />
              </RoundContent>
              <RoundItems>
                {items.map(({ champKey, url, tooltip }, itemIdx) => {
                  if (!url) return null;
                  return (
                    <ItemWithChampion
                      key={itemIdx}
                      itemUrl={url}
                      itemTooltip={tooltip}
                      champKey={StaticTFT.getChampName(champKey)}
                    />
                  );
                })}
              </RoundItems>
            </Round>
          ))}
        </Rounds>
      </Content>
    </Container>
  );
}

export default PostMatchTimelineItemTimeline;

function useData() {
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const { getItemUrlById, getItemById } = useItemUrl();
  const summoners = state.tft.summoners;
  const latestPatch = getCurrentPatchForStaticData();
  let roundBreakdown = [],
    itemTimeline = [];
  if (currentMatch && !(currentMatch instanceof Error)) {
    roundBreakdown = currentMatch.extra.RoundBreakDown;
    itemTimeline = currentMatch.extra.Timeline.itemsTimeLine;
  }
  return itemTimeline.map((item, itemTimelineIdx) => {
    let items = [];
    if (!isEmpty(item.items)) {
      items = item.items.map((id) => {
        let champKey = "";
        let allUnits = [];
        if (roundBreakdown[itemTimelineIdx])
          allUnits = roundBreakdown[itemTimelineIdx].player.units;
        for (let i = 0; i < allUnits.length; i += 1) {
          const currentUnit = allUnits[i];
          if (typeof currentUnit?.items === "object") {
            const itemIds = Object.values(currentUnit.items);
            const result = itemIds.find((rbdItemId) => rbdItemId === id);
            if (typeof result !== "undefined") {
              champKey = currentUnit.id.match(/(TFT\d_|TFT_)([^\W]+)/)[2];
              break;
            }
          }
        }
        return {
          id: Number(id),
          url: getItemUrlById(id),
          tooltip: getItemById(id)?.bonus,
          champKey,
        };
      });
    }
    let summoner = {};
    for (const key in summoners) {
      const j = summoners[key];
      if (new RegExp(item.opponent, "i").test(j?.name)) {
        summoner = j;
        break;
      }
    }
    return {
      ...item,
      opponentAvatar:
        getRoundUrlByTarget(item.round) ||
        Static.getProfileIcon(summoner.profileiconid || 29, latestPatch),
      items,
    };
  });
}

const Rounds = styled("div", React.forwardRef)`
  position: relative;
  display: flex;
  overflow-x: auto;
  padding-right: 18px;
  padding-left: 18px;
`;
const Round = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 22px;
  padding: 33px 0;
  text-align: center;
  flex-basis: ${ROUND_WIDTH}px;
  flex-grow: 0;
  flex-shrink: 0;
  z-index: 1;
  &:hover {
    background: linear-gradient(180deg, rgba(18, 20, 24, 0.1) 0%, #262b35 100%);
  }
  &:first-child:hover {
    background: transparent;
  }
`;
const RoundContent = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const RoundItems = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Avatar = styled("div")`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--shade7);
  background-image: url(${(props) => props.url});
  background-size: cover;
  background-repeat: no-repeat;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 2px solid
    ${(props) =>
      props.$isWin
        ? "var(--blue)"
        : props.$isLoss
        ? "var(--red)"
        : "var(--shade3)"};
`;
const Score = styled("div")`
  font-size: 12px;
  color: var(--shade0);
  letter-spacing: 1.5px;
`;
const Label = styled("p")`
  color: var(--shade3);
  font-size: 12px;
`;
const RoundHorizontalRule = styled("div")`
  position: absolute;
  background: var(--shade6);
  height: 2px;
  width: ${(props) =>
    props.rounds * ROUND_WIDTH + 18 - (80 + (ROUND_WIDTH - 36) / 2)}px;
  left: ${80 + 18 + (ROUND_WIDTH - 36 / 2)}px;
  top: 80px;
  z-index: 0;
`;
