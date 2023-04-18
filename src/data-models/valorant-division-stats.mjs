import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

const DamageStatus = {
  bodyshots: Number,
  damage: Number,
  headshots: Number,
  legshots: Number,
};

const DuelStatus = {
  duelsLost: Number,
  duelsPlayed: Number,
  duelsWon: Number,
  duelsWonUsingHeadshots: Number,
  roundsWhereDuelsWon: Number,
  roundsWonWhenDuelsWon: Number,
};

const WeaponRanges = {
  altFireKills: Number,
  bodyshots: Number,
  damage: Number,
  headshots: Number,
  kills: Number,
  legshots: Number,
  roundsUsed: Number,
  totalKillRange: Number,
};

const WeaponDamageStatus = {
  altFireKills: Number,
  bodyshots: Number,
  damage: Number,
  headshots: Number,
  kills: Number,
  legshots: Number,
  roundsUsed: Number,
  totalKillRange: Number,
  ranges: Optional({
    "10-20": WeaponRanges,
    "20-40": WeaponRanges,
    "40-10000": WeaponRanges,
  }),
};

const SummaryWeaponDamageStatus = {
  attacking: { [arbitraryKeys]: WeaponDamageStatus },
  defending: { [arbitraryKeys]: WeaponDamageStatus },
};

const WeaponDuelStatus = {
  duelsLost: Number,
  duelsPlayed: Number,
  duelsWon: Number,
};

const SummaryWeaponDuelStatus = {
  attacking: { [arbitraryKeys]: WeaponDuelStatus },
  defending: { [arbitraryKeys]: WeaponDuelStatus },
};

const BloodAndDeathStatus = {
  firstBloods: Number,
  firstDeaths: Number,
  roundsLostWhenFirstDeath: Number,
  roundsWonWhenFirstBlood: Number,
};

const TradeStatus = {
  roundsWhereTradesWon: Number,
  roundsWonWhenTradesWon: Number,
  tradesDrawn: Number,
  tradesLost: Number,
  tradesPlayed: Number,
  tradesWon: Number,
};

const MapStatus = {
  attackingPlayed: Number,
  attackingWon: Number,
  damageStats: DamageStatus,
  damageStatsByAtkOrDef: {
    atk: DamageStatus,
    def: DamageStatus,
  },
  defendingPlayed: Number,
  defendingWon: Number,
  duelStats: {
    atk: DuelStatus,
    def: DuelStatus,
  },
  firstBloodAndDeathStats: {
    atk: BloodAndDeathStatus,
    def: BloodAndDeathStatus,
  },
  lastKills: Number,
  matches: Number,
  roundsPlayed: Number,
  roundsWon: Number,
  ties: Number,
  tradeStats: {
    atk: TradeStatus,
    def: TradeStatus,
  },
  weaponDamageStats: { [arbitraryKeys]: WeaponDamageStatus },
  wins: Number,
};

const Item = {
  abilityCasts: {
    ability1Casts: Number,
    ability2Casts: Number,
    grenadeCasts: Number,
    ultimateCasts: Number,
  },
  // agentsStats: { [arbitraryKeys]: Item },
  assists: Number,
  damageStats: DamageStatus,
  damageStatsByAtkOrDef: {
    atk: DamageStatus,
    def: DamageStatus,
  },
  deaths: Number,
  defuses: Number,
  duelStats: {
    atk: DuelStatus,
    def: DuelStatus,
    duelsLost: Number,
    duelsPlayed: Number,
    duelsWon: Number,
  },
  economy: Number,
  expandedWeaponDamageStats: {
    long: SummaryWeaponDamageStatus,
    medium: SummaryWeaponDamageStatus,
    short: SummaryWeaponDamageStatus,
    unknown: SummaryWeaponDamageStatus,
  },
  expandedWeaponDuelStats: {
    long: SummaryWeaponDuelStatus,
    medium: SummaryWeaponDuelStatus,
    short: SummaryWeaponDuelStatus,
    unknown: SummaryWeaponDuelStatus,
  },
  firstBloodAndDeathStats: BloodAndDeathStatus,
  firstBloodsGiven: Number,
  firstBloodsTaken: Number,
  kills: Number,
  lastKills: Number,
  mapStats: {
    ascent: MapStatus,
    bind: MapStatus,
    breeze: MapStatus,
    foxtrot: MapStatus,
    haven: MapStatus,
    port: MapStatus,
    split: MapStatus,
    triad: MapStatus,
  },
  matches: Number,
  pistolRoundWeaponDamageStats: { [arbitraryKeys]: WeaponDamageStatus },
  plants: Number,
  playtimeMillis: Number,
  roundsLostWhenFirstBloodGiven: Number,
  roundsPlayed: Number,
  roundsWon: Number,
  roundsWonWhenFirstBloodTaken: Number,
  score: Number,
  ties: Number,
  tradeStats: {
    atk: TradeStatus,
    def: TradeStatus,
  },
  weaponDamageStats: { [arbitraryKeys]: WeaponDamageStatus },
  weaponDuelStats: { [arbitraryKeys]: WeaponDuelStatus },
  weaponKDStats: {
    [arbitraryKeys]: { kills: Number, deaths: Number },
  },
  weaponStats: {
    [arbitraryKeys]: { kills: Number, totalRange: Number },
  },
  weaponTradeStats: { [arbitraryKeys]: WeaponDamageStatus },
  wins: Number,
};

Item.agentsStats = { [arbitraryKeys]: Object.assign({}, Item) };

const model = {
  unrated: Item,
  bronze: Item,
  diamond: Item,
  gold: Item,
  immortal: Item,
  iron: Item,
  platinum: Item,
  radiant: Item,
  silver: Item,
};

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
