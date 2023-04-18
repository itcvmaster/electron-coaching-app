import styleToColor from "@/game-tft/get-style-to-color.mjs";

export const colorFromCount = (trait, count, setTraits) => {
  if (!trait || !count || !setTraits) return "";

  if (setTraits[trait]) {
    let curBonus = setTraits[trait].bonuses[0];
    for (const bonus of setTraits[trait].bonuses) {
      if (count >= bonus.needed && bonus.needed > curBonus.needed) {
        curBonus = bonus;
      }
    }

    return styleToColor(curBonus.style);
  }
  return "";
};
