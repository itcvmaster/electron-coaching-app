import i18n from "i18next";

import {
  ANTIHEAL,
  BOOTS,
  BOOTS_IDS,
  BUILD_FORMAT,
  ITEM_IDS,
  KEYSTONE_STYLES,
  MYTHICS,
  NOT_PURCHASABLE_ITEMS,
  POTIONS,
  POTIONS_IDS,
  PRO_LEAGUES,
  ROLE_SYMBOLS,
  RUNE_ROWS,
  RUNES_SPECIAL,
  STARTERS,
  STARTERS_IDS,
  SUMMONER_SPELL_IDS,
  TEAR_ITEMS,
  TRINKETS,
  UNIQUE_ITEM_PASSIVES,
  WARDS,
} from "@/game-lol/constants.mjs";
import { buildToRoleMap } from "@/game-lol/in-game-builds.mjs";
import SymbolRole from "@/game-lol/symbol-role.mjs";
import { getStaticData } from "@/game-lol/util.mjs";

/**
 * Helper function to determine if an item is a "component" item
 * @function
 * @param {Object} itemStaticInfo - Riot static data of an item
 */
export const isReasonablePurchase = (itemStaticInfo) => {
  if (itemStaticInfo?.gold?.total >= 600 || BOOTS[itemStaticInfo?.id]) {
    return itemStaticInfo;
  }

  return null;
};

// This function corrects backend build to limit the build to a single mythic item
// Returns an obj with the build, and all of the component in the build
export function limitMythicItems(originalBuild = [], itemsStaticData = {}) {
  const buildComponents = [];
  const correctedBuild = [];
  let mythicCount = 0;

  if (!itemsStaticData || !Object.values(itemsStaticData)?.length) {
    return {
      build: correctedBuild,
      components: buildComponents,
    };
  }

  const itemBuild = originalBuild.map((item) => itemsStaticData[item]);

  for (const item of itemBuild) {
    const itemComponents = itemsStaticData[item?.id]?.from || [];
    const isMythic = MYTHICS[item?.id];

    if (isMythic) mythicCount++;
    if (mythicCount >= 2 && isMythic) {
      continue;
    } else {
      if (item?.id) correctedBuild.push(Number(item?.id));
      buildComponents.push(...itemComponents);
    }
  }

  return {
    build: correctedBuild,
    components: buildComponents,
  };
}

/**
 * Helper function to ensure multiple unique passives arent stacked (IE+rageblade on Yi)
 * @function
 * @param {array} build
 * @returns Array of unique items
 */
export const limitUniqueItemPassives = (build = []) => {
  const flagged_items = {};
  const unique_item_flags = {};

  for (const passive of UNIQUE_ITEM_PASSIVES) {
    unique_item_flags[passive.type] = false;
  }

  for (const item of build) {
    for (const passive of UNIQUE_ITEM_PASSIVES) {
      if (
        passive.items.includes(item.itemId) &&
        !unique_item_flags[passive.type]
      ) {
        // first time running into an item with a uniq passive,
        // keep the item and flag the passive
        unique_item_flags[passive.type] = true;
      } else if (
        // second time running into an item with a uniq passive,
        // flag the item and passive so we can skip it on the way out
        passive.items.includes(item.itemId) &&
        unique_item_flags[passive.type]
      ) {
        flagged_items[item.itemId] = true;
      }
    }
  }

  return build.filter((item) => !flagged_items[item.itemId]);
};

