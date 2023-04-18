export function calcTotalKills(teammates = []) {
  const kills = teammates
    .map((participant) =>
      participant && participant.kills ? participant.kills : 0
    )
    .reduce((a, b) => {
      return a + b;
    }, 0);

  return kills === 0 ? 1 : kills;
}

export function calcTotalDamage(teammates = []) {
  const dmg = teammates
    .map((participant) =>
      participant && participant.totalDamageDealtToChampions
        ? participant.totalDamageDealtToChampions
        : 0
    )
    .reduce((a, b) => {
      return a + b;
    }, 0);

  return dmg;
}

export function calcKP(stats = {}, totalKills) {
  return ((stats.kills + stats.assists) / totalKills) * 100;
}
