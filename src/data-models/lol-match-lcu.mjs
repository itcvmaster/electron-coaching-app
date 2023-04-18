import createModel from "@/__main__/data-model.mjs";
import { model as lolMatchModel } from "@/data-models/lol-match.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

const apiModelValidation = createModel({
  gameId: Number,
  gameCreation: Number,
  gameDuration: Number,
  gameMode: String,
  gameType: String,
  gameVersion: String,
  mapId: Number,
  participantIdentities: [
    {
      participantId: Number,
      player: {
        profileIcon: Number,
        summonerId: String,
        summonerName: String,
      },
    },
  ],
  participants: [
    {
      participantId: Number,
      championId: Number,
      highestAchievedSeasonTier: String,
      spell1Id: Number,
      spell2Id: Number,
      teamId: Number,
      win: Boolean,
      stats: {
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
        // Perks
        perk0: Number,
        perk0Var1: Number,
        perk0Var2: Number,
        perk0Var3: Number,
        perk1: Number,
        perk1Var1: Number,
        perk1Var2: Number,
        perk1Var3: Number,
        perk2: Number,
        perk2Var1: Number,
        perk2Var2: Number,
        perk2Var3: Number,
        perk3: Number,
        perk3Var1: Number,
        perk3Var2: Number,
        perk3Var3: Number,
        perk4: Number,
        perk4Var1: Number,
        perk4Var2: Number,
        perk4Var3: Number,
        perk5: Number,
        perk5Var1: Number,
        perk5Var2: Number,
        perk5Var3: Number,
        perkPrimaryStyle: Number,
        perkSubStyle: Number,
        statPerk0: Number,
        statPerk1: Number,
        statPerk2: Number,
      },
      timeline: {
        role: RoleSymbol,
        lane: String,
      },
    },
  ],
  platformId: String,
  queueId: QueueSymbol,
  seasonId: Number,
  teams: [
    {
      teamId: Number,
      win: String,
      bans: [
        {
          championId: Number,
          pickTurn: Number,
        },
      ],
      firstBaron: Boolean,
      baronKills: Number,
      firstDragon: Boolean,
      dragonKills: Number,
      firstInhibitor: Boolean,
      inhibitorKills: Number,
      firstRiftHerald: Boolean,
      riftHeraldKills: Number,
      firstTower: Boolean,
      towerKills: Number,
      firstBlood: Boolean,
    },
  ],
});

function mapLCUPerks(source) {
  return {
    statPerks: {
      offense: source.statPerk0,
      flex: source.statPerk1,
      defense: source.statPerk2,
    },
    styles: [
      {
        style: source.perkPrimaryStyle,
        description: "primaryStyle",
        selections: [
          {
            perk: source.perk0,
            var1: source.perk0Var1,
            var2: source.perk0Var2,
            var3: source.perk0Var3,
          },
          {
            perk: source.perk1,
            var1: source.perk1Var1,
            var2: source.perk1Var2,
            var3: source.perk1Var3,
          },
          {
            perk: source.perk2,
            var1: source.perk2Var1,
            var2: source.perk2Var2,
            var3: source.perk2Var3,
          },
          {
            perk: source.perk3,
            var1: source.perk3Var1,
            var2: source.perk3Var2,
            var3: source.perk3Var3,
          },
        ],
      },
      {
        style: source.perkSubStyle,
        description: "subStyle",
        selections: [
          {
            perk: source.perk4,
            var1: source.perk4Var1,
            var2: source.perk4Var2,
            var3: source.perk4Var3,
          },
          {
            perk: source.perk5,
            var1: source.perk5Var1,
            var2: source.perk5Var2,
            var3: source.perk5Var3,
          },
        ],
      },
    ],
  };
}

function mapLCUParticipant(source, participantIdentiy) {
  const { stats, timeline } = source;
  return {
    participantId: source.participantId,
    summonerId: participantIdentiy.player.summonerId,
    summonerName: participantIdentiy.player.summonerName,
    profileIcon: participantIdentiy.player.profileIcon,
    championId: source.championId,
    role: timeline.role,
    summoner1Id: source.spell1Id,
    summoner2Id: source.spell2Id,
    teamId: source.teamId,
    teamPosition: timeline.lane,
    win: source.win,
    perks: mapLCUPerks(stats),
    ...stats, // Stat names *should* be 1:1 with our names
  };
}

function mapLCUTeam(source, championKillCount) {
  return {
    teamId: source.teamId,
    win: source.win === "Win",
    bans: source.bans,
    objectives: {
      baron: {
        first: source.firstBaron,
        kills: source.baronKills,
      },
      champion: {
        first: source.firstBlood,
        kills: championKillCount,
      },
      dragon: {
        first: source.firstDargon, // [sic]
        kills: source.dragonKills,
      },
      inhibitor: {
        first: source.firstInhibitor,
        kills: source.inhibitorKills,
      },
      riftHerald: {
        first: source.firstRiftHerald,
        kills: source.riftHeraldKills,
      },
      tower: {
        first: source.firstTower,
        kills: source.towerKills,
      },
    },
  };
}

const afterTransformValidation = createModel(lolMatchModel);

function transform(data) {
  apiModelValidation(data);

  const { participantIdentities, participants } = data;
  const killsByTeamId = participants.reduce((acc, { teamId, stats }) => {
    if (!acc[teamId]) acc[teamId] = 0;
    acc[teamId] += stats.kills;
    return acc;
  }, {});
  return afterTransformValidation({
    ...data,
    lcuData: true,
    gameId: data.gameId,
    gameCreation: data.gameCreation,
    gameDuration: data.gameDuration,
    gameMode: data.gameMode,
    gameType: data.gameType,
    gameVersion: data.gameVersion,
    mapId: data.mapId,
    participants: participants.map((participant) =>
      mapLCUParticipant(
        participant,
        participantIdentities.find(
          (ident) => ident.participantId === participant.participantId
        )
      )
    ),
    platformId: data.platformId,
    queueId: data.queueId,
    seasonId: data.seasonId,
    teams: data.teams.map((team) =>
      mapLCUTeam(team, killsByTeamId[team.teamId])
    ),
  });
}

export default transform;
