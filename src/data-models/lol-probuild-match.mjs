import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import { model as ProbuildMatchesModel } from "@/data-models/lol-probuild-matches.mjs";

export const model = {
  id: String,
  matchCount: Number,
  pickRate: Number,
  winRate: Number,
  probuildMatches: [ProbuildMatchesModel],
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
