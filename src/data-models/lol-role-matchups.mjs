import createModel, {
  arbitraryKeys,
  isRootModel,
} from "@/__main__/data-model.mjs";

const matchup = {
  championId: Number,
  opponentChampionId: Number,
  games: Number,
  wins: Number,
  laneWins: Number,
};

export const model = {
  championId: Number,
  role: String,
  region: String,
  patch: String,
  matchups: [matchup],
};

const allChampionStats = [model];
allChampionStats[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    allChampionStats,
  },
});

const afterTransformModel = {
  [arbitraryKeys]: {
    [arbitraryKeys]: matchup,
  },
};

const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  apiModelValidation(data);

  const matchups = data.data.allChampionStats.reduce((acc, curr) => {
    acc[curr.championId] = (curr.matchups || []).reduce((acc, curr) => {
      const { opponentChampionId } = curr;
      acc[opponentChampionId] = curr;

      return acc;
    }, {});

    return acc;
  }, {});

  return afterTransformValidation(matchups);
}

export default transform;
