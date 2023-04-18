import { appURLs } from "@/app/constants.mjs";
import stringsToSymbols from "@/util/strings-to-symbols.mjs";

// LOL-SPECIFIC CONSTANTS
export const INGAME_PHASES = [
  "DECLARING",
  "BANNING",
  "PICKING",
  "FINALIZING",
  "STARTING",
  "INGAME",
  "UNKNOWN",
];

export const GARENA_REGIONS = ["sg", "ph", "id1", "vn", "th", "tw"];

export const MAX_GAME_TIME_IN_MINUTES = 200 * 60;

export const QUEUE_SYMBOLS = stringsToSymbols([
  "rankedSoloDuo",
  "rankedFlex",
  "normalDraft",
  "normalBlind",
  "aram",
  "urf",
  "rankedTft",
  "custom",
]);

export const QUEUE_SYMBOL_TO_STR = {
  [QUEUE_SYMBOLS.rankedSoloDuo]: {
    gql: "RANKED_SOLO_5X5",
    key: "420",
    dashed: "ranked-solo-duo",
    t: {
      name: "lol:filters.queues.rankedSolo",
      fallback: "Ranked Solo/Duo",
    },
  },
  [QUEUE_SYMBOLS.rankedFlex]: {
    gql: "RANKED_FLEX_SR",
    key: "440",
    dashed: "ranked-flex",
    t: {
      name: "lol:filters.queues.rankedFlex",
      fallback: "Ranked Flex",
    },
  },
  [QUEUE_SYMBOLS.normalDraft]: {
    gql: "SUMMONERS_RIFT_DRAFT_PICK",
    key: "400",
    dashed: "normal-draft",
    hideRank: true,
    t: {
      name: "lol:filters.queues.normalDraft",
      fallback: "Normal Draft",
    },
  },
  [QUEUE_SYMBOLS.normalBlind]: {
    gql: "SUMMONERS_RIFT_BLIND_PICK",
    key: "430",
    dashed: "normal-blind",
    hideRank: true,
    t: {
      name: "lol:filters.queues.normalBlind",
      fallback: "Normal Blind",
    },
  },
  [QUEUE_SYMBOLS.urf]: {
    gql: "SUMMONERS_RIFT_URF",
    key: "900",
    dashed: "urf",
    hideRole: true,
    hideRank: true,
    hideFilter: true,
    t: {
      name: "lol:filters.queues.urf",
      fallback: "URF",
    },
  },
  [QUEUE_SYMBOLS.aram]: {
    gql: "HOWLING_ABYSS_ARAM",
    key: "450",
    dashed: "aram",
    hideRole: true,
    hideRank: true,
    t: {
      name: "lol:filters.queues.aram",
      fallback: "ARAM",
    },
  },
  [QUEUE_SYMBOLS.custom]: {
    gql: "CUSTOM_GAME",
    key: "0",
    dashed: "custom",
    hideRole: true,
    hideRank: true,
    hideFilter: true,
    t: {
      name: "lol:filters.queues.custom",
      fallback: "Custom",
    },
  },
};

export const defaultQueue = QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo];

export const RANK_SYMBOLS = stringsToSymbols([
  "platinumPlus",
  "challenger",
  "grandmaster",
  "master",
  "diamond",
  "platinum",
  "gold",
  "silver",
  "bronze",
  "iron",
]);

export const RANK_SYMBOL_TO_STR = {
  [RANK_SYMBOLS.platinumPlus]: {
    key: "platinum_plus",
    capped: "PLATINUM+",
    gql: "PLATINUM_PLUS",
    t: {
      name: "lol:filters.ranks.platPlus",
      fallback: "Platinum+",
    },
  },
  [RANK_SYMBOLS.challenger]: {
    key: "challenger",
    capped: "CHALLENGER",
    gql: "CHALLENGER",
    t: {
      name: "lol:filters.ranks.challenger",
      fallback: "Challenger",
    },
  },
  [RANK_SYMBOLS.grandmaster]: {
    key: "grandmaster",
    capped: "GRANDMASTER",
    gql: "GRANDMASTER",
    t: {
      name: "lol:filters.ranks.grandmaster",
      fallback: "Grandmaster",
    },
  },
  [RANK_SYMBOLS.master]: {
    key: "master",
    capped: "MASTER",
    gql: "MASTER",
    t: {
      name: "lol:filters.ranks.master",
      fallback: "Master",
    },
  },
  [RANK_SYMBOLS.diamond]: {
    key: "diamond",
    capped: "DIAMOND",
    gql: "DIAMOND",
    t: {
      name: "lol:filters.ranks.diamond",
      fallback: "Diamond",
    },
  },
  [RANK_SYMBOLS.platinum]: {
    key: "platinum",
    capped: "PLATINUM",
    gql: "PLATINUM",
    t: {
      name: "lol:filters.ranks.platinum",
      fallback: "Platinum",
    },
  },
  [RANK_SYMBOLS.gold]: {
    key: "gold",
    capped: "GOLD",
    gql: "GOLD",
    t: {
      name: "lol:filters.ranks.gold",
      fallback: "Gold",
    },
  },
  [RANK_SYMBOLS.silver]: {
    key: "silver",
    capped: "SILVER",
    gql: "SILVER",
    t: {
      name: "lol:filters.ranks.silver",
      fallback: "Silver",
    },
  },
  [RANK_SYMBOLS.bronze]: {
    key: "bronze",
    capped: "BRONZE",
    gql: "BRONZE",
    t: {
      name: "lol:filters.ranks.bronze",
      fallback: "Bronze",
    },
  },
  [RANK_SYMBOLS.iron]: {
    key: "iron",
    capped: "IRON",
    gql: "IRON",
    t: {
      name: "lol:filters.ranks.iron",
      fallback: "Iron",
    },
  },
};

