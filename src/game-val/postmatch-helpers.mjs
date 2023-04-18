import clone from "@/util/clone.mjs";
import orderBy from "@/util/order-array-by.mjs";

const mergeObj = (obj, exObj) => {
  if (obj) {
    Object.entries(obj).forEach(([key, val]) => {
      let newVal = exObj[key];
      if (typeof val === "object") {
        newVal = newVal ? mergeObj(val, newVal) : clone(val);
      } else {
        newVal = (newVal || 0) + val;
      }
      exObj[key] = newVal;
    });
  }
  return exObj;
};

// KILL_RANGES
const KILL_RANGES = {
  SHORT: "short",
  MEDIUM: "medium",
  LONG: "long",
  UNKNOWN: "unknown",
};

const VALORANT_STATS = {
  kills: 0,
  score: 0,
  deaths: 0,
  assists: 0,
  roundsPlayed: 0,
  playtimeMillis: 0,
  wins: 0,
  ties: 0,
  roundsWon: 0,
  matches: 0,
  damageStats: {
    damage: 0,
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
  },
  weaponStats: {},
  weaponDamageStats: {},
  expandedWeaponDamageStats: {},
  pistolRoundWeaponDamageStats: {},
  weaponKDStats: {},
  economy: 0,
  abilityCasts: {
    grenadeCasts: 0,
    ability1Casts: 0,
    ability2Casts: 0,
    ultimateCasts: 0,
  },
  plants: 0,
  defuses: 0,
  firstBloodsTaken: 0,
  firstBloodsGiven: 0,
  roundsWonWhenFirstBloodTaken: 0,
  roundsLostWhenFirstBloodGiven: 0,
  lastKills: 0,
  duelStats: {
    duelsWon: 0,
    duelsLost: 0,
    duelsPlayed: 0,
  },
  expandedWeaponDuelStats: {},
};
const VALORANT_STATS_WITH_AGENTS = {
  ...clone(VALORANT_STATS),
  agentsStats: {},
  mapStats: {},
};

function getDeathmatchPosition({ players, playerId }) {
  const playerStats = players.map((p) => ({
    kills: (p.stats && p.stats.kills) || 0,
    score: (p.stats && p.stats.score) || 0,
    id: p.subject || p.puuid,
  }));
  return (
    orderBy(playerStats, ["kills", "score"], ["desc", "desc"]).findIndex(
      (p) => p.id === playerId
    ) + 1 || players.length
  );
}

export function getMatchOutcomeForTeam({
  players,
  playerTeam = {},
  teams = [],
  queue = "",
}) {
  if (queue === "deathmatch") {
    const deathmatchPosition = getDeathmatchPosition({
      players,
      playerId: playerTeam.teamId,
    });

    if (deathmatchPosition / teams.length <= 0.5) {
      return "win";
    }
    return "loss";
  }
  const playerTeamID = playerTeam.teamId;
  const enemyTeam = teams.find((t) => t.teamId !== playerTeamID);

  const playerWon = playerTeam && playerTeam.won;
  const enemyWon = enemyTeam && enemyTeam.won;

  if (playerWon) {
    return "win";
  }
  if (enemyWon) {
    return "loss";
  }

  return "tie";
}

export function getRoundAtkOrDef(mode, roundNum, playerTeamColor) {
  let roundType = "attacking";

  switch (mode) {
    case "bomb":
      if (
        (roundNum > 11 && playerTeamColor === "Red") ||
        (roundNum <= 11 && playerTeamColor === "Blue")
      ) {
        roundType = "defending";
      }
      break;
    case "quickbomb":
      // round 0, 1, 2 - Blue defending, Red attacking
      // round 3, 4, 5 - Blue attacking, Red defending
      // round 6 - tie breaker
      if (
        (roundNum > 2 && playerTeamColor === "Red") ||
        (roundNum <= 2 && playerTeamColor === "Blue")
      ) {
        roundType = "defending";
      }
      break;
    case "oneforall":
      // round 0, 1, 2, 3 - Blue defending, Red attacking
      // round 4, 5, 6, 7 - Blue attacking, Red defending
      // round 8 - tie breaker
      if (
        (roundNum > 3 && playerTeamColor === "Red") ||
        (roundNum <= 3 && playerTeamColor === "Blue")
      ) {
        roundType = "defending";
      }
      break;
    default:
      break;
  }

  return roundType;
}