// This function builds and outputs a smart build path based on
// the passed array of items (typically the core/final build)
export function buildCorePath(
  finalItems = [],
  staticItems = {},
  startingItems = [],
  limit = 2
) {
  const { basic: BASIC_BOOTS } = BOOTS_IDS;

  let buildPath = [];

  const completeItems = [];
  let boots = null;

  const firstItem = finalItems[0];

  // Ensure all final items are actually final and separate boots.
  for (const item of finalItems || []) {
    const isBoots = BOOTS[item];

    if ((!boots || staticItems[item]?.from?.length) && isBoots) {
      boots = item;
    }
    const isItem = !NOT_PURCHASABLE_ITEMS.includes(Number(item));

    if (!staticItems[item]?.into?.length && isItem) {
      completeItems.push(item);
    }
  }
  for (
    let i = 0;
    i <
    (limit < completeItems.length && boots ? limit + 1 : completeItems.length);
    i += 1
  ) {
    const completeItem = completeItems[i];
    const staticItem = staticItems[completeItem];
    if (staticItem) {
      buildPath.push(...(staticItems[completeItem]?.from || []), completeItem);
    }
  }

  if (!BOOTS[firstItem] && staticItems[firstItem]?.from?.length > 2 && boots) {
    // If the first completed item *isnt* boots
    // and has 3 components (Trinity Force)
    // move the basic boots to index 2
    buildPath = buildPath.filter((item) => Number(item) !== BASIC_BOOTS);
    buildPath.splice(2, 0, BASIC_BOOTS);
  } else if (!BOOTS[firstItem] && boots) {
    // If the first completed item *isnt* boots
    // and has 2 components (Ludens)
    // move the basic boots to index 1
    buildPath = buildPath.filter((item) => Number(item) !== BASIC_BOOTS);
    buildPath.splice(1, 0, BASIC_BOOTS);
  } else if (BOOTS[firstItem] && staticItems[boots]?.from?.length > 1) {
    // If the first completed item *is* boots
    // and boots *DO* need a basic component (steelcaps)
    // move an item component before boots completion
    const componentItem = buildPath[3];
    const firstComponentIndex = buildPath.indexOf(componentItem);
    buildPath.splice(firstComponentIndex, 1);
    buildPath.splice(1, 0, componentItem);
  } else if (BOOTS[firstItem]) {
    // If the first completed item *is* boots
    // and boots *DONT* need a baic component (steelcaps)
    // move an item component before boots completion
    const componentItem = buildPath[2];
    const firstComponentIndex = buildPath.indexOf(componentItem);
    buildPath.splice(firstComponentIndex, 1);
    buildPath.splice(1, 0, componentItem);
  }

  buildPath = buildPath.map(Number).filter(Boolean);

  for (const startingItem of startingItems) {
    if (buildPath.includes(startingItem)) {
      const firstStarterOccurance = buildPath.findIndex(
        (item) => item === startingItem
      );

      buildPath.splice(firstStarterOccurance, 1);
    }
  }

  return buildPath;
}

// Determines if the build is a build that uses Tear of the Goddess
// And what kind is it (AP or AD)
export const isTearBuild = (build) => {
  if (!build?.length) return false;

  const { manamune, muramana, archangels, seraphs } = TEAR_ITEMS;

  if (build.includes(archangels) || build.includes(seraphs)) {
    return "ap";
  } else if (build.includes(manamune) || build.includes(muramana)) {
    return "ad";
  }
  return false;
};

export const isBuildValid = (v) => {
  if (
    !v?.data?.champion_id ||
    (!v?.data?.stats?.runes?.build?.length &&
      !v?.data?.stats?.starting_items?.build?.length &&
      !v?.data?.stats?.most_common_runes?.build?.length &&
      !v?.data?.stats?.skills?.build?.length &&
      !v?.data?.stats?.most_common_skills?.build?.length)
  ) {
    return false;
  }
  return true;
};

