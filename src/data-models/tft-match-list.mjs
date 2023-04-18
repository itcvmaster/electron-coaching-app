import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";
import { SkipGraphQLSerialization } from "@/util/graphql-query.mjs";

const Item = {
  [SkipGraphQLSerialization]: true,
  companion: {
    content_ID: String,
    skin_ID: Number,
    species: String,
  },
  gold_left: Number,
  last_round: Number,
  level: Number,
  placement: Number,
  players_eliminated: Number,
  puuid: String,
  time_eliminated: Number,
  total_damage_to_players: Number,
  traits: [
    {
      name: String,
      num_units: Number,
      style: Number,
      tier_current: Number,
      tier_total: Number,
    },
  ],
  units: [
    {
      character_id: String,
      items: [Number],
      name: String,
      rarity: Number,
      tier: Number,
    },
  ],
};

const Player = {
  [SkipGraphQLSerialization]: true,
  boardPieces: [
    {
      icon: String,
      level: Number,
      name: String,
      price: Number,
    },
  ],
  companion: {
    colorName: String,
    icon: String,
    speciesName: String,
  },
  ffaStanding: Number,
  health: Number,
  iconId: Number,
  isLocalPlayer: Boolean,
  puuid: String,
  rank: Number,
  summonerId: Number,
  summonerName: String,
};

export const model = {
  createdAt: String,
  data: [Item],
  length: Number,
  matchid: String,
  players: Optional([Player]),
  queueId: String,
};

const ms = [model];
ms[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    ms: [model],
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.ms;
}

export default transform;