export const getKillsFromRoundResults = (roundResults = []) => {
  let kills = [];
  for (const { roundNum, playerStats } of roundResults) {
    const roundKills = playerStats.map(({ kills }) => kills).flat();
    kills = kills.concat(
      roundKills.map((kill) => ({
        round: roundNum,
        ...kill,
      }))
    );
  }

  return orderBy(kills, "gameTime", "asc");
};

export const getWeaponStats = (kills, weaponStats = {}, type = "subject") =>
  kills.reduce(
    (
      weaponStats,
      { finishingDamage, victimLocation, playerLocations, killer }
    ) => {
      if (finishingDamage.damageType !== "Weapon") return weaponStats;

      const isAltFire = finishingDamage.isSecondaryFireMode;
      const weapon = isAltFire
        ? `${finishingDamage.damageItem}_alt`
        : finishingDamage.damageItem;
      const player1pos = victimLocation;
      const player2 = playerLocations.find((p) => p[type] === killer);
      let player2pos;
      if (player2) {
        player2pos = player2.location;
      }
      const killRange =
        player1pos && player2pos ? calcDistance(player1pos, player2pos) : 0;

      if (!(weapon in weaponStats)) {
        weaponStats[weapon] = {
          kills: 1,
          totalRange: killRange,
        };
      } else {
        weaponStats[weapon].kills += 1;
        weaponStats[weapon].totalRange += killRange;
      }
      return weaponStats;
    },
    weaponStats
  );

const getDamageStats = (
  damage,
  damageStats = {
    damage: 0,
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
  }
) =>
  damage.reduce((result, { headshots, bodyshots, legshots, damage }) => {
    result.damage += damage;
    result.headshots += headshots;
    result.bodyshots += bodyshots;
    result.legshots += legshots;
    return result;
  }, damageStats);

const isPistolRound = (mode, roundNum) => {
  switch (mode) {
    case "bomb":
      return roundNum === 0 || roundNum === 12;
    default:
      return false;
  }
};

function buildObj(obj, path = []) {
  let last = obj;
  for (const p of path) {
    if (!(p in last)) {
      last[p] = {};
    }
    last = last[p];
  }
}

function getKillRange(kill, type = "subject") {
  const player1pos = kill.victimLocation;
  const player2 = kill.playerLocations.find((p) => p[type] === kill.killer);
  const player2pos = player2 && player2.location;
  if (player1pos && player2pos) {
    const distance = calcDistance(player1pos, player2pos);

    if (distance > 4000) {
      return KILL_RANGES.LONG;
    }
    if (distance > 2000) {
      return KILL_RANGES.MEDIUM;
    }
    if (distance > 0) {
      return KILL_RANGES.SHORT;
    }
  }

  return KILL_RANGES.UNKNOWN;
}
const weaponStats = {
  kills: 0,
  altFireKills: 0,
  headshots: 0,
  bodyshots: 0,
  legshots: 0,
  damage: 0,
  roundsUsed: 0,
};

function extractWepStats(wepStats, range, roundType, weaponId) {
  const stats = wepStats?.[range]?.[roundType]?.[weaponId];
  // get(wepStats, [range, roundType, weaponId]);
  if (!stats) {
    buildObj(wepStats, [range, roundType, weaponId]);
    wepStats[range][roundType][weaponId] = clone(weaponStats);
  }
  return wepStats[range][roundType][weaponId];
}

/**
 *
 * @param kills
 * @param damage
 * @param economy
 * @param roundType
 * @param playerId
 * @param type
 * @returns {{}} Weapon damage stats object
 * @example Returns
  {
    short: {
      attacking: {
        [weaponId]: {
          kills: 0,
          altFireKills: 0,
          headshots: 0,
          bodyshots: 0,
          legshots: 0,
          damage: 0,
          roundsUsed: 0,
        },
      },
      defending: {},
    },
    medium: {
      attacking: {},
      defending: {},
    },
    long: {
      attacking: {},
      defending: {},
    },
  };
 */
