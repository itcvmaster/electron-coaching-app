import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";

const Stats = {
  hp: Number,
  hpperlevel: Number,
  mp: Number,
  mpperlevel: Number,
  movespeed: Number,
  armor: Number,
  armorperlevel: Number,
  spellblock: Number,
  spellblockperlevel: Number,
  attackrange: Number,
  hpregen: Number,
  hpregenperlevel: Number,
  mpregen: Number,
  mpregenperlevel: Number,
  crit: Number,
  critperlevel: Number,
  attackdamage: Number,
  attackdamageperlevel: Number,
  attackspeedperlevel: Number,
  attackspeed: Number,
};

const Spell = {
  name: String,
  description: String,
  image: {
    full: String,
    sprite: String,
    group: String,
    x: Number,
    y: Number,
    w: Number,
    h: Number,
  },
};

const Champion = {
  key: String,
  name: String,
  stats: Stats,
  spells: Array(Spell),
  tips: {
    ally: [String],
    enemy: [String],
  },
};

const afterTransformModel = {
  [arbitraryKeys]: Champion,
  keys: {
    [arbitraryKeys]: String,
  },
};

const apiModelValidation = createModel({
  data: {
    [arbitraryKeys]: Champion,
  },
  keys: {
    [arbitraryKeys]: String,
  },
});

const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  apiModelValidation(data);

  const champions = data.data;
  champions["keys"] = data.keys;
  return afterTransformValidation(champions);
}

export default transform;
