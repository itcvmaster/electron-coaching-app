import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

const matches = [
  {
    id: String,
    playerMatch: Optional({
      id: String,
      playerMatchStats: {
        lp: Number,
        deltaLp: Number,
      },
    }),
  },
];
matches[isRootModel] = true;

export const model = {
  matches,
};

const apiModelValidation = createModel({
  data: {
    matchlist: model,
  },
});

// Extract the matchlist.
function transform(data) {
  apiModelValidation(data);
  return data.data.matchlist.matches;
}

export default transform;
