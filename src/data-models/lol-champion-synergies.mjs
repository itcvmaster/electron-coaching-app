import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

const Champion = {
  games: Number,
  wins: Number,
};

export const model = {
  championId: Number,
  duoChampionId: Number,
  role: RoleSymbol,
  duoRole: RoleSymbol,
  wins: Number,
  games: Number,
  champion: Champion,
  duoChampion: Champion,
};

const allSynergies = [model];
allSynergies[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    allSynergies,
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.allSynergies;
}

export default transform;
