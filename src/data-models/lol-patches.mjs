import createModel, { isRootModel } from "@/__main__/data-model.mjs";

export const model = {
  majorVersion: Number,
  minorVersion: Number,
  versionString: String,
};

const patches = [model];
patches[isRootModel] = true;

const apiModelValidation = createModel({
  data: {
    patches,
  },
});

function transform(data) {
  data = apiModelValidation(data);
  return data.data.patches;
}

export default transform;