function getExpandedWeaponDamageStats(
  kills,
  damage,
  economy,
  roundType,
  playerId,
  type = "subject"
) {
  const weaponDamageStats = {};
  if (!(damage && damage.length)) return weaponDamageStats;

  const roundStartWep = economy && economy.weapon;

  for (const playerDamage of damage) {
    const { headshots, bodyshots, legshots } = playerDamage;
    const totalShots = headshots + bodyshots + legshots;
    if (totalShots === 0) continue;

    const damageWasKillingBlow = kills.find(
      (k) =>
        k.finishingDamage.damageType === "Weapon" &&
        k.victim === playerDamage.receiver
    );
    const damageWep = damageWasKillingBlow
      ? damageWasKillingBlow.finishingDamage.damageItem
      : roundStartWep;

    let killRange = KILL_RANGES.UNKNOWN;
    if (damageWasKillingBlow) {
      killRange = getKillRange(damageWasKillingBlow, type);
    }
    const wepStats = extractWepStats(
      weaponDamageStats,
      killRange,
      roundType,
      damageWep
    );

    wepStats.headshots += playerDamage.headshots;
    wepStats.bodyshots += playerDamage.bodyshots;
    wepStats.legshots += playerDamage.legshots;
    wepStats.damage += playerDamage.damage;
    wepStats.roundsUsed += 1;

    if (damageWasKillingBlow) {
      wepStats.kills += 1;

      if (damageWasKillingBlow.finishingDamage.isSecondaryFireMode) {
        wepStats.altFireKills += 1;
      }
    }
  }

  return weaponDamageStats;
}

function getDuelStats(roundResults, playerId) {
  const duelStats = {
    duelsPlayed: 0,
    duelsWon: 0,
    duelsLost: 0,
  };
  for (const { playerStats: roundPlayersStats } of roundResults) {
    for (const roundPlayerStats of roundPlayersStats) {
      const { kills = [] } = roundPlayerStats;
      const duelsWon = kills.filter(
        (kill) =>
          kill.killer === playerId &&
          (!kill.assistants || kill.assistants.length === 0)
      );
      const duelsLost = kills.filter(
        (kill) =>
          kill.victim === playerId &&
          (!kill.assistants || kill.assistants.length === 0)
      );
      duelStats.duelsWon += duelsWon.length;
      duelStats.duelsLost += duelsLost.length;
      duelStats.duelsPlayed += duelsWon.length + duelsLost.length;
    }
  }

  return duelStats;
}

const weaponDuelStats = {
  duelsWon: 0,
  duelsPlayed: 0,
  duelsLost: 0,
};

const DUEL_RESULT = {
  won: "won",
  lost: "lost",
};

const extractWeaponDuelStats = (duelStats, range, roundType, weaponId) => {
  // const stats = get(duelStats, [range, roundType, weaponId]);
  const stats = duelStats?.[range]?.[roundType]?.[weaponId];
  if (!stats) {
    buildObj(duelStats, [range, roundType, weaponId]);
    duelStats[range][roundType][weaponId] = clone(weaponDuelStats);
  }
  return duelStats[range][roundType][weaponId];
};

const addDuelStats = (duelStats, range, roundType, weaponId, result) => {
  const killDuelStats = extractWeaponDuelStats(
    duelStats,
    range,
    roundType,
    weaponId
  );
  if (result === DUEL_RESULT.won) {
    killDuelStats.duelsWon += 1;
  } else {
    killDuelStats.duelsLost += 1;
  }
  killDuelStats.duelsPlayed += 1;
};

/**
 *
 * @param roundResults
 * @param mode
 * @param playerTeamId
 * @param playerId
 * @param type
 * @returns {{}} Weapon damage stats object
 * @example Returns
 {
    short: {
      attacking: {
        [weaponId]: {
          duelsWon: 0,
          duelsPlayed: 0,
          duelsLost: 0,
        },
      },
      defending: {},
    },
    medium: {
      attacking: {},
      defending: {},
    },
    long: {
      attacking: {},
      defending: {},
    },
  };
 */
