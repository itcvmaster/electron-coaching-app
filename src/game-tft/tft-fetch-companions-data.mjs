import getData from "@/__main__/get-data.mjs";
import TftCompanions from "@/data-models/tft-companions.mjs";
import * as API from "@/game-tft/api.mjs";

function fetchData() {
  return getData(API.getCompanions(), TftCompanions, ["tft", "companions"]);
}

export default fetchData;
