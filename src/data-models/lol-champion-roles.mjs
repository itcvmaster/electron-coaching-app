import createModel, {
  arbitraryKeys,
  isRootModel,
} from "@/__main__/data-model.mjs";

export const model = {
  championId: Number,
  role: String,
  rolePercentage: Number,
};

const allChampionStats = [model];
allChampionStats[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    allChampionStats,
  },
});

const afterTransformModel = {
  [arbitraryKeys]: [
    {
      championId: Number,
      role: String,
      rolePercentage: Number,
    },
  ],
};

const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  apiModelValidation(data);

  const championReport = data.data.allChampionStats.reduce((acc, curr) => {
    const { championId } = curr;

    if (!acc[championId]) acc[championId] = [];
    acc[championId] = [...acc[championId], curr];

    return acc;
  }, {});

  return afterTransformValidation(championReport);
}

export default transform;
