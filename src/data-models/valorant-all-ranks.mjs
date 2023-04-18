import createModel from "@/__main__/data-model.mjs";
import { AgentsStatsDetail } from "@/data-models/valorant-player.mjs";

const model = {
  bronze: AgentsStatsDetail,
  diamond: AgentsStatsDetail,
  gold: AgentsStatsDetail,
  immortal: AgentsStatsDetail,
  iron: AgentsStatsDetail,
  platinum: AgentsStatsDetail,
  radiant: AgentsStatsDetail,
  silver: AgentsStatsDetail,
};

const apiModelValidation = createModel(model);

function transform(data) {
  return apiModelValidation(data);
}

export default transform;
