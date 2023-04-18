import { appURLs } from "@/app/constants.mjs";
import TftColor from "@/game-tft/colors.mjs";
import { setDates, setUnitPrefixes } from "@/game-tft/constants.mjs";
import makeStrictKeysObject from "@/util/strict-keys-object.mjs";

const staticTftMediaURLs = makeStrictKeysObject({
  getItemImage(key, set) {
    let url = "";
    if (typeof key !== "string") return url;
    url += `${appURLs.CDN}/blitz/tft/items/`;
    if (typeof set === "string") url += `${set}/`;
    return url + `${key}.webp`;
  },
  getChampionImage(key, set) {
    if (
      typeof key === "string" &&
      typeof set === "string" &&
      key.length &&
      set.length
    ) {
      return `${appURLs.CDN}/blitz/tft/champion_squares/${set}/${key}.png`;
    }
    if (typeof key === "string" && key.length) {
      return `${appURLs.CDN}/blitz/tft/champion_squares/set1/${key}.png`;
    }
    return "";
  },
  getChampName(key) {
    let name = key || "";
    const prefixes = Object.values(setUnitPrefixes);

    prefixes.forEach((prefix) => {
      if (name.startsWith(prefix)) name = name.replace(prefix, "");
    });

    switch (true) {
      case name === "TFT_TrainingDummy" ||
        name === "TFT_ItemUnknown" ||
        name === "rainingDummy":
        return "TrainingDummy";
      case name.includes("Lux"):
        return "Lux";
      case name.includes("Qiyana"):
        return "Qiyana";
      case name === "LeBlanc":
        return "Leblanc";
      case name === "Wukong":
        return "WuKong";
      case name === "ChoGath":
        return "Chogath";
      case name === "Kaisa":
        return "KaiSa";
      case name === "KhaZix":
        return "Khazix";
      default:
        return name.replaceAll("_", "");
    }
  },
  fixChampKey(key) {
    switch (key) {
      case "Wukong":
        return "WuKong";
      case "ChoGath":
        return "Chogath";
      case "Kaisa":
        return "KaiSa";
      case "KhaZix":
        return "Khazix";
      default:
        return key.replaceAll("_", "");
    }
  },
  getChampElement(key) {
    let champElement;

    switch (true) {
      case key.includes("Lux"):
        champElement = key.replace("Lux", "");
        return champElement;
      case key.includes("Qiyana"):
        champElement = key.replace("Qiyana", "");
        if (champElement === "Woodland") champElement = "Mountain";
        return champElement;
      default:
        return (champElement = null);
    }
  },
  inferTraitsFromUnits({
    units = [],
    traitsStaticData = {},
    unitsStaticData = {},
    matchSet,
  }) {
    const inferredTraits = [];
    if (!units.length) return inferredTraits;

    // Obj map to keep track of aggregate count of traits
    const traitTally = {};

    // Loop through units to count traits
    for (const unit of units) {
      const unitKey = staticTftMediaURLs.getChampName(unit.character_id);
      const unitInfo = unitsStaticData[unitKey]?.[matchSet];
      if (!unitInfo) continue;

      const unitTraits = [...unitInfo.class, ...unitInfo.origin];

      for (const unitTrait of unitTraits) {
        if (traitTally[unitTrait]) {
          traitTally[unitTrait] += 1;
        } else {
          traitTally[unitTrait] = 1;
        }
      }
    }
    // Loop through traits count aggregate to determine
    // if the count met the requirements
    for (const trait of Object.entries(traitTally)) {
      const [traitKey, traitCount] = trait;
      const traitInfo = traitsStaticData[traitKey];
      if (!traitInfo) continue;

      const { bonuses } = traitInfo;
      let styleMet = 0;
      let unitsMet = 0;

      for (const bonus of bonuses) {
        if (traitCount >= bonus.needed) {
          styleMet = bonus.style;
          unitsMet = bonus.needed;
        }
      }

      if (unitsMet) {
        inferredTraits.push({
          name: traitKey,
          style: styleMet,
          num_units: traitTally[traitKey],
          tier_current: styleMet,
          tier_total: bonuses.length,
          tier_units_required: unitsMet,
        });
      }
    }

    return inferredTraits.sort(
      (a, b) => b.style * 10 - a.style * 10 + (b.num_units - a.num_units)
    );
  },
  getMatchSetByDate(matchDate) {
    let set = "set4";
    for (let i = 0; i < setDates.length; i++) {
      const date = setDates[i];
      if (new Date(matchDate || Date.now()) > new Date(date.date)) {
        set = date.set;
        break;
      }
    }
    return set;
  },
  getStatsKey({ rank, region, sort }) {
    return `${rank.toLowerCase()}_${region}_${sort}`;
  },
  getRarityFromTier(rarity) {
    return TftColor.rarity[`${rarity}`.match(/([1-5|7])/)[0]] || "transparent";
  },
  getHyperRollRankImage(name) {
    return `${appURLs.CDN}/ranks/tft-hyper-roll/${name.toLowerCase()}.png`;
  },
});

export default staticTftMediaURLs;
