import createModel, {
  Any,
  arbitraryKeys,
  isRootModel,
} from "@/__main__/data-model.mjs";

const Summoner = {
  key: String,
  name: String,
  description: String,
  summonerLevel: Number,
  range: Number,
  modes: Array(String),
  cooldown: Number,
  tooltip: String,
  effect: Any,
  effectBurn: Any,
  vars: [],
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

const model = {
  [arbitraryKeys]: Summoner,
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: model,
});

function transform(data) {
  apiModelValidation(data);
  return data.data;
}

export default transform;