export const REGION_LIST = [
  {
    key: "world",
    name: "World",
    gql: "WORLD",
    t: {
      name: "lol:filters.regions.world",
      fallback: "World",
    },
  },
  {
    key: "na1",
    name: "NA",
    gql: "NA1",
    t: {
      name: "lol:filters.regions.na1",
      fallback: "NA",
    },
  },
  {
    key: "br1",
    name: "BR",
    gql: "BR1",
    t: {
      name: "lol:filters.regions.br1",
      fallback: "BR",
    },
  },
  {
    key: "eun1",
    name: "EUNE",
    gql: "EUN1",
    t: {
      name: "lol:filters.regions.eun1",
      fallback: "EUNE",
    },
  },
  {
    key: "euw1",
    name: "EUW",
    gql: "EUW1",
    t: {
      name: "lol:filters.regions.euw1",
      fallback: "EUW",
    },
  },
  {
    key: "jp1",
    name: "JP",
    gql: "JP1",
    t: {
      name: "lol:filters.regions.jp1",
      fallback: "JP",
    },
  },
  {
    key: "kr",
    name: "KR",
    gql: "KR",
    t: {
      name: "lol:filters.regions.kr",
      fallback: "KR",
    },
  },
  {
    key: "la1",
    name: "LAN",
    gql: "LA1",
    t: {
      name: "lol:filters.regions.la1",
      fallback: "LAN",
    },
  },
  {
    key: "la2",
    name: "LAS",
    gql: "LA2",
    t: {
      name: "lol:filters.regions.la2",
      fallback: "LAS",
    },
  },
  {
    key: "oc1",
    name: "OCE",
    gql: "OC1",
    t: {
      name: "lol:filters.regions.oc1",
      fallback: "OCE",
    },
  },
  {
    key: "tr1",
    name: "TR",
    gql: "TR1",
    t: {
      name: "lol:filters.regions.tr1",
      fallback: "TR",
    },
  },
  {
    key: "ru",
    name: "RU",
    gql: "RU",
    t: {
      name: "lol:filters.regions.ru",
      fallback: "RU",
    },
  },
];

export const FILTER_SYMBOLS = stringsToSymbols([
  "searchText",
  "role",
  "duoRole",
  "tier",
  "queue",
  "region",
  "patch",
  "matchup",
  "team",
  "victoryOnly",
]);

// Do not change the ordering!
export const ROLE_SYMBOLS = stringsToSymbols([
  "all",
  "top",
  "jungle",
  "mid",
  "adc",
  "support",
]);

export const ROLE_SYMBOL_TO_STR = {
  [ROLE_SYMBOLS.all]: {
    key: "all",
    gql: null,
    internal: "ALL",
    t: {
      name: "lol:roles.all",
      fallback: "All",
    },
  },
  [ROLE_SYMBOLS.top]: {
    key: "top",
    gql: "TOP",
    internal: "TOP",
    t: {
      name: "lol:roles.top",
      fallback: "Top",
    },
  },
  [ROLE_SYMBOLS.jungle]: {
    key: "jungle",
    gql: "JUNGLE",
    internal: "JUNGLE",
    t: {
      name: "lol:roles.jungle",
      fallback: "Jungle",
    },
  },
  [ROLE_SYMBOLS.mid]: {
    key: "mid",
    gql: "MID",
    internal: "MID",
    t: {
      name: "lol:roles.mid",
      fallback: "Middle",
    },
  },
  [ROLE_SYMBOLS.adc]: {
    key: "adc",
    gql: "ADC",
    internal: "ADC",
    t: {
      name: "lol:roles.adc",
      fallback: "Bottom",
    },
  },
  [ROLE_SYMBOLS.support]: {
    key: "support",
    gql: "SUPPORT",
    internal: "SUPPORT",
    t: {
      name: "lol:roles.support",
      fallback: "Support",
    },
  },
};

export const ROLE_PAIRS = {
  [ROLE_SYMBOLS.top]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.jungle].internal,
  [ROLE_SYMBOLS.jungle]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.mid].internal,
  [ROLE_SYMBOLS.mid]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.jungle].internal,
  [ROLE_SYMBOLS.adc]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.support].internal,
  [ROLE_SYMBOLS.support]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.adc].internal,
  [ROLE_SYMBOLS.all]: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].internal,
};

export const ROLE_SYMBOL_TO_RIOT_STRING = {
  [ROLE_SYMBOLS.adc]: "BOTTOM",
  [ROLE_SYMBOLS.jungle]: "JUNGLE",
  [ROLE_SYMBOLS.support]: "UTILITY",
  [ROLE_SYMBOLS.mid]: "MIDDLE",
  [ROLE_SYMBOLS.top]: "TOP",
};

export const ARAM_QUEUE_TYPES = [65, 450, 920];
export const ROLE_QUEUE_TYPES = [400, 420, 430, 440, 700];
export const ROLE_MAP = {
  all: ROLE_SYMBOLS.all,
  top: ROLE_SYMBOLS.top,
  jungle: ROLE_SYMBOLS.jungle,
  jng: ROLE_SYMBOLS.jungle,
  none: ROLE_SYMBOLS.jungle,
  middle: ROLE_SYMBOLS.mid,
  mid: ROLE_SYMBOLS.mid,
  solo: ROLE_SYMBOLS.mid,
  bottom: ROLE_SYMBOLS.adc,
  bot: ROLE_SYMBOLS.adc,
  adc: ROLE_SYMBOLS.adc,
  carry: ROLE_SYMBOLS.adc,
  sup: ROLE_SYMBOLS.support,
  support: ROLE_SYMBOLS.support,
  utility: ROLE_SYMBOLS.support,
};

