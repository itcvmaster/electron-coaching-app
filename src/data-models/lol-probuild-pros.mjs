import createModel, { Any, isRootModel } from "@/__main__/data-model.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";

export const model = {
  accounts: [String],
  encryptedAccounts: [String],
  fame: Number,
  id: String,
  insertedAt: String,
  name: String,
  portraitImageUrl: String,
  profileImageUrl: String,
  realName: String,
  region: RegionSymbol,
  slug: String,
  teamId: String,
  updatedAt: String,
  liveSpectator: Any,
};

const probuildPlayers = [model];
probuildPlayers[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    probuildPlayers,
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.probuildPlayers;
}

export default transform;
