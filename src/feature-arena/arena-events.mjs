import createModel, { isRootModel } from "@/__main__/data-model.mjs";
import { event } from "@/feature-arena/arena-event-detail.mjs";

export const model = event;

const events = [model];
events[isRootModel] = true;

const apiModelValidation = createModel({ data: { events } });

function transform(data) {
  data = apiModelValidation(data);
  return data.data.events;
}

export default transform;
