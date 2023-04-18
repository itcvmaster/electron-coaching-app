import createModel, { isRootModel } from "@/__main__/data-model.mjs";

const model = { id: String };
const matches = [model];
matches[isRootModel] = true;

const transform = createModel({ matches });

export const fixture = {
  matches: new Array(50).fill().map((_, i) => {
    return {
      id: `${i}`,
    };
  }),
};

export default transform;
