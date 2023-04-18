import createModel, { isRootModel, Optional } from "@/__main__/data-model.mjs";

export const model = createModel({
  matchid: String,
  createdAt: String,
  players: Optional([
    {
      augments: [
        {
          icon: String,
          id: Number,
          name: String,
        },
      ],
      boardPieces: [
        {
          icon: String,
          items: [
            {
              icon: String,
              id: Number,
              name: String,
            },
          ],
          level: Number,
          name: String,
          price: Number,
          traits: [
            {
              id: String,
              name: String,
            },
          ],
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
      partnerGroupId: Number,
      puuid: String,
      rank: Number,
      summonerId: Number,
      summonerName: String,
    },
  ]),
  data: Optional([
    {
      augments: [String],
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
          itemNames: Array,
          items: Array,
          name: String,
          rarity: Number,
          tier: Number,
        },
      ],
    },
  ]),
  length: Number,
  queueId: String,
  patch: String,
});

const matches = [model];
matches[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    probuilds: {
      matches,
    },
  },
});

function transform(data) {
  data = apiModelValidation(data);
  return data.data.probuilds.matches;
}

export default transform;
