import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

const MinionStatsObject = {
  minionsKilledEnemyJungle: Number,
  minionsKilledNeutral: Number,
  minionsKilledTeamJungle: Number,
  minionsKilledTotal: Number,
};

const MultiKillStatsObject = {
  doubleKills: Number,
  killingSprees: Number,
  pentaKills: Number,
  quadraKills: Number,
  tripleKills: Number,
};

const WardStatsObject = {
  wardsKilled: Number,
  wardsPlaced: Number,
  wardsPurchased: Number,
};

const GoldStatsObject = {
  goldEarned: Number,
  goldSpent: Number,
};

const FirstStatsObject = {
  firstBlood: Number,
  firstInhibitorKill: Number,
  firstTowerKill: Number,
};

const DamageStatsObject = {
  damageDealt: Number,
  damageHealed: Number,
  damageMagicDealt: Number,
  damagePhysicalDealt: Number,
  damageSelfMitigated: Number,
  damageTaken: Number,
  damageToChampions: Number,
  damageToObjectives: Number,
  damageToTowers: Number,
  damageTrueDealt: Number,
};

const CCStatsObject = {
  timeCcOthers: Number,
  totalTimeCcDealt: Number,
};

const BasicStatsObject = {
  assists: Number,
  deaths: Number,
  kills: Number,
  lp: Number,
  lpEstimate: Number,
  visionScore: Number,
  wins: Number,
};

export const model = {
  basicStats: BasicStatsObject,
  ccStats: CCStatsObject,
  championId: String,
  damageStats: DamageStatsObject,
  firstStats: FirstStatsObject,
  gameCount: Number,
  gameDuration: Number,
  goldDiffAtLaneEnd: Number,
  goldStats: GoldStatsObject,
  lastPlayed: String,
  minionStats: MinionStatsObject,
  multikillStats: MultiKillStatsObject,
  queue: QueueSymbol,
  role: RoleSymbol,
  wardStats: WardStatsObject,
};

const playerChampionsStats = [model];
playerChampionsStats[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    playerChampionsStats,
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.playerChampionsStats;
}

export default transform;