export const REGION_SYMBOLS = stringsToSymbols([
  "na",
  "br",
  "eune",
  "euw",
  "lan",
  "las",
  "oce",
  "ru",
  "tr",
  "jp",
  "kr",
  "pbe",
  "ph",
  "sg",
  "tw",
  "vn",
  "th",
]);

export const PRO_LEAGUES = {
  worlds: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/worlds.webp`,
  msi: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/msi.webp`,
  lcs: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lcs.webp`,
  lck: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lck.webp`,
  lec: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lec.webp`,
  lpl: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lpl.webp`,
  tcl: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/tcl.webp`,
  cblol: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/cblol.webp`,
  lla: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lla.webp`,
  lco: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lco.webp`,
  ljl: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/ljl.webp`,
  vcs: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/vcs.webp`,
  lplol: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lplol.webp`,
  em: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/em.webp`,
  prime: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/prime.webp`,
  lcl: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/lcl.webp`,
  pcs: `${appURLs.CDN_PLAIN}/blitz/lol/competitive_regions/pcs.webp`,
};

export const REGION_MAP = {
  // RIOT Server Regions
  na: REGION_SYMBOLS.na,
  na1: REGION_SYMBOLS.na,
  br: REGION_SYMBOLS.br,
  br1: REGION_SYMBOLS.br,
  eune: REGION_SYMBOLS.eune,
  eun1: REGION_SYMBOLS.eune,
  euw: REGION_SYMBOLS.euw,
  euw1: REGION_SYMBOLS.euw,
  lan: REGION_SYMBOLS.lan,
  la1: REGION_SYMBOLS.lan,
  las: REGION_SYMBOLS.las,
  la2: REGION_SYMBOLS.las,
  oce: REGION_SYMBOLS.oce,
  oc1: REGION_SYMBOLS.oce,
  ru: REGION_SYMBOLS.ru,
  ru1: REGION_SYMBOLS.ru,
  tr: REGION_SYMBOLS.tr,
  tr1: REGION_SYMBOLS.tr,
  jp: REGION_SYMBOLS.jp,
  jp1: REGION_SYMBOLS.jp,
  kr: REGION_SYMBOLS.kr,
  pbe: REGION_SYMBOLS.pbe,
  // Garena Regions
  ph: REGION_SYMBOLS.ph,
  sg: REGION_SYMBOLS.sg,
  tw: REGION_SYMBOLS.tw,
  vn: REGION_SYMBOLS.vn,
  th: REGION_SYMBOLS.th,
  // TODO: (Need to do something with Tencent Server regions)
};

export const QUEUE_TYPES = {
  "-1": "CUSTOM",
  0: "CUSTOM",
  2: "NORMAL",
  4: "RANKED_SOLO",
  6: "RANKED_PREMADE",
  7: "CO_OP_VS_AI",
  8: "TWISTED_TREELINE",
  9: "RANKED_TWISTED_TREELINE",
  14: "DRAFT_PICK",
  16: "BLIND_PICK_5V5_DOMINION",
  17: "DRAFT_PICK_5V5_DOMINION",
  25: "DOMINION_CO_OP_VS_AI",
  31: "CO_OP_VS_AI_INTRO_BOT",
  32: "CO_OP_VS_AI_BEGINNER_BOT",
  33: "CO_OP_VS_AI_INTERMEDIATE_BOT",
  41: "RANKED_TEAM_3V3",
  42: "RANKED_TEAM_5V5",
  52: "CO_OP_VS_AI",
  61: "TEAM_BUILDER",
  65: "ARAM",
  72: "SNOWDOWN_SHOWDOWN_1V1",
  73: "SNOWDOWN_SHOWDOWN_2V2",
  75: "HEXAKILL_6V6",
  76: "ULTRA_RAPID_FIRE",
  78: "MIRRORED_ONE_FOR_ALL",
  83: "CO_OP_VS_AI_ULTRA_RAPID_FIRE",
  91: "DOOM_BOTS_RANK_1",
  92: "DOOM_BOTS_RANK_2",
  93: "DOOM_BOTS_RANK_5",
  96: "ASCENSION",
  98: "TWISTED_TREELINE_6V6_HEXAKILL",
  100: "BUTCHERS_BRIDGE_5V5_ARAM",
  300: "KING_PORO",
  310: "NEMESIS",
  313: "BLACK_MARKET_BRAWLERS",
  315: "NEXUS_SIEGE",
  317: "DEFINITELY_NOT_DOMINION",
  318: "ALL_RANDOM_URF",
  325: "ALL_RANDOM",
  400: "DRAFT_PICK",
  410: "RANKED_DYNAMIC",
  420: "RANKED_SOLO",
  430: "NORMAL",
  440: "RANKED_FLEX",
  450: "ARAM",
  460: "TWISTED_TREELINE",
  470: "RANKED_TWISTED_TREELINE",
  600: "BLOOD_HUNT_ASSASSIN",
  610: "DARK_STAR",
  700: "CLASH",
  800: "CO_OP_VS_AI_INTERMEDIATE_BOT",
  810: "CO_OP_VS_AI_INTRO_BOT",
  820: "CO_OP_VS_AI_BEGINNER_BOT",
  830: "CO_OP_VS_AI_INTRO_BOT",
  840: "CO_OP_VS_AI_BEGINNER_BOT",
  850: "CO_OP_VS_AI_INTERMEDIATE_BOT",
  900: "URF",
  920: "KING_PORO",
  940: "NEXUS_SIEGE",
  980: "GUARDIAN_INVASION",
  990: "GUARDIAN_INVASION_ONSLAUGHT",
  1000: "OVERCHARGED",
  1010: "URF",
  1020: "ONE_FOR_ALL",
  1030: "ODYSSEY_INTRO",
  1040: "ODYSSEY_CADET",
  1050: "ODYSSEY_CREWMEMBER",
  1060: "ODYSSEY_CAPTAIN",
  1070: "ODYSSEY_ONSLAUGHT",
  1200: "NEXUS_BLITZ",
  1300: "NEXUS_BLITZ",
  1400: "ULTIMATE_SPELLBOOK",
  1090: "TEAMFIGHT_TACTICS",
  1091: "TEAMFIGHT_TACTICS_ONE_VS_ZERO",
  1092: "TEAMFIGHT_TACTICS_TWO_VS_ZERO",
  1100: "RANKED_TEAMFIGHT_TACTICS",
  1110: "TEAMFIGHT_TACTICS_TUTORIAL",
  1111: "TEAMFIGHT_TACTICS_SIMULATION",
  1130: "TEAMFIGHT_TACTICS_HYPER_ROLL",
};

