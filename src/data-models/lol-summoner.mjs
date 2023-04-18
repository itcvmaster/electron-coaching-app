import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RankSymbol from "@/game-lol/symbol-rank.mjs";

const RankObject = {
  queue: QueueSymbol,
  tier: RankSymbol,
  rank: String,
  wins: Number,
  losses: Number,
  leaguePoints: Number,
  insertedAt: Date,
};

export const model = {
  id: String,
  accountId: String,
  puuid: String,
  summonerId: String,
  summonerName: String,
  summonerLevel: Number,
  profileIconId: Number,
  updatedAt: String,
  latestRanks: Optional([RankObject]), // latestRanks should be used for latest ranks in api-regions
  // querying "ranks" will be deprecated in favor of "latestRanks" (it will work for all regions)
  // ranks: Optional([RankObject]),
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: { leagueProfile: model },
});

function transform(data) {
  apiModelValidation(data);
  const profile = data.data.leagueProfile;
  profile.latestRanks = profile.latestRanks ?? profile.ranks;
  return profile;
}

export default transform;
