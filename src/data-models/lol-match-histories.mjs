import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

export const model = {
  duration: Number,
  gameCreation: String,
  id: String,
  leaguePatch: {
    majorVersion: String,
    minorVersion: String,
  },
  playerMatches: [
    {
      accountId: String,
      champion: {
        id: String,
        name: String,
        normalizedName: String,
      },
      matchStatsFromClient: Optional({
        lp: Number,
        deltaLp: Number,
        division: String,
        tier: String,
      }),
      playerMatchStats: {
        assists: Number,
        champLevel: Number,
        creepScoreDiffAtLaneEnd: Number,
        damageDealt: Number,
        damageSelfMitigated: Number,
        damage_healed: Number,
        damage_magic_dealt: Number,
        damage_physical_dealt: Number,
        damage_taken: Number,
        damage_to_champions: Number,
        damage_to_objectives: Number,
        damage_to_towers: Number,
        damage_true_dealt: Number,
        deaths: Number,
        doubleKills: Number,
        firstInhibitorKill: Boolean,
        firstTowerKill: Boolean,
        first_blood: Boolean,
        goldAtLaneEnd: Number,
        goldDiffAtLaneEnd: Number,
        goldEarned: Number,
        goldSpent: Number,
        items: Number,
        killingSprees: Number,
        kills: Number,
        largestKillingSpree: Number,
        largestMultiKill: Number,
        largest_critical: Number,
        minions_killed_neutral: Number,
        minions_killed_total: Number,
        opponentChampionId: Number,
        pentaKills: Number,
        perkPrimaryStyle: Number,
        perkSubStyle: Number,
        perks: Number,
        quadraKills: Number,
        spells: Number,
        time_cc_others: Number,
        total_time_cc_dealt: Number,
        tripleKills: Number,
        turrets_killed: Number,
        visionScore: Number,
        wardsKilled: Number,
        wardsPlaced: Number,
        wards_purchased: Number,
        win: Boolean,
      },
      role: RoleSymbol,
      teamId: Number,
    },
  ],
  queue: QueueSymbol,
  region: RegionSymbol,
  riotMatchId: String,
};

const matches = [model];
matches[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    matches: [model],
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.matches;
}

export default transform;
