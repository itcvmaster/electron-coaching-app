import createModel, { Optional } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

export const model = {
  championId: Number,
  opponentChampionId: Optional(Number),
  queue: QueueSymbol,
  role: RoleSymbol,
  builds: [
    {
      wins: Number,
      games: Number,
      mythicId: Number,
      mythicAverageIndex: Number,
      primaryRune: Number,
      completedItems: [
        {
          games: Number,
          index: Number,
          averageIndex: Number,
          itemId: Number,
          wins: Number,
        },
      ],
      runes: [
        {
          games: Number,
          index: Number,
          runeId: Number,
          wins: Number,
          treeId: Number,
        },
      ],
      skillOrders: [
        {
          games: Number,
          wins: Number,
          skillOrder: [Number],
        },
      ],
      startingItems: [
        {
          games: Number,
          wins: Number,
          startingItemIds: [Number],
        },
      ],
      summonerSpells: [
        {
          games: Number,
          wins: Number,
          summonerSpellIds: [Number],
        },
      ],
    },
  ],
};

const apiModelValidation = createModel({
  data: {
    championBuildStats: model,
  },
});

function transform(data) {
  apiModelValidation(data);

  const builds = data.data.championBuildStats;
  return builds;
}

export default transform;
