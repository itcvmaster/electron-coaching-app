import createModel, {
  Any,
  isRootModel,
  Optional,
} from "@/__main__/data-model.mjs";
import { QUEUE_SYMBOL_TO_STR, QUEUE_SYMBOLS } from "@/game-lol/constants.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

// Note this is not everything that is returned as part of the match, just what is being used currently
export const model = {
  gameId: Number,
  gameCreation: Number,
  gameDuration: Number,
  gameMode: String,
  gameType: String,
  gameVersion: String,
  mapId: Number,
  participants: [
    {
      puuid: String,
      participantId: Number,
      summonerId: String,
      summonerName: String,
      profileIcon: Number,
      championId: Number,
      role: RoleSymbol,
      summoner1Id: Number,
      summoner2Id: Number,
      teamId: Number,
      teamPosition: String,
      win: Boolean,
      challenges: Any,
      perks: {
        statPerks: {
          defense: Number,
          flex: Number,
          offense: Number,
        },
        styles: [
          {
            style: Number,
            description: String,
            selections: [
              {
                perk: Number,
                var1: Number,
                var2: Number,
                var3: Number,
              },
            ],
          },
        ],
      },
      // Stats
      kills: Number,
      deaths: Number,
      assists: Number,
      visionScore: Number,
      wardsPlaced: Number,
      wardsKilled: Number,
      visionWardsBoughtInGame: Number,
      totalHeal: Number,
      largestKillingSpree: Number,
      largestMultiKill: Number,
      timeCCingOthers: Number,
      firstBloodKill: Boolean,
      totalDamageDealtToChampions: Number,
      physicalDamageDealtToChampions: Number,
      magicDamageDealtToChampions: Number,
      trueDamageDealtToChampions: Number,
      totalDamageDealt: Number,
      physicalDamageDealt: Number,
      magicDamageDealt: Number,
      trueDamageDealt: Number,
      largestCriticalStrike: Number,
      damageDealtToObjectives: Number,
      damageDealtToTurrets: Number,
      totalDamageTaken: Number,
      physicalDamageTaken: Number,
      magicDamageTaken: Number,
      trueDamageTaken: Number,
      damageSelfMitigated: Number,
      goldEarned: Number,
      goldSpent: Number,
      totalMinionsKilled: Number,
      neutralMinionsKilled: Number,
      turretKills: Number,
      inhibitorKills: Number,
    },
  ],
  platformId: String,
  queueId: QueueSymbol,
  seasonId: Optional(Number),
  teams: [
    {
      teamId: Number,
      win: Boolean,
      bans: [
        {
          championId: Number,
          pickTurn: Number,
        },
      ],
      objectives: {
        baron: {
          first: Boolean,
          kills: Number,
        },
        champion: {
          first: Boolean,
          kills: Number,
        },
        dragon: {
          first: Boolean,
          kills: Number,
        },
        inhibitor: {
          first: Boolean,
          kills: Number,
        },
        riftHerald: {
          first: Boolean,
          kills: Number,
        },
        tower: {
          first: Boolean,
          kills: Number,
        },
      },
    },
  ],
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: {
    match: { info: model },
  },
});

function transform(data) {
  apiModelValidation(data);
  const match = data.data.match.info;
  if (match.gameType === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.custom].gql)
    match.queueId = QUEUE_SYMBOLS.custom;

  return match;
}

export default transform;
