import createModel, { Optional } from "@/__main__/data-model.mjs";

const model = {
  agentId: String,
  assists: Number,
  bodyshots: Number,
  competitiveMovement: Number,
  damage: Number,
  deaths: Number,
  enemyTeamNumPoints: Number,
  headshots: Number,
  hsStats: {
    all: {
      bodyshots: Number,
      count: Number,
      headshots: Number,
      last20Avg: Number,
      legshots: Number,
    },
    current: Number,
  },
  kills: Number,
  legshots: Number,
  map: String,
  mapStats: {
    attackingPlayed: Number,
    attackingWon: Number,
    defendingPlayed: Number,
    defendingWon: Number,
    matches: Number,
    roundsPlayed: Number,
    roundsWon: Number,
    ties: Number,
    wins: Number,
  },
  matchDate: String,
  matchId: String,
  matchPosition: Number,
  playerId: String,
  playtimeMillis: Number,
  queue: String,
  rankedRatingEarned: Number,
  roundsPlayed: Number,
  roundsWon: Number,
  score: Number,
  season: String,
  teamNumPoints: Number,
  teamPosition: Number,
  tierAfterUpdate: Number,
  winStatus: String,
};

const apiModelValidation = createModel([Optional(model)]);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
