import React, { useCallback, useMemo } from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import ChampionImage from "@/game-tft/ChampionImage.jsx";
import { CombinedItemImage } from "@/game-tft/CommonComponents.jsx";
import getUnitItemStats from "@/game-tft/get-unit-item-stats.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

/**
 * This component really should only be used in TFT Postmatch
 * because the useItemWithChampion helper hook only makes a comparison against
 * the TFT Postmatch Scoreboard data
 * @param itemId {number} - Item Id
 * @param itemUrl {string} - Full url only
 * @param itemTooltip {any} - Applied to data-tip property
 * @param isHighTier {boolean} - Item comparison with high tier items
 * @param champKey {number} - Provide a champion key directly
 * @returns {JSX.Element}
 * @constructor
 */
function ItemWithChampion({
  champKey,
  itemId,
  itemUrl,
  itemTooltip,
  isHighTier,
}) {
  const state = useSnapshot(readState);

  const selectedSet = useSetByMatch();
  const championSet = state.tft.champions;
  const { getChampKeyByItemIdForHighTier, getChampKeyByItemId } =
    useItemWithChampion();
  const champ = isHighTier
    ? getChampKeyByItemIdForHighTier(itemId)
    : getChampKeyByItemId(itemId);
  let cost = champ.cost;
  const derivedChampKey = champ.champKey;
  if (
    typeof cost === "undefined" &&
    championSet[champKey] &&
    championSet[champKey][selectedSet]
  ) {
    cost = championSet[champKey][selectedSet]?.cost;
  }
  if (typeof cost === "undefined") cost = 0;

  return (
    <Relative>
      <CombinedItemImage src={itemUrl} data-tip={itemTooltip} />
      {champKey || derivedChampKey ? (
        <ChampionImageContainer>
          <ChampionImage
            champKey={champKey || derivedChampKey}
            set={selectedSet}
            size={24}
            cost={cost}
          />
        </ChampionImageContainer>
      ) : null}
    </Relative>
  );
}

// Helpers
function useItemWithChampion() {
  // Hooks
  const {
    parameters: [, name],
  } = useRoute();
  const state = useSnapshot(readState);
  const selectedSet = useSetByMatch();
  const currentMatch = useMatch();
  const staticItems = state.tft.items;
  const staticChampions = state.tft.champions;
  const champions = state.tft.stats.champions;
  // Current player
  const currentPlayer = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return (
        currentMatch.data.players.find((i) => i.summonerName === name) || {}
      );
    return undefined;
  }, [currentMatch, name]);
  // All champions from the current player will have their items merged
  const championsWithCurrentItems = useMemo(() => {
    if (currentPlayer) {
      const res = currentPlayer.boardPieces.reduce(
        (acc, cur, idx) => {
          if (acc[1].has(cur.name)) {
            cur.items.forEach((i) => {
              if (
                acc[0][acc[1].get(cur.name)].items.some((j) => j.id === i.id)
              ) {
                return;
              }
              acc[0][acc[1].get(cur.name)].items.push(i);
            });
            return acc;
          }
          acc[1].set(cur.name, idx);
          const champKey = Object.values(staticChampions).find(
            (champ) => champ.name.toLowerCase() === cur.name.toLowerCase()
          )?.key;
          acc[0].push({
            champKey: champKey,
            items: cur.items,
            cost: cur.price,
          });
          return acc;
        },
        [[], new Map()]
      );
      res[1].clear();
      res[1] = null;
      return res[0];
    }
    return [];
  }, [staticChampions, currentPlayer]);
  // All champions from the current player will receive a top 5 item list
  const championsWithTop5Items = useMemo(() => {
    let defaultVal = [];
    if (currentMatch && !(currentMatch instanceof Error) && currentPlayer) {
      const allUnits = currentPlayer?.boardPieces?.reduce(
        (acc, unit) => {
          if (acc[1].has(unit.name)) return acc;
          acc[1].add(unit.name);

          let unitItemStats =
            getUnitItemStats(champions, staticItems, selectedSet, unit.name) ||
            {};
          unitItemStats = unitItemStats[unit.name] || [];

          acc[0].push({
            key: unit.name,
            recommendedItems: unitItemStats.slice(0, 5),
            cost: unit.price,
          });
          return acc;
        },
        [[], new Set()]
      );
      if (!Array.isArray(allUnits)) return defaultVal;
      if (typeof allUnits[1] !== "undefined") {
        allUnits[1].clear();
        allUnits[1] = undefined;
      }
      if (allUnits[0].length === 0) return defaultVal;
      defaultVal = null;
      return allUnits[0];
    }
    return defaultVal;
  }, [currentMatch, currentPlayer, champions, staticItems, selectedSet]);

  const getChampKeyByItemIdForHighTier = React.useCallback(
    function getChampKeyByItemIdForHighTier(itemId) {
      // Does this item match high tier items from a champion from the scoreboard
      let champKey = "",
        cost;
      if (typeof itemId !== "number") return champKey;
      for (let k = 0; k < championsWithTop5Items.length; k += 1) {
        for (
          let y = 0;
          y < championsWithTop5Items[k].recommendedItems.length;
          y += 1
        ) {
          const itemIdFromTop5 = Number(
            championsWithTop5Items[k].recommendedItems[y].id
          );
          if (itemIdFromTop5 === itemId) {
            champKey = championsWithTop5Items[k].key?.replace(/[\W_]+/g, "");
            cost = championsWithTop5Items[k].cost;
            k = championsWithTop5Items.length;
            break;
          }
        }
      }
      return {
        champKey,
        cost,
      };
    },
    [championsWithTop5Items]
  );
  const getChampKeyByItemId = useCallback(
    function getChampKeyByItemId(itemId) {
      // Does this item match current items from a champion from the scoreboard
      let champKey = "",
        cost;
      if (typeof itemId !== "number") return champKey;
      for (let i = 0; i < championsWithCurrentItems.length; i += 1) {
        for (let y = 0; y < championsWithCurrentItems[i].items.length; y += 1) {
          if (championsWithCurrentItems[i].items[y].id === itemId) {
            champKey = championsWithCurrentItems[i].champKey?.replace(
              /[\W_]+/g,
              ""
            );
            cost = championsWithCurrentItems[i].cost;
            i = championsWithCurrentItems.length;
            break;
          }
        }
      }
      return {
        champKey,
        cost,
      };
    },
    [championsWithCurrentItems]
  );
  return {
    getChampKeyByItemIdForHighTier,
    getChampKeyByItemId,
  };
}

export default ItemWithChampion;

const ChampionImageContainer = styled("div")`
  position: absolute;
  bottom: -6px;
  right: -12px;
`;

const Relative = styled("div")`
  position: relative;
`;
