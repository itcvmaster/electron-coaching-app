// EXEMPT
import { isPopulatedFromDB, PATH_DELIMITER } from "@/__main__/constants.mjs";
import db from "@/__main__/db.mjs";
import {
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { DEFAULT_PROFILE_ICON } from "@/game-val/constants.mjs";
import makeRangeObject from "@/util/make-range-object.mjs";

export const getGameProfileImg = (game, profileIconId) => {
  let src;

  switch (game) {
    case GAME_SYMBOL_VAL:
      src = DEFAULT_PROFILE_ICON;
      break;
    case GAME_SYMBOL_TFT:
    case GAME_SYMBOL_LOL:
    default:
      src = profileIconId && Static.getProfileIcon(profileIconId);
      break;
  }

  return src;
};

// Not exporting because private.
const __languageToRegionMap = {
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
  // nl: "en_US", // WTF??
  pt: "pt_BR",
  tr: "tr_TR",
  pl: "pl_PL",
  ru: "ru_RU",
  cs: "cs_CZ",
  cz: "cs_CZ",
  el: "el_GR",
  gr: "el_GR",
  ko: "ko_KR",
  kr: "ko_KR",
  ja: "ja_JP",
  jp: "ja_JP",
  vi: "vn_VN",
  vn: "vn_VN",
  "zh-Hans-CN": "zh_CN",
  "zh-Hant-TW": "zh_TW",
};

const __defaultRitoLanguage = __languageToRegionMap["en"];
export function getRitoLanguageCodeFromBCP47(code) {
  const result = __languageToRegionMap[code];
  return result || __defaultRitoLanguage;
}

const colorRangeArray = makeRangeObject({
  "0-45": "#FF5859",
  46: "#F16F74",
  47: "#E4858F",
  48: "#D69CAA",
  49: "#C9B2C5",
  50: "var(--shade1)",
  51: "#A4C5E6",
  52: "#8DC1EC",
  53: "#77BCF3",
  54: "#60B8F9",
  "55-100": "#49B4FF",
});

export const winRatecolorRange = (percent) => colorRangeArray[~~percent];

export function persistData(data, path) {
  if (data[isPopulatedFromDB]) return null;

  const id = path.join(PATH_DELIMITER);
  return db.upsert([[id, data]]);
}

export const getCaretColor = (diff) => {
  if (diff > 0) return "var(--turq)";
  if (diff < 0) return "var(--red)";
  return "var(--shade2)";
};

const KDA_COLORS = {
  kda1less: "#828790",
  kda1to2: "#978D87",
  kda2to4: "#C4A889",
  kda4to6: "#DEAF78",
  kda6to10: "#E6A85F",
  kda10plus: "#FF9417",
  perfect: "#ffbe05",
};

export function kdaColorStyle(kda) {
  switch (true) {
    case kda < 1:
      return KDA_COLORS.kda1less;
    case kda >= 1 && kda < 2:
      return KDA_COLORS.kda1to2;
    case kda >= 2 && kda < 4:
      return KDA_COLORS.kda2to4;
    case kda >= 4 && kda < 6:
      return KDA_COLORS.kda4to6;
    case kda >= 6 && kda < 10:
      return KDA_COLORS.kda6to10;
    case kda === "perfect":
    case kda === "Perfect":
      return KDA_COLORS.perfect;
    default:
      return KDA_COLORS.kda10plus;
  }
}

export const formatDuration = (milliseconds, format = "h:mm:ss") => {
  const normalizeTime = (time) =>
    time.toString().length === 1 ? `0${time}` : time;

  const secondsAmount = milliseconds / 1000;

  switch (format) {
    case "hh:mm:ss":
    default: {
      const hours = normalizeTime(Math.floor(secondsAmount / 3600));
      const minutes = normalizeTime(Math.floor((secondsAmount / 60) % 60));
      const seconds = normalizeTime(Math.floor(secondsAmount % 60));
      return `${hours}:${minutes}:${seconds}`;
    }
    case "h:mm:ss": {
      const hours = Math.floor(secondsAmount / 3600);
      const minutes = normalizeTime(Math.floor((secondsAmount / 60) % 60));
      const seconds = normalizeTime(Math.floor(secondsAmount % 60));
      return `${hours}:${minutes}:${seconds}`;
    }
    case "mm:ss": {
      const minutes = normalizeTime(Math.floor(secondsAmount / 60));
      const seconds = normalizeTime(Math.floor(secondsAmount % 60));
      return `${minutes}:${seconds}`;
    }
    case "m:ss": {
      const minutes = Math.floor(secondsAmount / 60);
      const seconds = normalizeTime(Math.floor(secondsAmount % 60));
      return `${minutes}:${seconds}`;
    }
    case "ss": {
      return `${secondsAmount}`;
    }
  }
};
