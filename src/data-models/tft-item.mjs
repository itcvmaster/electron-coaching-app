import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

export const model = Optional({
  [arbitraryKeys]: {
    bonus: Optional(String),
    buildsFrom: Optional([String]),
    depth: Optional(Number),
    id: Optional(Number),
    key: String,
    kind: String,
    name: String,
    tier: Optional(Number),
    type: String,
  },
});

const transform = createModel(model);

export default transform;
