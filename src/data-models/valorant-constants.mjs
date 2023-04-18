import createModel from "@/__main__/data-model.mjs";

const model = {
  version: String,
  acts: [
    {
      id: String,
      isActive: Boolean,
      name: String,
      parentId: String,
      type: String,
    },
  ],
  agents: [
    {
      name: String,
      id: String,
    },
  ],
  maps: [
    {
      id: String,
      key: String,
      name: String,
    },
  ],
  weapons: [
    {
      name: String,
      id: String,
    },
  ],
};

const transform = createModel(model);

export default transform;
