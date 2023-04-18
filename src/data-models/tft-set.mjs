import createModel from "@/__main__/data-model.mjs";

export const model = {
  origin: [String],
  class: [String],
  cost: Number,
  ability: {
    name: String,
    description: String,
    type: String,
    manaCost: Number,
    manaStart: Number,
    stats: [
      {
        type: String,
        value: String,
      },
    ],
  },
  stats: {
    offense: {
      damage: Number,
      attackSpeed: Number,
      range: Number,
    },
    defense: {
      health: Number,
      armor: Number,
      magicResist: Number,
    },
  },
};

const transform = createModel(model);

export default transform;
