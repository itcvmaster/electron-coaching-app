import createModel from "@/__main__/data-model.mjs";

const model = { name: String };

const transform = createModel(model);

export const fixture = {
  name: "Deli Meats",
  icon: "",
};

export default transform;
