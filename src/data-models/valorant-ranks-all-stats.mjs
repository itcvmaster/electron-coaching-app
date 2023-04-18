import createModel, { arbitraryKeys } from "@/__main__/data-model.mjs";

const weaponDamageInfo = {
  kills: Number,
  damage: Number,
  legshots: Number,
  bodyshots: Number,
  headshots: Number,
  roundsUsed: Number,
  altFireKills: Number,
  totalKillRange: Number,
};

const rank = {
  weaponDamageStats: { [arbitraryKeys]: weaponDamageInfo },
};

const model = {
  // unrated: rank,
  bronze: rank,
  diamond: rank,
  gold: rank,
  immortal: rank,
  iron: rank,
  platinum: rank,
  radiant: rank,
  silver: rank,
};

const transform = createModel(model);

export default transform;
