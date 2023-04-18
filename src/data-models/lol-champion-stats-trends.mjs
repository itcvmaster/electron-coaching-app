import createModel, { isRootModel } from "@/__main__/data-model.mjs";

export const model = {
  championId: Number,
  wins: Number,
  laneWins: Number,
  games: Number,
  pickRate: Number,
  banRate: Number,
  totalDamageDealtToChampions: Number,
  timePlayed: Number,
  patch: String,
};
const allChampionTrends = [model];
allChampionTrends[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    allChampionTrends,
  },
});

function transform(data) {
  apiModelValidation(data);

  const trends = data.data.allChampionTrends.sort((a, b) => a.patch - b.patch);
  return trends;
}

export default transform;