export const formatPlaystyleTitle = (mythic, keystone) => {
  const mythicTitle = MYTHICS[mythic]?.style;
  const keystoneTitle = KEYSTONE_STYLES[keystone];

  // Handle special cases
  // Predator + Turbo Chemtank 	Engage - Tank
  if (keystone === 8124 && mythic === 6664) {
    return `${i18n.t(
      "lol:build.playstyles.mythic.engage",
      "Engage"
    )} <span>&</span> ${i18n.t("lol:build.playstyles.keystone.tank", "Tank")}`;
  }
  // Grasp of the Undying + Goredrinker 	Sustain - Bruiser
  else if (keystone === 8437 && mythic === 6630) {
    return `${i18n.t(
      "lol:build.playstyles.mythic.sustain",
      "Sustain"
    )} <span>&</span> ${i18n.t(
      "lol:build.playstyles.keystone.bruiser",
      "Bruiser"
    )}`;
  }
  // Guardian + Locket of the Iron Solari	Shielding - Defensive Aura
  else if (keystone === 8465 && mythic === 3190) {
    return `${i18n.t(
      "lol:build.playstyles.mythic.shielding",
      "Shielding"
    )} <span>&</span> ${i18n.t(
      "lol:build.playstyles.keystone.defensiveAura",
      "Defensive Aura"
    )}`;
  }
  // Electrocute + Duskbalde of Draktharr	Burst - Ability Haste
  else if (keystone === 8112 && mythic === 6691) {
    return `${i18n.t(
      "lol:build.playstyles.mythic.burst",
      "Burst"
    )} <span>&</span> ${i18n.t(
      "lol:build.playstyles.keystone.abilityHaste",
      "Ability Haste"
    )}`;
  }
  // Electrocute + Night Harvester	Burst - Mobility
  else if (keystone === 8112 && mythic === 4636) {
    return `${i18n.t(
      "lol:build.playstyles.mythic.burst",
      "Burst"
    )} <span>&</span> ${i18n.t(
      "lol:build.playstyles.keystone.mobility",
      "Mobility"
    )}`;
  }
  // Handle normal cases
  else if (mythicTitle && keystoneTitle) {
    // Check whether they have the same name
    if (mythicTitle.full === keystoneTitle.full) {
      return i18n.t(keystoneTitle.t, keystoneTitle.full);
    }

    return `${i18n.t(
      keystoneTitle.t,
      keystoneTitle.full
    )} <span>&</span> ${i18n.t(mythicTitle.t, mythicTitle.full)}`;
  } else if (mythicTitle && !keystoneTitle) {
    return i18n.t(mythicTitle.t, mythicTitle.full);
  } else if (!mythicTitle && keystoneTitle) {
    return i18n.t(keystoneTitle.t, keystoneTitle.full);
  }

  return "Blitz Build";
};

/**
 * Helper function to create a build order of component items from an array of final items
 * @function
 * @param {array} finalBuild - Array of item IDS
 * @param {Object} staticData - Obj of riot items static data
 */
export const createBuildOrder = ({ finalBuild, runes = [] }) => {
  const itemsData = getStaticData("items");

  if (!itemsData) return [];

  const HOW_MANY = 3;

  let buildComponents = [];
  let firstfound = false;
  let firstNonBootscomponents = [];

  // Create build order from only the first 3 items
  const buildList = finalBuild
    ? finalBuild
        .slice(0, HOW_MANY)
        .map((item) => itemsData[item])
        .filter(Boolean)
    : [];
  buildList.forEach((item) => {
    if (item.id) {
      if (!BOOTS[item.id] && !firstfound) {
        firstfound = true;
        firstNonBootscomponents = (item.from || []).map((component) =>
          Number(component)
        );
      }
      const itemComponents = (itemsData[item.id]?.from || []).map((component) =>
        Number(component)
      );
      buildComponents.push(...[...itemComponents, Number(item.id)]);
    }
  });

  // if the build order includes basic boots purchase
  // force move them to index 1 (directly after first component item)
  const buildHasBoots = buildComponents.includes(BOOTS_IDS.basic);
  const buildHasFootwearRune = runes.includes(RUNES_SPECIAL.magicalFootwear);

  if (buildHasBoots && buildHasFootwearRune) {
    // if the build takes Magical Footwear, remove basic boots
    buildComponents = buildComponents.filter(
      (item) => item !== BOOTS_IDS.basic
    );
  }

  // Important mythic item components to suggest to build first
  // Ex: Bamis, lost champter, noonquiver etc.
  const notableComponents = [
    6670, 6660, 4642, 3802, 3145, 4635, 3134, 3057, 6029, 3044, 3067,
  ];

  const firstComponent = notableComponents.find((item) =>
    firstNonBootscomponents.includes(item)
  );

  if (firstComponent) {
    // If we have a suitable first item component, remove it
    // and add it to the front of the build order
    const componentIndex = buildComponents.findIndex(
      (item) => item === firstComponent
    );
    buildComponents.splice(componentIndex, 1);
    buildComponents.unshift(firstComponent);
  }

  // If the build takes the "Perfect Timing" rune,
  // remove stopwatch from the build order
  const buildHasStopwatch = finalBuild.some(
    (item) => item === ITEM_IDS.zhonya || item === ITEM_IDS.guardianAngel
  );
  const buildHasStopwatchRune = runes.includes(RUNES_SPECIAL.perfectTiming);

  if (buildHasStopwatch && buildHasStopwatchRune) {
    buildComponents = buildComponents.filter(
      (item) => item !== ITEM_IDS.stopwatch
    );
  }

  return buildComponents;
};

