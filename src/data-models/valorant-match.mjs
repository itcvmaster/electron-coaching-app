import createModel from "@/__main__/data-model.mjs";

export const model = {
  agentId: String,
  matchDate: String,
  matchId: String,
  playerId: String,
  season: String,
  current: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
    xAxis: Number,
    yAxis: Number,
    distance: Number,
    crosshairplacementCount: Number,
    sprayAccuracy: Number,
    sprayCount: Number,
  },
  lastN: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
    xAxis: Number,
    yAxis: Number,
    distance: Number,
    crosshairplacementCount: Number,
    count: Number,
    sprayAccuracy: Number,
    sprayCount: Number,
  },
};

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
