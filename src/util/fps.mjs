import { getLocaleRate } from "@/util/i18n-helper.mjs";

export function calcHeadshotPercent(stats, hasLegshots) {
  const total =
    stats.headshots + stats.bodyshots + (hasLegshots ? stats.legshots : 0);
  return getLocaleRate(stats.headshots * 100, total);
}

export function calcBodyshotPercent(stats, hasLegshots) {
  const total =
    stats.headshots + stats.bodyshots + (hasLegshots ? stats.legshots : 0);
  return getLocaleRate(stats.bodyshots * 100, total);
}

export function calcLegshotPercent(stats, hasLegshots) {
  const total =
    stats.headshots + stats.bodyshots + (hasLegshots ? stats.legshots : 0);
  const legshots = hasLegshots ? stats.legshots : stats.bodyshots;
  return getLocaleRate(legshots * 100, total);
}
