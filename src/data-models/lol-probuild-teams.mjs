import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import RegionSymbol from "@/game-lol/symbol-region.mjs";

export const model = {
  id: String,
  name: String,
  pictureUrl: String,
  region: RegionSymbol,
  tag: String,
  players: [
    {
      id: String,
      name: String,
    },
  ],
};

const probuildTeams = [model];
probuildTeams[isRootModel] = true;

const apiModelValidation = createModel({
  data: { probuildTeams },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.probuildTeams;
}

export default transform;
