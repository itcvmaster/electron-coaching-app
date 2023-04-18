import getData from "@/__main__/get-data.mjs";
import { persistData } from "@/app/util.mjs";
import { modelPath } from "@/data-models/no-op.mjs";
import { getChampionBuildsGeneral } from "@/game-lol/api.mjs";
import {
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import { fetchRef } from "@/game-lol/in-game-external-api.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import {
  calculateItemSets,
  formatItemSet,
  formatRunes,
  writeItems,
  writeRunes,
  writeSpells,
} from "@/game-lol/lol-client-api.mjs";
import { getStaticData } from "@/game-lol/util.mjs";
import { devLog } from "@/util/dev.mjs";

export const BUILD_DELIMITER = ":";

function buildKey({ championId, role, queue, matchup, pro }) {
  if (role) role = ROLE_SYMBOL_TO_STR[role]?.key;
  if (queue) queue = QUEUE_SYMBOL_TO_STR[queue]?.key;
  return [championId, queue, role, matchup, pro]
    .filter(Boolean)
    .join(BUILD_DELIMITER);
}

// This is needed because the build data itself doesn't contain useful metadata.
export const buildToChampionIdMap = new WeakMap();
export const buildToRoleMap = new WeakMap();
export const buildToKeyMap = new WeakMap();

function associateBuildsToMaps(builds, options) {
  const { championId, role } = options;
  for (const build of builds) {
    buildToChampionIdMap.set(build, championId);
    buildToRoleMap.set(build, role);
    buildToKeyMap.set(build, buildKey(options));
  }
}

const getBuildsPath = modelPath(["data", "championBuildStats", "builds"]);
const buildsModel = (data) => {
  data = getBuildsPath(data) || [];
  optimizeBuilds(data);
  return data;
};

function getChampionGeneralBuilds(championId) {
  const { fetch } = fetchRef;
  const promises = [];

  for (const role of [
    ROLE_SYMBOLS.top,
    ROLE_SYMBOLS.jungle,
    ROLE_SYMBOLS.mid,
    ROLE_SYMBOLS.adc,
    ROLE_SYMBOLS.support,
  ]) {
    const key = buildKey({
      championId,
      queue: QUEUE_SYMBOLS.rankedSoloDuo,
      role,
    });
    const writeStatePath = ["lolGameStatePersistedKeys", "builds", key];
    writeStatePath.root = inGameState;
    promises.push(
      getData(
        getChampionBuildsGeneral(
          championId,
          role,
          QUEUE_SYMBOLS.rankedSoloDuo,
          false
        ),
        buildsModel,
        writeStatePath,
        { fetch }
      ).then((data) => {
        associateBuildsToMaps(data, { championId, role });
        inGameState.buildsUpdatedAt = Date.now();
        persistData(data, writeStatePath);
      })
    );
  }

  return promises;
}

function getChampionARAMBuilds(championId) {
  const key = buildKey({
    championId,
    queue: QUEUE_SYMBOLS.aram,
  });
  const writeStatePath = ["lolGameStatePersistedKeys", "builds", key];
  writeStatePath.root = inGameState;
  return getData(
    getChampionBuildsGeneral(championId, undefined, QUEUE_SYMBOLS.aram, false),
    buildsModel,
    writeStatePath,
    { fetch }
  ).then((data) => {
    associateBuildsToMaps(data, { championId, queue: QUEUE_SYMBOLS.aram });
    inGameState.buildsUpdatedAt = Date.now();
    persistData(data, writeStatePath);
  });
}

export function getChampionBuilds(championId) {
  const promises = [
    ...getChampionGeneralBuilds(championId),
    getChampionARAMBuilds(championId),
  ];

  return Promise.all(promises);
}

export function importBuild(buildKey, index) {
  const {
    lolGameStatePersistedKeys: { builds },
  } = inGameState;
  const buildsArray = builds[buildKey];
  if (!buildsArray) {
    throw new Error(`Invalid build key! "${buildKey}"`);
  }
  const build = buildsArray[index];
  devLog("build import", build);

  return Promise.all([
    importSpells(build),
    importRunes(build),
    importItems(buildsArray, index),
  ]);
}

const FLASH_ID = 4;
function importSpells(build) {
  const { summonerSpells, summonerSpellsIndex } = build;
  const spellIds = summonerSpells[summonerSpellsIndex].summonerSpellIds.slice();

  // TODO: sort based on flash key preference.
  spellIds.sort((a, b) => {
    if (a === FLASH_ID) return -1;
    if (b === FLASH_ID) return 1;
    return 0;
  });

  return writeSpells(spellIds);
}

function importRunes(build) {
  const champions = getStaticData("champions");
  const runes = {
    selectedChampionName: Object.values(champions).find(({ key }) => {
      const championId = buildToChampionIdMap.get(build);
      const buildKey = String(championId);
      return key === buildKey;
    })?.name,
    ...formatRunes(build),
  };

  return writeRunes(runes);
}

function importItems(buildsArray, index) {
  const itemSets = calculateItemSets(buildsArray);
  const formattedItemSets = [];

  for (let i = 0; i < itemSets.length; i++) {
    const formattedItemSet = formatItemSet(itemSets[i], i, index);
    formattedItemSets.push(formattedItemSet);
  }

  return writeItems(formattedItemSets);
}

/**
 * What this does is try to calculate the optimal options within builds
 * so that we can present the best options from the data given.
 */
function optimizeBuilds(builds) {
  for (const build of builds) {
    for (const [key, indexKey] of [
      ["skillOrders", "skillOrdersIndex"],
      ["startingItems", "startingItemsIndex"],
      ["summonerSpells", "summonerSpellsIndex"],
    ]) {
      const array = build[key];
      let max = 0;
      build[indexKey] = array.reduce((acc, { games, wins }, i) => {
        const winRate = wins / games;
        if (winRate > max) {
          max = winRate;
          return i;
        }
        return acc;
      }, 0);
    }
  }
}
