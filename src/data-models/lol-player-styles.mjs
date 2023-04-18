import { ref } from "s2-engine";

import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

export const model = {
  averageFirstWardTime: Number,
  averageGankDeaths: Number,
  averageLaningPhaseDeaths: Number,
  averageLaningPhaseSoloKills: Number,
  averageWardsPlaced: Number,
  championCounts: {
    count: Optional(Number),
    id: Optional(String),
  },
  firstGankedLaneCounts: [
    {
      count: Number,
      id: String,
    },
  ],
  largestCritical: Number,
  largestKillingSpree: Number,
  largestMultiKill: Number,
  lastFewWins: [Boolean],
  lastGame: String,
  recentlyPlayedWith: [
    {
      accountId: String,
      games: Number,
      profileIconId: Number,
      summonerName: String,
      wins: Number,
    },
  ],
  roles: [
    {
      count: Number,
      name: String,
    },
  ],
  teammateCounts: [
    {
      count: Number,
      id: String,
    },
  ],
  totalGames: Number,
  updatedAt: String,
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: { playstyles: model },
});

function transform(data) {
  apiModelValidation(data);

  const result = data.data.playstyles;
  return ref(result); // ref needed for drafting
}

export default transform;
