import createModel, { Any, arbitraryKeys } from "@/__main__/data-model.mjs";

const model = { [arbitraryKeys]: Any };

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