function orderByType(a, b, type) {
  return type === "winrate"
    ? b.wins / b.games - a.wins / a.games
    : b.games - a.games;
}

/**
 * Helper function to create a build order of component items from an array of final items
 * @function
 * @param {object} build - gql build object
 * @param {string} type - type of build common/winrate
 * @param {string} role - role/lane
 * @returns {object} Build object
 */
export const formatBuildPlaystyle = ({ build, type = "winrate", role }) => {
  if (!build) return BUILD_FORMAT;
  role = SymbolRole(role);
  const isJungle = role === ROLE_SYMBOLS.jungle;

  const {
    games,
    wins,
    mythicId,
    primaryRune,
    runes,
    summonerSpells,
    skillOrders,
  } = build.data;

  // Rune indexes:
  // primaryRune
  // 0    3
  // 1    4
  // 2    5/6/7

  // Runes
  const runesPool = runes
    .filter((rune) => rune.index < 5)
    .sort((a, z) => orderByType(a, z, type));

  const rune1 = primaryRune;
  const rune2 = runesPool.find((rune) => rune.index === 0).runeId;
  const rune3 = runesPool.find((rune) => rune.index === 1).runeId;
  const rune4 = runesPool.find((rune) => rune.index === 2).runeId;
  const primaryTree = runesPool.find((rune) => rune.index === 0).treeId;

  // Secondary Runes
  // Array of secondary runes with the row they are in
  // so that we can later ensure no 2 runes in the same
  // row can be taken
  const secondaryOptions = runesPool
    .filter((r) => r.index === 3 || r.index === 4)
    .map((rune) => ({ ...rune, row: RUNE_ROWS[rune.runeId] }));

  // Determine secondary tree by sorting the stats
  // of all Seconary Runes. Must be sorted by most common
  // because we cant ensure there are 2 runes from the
  // tree with the highest winrate :/
  const secondaryTree = Object.values(
    secondaryOptions.reduce((acc, curr) => {
      if (acc[curr.treeId]) {
        acc[curr.treeId].games += curr.games;
        acc[curr.treeId].wins += curr.wins;
      } else {
        acc[curr.treeId] = {
          games: curr.games,
          wins: curr.wins,
          treeId: curr.treeId,
        };
      }
      return acc;
    }, {})
  ).sort((a, z) => orderByType(a, z, "common"))[0].treeId;

  const rune5 = secondaryOptions.find((rune) => rune.treeId === secondaryTree);
  const rune6 = secondaryOptions.find(
    (rune) => rune.treeId === secondaryTree && rune.row !== rune5.row
  );

  const secondaryRunes = [rune5, rune6]
    .sort((a, z) => a.row - z.row)
    .map((rune) => rune?.runeId);

  const allRunes = [
    primaryTree,
    rune1,
    rune2,
    rune3,
    rune4,
    secondaryTree,
    ...secondaryRunes,
  ];

  // Rune shards
  const shardsPool = runes
    .filter((rune) => rune.index >= 5)
    .sort((a, z) => orderByType(a, z, type));
  const shard1 = shardsPool.find((shard) => shard.index === 5).runeId;
  const shard2 = shardsPool.find((shard) => shard.index === 6).runeId;
  const shard3 = shardsPool.find((shard) => shard.index === 7).runeId;

  // Summoner Spells
  const summonersSorted = summonerSpells.sort((a, z) =>
    orderByType(a, z, type)
  );

  let summoners = summonersSorted?.[0]?.summonerSpellIds;
  const allSummoners = {};

  for (const summs of summonersSorted) {
    const hasSnowball = summs.summonerSpellIds.includes(
      SUMMONER_SPELL_IDS.snowball
    );
    const hasSmite = summs.summonerSpellIds.includes(SUMMONER_SPELL_IDS.smite);

    // Aggregate most used summoners
    for (const summ of summs.summonerSpellIds) {
      if (!allSummoners[summ]) allSummoners[summ] = 0;
      allSummoners[summ] += 1;
    }

    if (!hasSmite && !isJungle) {
      // If the assigned/selected role is *not* Jungle,
      // dont use a summoner set that uses smite
      summoners = summs.summonerSpellIds;
      break;
    } else if (hasSmite && isJungle) {
      summoners = summs.summonerSpellIds;
      break;
    }

    // If any of the summoner set options takes snowball
    // and is taken 50% of the time, use that (ARAM only)
    if (hasSnowball && summs.games / games > 0.5) {
      summoners = summs.summonerSpellIds;
      break;
    }
  }

  if (isJungle && !allSummoners[SUMMONER_SPELL_IDS.smite]) {
    // If the role is jungle and none of the summoner pairs
    // contain smite as an option, FORCE build a new summoner pair
    // using smite + the most common summoner spell
    const mostUsedSummonerSpell = Object.entries(allSummoners).sort(
      (a, z) => z[1] - a[1]
    )[0][0];

    summoners = [Number(mostUsedSummonerSpell), SUMMONER_SPELL_IDS.smite];
  } else if (!isJungle && summoners.includes(SUMMONER_SPELL_IDS.smite)) {
    // If not jungle and we havent already replaced the smite tuple
    // replace it with flash + ignite (somewhat arbitrary)
    summoners = [SUMMONER_SPELL_IDS.flash, SUMMONER_SPELL_IDS.ignite];
  }

  // Use extracted method for items.
  if (role) buildToRoleMap.set(build, role);
  const { itemsStarting, finalBuild, itemsSituational, antiheal, buildOrder } =
    formatBuildItems(build, type === "winrate");

  // Skill Orders
  const skillOrder = !skillOrders.length
    ? skillOrders
    : skillOrders.sort((a, z) => orderByType(a, z, type))[0]?.skillOrder || [];

  const playstyleTitle = formatPlaystyleTitle(mythicId, primaryRune);

  return {
    ...BUILD_FORMAT,
    games,
    wins,
    runes: allRunes,
    rune_shards: [shard1, shard2, shard3],
    summoner_spells: summoners,
    items_starting: itemsStarting,
    items_completed: finalBuild,
    items_situational: itemsSituational,
    items_antiheal: antiheal,
    items_order: buildOrder,
    skills: skillOrder,
    key: build.key,
    role,
    misc: {
      playstyleTitle,
    },
  };
};

