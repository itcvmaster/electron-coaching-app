import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";

export const model = {
  apexId: String,
  imageUrl: String,
  name: String,
  modelNames: [String],
};

// const apiModelValidation = createModel({ data: { apexChampions: [model] } });

const afterTransformModel = {
  [arbitraryKeys]: {
    apexId: String,
    imageUrl: String,
    name: String,
    modelNames: [String],
  },
};

const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  // apiModelValidation(data);
  return afterTransformValidation(data);
}

export default transform;
