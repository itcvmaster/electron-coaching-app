import createModel from "@/__main__/data-model.mjs";
import { model as Stats } from "@/data-models/tft-attribute.mjs";

const model = createModel({
  set1: Stats,
  set2: Stats,
  set3: Stats,
  set4: Stats,
  set4_5: Stats,
  set5: Stats,
  set5_5: Stats,
  set6: Stats,
  set6_5: Stats,
});

function transform(data) {
  return model(data);
}

export default transform;
