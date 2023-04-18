import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import getItemSorted from "@/game-tft/get-item-sorted.mjs";
import { calculateItemTier } from "@/game-tft/get-stats-score.mjs";
import orderBy from "@/util/order-array-by.mjs";

function useItemTier() {
  const state = useSnapshot(readState);
  const itemsStaticData = state.tft.items;
  const stats = state.tft.stats.items;

  return (id, selectedSet) => {
    if (!stats.length) return null;

    const itemsStatsObj = Object.fromEntries(stats);
    const scoredItemsArray = getItemSorted(
      itemsStatsObj,
      itemsStaticData,
      selectedSet
    );
    const sortedItems = orderBy(scoredItemsArray, ["itemPoints"], ["desc"]);
    const itemsTotalPts = scoredItemsArray.reduce((acc, curr) => {
      return acc + curr.itemPoints;
    }, 0);
    const itemsAvgPts = itemsTotalPts / scoredItemsArray.length;

    const resultItem = sortedItems.find((items) => parseInt(items.id) === id);
    return calculateItemTier(resultItem?.itemPoints || 0, itemsAvgPts);
  };
}

export default useItemTier;