const getExpandedWeaponDuelStats = (
  roundResults,
  mode,
  playerTeamId,
  playerId,
  type = "subject"
) => {
  const duelStats = {};
  for (const { roundNum, playerStats: roundPlayersStats } of roundResults) {
    const roundType = getRoundAtkOrDef(mode, roundNum, playerTeamId);
    for (const roundPlayerStats of roundPlayersStats) {
      const { kills = [], economy } = roundPlayerStats;

      const roundStartWeapon = economy && economy.weapon;

      for (const kill of kills) {
        // not a duel
        if (kill.assistants && kill.assistants.length !== 0) continue;

        // Duel won
        if (kill.killer === playerId) {
          const weaponId =
            kill.finishingDamage.damageType === "Weapon"
              ? kill.finishingDamage.damageItem
              : roundStartWeapon;
          const range = getKillRange(kill, type);
          addDuelStats(duelStats, range, roundType, weaponId, DUEL_RESULT.won);
        }

        // Duel lost
        if (kill.victim === playerId) {
          const weaponId = roundStartWeapon;
          const range = getKillRange(kill, type);
          addDuelStats(duelStats, range, roundType, weaponId, DUEL_RESULT.lost);
        }
      }
    }
  }

  return duelStats;
};

const weaponKDStats = {
  kills: 0,
  deaths: 0,
};

const extractWeaponKDStats = (kdStats, weaponId) => {
  const stats = kdStats?.[weaponId];
  if (!stats) {
    buildObj(kdStats, [weaponId]);
    kdStats[weaponId] = clone(weaponKDStats);
  }
  return kdStats[weaponId];
};

/**
 *
 * @param roundResults
 * @param playerId
 * @returns {{}} Weapon kd stats object
 * @example Returns
 {
    kills: 0,
    deaths: 0,
  };
 */
const getWeaponKDStats = (roundResults, playerId) => {
  const kdStats = {};
  for (const { playerStats: roundPlayersStats } of roundResults) {
    for (const roundPlayerStats of roundPlayersStats) {
      const { kills = [], economy } = roundPlayerStats;

      const roundStartWeapon = economy && economy.weapon;

      for (const kill of kills) {
        if (kill.killer === playerId) {
          const weaponId =
            kill.finishingDamage.damageType === "Weapon"
              ? kill.finishingDamage.damageItem
              : roundStartWeapon;
          const stats = extractWeaponKDStats(kdStats, weaponId);
          stats.kills += 1;
        }

        if (kill.victim === playerId) {
          const weaponId = roundStartWeapon;
          const stats = extractWeaponKDStats(kdStats, weaponId);
          stats.deaths += 1;
        }
      }
    }
  }

  return kdStats;
};

// import getMatchOutcomeForTeam from "./utils/getMatchOutcomeForTeam";
// import getRoundAtkOrDef from "./getRoundAtkOrDef";
// import getKillsFromRoundResults from "./getKillsFromRoundResults";
// import getWeaponStats from "./getWeaponStats";
// import getDamageStats from "./getDamageStats";
// import isPistolRound from "./isPistolRound";
// import getWeaponDamageStats from "./getWeaponDamageStats";
// import getDuelStats from "./getDuelStats";
// import getExpandedWeaponDuelStats from "./getExpandedWeaponDuelStats";
// import getWeaponKDStats from "./getWeaponKDStats";

// import getExpandedWeaponDamageStats from "./getExpandedWeaponDamageStats";

export function calcDistance(pos1, pos2) {
  return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}

const NON_HEADSHOT_WEPS = {
  "910BE174-449B-C412-AB22-D0873436B21B": true, // bucky
  "EC845BF4-4F79-DDDA-A3DA-0DB3774B2794": true, // judge
  "A03B24D3-4319-996D-0F8C-94BBFBA1DFC7": true, // operator
  "42DA8CCC-40D5-AFFC-BEEC-15AA47B42EDA": true, // shorty
};

export function getWeaponDamageHits(weaponDamageStats) {
  const hits = {
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
  };

  if (!weaponDamageStats) return hits;

  const weapons = Object.entries(weaponDamageStats);

  for (const weapon of weapons) {
    const [wedId, wepStats] = weapon;

    if (!NON_HEADSHOT_WEPS[wedId]) {
      hits.headshots += wepStats.headshots || 0;
      hits.bodyshots += wepStats.bodyshots || 0;
      hits.legshots += wepStats.legshots || 0;
    }
  }

  return hits;
}

