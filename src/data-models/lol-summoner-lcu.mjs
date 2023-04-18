import createModel from "@/__main__/data-model.mjs";
import { model as lolSummonerModel } from "@/data-models/lol-summoner.mjs";
import QueueSymbol from "@/game-lol/symbol-queue.mjs";
import RankSymbol from "@/game-lol/symbol-rank.mjs";

const apiModelValidation = createModel({
  summoner: {
    accountId: String,
    puuid: String,
    summonerId: String,
    summonerLevel: Number,
    internalName: String,
    profileIconId: Number,
  },
  rankedStats: {
    queues: [
      {
        queueType: QueueSymbol,
        tier: RankSymbol,
        division: String,
        wins: Number,
        losses: Number,
        leaguePoints: Number,
      },
    ],
  },
});

const afterTransformValidation = createModel(lolSummonerModel);

function transform(data) {
  apiModelValidation(data);

  const { summoner, rankedStats } = data;
  delete data.summoner;
  delete data.rankedStats;

  const latestRanks = rankedStats.queues
    .filter((queue) => queue.division !== "NA")
    .map((queue) => ({
      queue: queue.queueType,
      tier: queue.tier,
      rank: queue.rank,
      wins: queue.wins,
      losses: queue.losses,
      leaguePoints: queue.leaguePoints,
    }));

  return afterTransformValidation({
    ...data,
    lcuData: true,
    accountId: summoner.accountId,
    puuid: summoner.puuid,
    summonerId: summoner.summonerId,
    summonerName: summoner.internalName,
    summonerLevel: summoner.summonerLevel,
    profileIconId: summoner.profileIconId,
    latestRanks,
  });
}

export default transform;
