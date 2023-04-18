import makeRangeObject from "@/util/make-range-object.mjs";

export const wepColorRange = (percent) =>
  makeRangeObject({
    "0-2": "var(--shade3)",
    "2-15": "var(--blue)",
    "16-30": "var(--blue)",
    "31-50": "var(--blue)",
    "51-100": "var(--blue)",
  })[Math.floor(percent)];

export const wepOpacityRange = (percent) =>
  makeRangeObject({
    "0-2": 0.2,
    "2-15": 0.3,
    "16-30": 0.5,
    "31-50": 0.65,
    "51-100": 1.0,
  })[Math.floor(percent)];
