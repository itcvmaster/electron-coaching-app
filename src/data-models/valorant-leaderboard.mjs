import createModel from "@/__main__/data-model.mjs";

const model = {
  gameName: String,
  leaderboardRank: Number,
  nametag: String,
  numberOfWins: Number,
  puuid: String,
  rank: Number,
  rankedRating: Number,
  shard: String,
  tagLine: String,
};

const apiModelValidation = createModel([model]);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