const IRON = "IRON";
const BRONZE = "BRONZE";
const SILVER = "SILVER";
const GOLD = "GOLD";
const PLATINUM = "PLATINUM";
const DIAMOND = "DIAMOND";
const MASTER = "MASTER";
const GRANDMASTER = "GRANDMASTER";
const CHALLENGER = "CHALLENGER";

export const TIER_LIST = [
  IRON,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
  MASTER,
  GRANDMASTER,
  CHALLENGER,
];

export const TIER_NONE = "NONE";

export const TIER_UNRANKED = [MASTER, GRANDMASTER, CHALLENGER];

export const GAME_LOL_RANK_COLORS = {
  iron: {
    fill: "#817678",
    text: "#a29294",
  },
  bronze: {
    fill: "#9F6347",
    text: "#b97452",
  },
  silver: {
    fill: "#80989D",
    text: "#a2c1c7",
  },
  gold: {
    fill: "#CD8837",
    text: "#f1a64e",
  },
  platinum: {
    fill: "#4E9996",
    text: "#63b7b4",
  },
  diamond: {
    fill: "#576BCE",
    text: "#748df9",
  },
  master: {
    fill: "#9D48E0",
    text: "#A952E5",
  },
  grandmaster: {
    fill: "#D94444",
    text: "#ef4f4f",
  },
  challenger: {
    fill: "#F4C874",
    text: "#F4C874",
  },
  none: {
    fill: "var(--shade6)",
    text: "var(--shade3)",
  },
};

export const SEASON_FILTERS = {
  PRESEASON: "preSeason",
  SEASON: "season",
  PREV20: "prev20",
};

export const LOL_GRADE_COLORS = {
  "S+": "var(--pro-solid)",
  S: "var(--pro-solid)",
  "S-": "#49B4FF",
  "A+": "var(--turq)",
  A: "var(--turq)",
  "A-": "var(--turq)",
  "B+": "var(--turq)",
  B: "#9DD5D7",
  "B-": "#9DD5D7",
  "C+": "#DD7A7D",
  C: "#DD7A7D",
  "C-": "#DD7A7D",
  "D+": "#E4858F",
  D: "#F16F74",
  "D-": "var(--red)",
};

export const Z_SCORES = {
  kda: [
    { grade: "S+", score: 1.282, percentile: 0.9 },
    { grade: "S", score: 1.175, percentile: 0.88 },
    { grade: "S-", score: 1.036, percentile: 0.85 },
    { grade: "A+", score: 0.842, percentile: 0.8 },
    { grade: "A", score: 0.674, percentile: 0.75 },
    { grade: "A-", score: 0.524, percentile: 0.7 },
    { grade: "B+", score: 0.253, percentile: 0.6 },
    { grade: "B", score: 0, percentile: 0.5 },
    { grade: "B-", score: -0.385, percentile: 0.35 },
    { grade: "C+", score: -0.674, percentile: 0.25 },
    { grade: "C", score: -0.842, percentile: 0.2 },
    { grade: "C-", score: -1.036, percentile: 0.15 },
    { grade: "D+", score: -1.282, percentile: 0.1 },
    { grade: "D", score: -1.645, percentile: 0.05 },
    { grade: "D-", score: null, percentile: 0 },
  ],
  default: [
    { grade: "S+", score: 1.282, percentile: 0.9 },
    { grade: "S", score: 0.842, percentile: 0.8 },
    { grade: "A+", score: 0.524, percentile: 0.7 },
    { grade: "A", score: 0.253, percentile: 0.6 },
    { grade: "B+", score: 0, percentile: 0.5 },
    { grade: "B", score: -0.253, percentile: 0.4 },
    { grade: "C+", score: -0.524, percentile: 0.3 },
    { grade: "C", score: -0.842, percentile: 0 },
    { grade: "C-", score: null, percentile: 0 },
  ],
  dmg: [
    { grade: "S+", score: 1.282, percentile: 0.9 },
    { grade: "S", score: 1.175, percentile: 0.88 },
    { grade: "S-", score: 1.036, percentile: 0.85 },
    { grade: "A+", score: 0.842, percentile: 0.8 },
    { grade: "A", score: 0.674, percentile: 0.75 },
    { grade: "A-", score: 0.524, percentile: 0.7 },
    { grade: "B+", score: 0.253, percentile: 0.6 },
    { grade: "B", score: 0, percentile: 0.5 },
    { grade: "B-", score: -0.253, percentile: 0.4 },
    { grade: "C+", score: -0.385, percentile: 0.35 },
    { grade: "C", score: -0.524, percentile: 0.3 },
    { grade: "C-", score: -0.674, percentile: 0.25 },
    { grade: "D+", score: -0.842, percentile: 0.2 },
    { grade: "D", score: -1.036, percentile: 0.15 },
    { grade: "D-", score: -1.282, percentile: 0.1 },
    { grade: "D-", score: -1.645, percentile: 0.05 },
    { grade: "D-", score: null, percentile: 0 },
  ],
  val: [
    { grade: "S+", score: 0.842, percentile: 0.8 },
    { grade: "S", score: 0.674, percentile: 0.75 },
    { grade: "S-", score: 0.524, percentile: 0.7 },
    { grade: "A+", score: 0.385, percentile: 0.65 },
    { grade: "A", score: 0.253, percentile: 0.6 },
    { grade: "A-", score: 0.126, percentile: 0.55 },
    { grade: "B+", score: 0, percentile: 0.5 },
    { grade: "B", score: -0.126, percentile: 0.45 },
    { grade: "B-", score: -0.253, percentile: 0.4 },
    { grade: "C+", score: -0.524, percentile: 0.3 },
    { grade: "C", score: -0.674, percentile: 0.25 },
    { grade: "C-", score: -0.842, percentile: 0.2 },
    { grade: "D+", score: -1.036, percentile: 0.15 },
    { grade: "D", score: -1.282, percentile: 0.1 },
    { grade: "D-", score: -1.645, percentile: 0.05 },
    { grade: "D-", score: null, percentile: 0 },
  ],
};

