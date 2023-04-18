import createModel from "@/__main__/data-model.mjs";
import { model as lolMatchListModel } from "@/data-models/lol-match-list-official.mjs";

// This is what the LCU gives us, we need to transform it to match LoL match list (official).
export const apiModelValidation = createModel({
  games: {
    games: [
      {
        gameId: Number,
        platformId: String,
      },
    ],
  },
});

const afterTransformValidation = createModel([lolMatchListModel]);

function transform(data) {
  apiModelValidation(data);

  const matchlist = data.games.games;
  for (const entry of matchlist) {
    const { gameId, platformId } = entry;
    for (const key in entry) {
      delete entry[key];
    }
    // IDs from the external endpoint come in this format.
    entry.id = `${platformId}_${gameId}`;
  }
  return afterTransformValidation(matchlist);
}

export default transform;
