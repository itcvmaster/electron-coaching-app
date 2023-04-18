import {
  GAME_ICONS,
  GAME_NAME_MAP,
  GAME_SHORT_NAMES,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import { FilterIcons } from "@/feature-arena/m-assets.mjs";

export const whitelistedGameSymbols = new Set([
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_VAL,
]);

export const TABS_HUB = ["discover", "yours"];
export const TABS_EVENT = ["overview", "scoring", "rewards", "faq"];

export const FilterOptions = [
  {
    href: "",
    name: ["arena:filter.all", "All Games"],
    icon: FilterIcons.ALL,
  },
];

for (const gameSymbol of whitelistedGameSymbols) {
  FilterOptions.push({
    href: `/${GAME_SHORT_NAMES[gameSymbol]}`,
    name: GAME_NAME_MAP[gameSymbol],
    icon: GAME_ICONS[gameSymbol],
    gameSymbol,
  });
}

export const LEADERBOARD_PAGE_SIZE = 12;
export const LEADERBOARD_FETCH_COUNT = LEADERBOARD_PAGE_SIZE * 10;
export const ARENA_ASSETS_URL = `https://blitz-cms-iesdev.blitz.gg/challenge_assets/`;
export const getFullAssetsUrl = (filename) => `${ARENA_ASSETS_URL}${filename}`;

export const RankColors = {
  FIRST: "var(--yellow)",
  SECOND: "var(--shade1)",
  THIRD: "#A78260",
};
