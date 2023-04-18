import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

const model = {
  name: String,
  region: String,
  puuid: String,
  accountid: String,
  profileiconid: String,
  leagues: Optional([
    {
      leagueId: String,
      queueType: String,
      tier: String,
      rank: String,
      summonerId: String,
      summonerName: String,
      leaguePoints: Number,
      wins: Number,
      losses: Number,
      veteran: Boolean,
      inactive: Boolean,
      freshBlood: Boolean,
      hotStreak: Boolean,
    },
  ]),
  summonerlevel: Number,
};

const summoners = [model];
summoners[isRootModel] = true;

const validation = createModel({
  data: {
    probuilds: {
      summoners,
    },
  },
});

function transform(data) {
  data = validation(data);
  return data.data.probuilds.summoners;
}

export default transform;
