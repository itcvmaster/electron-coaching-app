import {
  ITEM_BLACKLIST,
  ITEM_SUGGESTION_BLACKLIST,
  scoreWeights,
} from "@/game-tft/constants.mjs";
import orderBy from "@/util/order-array-by.mjs";

const getItemSorted = (
  champItems,
  itemsStaticData,
  selectedSet,
  amountWanted = 100
) => {
  const itemSetStaticData = itemsStaticData[selectedSet] || {};

  if (!champItems || !itemsStaticData || !itemSetStaticData) return [];

  const itemsArr = [];
  const items = (champItems && Object.entries(champItems)) || [];

  const setItemsStaticData = Object.values(itemSetStaticData);

  // Real items are items that aren't bogus
  const realItems = items.filter(
    (item) =>
      !ITEM_BLACKLIST.includes(item[0]) &&
      !ITEM_SUGGESTION_BLACKLIST.includes(item[0])
  );
  const realItemsStats = realItems.map((item) => item[1]);
  const lastItemIndex = realItemsStats.length - 1;

  if (realItems.length) {
    // Avg placement sorted
    const sortedBy_avgPlacement = orderBy(realItemsStats, "avgPlacement");
    const bestAvgPlacement = 8 - sortedBy_avgPlacement[0].avgPlacement;
    const worstAvgPlacement =
      8 - sortedBy_avgPlacement[lastItemIndex].avgPlacement;

    // Top4 rate sorted
    const sortedBy_top4Rate = orderBy(realItemsStats, "top4Rate", "desc");
    const highestTop4Rate = sortedBy_top4Rate[0].top4Rate;
    const lowestTop4Rate = sortedBy_top4Rate[lastItemIndex].top4Rate;

    // Win rate sorted
    const sortedBy_winRate = orderBy(realItemsStats, "winRate", "desc");
    const highestWinRate = sortedBy_winRate[0].winRate;
    const lowestWinRate = sortedBy_winRate[lastItemIndex].winRate;

    // Matches played sorted
    const sortedBy_matchesPlayed = orderBy(
      realItemsStats,
      "matchesPlayed",
      "desc"
    );
    const highestMatchesPlayed = sortedBy_matchesPlayed[0].matchesPlayed;
    const lowestMatchesPlayed =
      sortedBy_matchesPlayed[lastItemIndex].matchesPlayed;

    realItems.forEach((item) => {
      const itemID = item[0];
      const itemStats = item[1];

      // Avg placement normalization (0-1)
      const normAvgPlacement = normalize(
        8 - itemStats.avgPlacement,
        bestAvgPlacement,
        worstAvgPlacement
      );

      // Top4 rate normalization (0-1)
      const normTop4Rate = normalize(
        itemStats.top4Rate,
        highestTop4Rate,
        lowestTop4Rate
      );

      // Win rate normalization (0-1)
      const normWinrate = normalize(
        itemStats.winRate,
        highestWinRate,
        lowestWinRate
      );

      // Matches played normalization (0-1)
      const normMatchesPlayed = normalize(
        itemStats.matchesPlayed,
        highestMatchesPlayed,
        lowestMatchesPlayed
      );

      // Calculate points based on the above normalized values
      const itemPoints = calculatePointsItems(
        normAvgPlacement,
        normTop4Rate,
        normWinrate,
        normMatchesPlayed
      );

      const itemStaticData = setItemsStaticData
        ? setItemsStaticData.find(
            (setItem) => setItem.id === parseInt(itemID, 10)
          )
        : {};

      if (itemStaticData) {
        itemsArr.push({
          id: itemID,
          info: itemStaticData,
          itemPoints,
          ...itemStats,
        });
      }
    });
  }

  const sortedItems = orderBy(itemsArr, ["itemPoints"], ["desc"]).slice(
    0,
    amountWanted
  );

  return sortedItems;
};

export default getItemSorted;

const normalize = (val, max, min) => {
  const nom = val - min;
  const denom = max - min || 1;
  const result = nom / denom;
  return Number.isNaN(result) ? 0 : result;
};

const calculatePointsItems = (
  avgPlacementScore = 0,
  top4RateScore = 0,
  winrateScore = 0,
  matchesPlayedScore = 0
) => {
  let points = 0;

  // Weights
  const itemWeights = scoreWeights.items;
  const championWeights = scoreWeights.champions;

  // Calculate points based on the above normalized values
  points += Math.round(
    Math.pow(matchesPlayedScore, itemWeights.exponent.matchesPlayed) *
      itemWeights.multiply.matchesPlayed
  );
  points +=
    Math.pow(
      avgPlacementScore - championWeights.subtract.avgPlacement,
      itemWeights.exponent.avgPlacement
    ) * itemWeights.multiply.avgPlacement || 0;
  points +=
    Math.pow(
      top4RateScore - championWeights.subtract.top4Rate,
      itemWeights.exponent.top4Rate
    ) * itemWeights.multiply.top4Rate;
  points +=
    Math.pow(winrateScore, itemWeights.exponent.winRate) *
    itemWeights.multiply.winRate;

  return points;
};