export function getWeaponDamageStats(
  kills,
  damage,
  economy,
  weaponDamageStats = {},
  type = "subject"
) {
  const roundStartWep = economy && economy.weapon;
  let wepStats;

  if (damage && damage.length) {
    for (const playerDamage of damage) {
      // Find if any round kills contain the reciever of damage
      const damageWasKillingBlow = kills.find(
        (k) =>
          k.finishingDamage.damageType === "Weapon" &&
          k.victim === playerDamage.receiver
      );

      // If the damage killed someone, use the the killing blow wep
      // If not, use the weapon purchased at round start
      const damageWep = damageWasKillingBlow
        ? damageWasKillingBlow.finishingDamage.damageItem
        : roundStartWep;

      if (weaponDamageStats && weaponDamageStats[damageWep]) {
        wepStats = weaponDamageStats[damageWep];
      } else {
        wepStats = {
          kills: 0,
          totalKillRange: 0,
          altFireKills: 0,
          headshots: 0,
          bodyshots: 0,
          legshots: 0,
          damage: 0,
          roundsUsed: 0,
        };
      }

      const { headshots, bodyshots, legshots } = playerDamage;

      // Only add stats if hits occur
      if (headshots + bodyshots + legshots > 0) {
        if (damageWasKillingBlow) {
          wepStats.kills += 1;

          // Increment alt fire kills
          if (damageWasKillingBlow.finishingDamage.isSecondaryFireMode) {
            wepStats.altFireKills += 1;
          }

          // Increment kill range
          const player1pos = damageWasKillingBlow.victimLocation;
          const player2 = damageWasKillingBlow.playerLocations.find(
            (p) => p[type] === damageWasKillingBlow.killer
          );
          const player2pos = player2 && player2.location;

          if (player1pos && player2pos) {
            wepStats.totalKillRange += calcDistance(player1pos, player2pos);
          }
        }
        wepStats.headshots += playerDamage.headshots;
        wepStats.bodyshots += playerDamage.bodyshots;
        wepStats.legshots += playerDamage.legshots;
        wepStats.damage += playerDamage.damage;
        wepStats.roundsUsed += 1;

        weaponDamageStats[damageWep] = wepStats;
      }
    }
  }

  return weaponDamageStats;
}

export function getShotsFromMatch(match, playerId, type = "subject") {
  let result = {};
  const { roundResults = [] } = match;
  for (const round of roundResults) {
    const playerRoundStats = round.playerStats?.find(
      (x) => x[type] === playerId
    );
    if (playerRoundStats?.damage) {
      const { kills = [], damage = [], economy = [] } = playerRoundStats;
      result = getWeaponDamageStats(kills, damage, economy, result, type);
    }
  }

  return getWeaponDamageHits(result);
}

export const getAbilityKills = (match, playerId, type = "subject") => {
  const abilityKills = {
    ability1Casts: {
      kills: 0,
      casts: 0,
    },
    ability2Casts: {
      kills: 0,
      casts: 0,
    },
    grenadeCasts: {
      kills: 0,
      casts: 0,
    },
    ultimateCasts: {
      kills: 0,
      casts: 0,
    },
  };
  const { players, roundResults } = match;
  for (const { playerStats } of roundResults) {
    for (const { kills } of playerStats) {
      for (const kill of kills) {
        if (
          kill.killer === playerId &&
          kill.finishingDamage.damageType === "Ability"
        ) {
          if (kill.finishingDamage.damageItem === "Ability1") {
            abilityKills.ability1Casts.kills += 1;
          } else if (kill.finishingDamage.damageItem === "Ability2") {
            abilityKills.ability2Casts.kills += 1;
          } else if (kill.finishingDamage.damageItem === "Grenade") {
            abilityKills.grenadeCasts.kills += 1;
          } else if (kill.finishingDamage.damageItem === "Ultimate") {
            abilityKills.ultimateCasts.kills += 1;
          }
        }
      }
    }
  }
  const playerStats = players.find((player) => player[type] === playerId);
  if (playerStats?.stats?.abilityCasts) {
    abilityKills.ability1Casts.casts =
      playerStats.stats.abilityCasts.ability1Casts;
    abilityKills.ability2Casts.casts =
      playerStats.stats.abilityCasts.ability2Casts;
    abilityKills.grenadeCasts.casts =
      playerStats.stats.abilityCasts.grenadeCasts;
    abilityKills.ultimateCasts.casts =
      playerStats.stats.abilityCasts.ultimateCasts;
  }

  return abilityKills;
};

