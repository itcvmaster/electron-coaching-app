import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

const model = createModel([
  [
    Optional(String),
    {
      matchesPlayed: Number,
      wins: Number,
      sumOfRanks: Number,
      top4: Number,
      winRate: Number,
      avgPlacement: Number,
      top4Rate: Number,
      items: {
        [arbitraryKeys]: {
          matchesPlayed: Number,
          wins: Number,
          sumOfRanks: Number,
          top4: Number,
          winRate: Number,
          avgPlacement: Number,
          top4Rate: Number,
        },
      },
    },
  ],
]);

function transform(data) {
  return model(data);
}

export default transform;
