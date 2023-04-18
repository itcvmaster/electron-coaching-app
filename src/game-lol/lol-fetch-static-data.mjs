import getData from "@/__main__/get-data.mjs";
import { getRitoLanguageCodeFromBCP47 } from "@/app/util.mjs";
import LoLChampions from "@/data-models/lol-champions.mjs";
import LoLItems from "@/data-models/lol-items.mjs";
import LolPatches from "@/data-models/lol-patches.mjs";
import LoLRunes from "@/data-models/lol-runes.mjs";
import LoLSeason from "@/data-models/lol-seasons.mjs";
import LoLSpells from "@/data-models/lol-spells.mjs";
import { updateRuneDetails } from "@/game-lol/actions.mjs";
import * as API from "@/game-lol/api.mjs";
import { getMatchups, getSynergies } from "@/game-lol/in-game-external-api.mjs";
import {
  getCurrentPatchForStaticData,
  getStaticData,
} from "@/game-lol/util.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const PATCH_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
let patchesFetchedAt = null;

async function fetchData() {
  const shouldFetchAfterDuration =
    !patchesFetchedAt || Date.now() - patchesFetchedAt > PATCH_TIMEOUT;
  if (shouldFetchAfterDuration) {
    patchesFetchedAt = Date.now();
  }

  // Need to block on getting patches first.
  await Promise.all([
    getData(API.getPatches(), LolPatches, ["lol", "patches"], {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
    }),
  ]);

  // Get LoL static data.
  const patch = getCurrentPatchForStaticData();
  const lang = getLocale();
  const ritoLanguageCode = getRitoLanguageCodeFromBCP47(lang);

  await Promise.all([
    ...[
      ["spells", LoLSpells],
      ["runes", LoLRunes],
      ["champions", LoLChampions],
      ["items", LoLItems],
    ].map(([key, model]) => {
      const writeStatePath = [
        "lol",
        "staticData",
        ritoLanguageCode,
        patch,
        key,
      ];
      return getData(API.getStaticData(patch, key), model, writeStatePath);
    }),

    getData(API.getSeasons(), LoLSeason, ["lol", "seasons"], {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
    }),
  ]);

  // Make runes details from runes to make it easy to use.
  try {
    getStaticData("runeDetails");
  } catch (e) {
    const runes = getStaticData("runes");
    const runeDetails = {};
    for (const group of runes) {
      for (const slot of group.slots) {
        for (const rune of slot.runes) {
          runeDetails[rune.id] = rune.longDesc;
        }
      }
    }

    updateRuneDetails(patch, runeDetails);
  }

  Promise.all([getMatchups(), getSynergies()]);
}

export default fetchData;
