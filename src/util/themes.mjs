import { THEME_BLUE, THEME_DARK } from "@/app/constants.mjs";

export default {
  [THEME_DARK]: {
    key: THEME_DARK,
    title: "BlitzUI - Dark",
    nameKey: "common:settings.themes.dark",
    nameFallback: "Dark",
    cssClass: "theme-dark",
  },
  [THEME_BLUE]: {
    key: THEME_BLUE,
    title: "BlitzUI - Blue",
    nameKey: "common:settings.themes.blue",
    nameFallback: "Blue",
    cssClass: "theme-blue",
  },
};
