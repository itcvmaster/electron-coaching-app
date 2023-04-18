import createModel from "@/__main__/data-model.mjs";

const model = {
  id: String,
  timestamp: Number,
  isWinner: Boolean,
};

const transform = createModel(model);

export default transform;