export function getPlayerStatsFromMatch(
  match,
  playerId,
  playerStatsParam,
  type = "subject"
) {
  let playerStats = playerStatsParam || clone(VALORANT_STATS_WITH_AGENTS);

  const {
    teams,
    roundResults,
    players,
    map,
    mode,
    queue,
    // ranked,
  } = match;
  const kills = getKillsFromRoundResults(roundResults);

  const matchPlayerStats = players.find((p) => p[type] === playerId);

  if (!matchPlayerStats) return playerStats;

  const { stats, teamId, characterId } = matchPlayerStats;

  let mapStats;
  if (playerStats && playerStats.mapStats && playerStats.mapStats[map]) {
    mapStats = playerStats.mapStats[map];
  } else {
    mapStats = {
      wins: 0,
      ties: 0,
      matches: 0,
      roundsWon: 0,
      roundsPlayed: 0,
      attackingWon: 0,
      attackingPlayed: 0,
      defendingWon: 0,
      defendingPlayed: 0,
    };
  }

  let agentStats;
  if (
    playerStats &&
    playerStats.agentStats &&
    playerStats.agentStats[characterId]
  ) {
    agentStats = playerStats.agentsStats[characterId];
  } else {
    agentStats = clone(VALORANT_STATS);
  }

  const playerTeam = teams.find((t) => t.teamId === teamId);

  if (!playerTeam || teamId === "Neutral") {
    return playerStats;
  }

  const matchOutcome = getMatchOutcomeForTeam({
    players,
    playerTeam,
    teams,
    queue,
  });

  if (matchOutcome === "win") {
    playerStats.wins += 1;
    agentStats.wins += 1;
    mapStats.wins += 1;
  } else if (matchOutcome === "tie") {
    playerStats.ties += 1;
    agentStats.ties += 1;
    mapStats.ties += 1;
  }
  playerStats.matches += 1;
  agentStats.matches += 1;
  mapStats.matches += 1;
  playerStats.roundsWon += playerTeam.roundsWon;
  agentStats.roundsWon += playerTeam.roundsWon;
  mapStats.roundsWon += playerTeam.roundsWon;
  mapStats.roundsPlayed += playerTeam.roundsPlayed;

  playerStats = mergeObj(stats, playerStats);
  playerStats.agentsStats[characterId] = mergeObj(stats, agentStats);
  playerStats.mapStats[map] = mapStats;
  if (kills && kills.length > 0) {
    let currentRound = -1;

    for (const [index, kill] of kills.entries()) {
      if (currentRound < kill.round) {
        currentRound = kill.round;
        const winningTeam = roundResults[currentRound]?.winningTeam;

        if (winningTeam) {
          if (kill.killer === playerId) {
            playerStats.firstBloodsTaken += 1;
            if (winningTeam === teamId) {
              playerStats.roundsWonWhenFirstBloodTaken += 1;
            }
          } else if (kill.victim === playerId) {
            playerStats.firstBloodsGiven += 1;
            if (winningTeam !== teamId) {
              playerStats.roundsLostWhenFirstBloodGiven += 1;
            }
          }
          if (index > 0) {
            const prevKill = kills[index - 1];
            if (prevKill.killer === playerId) {
              playerStats.lastKills += 1;
            }
          }
        }
      }
    }
    const lastKill = kills[kills.length - 1];
    if (lastKill.killer === playerId) {
      playerStats.lastKills += 1;
    }
  }
  if (roundResults && roundResults.length) {
    for (const roundResult of roundResults) {
      const {
        roundNum,
        bombDefuser,
        bombPlanter,
        playerStats: playersRoundStats,
        winningTeam,
      } = roundResult;
      const playerRoundStats = playersRoundStats.find(
        (p) => p[type] === playerId
      );
      if (!playerRoundStats) continue;

      const roundType = getRoundAtkOrDef(mode, roundNum, teamId);

      if (roundType === "attacking") {
        mapStats.attackingPlayed += 1;
        if (winningTeam === teamId) mapStats.attackingWon += 1;
      } else if (roundType === "defending") {
        mapStats.defendingPlayed += 1;
        if (winningTeam === teamId) mapStats.defendingWon += 1;
      }

      const { economy, damage, kills } = playerRoundStats;

      playerStats.economy += economy.loadoutValue;
      playerStats.weaponStats = getWeaponStats(
        kills,
        playerStats.weaponStats,
        type
      );
      playerStats.damageStats = getDamageStats(damage, playerStats.damageStats);
      playerStats.weaponDamageStats = getWeaponDamageStats(
        kills,
        damage,
        economy,
        playerStats.weaponDamageStats,
        type
      );
      if (isPistolRound(mode, roundNum)) {
        playerStats.pistolRoundWeaponDamageStats = getWeaponDamageStats(
          kills,
          damage,
          economy,
          playerStats.pistolRoundWeaponDamageStats,
          type
        );
      }

      playerStats.agentsStats[characterId].economy += economy.loadoutValue;
      playerStats.agentsStats[characterId].weaponStats = getWeaponStats(
        kills,
        playerStats.agentsStats[characterId].weaponStats,
        type
      );
      playerStats.agentsStats[characterId].damageStats = getDamageStats(
        damage,
        playerStats.agentsStats[characterId].damageStats
      );
      playerStats.agentsStats[characterId].weaponDamageStats =
        getWeaponDamageStats(
          kills,
          damage,
          economy,
          playerStats.agentsStats[characterId].weaponDamageStats,
          type
        );
      if (bombPlanter && bombPlanter === playerId) {
        playerStats.plants += 1;
      }
      if (bombDefuser && bombDefuser === playerId) {
        playerStats.defuses += 1;
      }

      const expandedWepDmgStats = getExpandedWeaponDamageStats(
        kills,
        damage,
        economy,
        roundType,
        playerId,
        type
      );
      mergeObj(expandedWepDmgStats, playerStats.expandedWeaponDamageStats);
    }

    // Duel stats
    const duelStats = getDuelStats(roundResults, playerId);
    mergeObj(duelStats, playerStats.duelStats);

    const expandedWepDuelStats = getExpandedWeaponDuelStats(
      roundResults,
      mode,
      teamId,
      playerId,
      type
    );
    mergeObj(expandedWepDuelStats, playerStats.expandedWeaponDuelStats);

    const weaponKDStats = getWeaponKDStats(roundResults, playerId);
    mergeObj(weaponKDStats, playerStats.weaponKDStats);
  }
  return playerStats;
}
//
export function calcPlayerMatchPosition(playerStats, players, type) {
  const { teamId } = playerStats;
  const orderedPlayers = orderBy(
    players,
    (player) => player.stats.score,
    "desc"
  );

  const orderedTeamPlayers = orderedPlayers.filter(
    (player) => player.teamId === teamId
  );

  const position =
    orderedPlayers.findIndex((player) => player[type] === playerStats[type]) +
    1;
  const teamPosition =
    orderedTeamPlayers.findIndex(
      (player) => player[type] === playerStats[type]
    ) + 1;

  return {
    position,
    teamPosition,
  };
}

export const getTeamStatsFromMatch = (match, playerId, type) => {
  const player = match.players.find((p) => p[type] === playerId);
  const allPlayers = match.players
    .filter((p) => p.teamId !== "Neutral")
    .map((p) => {
      return {
        ...p,
        stats: getPlayerStatsFromMatch(match, p[type], null, type),
      };
    })
    .sort((p1, p2) => p2.stats.score - p1.stats.score);

  const team = allPlayers.filter((p) => p?.teamId === player?.teamId);

  const enemy = allPlayers.filter((p) => p?.teamId !== player?.teamId);
  return { team, enemy, allPlayers };
};
