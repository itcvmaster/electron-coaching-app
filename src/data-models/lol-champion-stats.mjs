import { ref } from "s2-engine";

import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

export const model = {
  queue: Optional(QueueSymbol),
  patch: Optional(String),
  role: RoleSymbol,
  region: Optional(RegionSymbol),
  tier: Optional(String),
  banRate: Number,
  pickRate: Number,
  assists: Number,
  rolePercentage: Number,
  championId: Number,
  damageDealtToTurrets: Optional(Number),
  damageSelfMitigated: Optional(Number),
  timeCcingOthers: Optional(Number),
  totalHeal: Optional(Number),
  deaths: Number,
  goldEarned: Optional(Number),
  goldSpent: Optional(Number),
  wins: Number,
  laneWins: Number,
  games: Number,
  totalGameCount: Number,
  kills: Number,
  timePlayed: Optional(Number),
  totalMinionsKilled: Optional(Number),
  physicalDamageDealtToChampions: Number,
  magicDamageDealtToChampions: Number,
  trueDamageDealtToChampions: Number,
  totalDamageDealtToChampions: Optional(Number),
  matchups: Optional([
    {
      championId: String,
      assists: Number,
      opponentChampionId: Number,
      deaths: Number,
      games: Number,
      wins: Number,
      laneWins: Number,
      kills: Number,
    },
  ]),
  tierListTier: Optional({
    tierRank: String,
    previousTierRank: String,
    status: String,
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
  const stats = data.data.allChampionStats;

  // This is needed for `in-game-state.mjs`. This object is way too large.
  return ref(stats);
}

export default transform;