export const TIER_MAP = [
  "IRON_IV",
  "IRON_III",
  "IRON_II",
  "IRON_I",
  "BRONZE_IV",
  "BRONZE_III",
  "BRONZE_II",
  "BRONZE_I",
  "SILVER_IV",
  "SILVER_III",
  "SILVER_II",
  "SILVER_I",
  "GOLD_IV",
  "GOLD_III",
  "GOLD_II",
  "GOLD_I",
  "PLATINUM_IV",
  "PLATINUM_III",
  "PLATINUM_II",
  "PLATINUM_I",
  "DIAMOND_IV",
  "DIAMOND_III",
  "DIAMOND_II",
  "DIAMOND_I",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

export const PROMOTION_STATES = {
  default: { value: 0 },
  demotion: { value: 1 },
  promotion: { value: 2 },
};

export const ROLE_SYMBOL_TO_TAB_STRING = {
  [ROLE_SYMBOLS.adc]: "bot",
  [ROLE_SYMBOLS.jungle]: "jungle",
  [ROLE_SYMBOLS.support]: "support",
  [ROLE_SYMBOLS.mid]: "mid",
  [ROLE_SYMBOLS.top]: "top",
};

export const SKILL_COLORS = ["red", "green", "blue", "yellow"];
export const SKILL_HOTKEYS = ["Q", "W", "E", "R"];
export const NOT_PURCHASABLE_ITEMS = [
  1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512,
  1515, 2001, 2007, 2008, 3901, 3902, 3903, 7000, 7001, 7002, 7003, 7004, 7005,
  7006, 7007, 7008, 7009, 7010, 7011, 7012, 7013, 7014, 7015, 7016, 7017, 7018,
  7019, 7020, 7021, 7022, 7050,
];

export const BUILD_TYPES = {
  general: "GENERAL",
  matchup: "MATCHUP",
  probuild: "PROBUILD",
  PREMIUM: "PREMIUM",
  PREMIUM_MATCHUP: "PREMIUM_MATCHUP",
  COMPETITIVE_MATCH: "COMPETITIVE_MATCH",
};

export const BOOTS = {
  1001: "basic",
  3158: "Lucidity",
  3006: "Berserkers",
  3009: "Swiftness",
  3020: "Sorcerers",
  3047: "Steelcaps",
  3111: "Mercurys",
  3117: "Mobility",
};

export const BOOTS_IDS = {
  basic: 1001,
};

export const TEAR_ITEMS = {
  tear: 3070,
  manamune: 3004,
  muramana: 3043,
  archangels: 3003,
  seraphs: 3040,
};

export const MYTHICS = {
  3078: {
    name: "Trinity Force",
    originalId: 3078,
    style: {
      t: "lol:build.playstyles.mythic.empoweredAutos",
      full: "Empowered Autos",
    },
    antiheal: [6609, 3075],
  },
  3152: {
    name: "Hextech Rocketbelt",
    originalId: 3152,
    style: {
      t: "lol:build.playstyles.mythic.gapClose",
      full: "Gap Close",
    },
    antiheal: [3165],
  },
  3190: {
    name: "Locket of the Iron Solari",
    originalId: 3190,
    style: {
      t: "lol:build.playstyles.mythic.shielding",
      full: "Shielding",
    },
    antiheal: [3011, 3075],
  },
  2065: {
    name: "Shurelya's Battlesong",
    originalId: 2065,
    style: {
      t: "lol:build.playstyles.mythic.aoeMobility",
      full: "AoE Mobility",
    },
    antiheal: [3011],
  },
  4005: {
    name: "Imperial Mandate",
    originalId: 4005,
    style: {
      t: "lol:build.playstyles.mythic.utility",
      full: "Utility",
    },
    antiheal: [3011, 3165],
  },
  4633: {
    name: "Riftmaker",
    originalId: 4633,
    style: {
      t: "lol:build.playstyles.mythic.rampingDamage",
      full: "Ramping Damage",
    },
    antiheal: [3165, 3075],
  },
  4636: {
    name: "Night Harvester",
    originalId: 4636,
    style: {
      t: "lol:build.playstyles.mythic.burst",
      full: "Burst",
    },
    antiheal: [3165],
  },
  6617: {
    name: "Moonstone Renewer",
    originalId: 6617,
    style: {
      t: "lol:build.playstyles.mythic.healing",
      full: "Healing",
    },
    antiheal: [6609],
  },
  6630: {
    name: "Goredrinker",
    originalId: 6630,
    style: {
      t: "lol:build.playstyles.mythic.sustain",
      full: "Sustain",
    },
    antiheal: [6609, 3075],
  },
  6631: {
    name: "Stridebreaker",
    originalId: 6631,
    style: {
      t: "lol:build.playstyles.mythic.engage",
      full: "Engage",
    },
    antiheal: [6609, 3075],
  },
  6632: {
    name: "Divine Sunderer",
    originalId: 6632,
    style: {
      t: "lol:build.playstyles.mythic.tankShredder",
      full: "Tank Shredder",
    },
    antiheal: [6609, 3075],
  },
  6653: {
    name: "Liandry's Anguish",
    originalId: 6653,
    style: {
      t: "lol:build.playstyles.mythic.burn",
      full: "Burn",
    },
    antiheal: [3165],
  },
  6655: {
    name: "Luden's Tempest",
    originalId: 6655,
    style: {
      t: "lol:build.playstyles.mythic.waveClear",
      full: "Wave Clear",
    },
    antiheal: [3165],
  },
  6656: {
    name: "Everfrost",
    originalId: 6656,
    style: {
      t: "lol:build.playstyles.mythic.activeSlow",
      full: "Active Slow",
    },
    antiheal: [3165, 3075],
  },
  6662: {
    name: "Frostfire Gauntlet",
    originalId: 6662,
    style: {
      t: "lol:build.playstyles.mythic.lockdown",
      full: "Lockdown",
    },
    antiheal: [3075],
  },
  6664: {
    name: "Turbo Chemtank",
    originalId: 6664,
    style: {
      t: "lol:build.playstyles.mythic.engage",
      full: "Engage",
    },
    antiheal: [3075],
  },
  3068: {
    name: "Sunfire Aegis",
    originalId: 3068,
    style: {
      t: "lol:build.playstyles.mythic.tenacity",
      full: "Tenacity",
    },
    antiheal: [3075],
  },
  6671: {
    name: "Galeforce",
    originalId: 6671,
    style: {
      t: "lol:build.playstyles.mythic.dash",
      full: "Dash",
    },
    antiheal: [3033],
  },
  6672: {
    name: "Kraken Slayer",
    originalId: 6672,
    style: {
      t: "lol:build.playstyles.mythic.trueDamage",
      full: "True Damage",
    },
    antiheal: [3033],
  },
  6673: {
    name: "Immortal Shieldbow",
    originalId: 6673,
    style: {
      t: "lol:build.playstyles.mythic.sustain",
      full: "Sustain",
    },
    antiheal: [3033],
  },
  6691: {
    name: "Duskblade of Draktharr",
    originalId: 6691,
    style: {
      t: "lol:build.playstyles.mythic.burst",
      full: "Burst",
    },
    antiheal: [6609],
  },
  6692: {
    name: "Eclipse",
    originalId: 6692,
    style: {
      t: "lol:build.playstyles.mythic.armorPenetration",
      full: "Armor Penetration",
    },
    antiheal: [6609],
  },
  6693: {
    name: "Prowler's Claw",
    originalId: 6693,
    style: {
      t: "lol:build.playstyles.mythic.gapClose",
      full: "Gap Close",
    },
    antiheal: [6609],
  },
  7000: { name: "Sandshrike's Claw", originalId: 6693 },
  7001: { name: "Syzygy", originalId: 6692 },
  7002: { name: "Draktharr's Shadowcarver", originalId: 6691 },
  7003: { name: "Turbocharged Hexperiment", originalId: 6664 },
  7004: { name: "Forgefire Crest", originalId: 3068 },
  7005: { name: "Rimeforged Grasp", originalId: 6662 },
  7006: { name: "Typhoon", originalId: 6671 },
  7007: { name: "Wyrmfallen Sacrifice", originalId: 6672 },
  7008: { name: "Bloodward", originalId: 6673 },
  7009: { name: "Icathia's Curse", originalId: 4633 },
  7010: { name: "Vespertide", originalId: 4636 },
  7011: { name: "Upgraded Aeropack", originalId: 3152 },
  7012: { name: "Liandry's Lament", originalId: 6653 },
  7013: { name: "Eye of Luden", originalId: 6655 },
  7014: { name: "Eternal Winter", originalId: 6656 },
  7015: { name: "Ceaseless Hunger", originalId: 6630 },
  7016: { name: "Dreamshatter", originalId: 6631 },
  7017: { name: "Deicide", originalId: 6632 },
  7018: { name: "Infinity Force", originalId: 3078 },
  7019: { name: "Reliquary of the Golden Dawn", originalId: 3190 },
  7020: { name: "Shurelya's Requiem", originalId: 2065 },
  7021: { name: "Starcaster", originalId: 6617 },
  7022: { name: "Seat of Command", originalId: 4005 },
};

export const ORNN_MYTHICS = Object.keys(MYTHICS).filter((id) => id >= 7000);

export const STARTERS = {
  1035: "Emberknife",
  1039: "Hailblade",

  1056: "Doran's Ring",
  1054: "Doran's Shield",
  1055: "Doran's Blade",

  3854: "Steel Shoulderguards",
  3850: "Spellthief's Edge",
  3862: "Spectral Sickle",
  3858: "Relic Shield",

  2033: "Corrupting Potion",
  3070: "Tear of the Goddess",
  1082: "Dark Seal",
  1083: "Cull",
  1036: "Long Sword",

  2051: "Guardians horn",
  3112: "Guardians orb",
  3184: "Guardians hammer",
};

export const STARTERS_IDS = {
  guardiansHorn: 2051,
  guardiansOrb: 3112,
  guardiansHammer: 3184,
  emberknife: 1035,
  hailblade: 1039,
};

export const POTIONS = { 2003: "heath", 2031: "refill" };
export const POTIONS_IDS = {
  health: 2003,
  refillable: 2031,
};

export const TRINKETS = {
  3340: "Warding",
  3348: "Sweeper",
  3361: "Greater stealth",
  3362: "Greater Vision",
  3363: "farsight",
  3364: "Oracles",
  3330: "Effigy",
};

export const WARDS = {
  2055: "Control Ward",
};

export const APHELIOS_ID = 523;

export const CHAMPION_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];

