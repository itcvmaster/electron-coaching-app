import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";

function format(data) {
  return (data?.data?.seasons || []).reduce((arr, curr, i) => {
    arr[i] = curr.name;
    return arr;
  }, {});
}

export const model = { name: String };

const apiModelValidation = createModel({ data: { seasons: [model] } });

const afterTransformModel = {
  [arbitraryKeys]: String,
};
const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  apiModelValidation(data);
  const seasons = format(data);
  return afterTransformValidation(seasons);
}

export default transform;
