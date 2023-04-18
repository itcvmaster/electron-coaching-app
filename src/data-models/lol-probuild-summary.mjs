import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

const SummaryObject = {
  id: String,
  count: Number,
  winRate: Number,
  pickRate: Number,
};

export const model = {
  id: String,
  aggregateSummaries: {
    boots: Optional(SummaryObject),
    items: SummaryObject,
    runes: SummaryObject,
    skillOrder: Optional({
      ids: [String],
      pickRate: Number,
      position: Number,
      winRate: Number,
    }),
    spells: Optional({
      ids: [String],
      count: Number,
      winRate: Number,
      pickRate: Number,
    }),
    startingItems: Optional({
      ids: [String],
      winRate: Number,
      position: Number,
      pickRate: Number,
    }),
  },
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: { probuildChampion: model },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.probuildChampion;
}

export default transform;