const SCALING_HEALTH = "scaling_health";
const ARMOR = "armor";
const MAGIC_RESIST = "magic_resist";
const ATTACK_SPEED = "attack_speed";
const ABILITY_HASTE = "ability_haste";
const ADAPTIVE_FORCE = "adaptive_force";

export const shardInfo = {
  5001: {
    currRune: {
      id: 5001,
      name: SCALING_HEALTH,
      shortDesc: "+15-90 HP (based on level)",
    },
  },
  5002: {
    currRune: {
      id: 5002,
      name: ARMOR,
      shortDesc: "+6 Armor",
    },
  },
  5003: {
    currRune: {
      id: 5003,
      name: MAGIC_RESIST,
      shortDesc: "+8 MR",
    },
  },
  5005: {
    currRune: {
      id: 5005,
      name: ATTACK_SPEED,
      shortDesc: "+10% Attack Speed",
    },
  },
  5007: {
    currRune: {
      id: 5007,
      name: ABILITY_HASTE,
      shortDesc: "+8 Ability Haste",
    },
  },
  5008: {
    currRune: {
      id: 5008,
      name: ADAPTIVE_FORCE,
      shortDesc: "+9 Adaptive Force",
    },
  },
};

/**
 * Rune IDs mapped to their row
 * Specifcally useful for secondary runes
 */
