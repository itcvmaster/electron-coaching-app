import createModel, {
  arbitraryKeys,
  isRootModel,
  Optional,
} from "@/__main__/data-model.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";
import { SkipGraphQLSerialization } from "@/util/graphql-query.mjs";

const League = {
  freshBlood: Boolean,
  hotStreak: Boolean,
  inactive: Boolean,
  leagueId: String,
  leaguePoints: Number,
  losses: Number,
  queueType: String,
  rank: String,
  summonerId: String,
  summonerName: String,
  tier: String,
  veteran: Boolean,
  wins: Number,
  [SkipGraphQLSerialization]: true,
};

const Item = {
  games: Number,
  rankSum: Number,
};

const Status = {
  [SkipGraphQLSerialization]: true,
  agg: { [arbitraryKeys]: Item },
  avgRank: Number,
  placements: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number,
    7: Number,
    8: Number,
  },
  recentTraitsAgg: { [arbitraryKeys]: Item },
  recentUnitsAgg: { [arbitraryKeys]: Item },
  top4: Number,
  total: Number,
  traitsAgg: { [arbitraryKeys]: Item },
  unitsAgg: { [arbitraryKeys]: Item },
};

export const model = {
  accountid: String,
  leagues: Optional([League]),
  matchids: [String],
  name: String,
  profileiconid: String,
  puuid: String,
  region: RegionSymbol,
  revisiondate: String,
  stats: Status,
  summonerlevel: Number,
  [isRootModel]: true,
};

const apiModelValidation = createModel({ data: { s: Optional(model) } });

// Extract the profile.
function transform(data) {
  apiModelValidation(data);
  const profile = data.data.s;
  for (const symbol of Object.getOwnPropertySymbols(data)) {
    profile[symbol] = data[symbol];
  }
  return profile;
}

export default transform;
