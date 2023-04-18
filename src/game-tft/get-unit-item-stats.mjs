import getItemSorted from "@/game-tft/get-item-sorted.mjs";
import StaticTFT from "@/game-tft/static.mjs";

const getUnitItemStats = (
  championsStats,
  itemsStaticData,
  selectedSet,
  champion = "all"
) => {
  const itemStats = {};
  const unitStatsData = (championsStats && Object.values(championsStats)) || [];

  const isLuxOrQiyana = champion === "Lux" ? true : champion === "Qiyana";

  // Return ALL units/champions
  if (unitStatsData && champion === "all") {
    unitStatsData.forEach((unit) => {
      const unitName = StaticTFT.getChampName(unit?.[0]);
      const unitStats = unit?.[1];
      const unitItems = unitStats?.items;

      const champSortedItems = getItemSorted(
        unitItems,
        itemsStaticData,
        selectedSet
      );

      itemStats[unitName] = [...champSortedItems];
    });

    // Return a specific unit/champion that ISNT Lux or Qiyana
  } else if (unitStatsData && !isLuxOrQiyana) {
    const unit = unitStatsData.find(
      (unit) => StaticTFT.getChampName(unit[0]) === champion
    );
    const unitName = StaticTFT.getChampName(unit?.[0]);
    const unitStats = unit?.[1];
    const unitItems = unitStats?.items;

    const champSortedItems = getItemSorted(
      unitItems,
      itemsStaticData,
      selectedSet
    );

    itemStats[unitName] = [...champSortedItems];

    // Return all Lux or Qiyana's
  } else if (unitStatsData) {
    const units = unitStatsData.filter((unit) => unit[0].includes(champion));

    units.forEach((unit) => {
      const unitName = StaticTFT.getChampName(unit?.[0]);
      const unitStats = unit?.[1];
      const unitItems = unitStats?.items;

      const champSortedItems = getItemSorted(
        unitItems,
        itemsStaticData,
        selectedSet
      );

      itemStats[unitName] = [...champSortedItems];
    });
  }

  return itemStats;
};

export default getUnitItemStats;