export const RUNE_ROWS = {
  8126: 1,
  8139: 1,
  8143: 1,
  8136: 2,
  8120: 2,
  8138: 2,
  8135: 3,
  8134: 3,
  8105: 3,
  8106: 3,
  8306: 1,
  8304: 1,
  8313: 1,
  8321: 2,
  8316: 2,
  8345: 2,
  8347: 3,
  8410: 3,
  8352: 3,
  9101: 1,
  9111: 1,
  8009: 1,
  9104: 2,
  9105: 2,
  9103: 2,
  8014: 3,
  8017: 3,
  8299: 3,
  8446: 1,
  8463: 1,
  8401: 1,
  8429: 2,
  8444: 2,
  8473: 2,
  8451: 3,
  8453: 3,
  8242: 3,
  8224: 1,
  8226: 1,
  8275: 1,
  8210: 2,
  8234: 2,
  8233: 2,
  8237: 3,
  8232: 3,
  8236: 3,
};

export const shardMap = [
  ["5008", "5005", "5007"],
  ["5008", "5002", "5003"],
  ["5001", "5002", "5003"],
];

export const shardIdList = [5008, 5005, 5007, 5002, 5003, 5001];
export const REGIONS_TO_SERVICES = {
  NA: "na1",
  EUNE: "eun1",
  EUW: "euw1",
  JP: "jp1",
  KR: "kr",
  LAN: "la1",
  LAS: "la2",
  BR: "br1",
  OCE: "oc1",
  TR: "tr1",
  RU: "ru",
  SG: "sg",
  ID: "id1",
  VN: "vn",
  TH: "th",
  TW: "tw",
  PH: "ph",
};

export const SERVICES_TO_REGIONS = Object.keys(REGIONS_TO_SERVICES).reduce(
  (obj, key) => ({
    ...obj,
    [REGIONS_TO_SERVICES[key]]: key,
  }),
  {}
);

export const regionsList = [
  {
    id: "na1",
    name: "North America",
    xlinkHref: "#region-NA",
  },
  {
    id: "euw1",
    name: "Europe West",
    xlinkHref: "#region-EUW",
  },
  {
    id: "eun1",
    name: "EU Nordic & East",
    xlinkHref: "#region-EUNE",
  },
  {
    id: "kr",
    name: "Korea",
    xlinkHref: "#region-KR",
  },
  {
    id: "jp1",
    name: "Japan",
    xlinkHref: "#region-JP",
  },
  {
    id: "br1",
    name: "Brazil",
    xlinkHref: "#region-BR",
  },
  {
    id: "la1",
    name: "Latin America North",
    xlinkHref: "#region-LAN",
  },
  {
    id: "la2",
    name: "Latin America South",
    xlinkHref: "#region-LAS",
  },
  {
    id: "oc1",
    name: "Oceania",
    xlinkHref: "#region-OCE",
  },
  {
    id: "ru",
    name: "Russia",
    xlinkHref: "#region-RU",
  },
  {
    id: "tr1",
    name: "Turkey",
    xlinkHref: "#region-TR",
  },
  {
    id: "ph",
    name: "Philippines",
    xlinkHref: "#region-PH",
  },
  {
    id: "sg",
    name: "Singapore, Malaysia, and Indonesia",
    xlinkHref: "#region-SG",
  },
  {
    id: "vn",
    name: "Vietnam",
    xlinkHref: "#region-VN",
  },
  {
    id: "th",
    name: "Thailand",
    xlinkHref: "#region-TH",
  },
];

export const POSITIVE_VANITYTAG_QUEUE_WHITELIST = [
  400, 420, 430, 440, 450, 460, 470, 900, 1010, 1020, 1200,
];
export const NEGATIVE_VANITYTAG_QUEUE_WHITELIST = [400, 420, 430, 440, 450];

export const STAT_TILE_TYPES = {
  cs: "CS",
  visionScore: "VisionScore",
  damage: "Damage",
  kda: "KDA",
  supportItem: "SupportItem",
  headshot: "Headshot",
  valKda: "valKda",
  valFirstblood: "valFirstblood",
};

export const STAT_TILE_COLORS = {
  gold: { key: "gold", bgColor: "var(--bg-gold)", color: "var(--yellow)" },
  green: { key: "green", bgColor: "var(--bg-green)", color: "var(--turq)" },
  red: { key: "red", bgColor: "var(--bg-red)", color: "var(--red)" },
  // This is a hashmap of ONLY new champion ability images
};

