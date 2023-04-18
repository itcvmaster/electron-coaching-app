import { appURLs } from "@/app/constants.mjs";
import { QUEUE_SYMBOLS as QUEUE_SYMBOLS_LOL } from "@/game-lol/constants.mjs";
import TftColors from "@/game-tft/colors.mjs";
import stringsToSymbols from "@/util/strings-to-symbols.mjs";
// Data set is mapped to lol patch below 'setPatches'
export const tftSets = {
  staticSet: "set4_5",
  dataSet: "set4_5",
};

export const tftSetsDropdown = {
  // set4: 'Set 4: Fates',
  // set4_5: 'Set 4.5: Festival of Beasts',
  // set5: 'Set 5: Reckoning',
  // set5_5: 'Set 5.5: Dawn of Heroes',
  set6: "Set 6: Gizmos & Gadgets",
  set6_5: "Set 6.5: Neon Nights",
};

// show placeholder for /stats pages
// values: "","set5"
export const PLACEHOLDER_SET = "set7";

// Not real items, or are basic, non-completed items, or spatula items
export const ITEM_BLACKLIST = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "200",
  "201",
  "202",
  "203",
  "999",
  "1001",
  "1002",
  "1003",
  "1004",
  "1005",
  "1006",
  "1007",
  "1008",
  "1009",
  "9001",
  "9002",
  "9003",
  "9004",
  "9005",
  "9006",
  "9007",
  "9008",
  "9009",
  "9010",
  "10001",
  "10005",
  "10006",
  "10201",
  "10202",
  "10203",
  "10204",

  // radiant items
  "2034",
  "2016",
  "2044",
  "2055",
  "2046",
  "2011",
  "2066",
  "2045",
  "2056",
  "2012",
  "2015",
  "2023",
  "2049",
  "2013",
  "2019",
  "2036",
  "2039",
  "2029",
  "2035",
  "2037",
  "2069",
  "2033",
  "2022",
  "2047",
  "2026",
  "2059",
  "2014",
  "2024",
  "2057",
  "2099",
  "2025",
  "2079",
  "2077",
  "2017",
  "2067",
  "2027",
];

// Hide these items from unit item suggestions
export const ITEM_SUGGESTION_BLACKLIST = ["1088", "88"];

export const CHAMP_BLACKLIST = [
  "BabyDragon",
  "Daisy",
  "DraconicEgg",
  "TheMonstrosity",
  "TrainingDummy",
  "Voidspawn",
  "Wolf",
  "MechanicalScarab",
  "MechanicalBear",
  "MechanicalDragon",
];

export const MATCHTILE_ITEM_BLACKLIST = [999, 10005];

export const HEX_ELEMENT_ITEMS = ["10201", "10202", "10203", "10204"];

export const QUEUE_SYMBOLS = stringsToSymbols([
  // If you're looking for the rankedTft symbol, it lives in the game-lol/constants.mjs
  "rankedTftTurbo",
  "rankedTftDoubleUp",
]);
export const QUEUE_SYMBOLS_TO_QUEUE_NAMES = {
  [QUEUE_SYMBOLS_LOL.rankedTft]: "RANKED_TFT",
  [QUEUE_SYMBOLS.rankedTftTurbo]: "RANKED_TFT_TURBO",
  [QUEUE_SYMBOLS.rankedTftDoubleUp]: "RANKED_TFT_DOUBLE_UP",
};

export const HYPER_ROLL_RANKS = {
  NONE: { key: "none", display: "None", color: "#fffff" },
  ORANGE: { key: "hyper", display: "Hyper", color: "#efbf6c" },
  PURPLE: { key: "purple", display: "Purple", color: "#9d48e0" },
  BLUE: { key: "blue", display: "Blue", color: "#8DC1EC" },
  GREEN: { key: "green", display: "Green", color: "#A1D486" },
  GRAY: { key: "gray", display: "Gray", color: "#E3E5EA" },
};

export const TFT_RANKED_QUEUES = [
  "RANKED_TFT",
  "RANKED_TFT_TURBO",
  "RANKED_TFT_DOUBLE_UP",
];

export const setUnitPrefixes = {
  set2: "TFT2_",
  set3: "TFT3_",
  set4: "TFT4_",
  set4_5: "TFT4b_",
  set5: "TFT5_",
  set5_5: "TFT5_",
  set6: "TFT6_",
  set6_5: "TFT6b_",
};

