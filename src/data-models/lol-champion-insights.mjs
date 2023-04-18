import createModel, { isRootModel } from "@/__main__/data-model.mjs";

export const model = {
  tips: {
    weaknesses: [
      {
        localizedInsights: [
          {
            language: String,
            translation: String,
          },
        ],
        value: String,
      },
    ],
    strengths: [
      {
        localizedInsights: [
          {
            language: String,
            translation: String,
          },
        ],
        value: String,
      },
    ],
    insights: [
      {
        localizedInsights: [
          {
            language: String,
            translation: String,
          },
        ],
        value: String,
      },
    ],
  },
  lastUpdatedPatch: String,
  championId: Number,
};

const championInsights = [model];
championInsights[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    championInsights,
  },
});

function transform(data) {
  apiModelValidation(data);

  const championInsights = data.data.championInsights;
  return championInsights;
}

export default transform;
