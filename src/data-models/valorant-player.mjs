import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

const ExpandedWeaponDuelStats = {
  attacking: {
    [arbitraryKeys]: {
      duelsWon: Number,
      duelsLost: Number,
      duelsPlayed: Number,
    },
  },
  defending: {
    [arbitraryKeys]: {
      duelsWon: Number,
      duelsLost: Number,
      duelsPlayed: Number,
    },
  },
};

const ExpandedWeaponDamageStats = {
  attacking: {
    [arbitraryKeys]: {
      altFireKills: Number,
      bodyshots: Number,
      damage: Number,
      headshots: Number,
      kills: Number,
      legshots: Number,
      roundsUsed: Number,
    },
  },
  defending: {
    [arbitraryKeys]: {
      altFireKills: Number,
      bodyshots: Number,
      damage: Number,
      headshots: Number,
      kills: Number,
      legshots: Number,
      roundsUsed: Number,
    },
  },
};

const PlayerStatsDetailMapStats = {
  ties: Number,
  wins: Number,
  matches: Number,
  roundsWon: Number,
  attackingWon: Number,
  defendingWon: Number,
  roundsPlayed: Number,
  attackingPlayed: Number,
  defendingPlayed: Number,
};

export const AgentsStatsDetail = {
  ties: Number,
  wins: Number,
  kills: Number,
  score: Number,
  deaths: Number,
  plants: Number,
  assists: Number,
  defuses: Number,
  economy: Number,
  matches: Number,
  mapStats: {
    haven: PlayerStatsDetailMapStats,
    ascent: PlayerStatsDetailMapStats,
    bind: PlayerStatsDetailMapStats,
    split: PlayerStatsDetailMapStats,
    port: PlayerStatsDetailMapStats,
    breeze: PlayerStatsDetailMapStats,
  },
  duelStats: {
    duelsWon: Number,
    duelsLost: Number,
    duelsPlayed: Number,
  },
  lastKills: Number,
  roundsWon: Number,
  agentsStats: {
    [arbitraryKeys]: {},
  },
  damageStats: {
    damage: Number,
    legshots: Number,
    bodyshots: Number,
    headshots: Number,
  },
  weaponStats: {
    [arbitraryKeys]: {
      kills: Number,
      totalRange: Number,
    },
  },
  abilityCasts: {
    grenadeCasts: Number,
    ability1Casts: Number,
    ability2Casts: Number,
    ultimateCasts: Number,
  },
  roundsPlayed: Number,
  weaponKDStats: {
    [arbitraryKeys]: {
      kills: Number,
      deaths: Number,
    },
  },
  playtimeMillis: Number,
  firstBloodsGiven: Number,
  firstBloodsTaken: Number,
  weaponDamageStats: {
    [arbitraryKeys]: {
      kills: Number,
      damage: Number,
      legshots: Number,
      bodyshots: Number,
      headshots: Number,
      roundsUsed: Number,
      altFireKills: Number,
      totalKillRange: Number,
    },
  },
  expandedWeaponDuelStats: {
    long: ExpandedWeaponDuelStats,
    short: ExpandedWeaponDuelStats,
    medium: ExpandedWeaponDuelStats,
    unknown: ExpandedWeaponDuelStats,
  },
  expandedWeaponDamageStats: {
    long: ExpandedWeaponDamageStats,
    short: ExpandedWeaponDamageStats,
    medium: ExpandedWeaponDamageStats,
    unknown: ExpandedWeaponDamageStats,
  },
  pistolRoundWeaponDamageStats: {
    [arbitraryKeys]: {
      kills: Number,
      damage: Number,
      legshots: Number,
      bodyshots: Number,
      headshots: Number,
      roundsUsed: Number,
      altFireKills: Number,
      totalKillRange: Number,
    },
  },
  roundsWonWhenFirstBloodTaken: Number,
  roundsLostWhenFirstBloodGiven: Number,
};

const PlayerStatsDetail = AgentsStatsDetail;
PlayerStatsDetail.agentsStats = {
  [arbitraryKeys]: Object.assign({}, AgentsStatsDetail),
};

const PlayerSeasonStats = Optional({
  competitive: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  custom: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  deathmatch: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  ggteam: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  newmap: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  overall: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  snowball: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  spikerush: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
  unrated: {
    career: PlayerStatsDetail,
    last20: PlayerStatsDetail,
  },
});

const _playerStatsModel = createModel(PlayerSeasonStats);
export { _playerStatsModel as PlayerSeasonStats };

export const HeadshotNotification = createModel([
  Optional({
    avgHS: Number,
    changeInAvgHS: Number,
    matchId: String,
  }),
]);

// Valorant Player Profile Model from Valorant API
const model = {
  id: String,
  puuid: String,
  name: String,
  region: String,
  lastPlayed: String,
  rank: Number,
  rankedRating: Number,
  subject: String,
  createdAt: String,
  isPrivate: String,
  tag: String,
  ranks: {
    competitive: {
      tier: Number,
    },
  },
  seasonRanks: {
    [arbitraryKeys]: {
      nonPlacementMatchesPlayed: Number,
      nonPlacementMatchesWon: Number,
      totalMatchesPlayed: Number,
      topMatches: [
        {
          matchId: String,
          rank: Number,
          startedAt: String,
          won: Boolean,
        },
      ],
    },
  },
  stats: {
    all: PlayerSeasonStats,
    [arbitraryKeys]: PlayerSeasonStats,
  },
  updatedMPs: Boolean,
};

const transform = createModel(Optional(model));

export default transform;
