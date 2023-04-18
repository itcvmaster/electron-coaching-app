import createModel, { Optional } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RankSymbol from "@/game-lol/symbol-rank.mjs";

const ValueObject = {
  mean: Number,
  stdev: Number,
};

const ScoreObject = {
  count: Number,
  mean: Number,
  stdev: Number,
  sum: Number,
};

const SupportItemObject = [
  "item_3851",
  "item_3853",
  "item_3855",
  "item_3857",
  "item_3859",
  "item_3860",
  "item_3863",
  "item_3864",
].reduce((acc, item) => {
  acc[item] = ValueObject;
  return acc;
}, {});

export const model = {
  championId: Number,
  creepScoreByMinute: [ValueObject],
  creepScorePerMinute: {
    gameDuration_15MinTo_20Min: ValueObject,
    gameDuration_20MinTo_25Min: ValueObject,
    gameDuration_25MinTo_30Min: ValueObject,
    gameDuration_30MinTo_35Min: ValueObject,
    gameDuration_35MinTo_40Min: ValueObject,
    gameDuration_40MinTo_45Min: ValueObject,
    gameDuration_45MinTo_50Min: ValueObject,
  },
  damageDealtToChampionsPerMinute: {
    gameDuration_15MinTo_20Min: ValueObject,
    gameDuration_20MinTo_25Min: ValueObject,
    gameDuration_25MinTo_30Min: ValueObject,
    gameDuration_30MinTo_35Min: ValueObject,
    gameDuration_35MinTo_40Min: ValueObject,
    gameDuration_40MinTo_45Min: ValueObject,
    gameDuration_45MinTo_50Min: ValueObject,
  },
  gameDuration: {
    mean: Number,
  },
  kdaByGameDuration: {
    gameDuration_15MinTo_20Min: ValueObject,
    gameDuration_20MinTo_25Min: ValueObject,
    gameDuration_25MinTo_30Min: ValueObject,
    gameDuration_30MinTo_35Min: ValueObject,
    gameDuration_35MinTo_40Min: ValueObject,
    gameDuration_40MinTo_45Min: ValueObject,
    gameDuration_45MinTo_50Min: ValueObject,
  },
  kills: {
    laning: ScoreObject,
    lateGame: ScoreObject,
    midGame: ScoreObject,
  },
  neutralMinionsKilled: ValueObject,
  queue: QueueSymbol,
  supportItemQuestCompletionTime: SupportItemObject,
  tier: RankSymbol,
  totalDamageDealtToChampions: ValueObject,
  totalMinionsKilled: ValueObject,
  visionScorePerMinute: {
    gameDuration_15MinTo_20Min: ValueObject,
    gameDuration_20MinTo_25Min: ValueObject,
    gameDuration_25MinTo_30Min: ValueObject,
    gameDuration_30MinTo_35Min: ValueObject,
    gameDuration_35MinTo_40Min: ValueObject,
    gameDuration_40MinTo_45Min: ValueObject,
    gameDuration_45MinTo_50Min: ValueObject,
  },
  win: ScoreObject,
};

const apiModelValidation = createModel({
  data: {
    divisionStats: [Optional(model)],
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data;
}

export default transform;
