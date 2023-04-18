import getChampionFromIcon from "@/game-tft/get-champion-from-icon.mjs";

const getUnitsFromBoardPieces = (boardPieces = [], champions, matchSet) => {
  let traits = [];
  const units = [];
  boardPieces.forEach(({ icon, level }) => {
    const { champion, championName, id } = getChampionFromIcon(
      icon,
      champions,
      matchSet
    );
    if (!champion) return null;
    if (champion[matchSet]) {
      traits = [
        ...traits,
        ...champion[matchSet].origin,
        ...champion[matchSet].class,
      ];
    }
    units.push({
      id: id,
      name: championName,
      level: level,
      champ: champion,
    });
  });
  return { traits, units };
};

export default getUnitsFromBoardPieces;
