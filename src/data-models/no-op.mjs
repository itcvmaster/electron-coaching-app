import createModel from "@/__main__/data-model.mjs";

// This exists mainly for graphql where the schema is defined already
// in the query.
const model = createModel({});

export default model;

export function modelPath(path) {
  return (data) => {
    data = model(data);

    let target = data;

    for (const key of path) {
      if (!(key in target)) return null;
      target = target[key];
    }

    // Copying internals is needed because the model has no definitions.
    for (const symbol of Object.getOwnPropertySymbols(data)) {
      target[symbol] = data[symbol];
    }

    return target;
  };
}
