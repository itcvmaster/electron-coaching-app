import createModel from "@/__main__/data-model.mjs";
import { model as OfficialMatchListModel } from "@/data-models/lol-match-list-official.mjs";

// TODO: Garena I think this mapping is incorrect
export const model = {
  id: String,
  playerMatches: [
    {
      accountId: String,
      matchStatsFromClient: {
        lp: Number,
        deltaLp: Number,
      },
    },
  ],
};

const apiModelValidation = createModel({
  data: {
    matches: [model],
  },
});

const afterTransformValidation = createModel([OfficialMatchListModel]);

function transform(data) {
  apiModelValidation(data);

  const matches = data.data.matches;
  const matchlist = matches.map(({ id, playerMatches }) => ({
    id,
    ...(playerMatches && {
      playerMatches: {
        ...playerMatches.matchStatsFromClient,
        ...playerMatches.playerMatchStats,
      },
    }),
  }));
  return afterTransformValidation(matchlist);
}

export default transform;
