import createModel from "@/__main__/data-model.mjs";

export const model = {
  id: Number,
  key: String,
  icon: String,
  name: String,
  slots: [
    {
      runes: [
        {
          id: Number,
          key: String,
          icon: String,
          name: String,
          shortDesc: String,
          longDesc: String,
        },
      ],
    },
  ],
};

const apiModelValidation = createModel([model]);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
