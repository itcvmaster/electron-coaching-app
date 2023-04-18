import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

const CrosshairPlacement = {
  count: Number,
  xAxis: Number,
  yAxis: Number,
};

const CrosshairPlacementStats = {
  distance: Number,
  count: Number,
  yAxis: Number,
  positiveXAsix: {
    distance: Number,
    count: Number,
  },
  negativeXAsix: {
    distance: Number,
    count: Number,
  },
  duelsWon: {
    distance: Number,
    count: Number,
    yAxis: Number,
    positiveXAxis: {
      distance: Number,
      count: Number,
    },
    negativeXAxis: {
      distance: Number,
      count: Number,
    },
  },
  duelsLost: {
    distance: Number,
    count: Number,
    yAxis: Number,
    positiveXAxis: {
      distance: Number,
      count: Number,
    },
    negativeXAxis: {
      distance: Number,
      count: Number,
    },
  },
  duelsPlayed: {
    distance: Number,
    count: Number,
    yAxis: Number,
    positiveXAxis: {
      distance: Number,
      count: Number,
    },
    negativeXAxis: {
      distance: Number,
      count: Number,
    },
  },
};

const AccuracyStatsDetail = {
  headshots: Number,
  bodyshots: Number,
  legshots: Number,
  missedshots: Number,
  firstShots: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
  },
  timeToKill: {
    head: {
      time: Number,
      kill: Number,
    },
    body: {
      time: Number,
      kill: Number,
    },
    leg: {
      time: Number,
      kill: Number,
    },
    all: {
      time: Number,
      kill: Number,
    },
  },
  duelsPlayed: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
  },
  duelsWon: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
  },
  duelsLost: {
    headshots: Number,
    bodyshots: Number,
    legshots: Number,
    missedshots: Number,
  },
};

const AccuracyStats = {
  all: AccuracyStatsDetail,
  long: AccuracyStatsDetail,
  medium: AccuracyStatsDetail,
  short: AccuracyStatsDetail,
};

export const model = {
  count: Number,
  engagements: Number,
  headshots: Number,
  bodyshots: Number,
  legshots: Number,
  missedshots: Number,
  firstShothits: Number,
  firstShots: Number,
  duelsPlayed: Number,
  duelsWon: Number,
  duelsLost: Number,
  kills: Number,
  rouns: Number,
  crosshairPlacementStats: {
    all: CrosshairPlacementStats,
    long: CrosshairPlacementStats,
    medium: CrosshairPlacementStats,
    short: CrosshairPlacementStats,
  },
  crosshairPlacements: {
    all: { [arbitraryKeys]: CrosshairPlacement },
    long: { [arbitraryKeys]: CrosshairPlacement },
    medium: { [arbitraryKeys]: CrosshairPlacement },
    short: { [arbitraryKeys]: CrosshairPlacement },
  },
  accuracyStats: AccuracyStats,
};

const apiModelValidation = createModel(Optional(model));

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