export const setDates = [
  { set: "set6_5", date: "2022-2-16 06:00:00" },
  { set: "set6", date: "2021-11-3 06:00:00" },
  { set: "set5_5", date: "2021-7-21 06:00:00" },
  { set: "set5", date: "2021-4-28 06:00:00" },
  { set: "set4_5", date: "2021-1-21 06:00:00" },
  { set: "set4", date: "2020-9-16 06:00:00" },
  { set: "set3", date: "2020-3-18 06:00:00" },
  { set: "set2", date: "2019-11-6 06:00:00" },
  { set: "set1", date: "2019-6-10 06:00:00" },
];

export const setTraitPrefixes = {
  set2: "Set2_",
  set3: "Set3_",
  set4: "Set4_",
  set4_5: "Set4_",
  set5: "Set5_",
  set5_5: "Set5_",
  set6: "Set6_",
  set6_5: "Set6_",
};

// Revisit when Riot releases set 6 info
export const setPatches = {
  11.19: "set5_5",
  "11.20": "set5_5",
  11.21: "set5_5",
  11.22: "set6",
  11.23: "set6",
  11.24: "set6",
  12.1: "set6",
  12.2: "set6",
  12.3: "set6",
  12.4: "set6_5",
  12.5: "set6_5",
  12.6: "set6_5",
  12.7: "set6_5",
  12.8: "set6_5",
  12.9: "set6_5",
};

// Transform LoL client img asset directory to blitz cdn directory
// companion_directory_replace
export const companionDirectoryReplace = (companionId) => {
  if (typeof companionId === "string") {
    return companionId
      .toLowerCase()
      .replace(
        "/lol-game-data/assets/assets/loadouts/companions/",
        `${appURLs.CDN}/0x90/blitz/companions/`
      )
      .replace(
        "/lol-game-data/assets/assets/loot/companions/tft_avatar/loot",
        `${appURLs.CDN}/0x90/blitz/companions/tooltip`
      )
      .replace(
        "/lol-game-data/assets/assets/loot/companions/miner/loot",
        `${appURLs.CDN}/0x90/blitz/companions/tooltip`
      );
  }
  return "";
};

export const TFTRounds = {
  1: [
    {
      round: 1,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    {
      round: 2,
      name: "Minions",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Minions.png`,
    },
    {
      round: 3,
      name: "Minions",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Minions.png`,
    },
    {
      round: 4,
      name: "Minions",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Minions.png`,
    },
  ],
  2: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Krugs",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Krugs.png`,
    },
  ],
  3: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Murk Wolves",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Wolves.png`,
    },
  ],
  4: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Raptor",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Raptor.png`,
    },
  ],
  5: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Infernal Drake",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Dragon.png`,
    },
  ],
  6: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Rift Herald",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Herald.png`,
    },
  ],
  7: [
    { round: 1, name: "PVP" },
    { round: 2, name: "PVP" },
    { round: 3, name: "PVP" },
    {
      round: 4,
      name: "Carousel",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Carousel.png`,
    },
    { round: 5, name: "PVP" },
    { round: 6, name: "PVP" },
    {
      round: 7,
      name: "Elder Dragon",
      url: `${appURLs.CDN}/blitz/tft/postmatch/Elderdragon.png`,
    },
  ],
};

// Calculate points based on the above normalized values
export const scoreWeights = {
  // Calculate points in champions
  champions: {
    multiply: {
      winRate: 5,
      avgPlacement: 20,
    },
    subtract: {
      avgPlacement: 0.8,
      top4Rate: 0.5,
      winRate: 3,
    },
  },
  // Calculate points in items
  items: {
    exponent: {
      matchesPlayed: 1.15,
      avgPlacement: 3,
      top4Rate: 5,
      winRate: 4,
    },
    multiply: {
      matchesPlayed: 90,
      avgPlacement: 60,
      top4Rate: 35,
      winRate: 35,
    },
  },
};

export const starTiers = {
  2: "Silver",
  3: "Gold",
  4: "Turq",
};

export const borderColors = {
  1: TftColors.placement.gradient[1],
  2: TftColors.placement.gradient[2],
  3: TftColors.placement.gradient[3],
  4: TftColors.placement.gradient[4],
};

export const titleColor = (rank) => {
  switch (rank) {
    case 1:
      return `color: ${TftColors.placement.solid[1]};`;
    case 2:
      return `color: ${TftColors.placement.solid[2]};`;
    case 3:
      return `color: ${TftColors.placement.solid[3]};`;
    case 4:
      return `color: ${TftColors.placement.solid[4]};`;
    default:
      return `color: ${TftColors.placement.solid.default};`;
  }
};

export const FLEX_SIZES = {
  PLAYER_PROFILE: 20,
  PLACEMENT: 10,
  TRAITS: 24,
  UNITS: 40,
  META: 12,
};

export const POSTMATCH_CAROUSEL = {
  ROUND_WIDTH: 66,
  ROUNDS_VIEWABLE: 12,
};
