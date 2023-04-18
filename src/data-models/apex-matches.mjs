import createModel, {
  Any,
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

const model = Optional([{ [arbitraryKeys]: Any }]);

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
