import createModel from "@/__main__/data-model.mjs";

export const model = {
  countryCode: String,
  eventId: Number,
  game: String,
  gameAccountId: String,
  gameCount: Number,
  puuid: String,
  region: String,
  userAccountId: Number,
};

const apiModelValidation = createModel({ data: { challegeOptIn: model } });

function transform(data) {
  apiModelValidation(data);
  return data.data.challegeOptIn;
}

export default transform;
