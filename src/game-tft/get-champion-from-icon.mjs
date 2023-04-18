import StaticTFT from "@/game-tft/static.mjs";

const convertNameToId = (name, allChampions) => {
  return (allChampions[name] && allChampions[name].id) || null;
};

const getChampionFromId = (cid, champions) =>
  Object.values(champions).find(({ id }) => id === cid);

export default (icon, champions) => {
  const data = {
    champion: null,
    id: null,
    championName: null,
  };
  // As of patch 9.24 Riot returns a different
  // string via DLL for the boardPieces
  if (icon.includes("/HUD/")) {
    const idFromIconRegex = /Characters\/(.*)\/HUD/;
    const matchedStr = idFromIconRegex.exec(icon);
    const name = StaticTFT.getChampName(matchedStr?.[1]);

    data.id = convertNameToId(name, champions);
    data.champion = getChampionFromId(data.id, champions) || {};
    data.championName = name;
  } else if (icon.includes("/Skins/")) {
    const idFromIconRegexAlt = /Characters\/(.*)\/Skins/;
    const matchedStrAlt = idFromIconRegexAlt.exec(icon);
    const name = StaticTFT.getChampName(matchedStrAlt?.[1]);

    data.id = convertNameToId(name, champions);
    data.champion = getChampionFromId(data.id, champions) || {};
    data.championName = name;
  } else {
    // fallback for matches pre 9.24
    const idFromIconRegex = /\/([0-9]*?)\.png/;
    data.id = (idFromIconRegex.exec(icon) || [])[1];
    data.champion = getChampionFromId(data.id, champions) || {};
    data.championName = data.champion.name;
  }

  return data;
};
