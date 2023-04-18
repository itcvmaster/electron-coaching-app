import { appURLs } from "@/app/constants.mjs";
import makeStrictKeysObject from "@/util/strict-keys-object.mjs";

const staticMediaURLs = makeStrictKeysObject({
  getChampionKeyFromId(champions, championId) {
    return champions.keys[championId];
  },
  getChampionImageById(champions, championId) {
    const key = champions.keys[championId];
    return staticMediaURLs.getChampionImage(key);
  },
  getChampionSplashImageById(champions, championId) {
    const key = champions.keys[championId];
    return `${appURLs.CDN}/blitz/centered/${key}_Splash_Centered_0.webp`;
  },
  getRuneImage(runeId) {
    return `${appURLs.CDN}/runes/all/${runeId}.webp`;
  },
  getSpellImageById(spells, spellId) {
    const id = Object.keys(spells).find((key) => {
      return Number(spells[key].key) === spellId;
    });
    return staticMediaURLs.getChampionSpellImageById(id);
  },
  getChampionSplashImage(key) {
    return `${appURLs.CDN}/blitz/centered/${key}_0.webp`;
  },
  getChampionSpellImageById(id) {
    return `${appURLs.CDN}/blitz/lol/spell/${id}.webp`;
  },
  getChampionPassiveImageById(passiveId) {
    return `${appURLs.CDN}/blitz/lol/passive/${passiveId.replace(
      ".png",
      ".webp"
    )}`;
  },
  getItemImage(itemId) {
    return `${appURLs.CDN}/blitz/lol/item/${itemId}.webp`;
  },
  getProfileIcon(iconId) {
    if (!iconId) iconId = 26;
    return `${appURLs.CDN}/blitz/lol/profileicon/${iconId}.webp`;
  },
  getChampionImage(key) {
    return `${appURLs.CDN}/blitz/lol/champion/${key}.webp`;
  },
  getRankImage(tier, size) {
    const base = `${appURLs.CDN}/ranks/2022`;
    if (!tier || typeof tier !== "string") return `${base}/unranked.webp`;
    if (size && typeof size === "number") {
      return `${appURLs.CDN}/${size}x0/ranks/2022/${tier.toLowerCase()}.webp`;
    }
    return `${base}/${tier.toLowerCase()}.webp`;
  },
  getProTeamIamge(teamImg) {
    return `${appURLs.CDN}/probuilds/img/teams/${teamImg}`;
  },
});

export default staticMediaURLs;
