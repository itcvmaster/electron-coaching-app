import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";

export const model = {
  [isRootModel]: true,
  id: String,
  userAccountId: String,
  retires: Number,
  postmatchReceived_at: String,
  prematchReceived_at: String,
  region: RegionSymbol,
  gameData: {
    league: {
      premadePuuids: [String],
    },
  },
};

const apiModelValidation = createModel({ data: model });

function transform(data) {
  apiModelValidation(data);
  return data.data;
}

export default transform;
