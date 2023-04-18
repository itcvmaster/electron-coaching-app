import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";
import { model as Set } from "@/data-models/tft-set.mjs";

const Champion = {
  id: String,
  key: String,
  name: String,
  set1: Set,
  set2: Set,
  set3: Set,
  set4: Set,
  set4_5: Set,
  set5: Set,
  set5_5: Set,
  set6: Set,
  set6_5: Set,
};

const model = createModel({
  [arbitraryKeys]: Champion,
});

function transform(data) {
  return model(data);
}

export default transform;
