import getKP from "@/game-lol/get-kill-participation.mjs";
import normalize from "@/game-lol/normalize.mjs";
import { calcKDA } from "@/util/helpers.mjs";
import orderArrayBy from "@/util/order-array-by.mjs";

export default function (matchData) {
  if (!matchData) return [];

  const orderedParticipants = [];

  const { participants } = matchData;
  if (!Array.isArray(participants) || participants.length === 0) return [];
  const team100 = participants.filter((player) => player.teamId === 100);
  const team200 = participants.filter((player) => player.teamId === 200);
  const teamBoth = [...participants];
  const numPlayers = teamBoth.length;

  const teamKills = {
    100: team100.reduce((acc, curr) => acc + curr.kills, 0),
    200: team200.reduce((acc, curr) => acc + curr.kills, 0),
  };

  // KDA
  const kdaSorted = orderArrayBy(
    teamBoth,
    (p) => calcKDA(p?.kills, p?.deaths, p?.assists),
    "desc"
  );
  const highestKDA =
    kdaSorted && kdaSorted.length > 0
      ? calcKDA(
          kdaSorted[0]?.kills,
          kdaSorted[0]?.deaths,
          kdaSorted[0]?.assists
        )
      : 1; // 1 to prevent issues when deviding bt (0)
  const lowestKDA =
    kdaSorted && kdaSorted.length > 0
      ? calcKDA(
          kdaSorted[numPlayers - 1]?.kills,
          kdaSorted[numPlayers - 1]?.deaths,
          kdaSorted[numPlayers - 1]?.assists
        )
      : 1; // 1 to prevent issues when deviding bt (0)

  // Damage
  const damageSorted = orderArrayBy(
    teamBoth,
    (p) => p.totalDamageDealtToChampions,
    "desc"
  );
  const highestDamage = damageSorted[0].totalDamageDealtToChampions;
  const lowestDamage = damageSorted[numPlayers - 1].totalDamageDealtToChampions;

  // Kill participation
  const kpSorted = orderArrayBy(
    teamBoth,
    (p) => getKP(p, teamKills[p.teamId]),
    "desc"
  );
  const highestKp = getKP(kpSorted[0], teamKills[kpSorted[0].teamId]);
  const lowestKp = getKP(
    kpSorted[numPlayers - 1],
    teamKills[kpSorted[numPlayers - 1].teamId]
  );

  // Vision score
  const visionSorted = orderArrayBy(teamBoth, (p) => p.visionScore, "desc");
  const highestVision = visionSorted[0].visionScore;
  const lowestVision = visionSorted[numPlayers - 1].visionScore;

  // Tower Damage
  const towerDmgSorted = orderArrayBy(
    teamBoth,
    (p) => p.damageDealtToTurrets,
    "desc"
  );
  const highestTowerDmg = towerDmgSorted[0].damageDealtToTurrets;
  const lowestTowerDmg = towerDmgSorted[numPlayers - 1].damageDealtToTurrets;

  // Healing (only used for support)
  const healingSorted = orderArrayBy(teamBoth, (p) => p.totalHeal, "desc");
  const highestHealing = healingSorted[0].totalHeal;
  const lowestHealing = healingSorted[numPlayers - 1].totalHeal;

  // Dmg mitigated (only used for support)
  const mitigatedSorted = orderArrayBy(
    teamBoth,
    (p) => p.damageSelfMitigated,
    "desc"
  );
  const highestMitigated = mitigatedSorted[0].damageSelfMitigated;
  const lowestMitigated = mitigatedSorted[numPlayers - 1].damageSelfMitigated;

  participants.forEach((p) => {
    const kda = calcKDA(p?.kills, p?.deaths, p?.assists);
    const normKDA = normalize(kda, highestKDA, lowestKDA);
    const normDamage = normalize(
      p.totalDamageDealtToChampions,
      highestDamage,
      lowestDamage
    );
    const normKP = normalize(
      getKP(p, teamKills[p.teamId]),
      highestKp,
      lowestKp
    );
    const normVision = normalize(p.visionScore, highestVision, lowestVision);
    const normTowerDmg = normalize(
      p.damageDealtToTurrets,
      highestTowerDmg,
      lowestTowerDmg
    );
    const normHealing = normalize(p.totalHeal, highestHealing, lowestHealing);
    const normMitigated = normalize(
      p.damageSelfMitigated,
      highestMitigated,
      lowestMitigated
    );

    const victoryPts = p.win ? 0.5 : 0;

    const healingPts = p.role === "SUPPORT" ? normHealing * 1.5 : 0;
    const tankPts = p.role === "SUPPORT" ? normMitigated * 1.25 : 0;

    const kdaPts = normKDA * 2.25;
    const dmgPts = normDamage * 2.5;
    const kpPts = normKP * 2.75;
    const visionPts = normVision * 1;
    const towerPts = normTowerDmg * 1;

    const total =
      kdaPts +
      dmgPts +
      kpPts +
      visionPts +
      towerPts +
      healingPts +
      tankPts +
      victoryPts;

    // normalized scores for each champ
    orderedParticipants.push({
      championId: p.championId,
      teamId: p.teamId,
      kda: kdaPts,
      dmg: dmgPts,
      kp: kpPts,
      vision: visionPts,
      towerDmg: towerPts,
      healing: healingPts,
      tank: tankPts,
      victory: victoryPts,
      total,
    });
  });

  return orderArrayBy(orderedParticipants, "total", "desc");
}
