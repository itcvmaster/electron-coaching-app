import createModel from "@/__main__/data-model.mjs";
import { model as Items } from "@/data-models/tft-item.mjs";

const model = createModel({
  set1: Items,
  set2: Items,
  set3: Items,
  set4: Items,
  set4_5: Items,
  set5: Items,
  set5_5: Items,
  set6: Items,
  set6_5: Items,
});

function transform(data) {
  return model(data);
}

export default transform;