/**
 * This is a somewhat cleaned up version of build formatting, this format is
 * mainly used for builds in champion select.
 */
export function formatBuildItems(build, isWinRate = true) {
  const itemsData = getStaticData("items");
  const role = buildToRoleMap.get(build);
  const isJungle = role === ROLE_SYMBOLS.jungle;

  const {
    mythicId,
    mythicAverageIndex = 0,
    completedItems,
    startingItems,
  } = build.data;

  // Items
  const items = limitUniqueItemPassives([
    { itemId: mythicId, averageIndex: mythicAverageIndex },
    ...completedItems,
  ]).sort((a, z) => a.averageIndex - z.averageIndex);

  const item1 = items[0]?.itemId;
  const item2 = items[1]?.itemId;
  const item3 = items[2]?.itemId;
  const item4 = items[3]?.itemId;
  const item5 = items[4]?.itemId;
  const item6 = items[5]?.itemId;

  let itemsMain = [item1, item2, item3, item4, item5, item6].filter(Boolean);
  let itemsSituational = items
    .map((item) => item.itemId)
    .filter((item) => !itemsMain.includes(item));

  // Handle instances where itemsMain winds up having 2 pairs of boots
  // Push all of the extra/remining boot options to situational array
  let buildBoots = null;
  for (const item of itemsMain) {
    if (!buildBoots && BOOTS[item]) {
      buildBoots = item;
    } else if (buildBoots && BOOTS[item]) {
      itemsSituational.push(item);
      itemsMain = itemsMain.filter((existingItem) => existingItem !== item);
    }
  }

  // Missing boots in the main item build,
  // pull the first boots from situational
  if (!buildBoots) {
    const fillBoots = items.find((item) => BOOTS[item.itemId])?.itemId;

    itemsMain = [item1, fillBoots, item2, item3, item4, item5].filter(Boolean);
    itemsSituational = [
      item6,
      ...itemsSituational.filter((item) => item !== fillBoots),
    ].filter(Boolean);
  }

  // Handle builds where the above 'itemsMain' has less than 6 items
  // Fill in the build until it has 6 (but never fill in with boots)
  const MAX_ITEMS = 6;
  if (itemsMain.length < MAX_ITEMS) {
    const itemsMissing = MAX_ITEMS - itemsMain.length;
    const shareItems = itemsSituational.filter((item) => !BOOTS[item]); // Situational, not boots

    itemsMain = [...itemsMain, ...shareItems.slice(0, itemsMissing)];
    itemsSituational = itemsSituational.filter(
      (item) => !itemsMain.includes(item)
    );
  }

  const mythicAntiHeal = MYTHICS[mythicId]?.antiheal || [];
  const builtAntiHeal = items
    .filter((item) => ANTIHEAL[item.itemId])
    .map((item) => item.itemId);
  const antiheal = [...new Set([...builtAntiHeal, ...mythicAntiHeal])];

  let finalBuild = [...itemsMain];

  // Starting Items
  const starterSorted = startingItems.sort((a, z) =>
    orderByType(a, z, isWinRate ? "winrate" : null)
  );
  let itemsStarting = starterSorted?.[0]?.startingItemIds || [];

  // If the starting items includes potions,
  // remove dupes and put it at the end
  if (itemsStarting.includes(POTIONS_IDS.health)) {
    itemsStarting = [
      ...itemsStarting.filter((item) => item !== POTIONS_IDS.health),
      POTIONS_IDS.health,
    ];
  } else if (itemsStarting.includes(POTIONS_IDS.refillable)) {
    itemsStarting = [
      ...itemsStarting.filter((item) => item !== POTIONS_IDS.refillable),
      POTIONS_IDS.refillable,
    ];
  }

  const jungleStarters = [STARTERS_IDS.emberknife, STARTERS_IDS.hailblade];
  const jungleItemStart = itemsStarting.some((item) =>
    jungleStarters.includes(item)
  );

  // If the assigned/selected role is *not* jungle AND the starting items
  // have a jungle item, find the next highest starter set that *doesnt*
  // include a jungle starting item. Example: Lillia Top
  if (!isJungle && jungleItemStart) {
    for (const { startingItemIds } of starterSorted) {
      const hasJungleStarter = startingItemIds.some(
        (item) =>
          item === STARTERS_IDS.emberknife || item === STARTERS_IDS.hailblade
      );

      if (!hasJungleStarter) {
        itemsStarting = startingItemIds;
      }
    }
  }

  // If the build role is jungle and the starting items dont use a
  // jungle item, create a NEW starting set using hailblade
  if (isJungle && !jungleItemStart) {
    itemsStarting = [STARTERS_IDS.hailblade, POTIONS_IDS.refillable];
  }

  const tearStart = itemsStarting.includes(TEAR_ITEMS.tear);
  const isPhysicalTearBuild =
    finalBuild.includes(TEAR_ITEMS.manamune) ||
    itemsSituational.includes(TEAR_ITEMS.manamune);
  const isMagicTearBuild =
    finalBuild.includes(TEAR_ITEMS.archangels) ||
    itemsSituational.includes(TEAR_ITEMS.archangels);

  if (tearStart && isPhysicalTearBuild) {
    // If the build starts with tear and is physical
    // force Manamune first and remove from situational
    finalBuild = [
      TEAR_ITEMS.manamune,
      ...finalBuild.filter((item) => item !== TEAR_ITEMS.manamune),
    ];
    itemsSituational.splice(itemsSituational.indexOf(TEAR_ITEMS.manamune), 1);
    itemsSituational.push(finalBuild.pop());
  } else if (tearStart && isMagicTearBuild) {
    // If the build starts with tear and is physical
    // force archangels first and remove from situational
    finalBuild = [
      TEAR_ITEMS.archangels,
      ...finalBuild.filter((item) => item !== TEAR_ITEMS.archangels),
    ];
    itemsSituational.splice(itemsSituational.indexOf(TEAR_ITEMS.archangels), 1);
    itemsSituational.push(finalBuild.pop());
  }

  // Build order
  const buildOrder = createBuildOrder({
    finalBuild,
    itemsData,
  });

  return {
    itemsStarting,
    finalBuild,
    itemsSituational,
    antiheal,
    buildOrder,
  };
}

