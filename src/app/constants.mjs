// EXEMPT
// APP WIDE GLOBAL CONSTANTS

import GameShapeApex from "@/inline-assets/GameShapeApex.svg";
import GameShapeLoL from "@/inline-assets/GameShapeLoL.svg";
import GameShapeTFT from "@/inline-assets/GameShapeTFT.svg";
import GameShapeVal from "@/inline-assets/GameShapeVal.svg";
import globals from "@/util/global-whitelist.mjs";
import makeStrictKeysObject from "@/util/strict-keys-object.mjs";
import symbolName from "@/util/symbol-name.mjs";

// This is an object because we want these key values to be looked up in runtime.
// BE CAREFUL **NOT** TO MEMOIZE ANY OF THESE URLS! Always prefer key lookup.
// For example: `appURLs.CDN`, NOT `const { CDN } = appURLs;`
export const appURLs = makeStrictKeysObject({
  LOL_CHAMPION_AGGREGATE: "https://league-champion-aggregate.iesdev.com",
  LOL_LEAGUE_PLAYER: "https://league-player.iesdev.com",
  RIOT: "https://riot.iesdev.com",
  VALORANT: "https://valorant.iesdev.com",
  VALORANT_DATA: "https://data.iesdev.com/api/valorant",
  CDN: "https://blitz-cdn.blitz.gg",
  CDN_WEB: "https://blitz-cdn-web.blitz.gg",
  CDN_PLAIN: "https://blitz-cdn-plain.blitz.gg",
  UTILS: "https://utils.iesdev.com",
  UTILS_STATIC: "https://utils.iesdev.com/static/json",
  CDN_VIDEOS: "https://blitz-cdn-videos.blitz.gg",
  CMS: "https://cms-api.iesdev.com",
  TFT: "https://tft.iesdev.com",
  TFT_GRAPHQL: "https://tft.iesdev.com/graphql",
  TFT_AGGREGATE: "https://tft-aggr.iesdev.com",
  PROBUILDS_URL: "https://probuilds.iesdev.com",
  SOLOMID_RESOURCE_URL: "https://solomid-resources.blitz.gg",
  BLITZ_STABLE_WINDOWS: `https://blitz-stable.blitz.gg/beta.yml`,
  BLITZ_STABLE_MAC: `https://dl.blitz.gg/feed/channel/beta.atom`,
});

globals.__BLITZ_DEV__.appURLs = appURLs;

export const MIN_STRING_DISTANCE = 0.8;

// This refers to the file extension used by esbuild output. By default,
// it is .js, but .mjs is preferred.
export const JS_FILE_EXTENSION = ".mjs";

export const hardCodeURLs = makeStrictKeysObject({
  RITO_THIRD_PARTY:
    "https://support.riotgames.com/hc/en-us/articles/225266848-Third-Party-Applications",
  BLITZ_SUPPORT: "https://support.blitz.gg",
  BLITZ_FACEBOOK: "https://www.facebook.com/theblitzapp/",
  BLITZ_TWITTER: "https://twitter.com/theblitzapp",
  BLITZ_INSTAGRAM: "https://www.instagram.com/theblitzapp/",
  BLITZ_DISCORD: "https://blitz.gg/discord",
  BLITZ_NAVER: "https://cafe.naver.com/blitzgg",
  BLITZ_MEDIUM: "https://medium.com/blitz-press",
});

export const FALLBACK_IMAGE_URL = `${appURLs.CDN_PLAIN}/blitz/ui/img/fallback.svg`;

export const GRID_ICON_URL = `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/grid.svg`;

// Split these up so they cause build-time errors if they are mis-used.
export const GAME_SYMBOL_UNKNOWN = symbolName("unknown");
export const GAME_SYMBOL_LOL = symbolName("lol");
export const GAME_SYMBOL_TFT = symbolName("tft");
export const GAME_SYMBOL_LOR = symbolName("lor");
export const GAME_SYMBOL_VAL = symbolName("val");
export const GAME_SYMBOL_FN = symbolName("fn");
export const GAME_SYMBOL_CSGO = symbolName("csgo");
export const GAME_SYMBOL_APEX = symbolName("apex");

