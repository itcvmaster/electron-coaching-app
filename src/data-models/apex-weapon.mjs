import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";

export const model = {
  apexId: String,
  imageUrl: String,
  name: String,
};

const apiModelValidation = createModel({ data: { apexWeapons: [model] } });

const afterTransformModel = {
  [arbitraryKeys]: {
    apexId: String,
    imageUrl: String,
    name: String,
    hitsPerShot: Optional(Number),
  },
};
const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  apiModelValidation(data);
  const keyedWeapons = (data?.data?.apexWeapons || []).reduce((obj, w) => {
    obj[w.apexId] = w;
    switch (w.apexId) {
      case "said00107352658":
        obj[w.apexId].hitsPerShot = 16;
        break;
      case "said01603172346":
      case "said00945439943":
        obj[w.apexId].hitsPerShot = 3;
        break;
      case "said00418361060":
        obj[w.apexId].hitsPerShot = 8;
        break;
      case "said01928357643":
        obj[w.apexId].hitsPerShot = 9;
        break;
      case "said01388774763":
        obj[w.apexId].hitsPerShot = 11;
        break;
      default:
        obj[w.apexId].hitsPerShot = 1;
        break;
    }
    return obj;
  }, {});
  afterTransformValidation(keyedWeapons);
  return keyedWeapons;
}

export default transform;
