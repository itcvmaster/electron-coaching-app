import createModel, { Optional } from "@/__main__/data-model.mjs";

const Weapon = {
  alt: {
    kind: String,
    rate: String,
    video: String,
  },
  cost: Optional(Number),
  damage: [
    {
      body: Optional(Number),
      head: Optional(Number),
      leg: Optional(Number),
      range: String,
    },
  ],
  damageCaveat: String,
  images: {
    model: String,
  },
  key: String,
  magazine: Number,
  name: String,
  pelletCount: String,
  penetration: String,
  primary: {
    kind: String,
    rate: String,
    video: String,
  },
  type: String,
  _id: Number,
};

const model = {
  Heavy: [Weapon],
  Rifles: [Weapon],
  SMGs: [Weapon],
  Shotguns: [Weapon],
  Sidearms: [Weapon],
  Snipers: [Weapon],
};

const transform = createModel(model);

export default transform;
