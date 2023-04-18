import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import RoleSymbol from "@/game-lol/symbol-role.mjs";

export const model = {
  accountId: String,
  assists: Number,
  boots: [{ id: String }],
  buildPaths: [{ id: String, itemId: Number, timestamp: Number }],
  champion: Number,
  deaths: Number,
  encryptedAccountId: String,
  gameDuration: Number,
  gold: Number,
  id: String,
  insertedAt: String,
  items: [{ id: String }],
  kills: Number,
  lane: String,
  opponentChampion: Number,
  patch: String,
  player: {
    id: String,
    accounts: [String],
    insertedAt: String,
    name: String,
    portraitImageUrl: String,
    profileImageUrl: String,
    realName: String,
    region: String,
    slug: String,
    team: {
      id: String,
      insertedAt: String,
      name: String,
      pictureUrl: String,
      region: String,
      tag: String,
      updatedAt: String,
    },
    teamId: String,
    updatedAt: String,
  },
  playerId: String,
  region: String,
  role: RoleSymbol,
  runePrimaryTree: Number,
  runeSecondaryTree: Number,
  runeShards: [Number],
  runes: [{ id: String }],
  skillOrder: [
    {
      id: String,
      skillSlot: Number,
      timestamp: Number,
    },
  ],
  spells: [{ ids: [String] }],
  timestamp: String,
  updatedAt: String,
  win: Boolean,
};

const probuildMatches = [model];
probuildMatches[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    probuildMatches,
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.probuildMatches;
}

export default transform;