/**
 * Returns build object from NEW probuilds gql
 * PRO BUILD FORMATTER (NEW GQL)
 *
 * @param {Object} build
 * @param {Object} itemsData - riot static data
 * @returns {object} Build object
 */
export const formatBuildProMatch = ({ build, itemsData }) => {
  if (!build) return BUILD_FORMAT;

  const {
    win,
    player = {},
    tournamentSummonerName = "",
    tournamentType = "",
    kills = 0,
    deaths = 0,
    assists = 0,
    id,
    boots,
    buildPaths,
    runes,
    patch,
    runeShards,
    items,
    timestamp,
    spells,
    skillOrder,
    opponentChampion,
    runePrimaryTree,
    runeSecondaryTree,
  } = build.data;

  const isCompetitiveMatch = Boolean(build.data.tournamentTeam);

  const runesList = runes.map((rune) => Number(rune?.id));

  runesList.splice(0, 0, runePrimaryTree);
  runesList.splice(5, 0, runeSecondaryTree);

  const buildTimeline = (buildPaths || []).sort(
    (a, z) => a.timestamp - z.timestamp
  );

  const spellsList = spells?.[0]?.ids.map((spell) => Number(spell));
  const bootsID = Number(boots?.[0]?.id) || 0;
  const itemList = items.map((item) => Number(item.id));
  const skills = skillOrder
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((skill) => Number(skill.skillSlot));

  // Purchases pre-30s
  const startingItems = buildTimeline
    .filter((purchase) => purchase.timestamp < 30000)
    .map((purchase) => purchase.itemId);

  // Final build: filter out junk
  const finalBuild =
    [bootsID, ...itemList]
      .filter(Boolean)
      .filter(
        (item) =>
          !TRINKETS[item] && !POTIONS[item] && !STARTERS[item] && !WARDS[item]
      ) || [];

  // Build order: built from items static data
  const buildOrder = itemsData
    ? buildTimeline
        .filter(
          (purchase) =>
            !TRINKETS[purchase.itemId] &&
            !POTIONS[purchase.itemId] &&
            !STARTERS[purchase.itemId] &&
            !WARDS[purchase.itemId] &&
            purchase.timestamp > 30000
        )
        .map((purchase) => itemsData[purchase.itemId])
        .filter((item) => Boolean(isReasonablePurchase(item)))
        .map((item) => Number(item.id))
    : buildTimeline
        .filter(
          (purchase) =>
            !TRINKETS[purchase.itemId] &&
            !POTIONS[purchase.itemId] &&
            !STARTERS[purchase.itemId] &&
            !WARDS[purchase.itemId] &&
            purchase.timestamp > 30000
        )
        .map((item) => Number(item.itemId));

  // const buildOrder = createBuildOrder({
  //   finalBuild,
  //   runes: runesList,
  //   staticData: itemsData,
  // });

  const playerName = isCompetitiveMatch ? tournamentSummonerName : player.name;
  const playerImage = isCompetitiveMatch
    ? PRO_LEAGUES[tournamentType.toLowerCase()]
    : player.profileImageUrl;

  const opponentTeam = build.data.tournamentOpponentTeam;

  return {
    ...BUILD_FORMAT,
    wins: win ? 1 : 0,
    games: 1,
    runes: runesList || [],
    rune_shards: runeShards.filter(Boolean),
    summoner_spells: spellsList || [],
    items_starting: startingItems || [],
    items_completed: finalBuild,
    items_order: buildOrder,
    items_situational: [],
    skills: skills || [],
    misc: {
      player: player || null,
      playerName,
      playerImage,
      tournament: tournamentType.length ? tournamentType : null,
      team: build.data.tournamentTeam,
      opponentTeam,
      gameId: id,
      opponentChampion,
      patch,
      timestamp,
      stats: {
        kills,
        deaths,
        assists,
      },
    },
    key: build.key,
  };
};
