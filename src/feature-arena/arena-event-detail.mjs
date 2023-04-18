import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";
import { SymbolGame } from "@/app/symbol-game.mjs";

export const event = {
  id: String,
  totalPrizePool: Optional(Number),
  startAt: Date,
  endAt: Date,
  topGames: Number,
  participantCount: Number,
  displayName: String,
  title: String,
  eventPageHeaderImg: String,
  hubFeaturedImg: String,
  gameLimit: Number,
  featuredInHub: Boolean,
  game: SymbolGame,
  regions: [String],
  optedIn: Optional(Boolean),
};

const eventDetails = {
  optIn: Optional({
    gameCount: Number,
    gameAccountId: String,
    userAccountId: String,
  }),
  rewards: [
    {
      minRank: Number,
      maxRank: Number,
      details: {
        amount: Number,
        type: String,
      },
    },
  ],
  missions: [
    {
      blitzPointValue: Number,
      description: String,
      index: Number,
      title: String,
    },
  ],
  leaderboard: [
    {
      rank: Number,
      score: Number,
      missionCompletions: Number,
      leagueProfile: Optional({
        profileIconId: Number,
        region: String,
        summonerName: String,
        accountId: String,
      }),
    },
  ],
  nativeAdUnit: {
    adImg: String,
    adText: String,
    brandName: String,
    callToActionUrl: String,
    logoImg: String,
  },
};

export const model = { ...event, ...eventDetails };
model[isRootModel] = true;

const apiModelValidation = createModel({ data: { event: model } });

function transform(data) {
  data = apiModelValidation(data);
  return data.data.event;
}

export default transform;
