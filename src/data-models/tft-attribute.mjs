import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";

export const model = {
  [arbitraryKeys]: {
    key: String,
    name: String,
    description: String,
    bonuses: [
      {
        needed: Number,
        effect: String,
      },
    ],
  },
};

const transform = createModel(model);

export default transform;
