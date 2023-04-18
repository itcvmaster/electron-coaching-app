import createModel, { isRootModel } from "@/__main__/data-model.mjs";

const model = {
  primaryRole: String,
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: model,
});

function transform(data) {
  apiModelValidation(data);
  return data.data;
}

export default transform;
