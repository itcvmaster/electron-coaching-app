import createModel, { Any, arbitraryKeys } from "@/__main__/data-model.mjs";

const Gold = {
  base: Number,
  total: Number,
  sell: Number,
  purchasable: Boolean,
};

const Item = {
  id: String,
  name: String,
  description: String,
  stats: {},
  maps: [Any],
  gold: Gold,
  mythic: Boolean,
};

const model = {
  [arbitraryKeys]: Item,
};

const apiModelValidation = createModel({ data: model });

function transform(data) {
  apiModelValidation(data);

  const items = data.data;
  return items;
}

export default transform;
