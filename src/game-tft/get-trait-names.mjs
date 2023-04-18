import { setTraitPrefixes } from "@/game-tft/constants.mjs";

// Riot data has inconsistent naming
export default (traitName, set = "set4") => {
  if (!traitName) return;
  const tName = (traitName || "").toLowerCase().replace(/[\s-]+/g, "");
  const names = {
    set2: {
      celestial: "Lunar",
      metal: "Steel",
      wind: "Cloud",
      forest: "Woodland",
    },
    set3: {},
    set4: {
      boss: "TheBoss",
      theboss: "TheBoss",
      wilderness: "Elderwood",
    },
    set4_5: {
      boss: "TheBoss",
      soulstealer: "Syphoner",
      theboss: "TheBoss",
      wilderness: "Elderwood",
    },
    set5: {},
    set6_5: {
      rivals: "Rival",
    },
  };
  let fixedName = names[set]?.[tName] || traitName;

  const prefixes = Object.values(setTraitPrefixes);

  prefixes.forEach((prefix) => {
    if (fixedName.startsWith(prefix)) fixedName = fixedName.replace(prefix, "");
  });

  return fixedName;
};