export const GAME_ICONS = {
  [GAME_SYMBOL_LOL]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/LOL-small.svg`,
  [GAME_SYMBOL_TFT]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/TFT3-small.svg`,
  [GAME_SYMBOL_LOR]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/LoR-small.svg`,
  [GAME_SYMBOL_VAL]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/VAL-small.svg`,
  [GAME_SYMBOL_FN]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/FN-small.svg`,
  [GAME_SYMBOL_CSGO]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/CSGO-small.svg`,
  [GAME_SYMBOL_APEX]: `${appURLs.CDN_PLAIN}/blitz/ui/images/icons/games/small/APEX-small.svg`,
};

export const GAME_ICON_SHAPES = {
  [GAME_SYMBOL_LOL]: GameShapeLoL,
  [GAME_SYMBOL_TFT]: GameShapeTFT,
  [GAME_SYMBOL_VAL]: GameShapeVal,
  [GAME_SYMBOL_APEX]: GameShapeApex,
};

export const GAME_SHORT_NAMES = {
  [GAME_SYMBOL_UNKNOWN]: "unknown",
  [GAME_SYMBOL_LOL]: "lol",
  [GAME_SYMBOL_TFT]: "tft",
  [GAME_SYMBOL_LOR]: "lor",
  [GAME_SYMBOL_VAL]: "valorant",
  [GAME_SYMBOL_FN]: "fn",
  [GAME_SYMBOL_CSGO]: "csgo",
  [GAME_SYMBOL_APEX]: "apex",
};
export const GAME_SYMBOL_BY_SHORT_NAME = Object.getOwnPropertySymbols(
  GAME_SHORT_NAMES
).reduce((hash, symbol) => {
  const shortName = GAME_SHORT_NAMES[symbol];
  hash[shortName] = symbol;
  return hash;
}, {});

export const GAME_ICON_MAP = {
  [GAME_SYMBOL_LOL]: GAME_ICONS.lol,
  [GAME_SYMBOL_TFT]: GAME_ICONS.tft,
  [GAME_SYMBOL_LOR]: GAME_ICONS.lor,
  [GAME_SYMBOL_VAL]: GAME_ICONS.valorant,
  [GAME_SYMBOL_FN]: GAME_ICONS.fn,
  [GAME_SYMBOL_CSGO]: GAME_ICONS.csgo,
  [GAME_SYMBOL_APEX]: GAME_ICONS.apex,
};

export const GAME_NAME_MAP = {
  [GAME_SYMBOL_LOL]: ["common:games.lol.long", "League of Legends"],
  [GAME_SYMBOL_TFT]: ["common:games.tft.long", "Teamfight Tactics"],
  [GAME_SYMBOL_LOR]: ["common:games.lor.long", "Legends of Runeterra"],
  [GAME_SYMBOL_VAL]: ["common:games.val.long", "Valorant"],
  [GAME_SYMBOL_FN]: ["common:games.fn.long", "Fortnite"],
  [GAME_SYMBOL_CSGO]: [
    "common:games.csgo.long",
    "Counter Strike: Global Offensive",
  ],
  [GAME_SYMBOL_APEX]: ["common:games.apex.long", "Apex Legends"],
};

export const GAME_ACTIVE_MAP = {
  [GAME_SYMBOL_UNKNOWN]: false,
  [GAME_SYMBOL_LOL]: true,
  [GAME_SYMBOL_TFT]: false,
  [GAME_SYMBOL_LOR]: false,
  [GAME_SYMBOL_VAL]: false,
  [GAME_SYMBOL_FN]: false,
  [GAME_SYMBOL_CSGO]: false,
  [GAME_SYMBOL_APEX]: false,
};

export const GAME_COLORS = {
  [GAME_SYMBOL_LOL]: "#d5a038",
  [GAME_SYMBOL_TFT]: "#EF952A",
  [GAME_SYMBOL_VAL]: "#FF4654",
  [GAME_SYMBOL_APEX]: "#E2312E",
};

export const LOCALES = [
  ["en", "English"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["fr", "Français"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português"],
  ["pl", "Polski"],
  ["ru", "Русский"],
  ["tr", "Türkçe"],
  ["cs", "Čeština"],
  ["el", "Ελληνικά"],
  ["ko", "한국어"],
  ["ja", "日本語"],
  ["vi", "Tiếng Việt"],
  ["zh-Hans-CN", "简体中文"],
  ["zh-Hant-TW", "繁體中文"],
];

export const TOOLTIP_MAX_WIDTH = 400;

export const THEME_DARK = "DARK";
export const THEME_BLUE = "BLUE";
