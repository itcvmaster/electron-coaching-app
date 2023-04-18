import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import {
  REGION_LIST,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import getUnitsFromBoardPieces from "@/game-tft/get-units-from-board-pieces.mjs";
import StaticTFT from "@/game-tft/static.mjs";

const all = ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].key;

export default function useProBuilds({ filters }) {
  const state = useSnapshot(readState);
  const matches = state.tft.matches;
  const summoners = state.tft.proSummoners;
  const champions = state.tft.champions;
  if (!Array.isArray(summoners) || !summoners.length) return [];
  const set = new Set();
  const results = Object.values(matches)
    .sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt))
    .reduce((acc, item) => {
      const match = item.data;
      let players = match.data || [];
      if (Array.isArray(match.players)) players = players.concat(match.players);
      for (const player of players) {
        const summoner = summoners.find((summoner) => {
          return (
            summoner.puuid === player.puuid ||
            summoner.name === player.summonerName
          );
        });
        if (summoner && !set.has(match.matchid)) {
          set.add(match.matchid);
          if (filterMatches({ match, summoner, champions, player, filters })) {
            acc.push({
              game: {
                createdAt: match.createdAt,
                queueId: match.queueId,
                region: match.region,
                matchid: match.matchid,
                patch: match.patch,
              },
              summoner,
              player,
            });
          }
        }
      }
      return acc;
    }, []);
  set.clear();
  return results;
}

function filterMatches({ match, summoner, champions, player, filters }) {
  const isChampion = getChampion(filters.champions, {
    match,
    player,
    champions,
  });
  const isRegion = getRegion(filters.region, {
    match,
    player,
    summoner,
  });
  const isClass = getClassOrOrigin(filters.classes, { match, player });
  const isOrigin = getClassOrOrigin(filters.origins, { match, player });
  const isTop4 = getTop4(filters.top4Only, player);
  return [isChampion, isRegion, isClass, isOrigin, isTop4].every((i) => i);
}

function getChampion(champion, { match, player, champions }) {
  if (typeof champion === "undefined" || champion === all) return true;
  const matchSet = StaticTFT.getMatchSetByDate(match.createdAt);
  const { units } =
    { units: player.units } ||
    getUnitsFromBoardPieces(player.boardPieces, champions, matchSet);
  return !!units?.find((unit) =>
    new RegExp(champion, "i").test(unit.character_id)
  );
}

function getRegion(region, { match, player, summoner }) {
  return (
    region === REGION_LIST[0].key ||
    [match.region, player.region, summoner.region].some((i) => i === region)
  );
}

function getClassOrOrigin(target, { match, player }) {
  const result =
    target === all ||
    player.traits?.find((i) => new RegExp(target, "i").test(i.name));
  if (result) return result;
  const matchSet = StaticTFT.getMatchSetByDate(match.createdAt);
  const champions = readState.tft.champions;
  const { traits } = getUnitsFromBoardPieces(
    player.boardPieces,
    champions,
    matchSet
  );
  return !!traits.find((i) => new RegExp(target, "i").test(i.name));
}

function getTop4(isTop4, player) {
  return (
    /false/i.test(isTop4) ||
    [player.rank, player.placement].some((i) => typeof i === "number" && i < 5)
  );
}
