import { ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import orderArrayBy from "@/util/order-array-by.mjs";

// Function for computing player champion stats
export function computeChampionStats(stats = [], limit) {
  if (!stats) return [];

  const _champions = stats.slice(0, limit).map((champ) => {
    const fEntry = {
      id: champ.championId,
      kills: 0,
      deaths: 0,
      assists: 0,
      games: 0,
      wins: 0,
      lp: 0,
      winrate: 0,
      kda: 0,
      role: "",
    };

    const roleData = ROLE_SYMBOL_TO_STR[champ.role];
    fEntry.kills += champ.basicStats.kills;
    fEntry.deaths += champ.basicStats.deaths;
    fEntry.assists += champ.basicStats.assists;
    fEntry.games += champ.gameCount;
    fEntry.wins += champ.basicStats.wins;
    fEntry.lp += champ.basicStats.lp ?? 0;
    fEntry.role += roleData?.key ?? "";

    fEntry.winrate = (fEntry.wins / fEntry.games) * 100;
    fEntry.kda =
      (fEntry.kills + fEntry.assists) / (fEntry.deaths > 0 ? fEntry.deaths : 1);
    return fEntry;
  });

  const champions = orderArrayBy(
    _champions,
    ["lp", "games", "winrate"],
    ["desc", "desc", "desc"]
  );
  return champions;
}
