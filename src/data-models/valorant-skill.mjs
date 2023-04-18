import createModel from "@/__main__/data-model.mjs";
import { model as MatchData } from "@/data-models/valorant-match.mjs";
import { model as PerformanceData } from "@/data-models/valorant-performance.mjs";

const model = {
  matches: [MatchData],
  performance: PerformanceData,
};

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
