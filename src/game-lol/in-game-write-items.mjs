import i18n from "i18next";

import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import { ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import {
  buildToChampionIdMap,
  buildToKeyMap,
  buildToRoleMap,
} from "@/game-lol/in-game-builds.mjs";
import lolClient from "@/game-lol/lol-client.mjs";
import Static from "@/game-lol/static.mjs";
import { getStaticData } from "@/game-lol/util.mjs";
import { formatBuildPlaystyle } from "@/game-lol/util-builds.mjs";

const { t } = i18n;
const itemSetToBuildMap = new WeakMap();

export default async function writeItems(itemSets) {
  const { map } = await lolClient.request("get", "/lol-gameflow/v1/session");

  const configID = `${itemSets[0]?.championKey}_${map?.mapStringId}_${map?.gameMode}`;
  return blitzMessage(EVENTS.SET_ITEM_BUILDS, {
    builds: itemSets,
    configID,
  });
}

export function calculateItemSets(buildsArray) {
  const itemSets = [];

  for (const build of buildsArray) {
    itemSets.push(calculateItemSet(build));
  }
  return itemSets;
}

function calculateItemSet(build) {
  // TODO: consider non-playstyle builds
  const result = formatBuildPlaystyle({
    build: { data: build, key: buildToKeyMap.get(build) },
    role: buildToRoleMap.get(build),
  });
  itemSetToBuildMap.set(result, build);
  return result;
}

// Convert from internal item set format, to rito's expected format.
export function formatItemSet(itemSet, index, selectedIndex) {
  const build = itemSetToBuildMap.get(itemSet);
  const role = buildToRoleMap.get(build);
  const championId = buildToChampionIdMap.get(build);
  const champions = getStaticData("champions");
  const championKey = Static.getChampionKeyFromId(champions, championId);
  const title = role
    ? t(`lol:itemsets.title.role`, `Blitz ({{role}})`, {
        role: t(`lol:roles.${ROLE_SYMBOL_TO_STR[role]?.key}`),
      })
    : t("lol:itemsets.title.default", "Blitz Build");

  const result = {
    // Fill these out.
    title,
    championKey,

    map: "any",
    mode: "any",
    type: "custom",
    priority: true,
    sortrank: index === selectedIndex ? 1000000 : 500000 - index,
    blocks: [],
  };

  for (const [key, title] of [
    ["items_starting", t("lol:itemsets.startingItems", "Starting Items")],
    ["items_order", t("lol:championData.coreBuildOrder", "Core Build Order")],
    [
      "items_completed",
      t("lol:itemsets.coreFinalBuild", `Core Final Build`, { gamesText: "" }),
    ],
    [
      "items_situational",
      t(
        "lol:itemsets.situationalItems",
        "Situational items that are also good"
      ),
    ],
    ["items_antiheal", t("lol:itemsets.antiHealing", "Anti-Healing")],
  ]) {
    result.blocks.push(addBlock(title, itemSet[key]));
  }

  return result;
}

function addBlock(name, items) {
  return {
    recMath: false,
    minSummonerLevel: -1,
    maxSummonerLevel: -1,
    showIfSummonerSpell: "",
    hideIfSummonerSpell: "",
    type: name,
    items: items.map((id) => {
      return {
        id: `${id}`,
        count: 1,
      };
    }),
  };
}
