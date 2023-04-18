import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

export const model = {
  championId: Number,
  role: String,
  rolePercentage: Number,
  kills: Number,
  deaths: Number,
  assists: Number,
  pickRate: Number,
  banRate: Number,
  wins: Number,
  laneWins: Number,
  games: Number,
  physicalDamageDealtToChampions: Number,
  magicDamageDealtToChampions: Number,
  trueDamageDealtToChampions: Number,
  totalDamageDealtToChampions: Number,
  totalGameCount: Number,
  damageSelfMitigated: Number,
  totalHeal: Number,
  timeCcingOthers: Number,
  tierListTier: Optional({
    tierRank: Number,
  }),
};

const allChampionStats = [model];
allChampionStats[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    allChampionStats,
  },
});

function transform(data) {
  apiModelValidation(data);

  const championReport = data.data.allChampionStats;
  return championReport;
}

export default transform;
