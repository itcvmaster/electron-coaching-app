import createModel from "@/__main__/data-model.mjs";

const model = createModel([
  {
    contentId: String,
    loadoutsIcon: String,
  },
]);

function transform(data) {
  return model(data);
}

export default transform;