export const PROS_FALLBACK_IMAGE = `${appURLs.SOLOMID_RESOURCE_URL}/probuilds/img/pros/170x240/misc.png`;

// This is a hashmap of ONLY new champion ability images
export const CHAMPION_ABILITY_MAP = {
  // Fiddlesticks_P:
  //   "//raw.communitydragon.org/pbe/game/assets/characters/fiddlesticks/hud/icons2d/fiddlesticksp.png",
};

export const TEAMS_IMGS =
  "//dc75lzxypo94l.cloudfront.net/probuilds/img/teams/team_logos/150x150";

export const DEFAULT_COUNT_PER_LOAD = 20;

export const BASE_SUPPORT_ITEMS = {
  3850: 3851,
  3854: 3855,
  3858: 3859,
  3862: 3863,
};

export const TIER1_SUPPORT_ITEMS = {
  3851: 3853,
  3855: 3857,
  3859: 3860,
  3863: 3864,
};

export const ITEM_IDS = {
  stopwatch: 2420,
  zhonya: 3157,
  guardianAngel: 3026,
};

export const BUILD_FORMAT = {
  key: null,
  games: 0,
  wins: 0,
  runes: [],
  rune_shards: [],
  summoner_spells: [],
  items_starting: [],
  items_completed: [],
  items_situational: [],
  items_antiheal: [],
  items_order: [],
  skills: [],
  misc: {
    // MATCHUPS AND PROBUILDS
    opponentChampion: null,

    // PROBUILDS
    gameId: null,
    player: null,
    patch: null,
    insertedAt: null,
  },
};

export const RUNES_SPECIAL = {
  magicalFootwear: 8304,
  perfectTiming: 8313,
};

export const SUMMONER_SPELL_IDS = {
  smite: 11,
  snowball: 32,
  flash: 4,
  ignite: 14,
  teleport: 12,
};

export const UNIQUE_ITEM_PASSIVES = [
  { type: "critModifier", items: [3031, 3124] },
  { type: "manaCharge", items: [3003, 3004, 3042, 3040, 3119, 3121] },
  { type: "lifeline", items: [3053, 3156, 3155] },
  { type: "lastWhisper", items: [6694, 3036, 3035] },
  { type: "quicksilver", items: [6035, 3139] },
  { type: "hydra", items: [3748, 3074] },
  { type: "spellblade", items: [3100, 3508, 6632, 3078] },
];

export const ANTIHEAL = {
  3123: { name: "Executioner's Calling", id: 3123 },
  3033: { name: "Mortal Reminder", id: 3033 },
  6609: { name: "Chempunk Chainsword", id: 6609 },
  3076: { name: "Bramble Vest", id: 3076 },
  3075: { name: "Thornmail", id: 3075 },
  3916: { name: "Oblivion Orb", id: 3916 },
  3165: { name: "Morellonomicon", id: 3165 },
  3011: { name: "Chemtech Putrifier", id: 3011 },
};

export const KEYSTONE_STYLES = {
  8005: {
    t: "lol:build.playstyles.keystone.damageAmp",
    full: "Damage Amp",
  },
  8008: {
    t: "lol:build.playstyles.keystone.attackSpeed",
    full: "Attack Speed",
  },
  8021: {
    t: "lol:build.playstyles.keystone.mobility",
    full: "Mobility",
  },
  8010: {
    t: "lol:build.playstyles.keystone.fighter",
    full: "Fighter",
  },
  8112: {
    t: "lol:build.playstyles.keystone.burst",
    full: "Burst",
  },
  8124: {
    t: "lol:build.playstyles.keystone.engage",
    full: "Engage",
  },
  8128: {
    t: "lol:build.playstyles.keystone.execute",
    full: "Execute",
  },
  9923: {
    t: "lol:build.playstyles.keystone.attackSpeed",
    full: "Attack Speed",
  },
  8214: {
    t: "lol:build.playstyles.keystone.harass",
    full: "Harass",
  },
  8229: {
    t: "lol:build.playstyles.keystone.poke",
    full: "Poke",
  },
  8230: {
    t: "lol:build.playstyles.keystone.mobility",
    full: "Mobility",
  },
  8437: {
    t: "lol:build.playstyles.keystone.sustain",
    full: "Sustain",
  },
  8439: {
    t: "lol:build.playstyles.keystone.tank",
    full: "Tank",
  },
  8465: {
    t: "lol:build.playstyles.keystone.shielding",
    full: "Shielding",
  },
  8351: {
    t: "lol:build.playstyles.keystone.onHitSlow",
    full: "On-Hit Slow",
  },
  8360: {
    t: "lol:build.playstyles.keystone.scaling",
    full: "Scaling",
  },
  8358: {
    t: "lol:build.playstyles.keystone.adaptive",
    full: "Adaptive",
  },
  8369: {
    t: "lol:build.playstyles.keystone.adaptive",
    full: "Adaptive",
  },
};

export const CANVAS_HEIGHT = 380;
export const CANVAS_WIDTH = 672;

export const TILES_DELAY = 0.5; // [s]

export const PHASE_UNKNOWN = "Unknown";
export const PHASE_NONE = "None";
export const PHASE_WAITING_FOR_STATS = "WaitingForStats";
export const PHASE_IN_PROGRESS = "InProgress";
export const BAR_ANIMATION_DURATION = 0.8; // duration for animation [s]
export const BAR_SHOW_INTERVAL = 0.1; // Interval to show icons, [s]

export const scoreWeights = {
  distribution: {
    you: {
      ratio: 0.8,
      offset: 12,
    },
  },
};

export const FLASH_PLACEMENT_LEFT = 0;
export const FLASH_PLACEMENT_RIGHT = 1;
export const flashPlacementOptions = [
  FLASH_PLACEMENT_LEFT,
  FLASH_PLACEMENT_RIGHT,
];
