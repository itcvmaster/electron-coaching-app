import { t } from "i18next";
import { computed } from "s2-engine";

import { readState } from "@/__main__/app-state.mjs";
import LoLColors from "@/game-lol/colors.mjs";
import {
  INGAME_PHASES,
  MYTHICS,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
  SKILL_HOTKEYS,
} from "@/game-lol/constants.mjs";
import { getSummonerInfo } from "@/game-lol/in-game-external-api.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import { getCurrSummonerCareer } from "@/game-lol/lol-client-api.mjs";
import Static from "@/game-lol/static.mjs";
import {
  getCurrentPatchForStaticData,
  getStaticChampionById,
  getStaticData,
  groupRecentlyPlayedTeam,
} from "@/game-lol/util.mjs";
import { devError, devWarn } from "@/util/dev.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import lruObject from "@/util/lru-object.mjs";

// The special care here is to not replace observable instances.
export function carefullyResetObservable(target, obj) {
  for (const key in obj) {
    const value = obj[key];
    if (value && typeof value === "object") {
      const targetObj = target[key];
      Object.assign(targetObj, value);
      for (const nestedKey in targetObj) {
        if (!value.hasOwnProperty[nestedKey]) {
          delete targetObj[nestedKey];
        }
      }
      continue;
    }
    target[key] = value;
  }
}

const enemySummonerPromisesByName = lruObject();

export function setEnemySummoners(data) {
  if (!inGameState.currentState) {
    devWarn("Tried to set enemy summoners outside of game.");
    return null;
  }

  const promises = [];

  const {
    summonerNamesByCellId,
    currentState: { localPlayerCellId, summonersByCellId },
  } = inGameState;

  const localPlayer = summonersByCellId[localPlayerCellId];
  const { team: localPlayerTeam, summonerId: localSummonerId } = localPlayer;

  const enemyCellIds = Object.keys(summonersByCellId).filter((cellId) => {
    const { team } = summonersByCellId[cellId];
    return team !== localPlayerTeam;
  });

  const {
    gameData: { teamOne, teamTwo },
  } = data;
  const enemyTeam = [teamOne, teamTwo].find((team) => {
    return !team.find((player) => player.summonerId === localSummonerId);
  });

  for (let i = 0; i < enemyTeam.length; i++) {
    const enemyCellId = enemyCellIds[i];
    const enemyPlayer = enemyTeam[i];
    const { summonerName } = enemyPlayer;
    if (enemySummonerPromisesByName[summonerName]) continue;
    summonerNamesByCellId[enemyCellId] = summonerName;
    const promise = getSummonerInfo(summonerName, enemyCellId).catch(
      (error) => {
        devError("FAILED TO GET SUMMONER INFO", error);
      }
    );
    promises.push(promise);
    enemySummonerPromisesByName[summonerName] = promise;
  }

  return Promise.all(promises);
}

export function getChampionPrimaryRole(championId) {
  championId = String(championId);
  if (!inGameState.championStats?.length) return null;
  let maxCount = 0;
  let role = null;
  for (const stat of inGameState.championStats) {
    if (String(stat.championId) !== championId) continue;
    const games = stat.games;
    if (games > maxCount) {
      maxCount = games;
      role = stat.role;
    }
  }
  return role;
}

function assignPremadesToTeams(data) {
  const { summonerPremadesByCellId } = inGameState;

  const [teamA = [], teamB = []] = groupRecentlyPlayedTeam(data)
    // Can only ever be two teams at a time max.
    .filter((g) => g.length > 1)
    // sort by larger team first
    .sort((a, b) => b.length - a.length);

  teamA.forEach((cellId) => {
    summonerPremadesByCellId[cellId] = {
      team: "A",
      size: teamA.length,
    };
  });
  teamB.forEach((cellId) => {
    summonerPremadesByCellId[cellId] = {
      team: "B",
      size: teamB.length,
    };
  });
}

export function determinePremadeGroups() {
  const {
    summonerPlayStylesByCellId,
    summonerAccountsByCellId,
    summonerPremadesByCellId,
    currentState,
  } = inGameState;

  if (!currentState) {
    return;
  }

  const data = [];
  const accountIdToCellId = new Map();

  // build cellId Map
  for (let i = 0; i < 10; i++) {
    const summoner = summonerAccountsByCellId[i];

    if (summoner?.accountId) {
      accountIdToCellId[summoner.accountId] = i;
    }
  }

  // build data
  for (let i = 0; i < 10; i++) {
    const summoner = summonerAccountsByCellId[i];
    const playStyles = summonerPlayStylesByCellId[i];
    const allyTeam =
      currentState.summonersByCellId[currentState.localPlayerCellId]?.team;
    const isAlly = currentState.summonersByCellId[i]?.team === allyTeam;

    if (summoner && playStyles) {
      summonerPremadesByCellId[i] = { team: "SOLO", size: 1 };
      data.push({
        isAlly,
        name: accountIdToCellId[summoner.accountId],
        recentlyPlayedWith: playStyles.recentlyPlayedWith.map(
          (r) => accountIdToCellId[r.accountId] ?? "noop"
        ),
      });
    }
  }

  // allies
  assignPremadesToTeams(data.filter((groups) => groups.isAlly));
  // enemies
  assignPremadesToTeams(data.filter((groups) => !groups.isAlly));
}

export function formatSkillOrder(build) {
  if (!inGameState.currentState) return null;

  const {
    currentState: { summonersByCellId, localPlayerCellId },
  } = inGameState;
  const { championId, championPickIntent } =
    summonersByCellId[localPlayerCellId];
  const localId = `${championId || championPickIntent}`;
  const patch = getCurrentPatchForStaticData();

  const {
    spells: [P, Q, W, E, R],
  } = getStaticChampionById(localId, patch, readState);

  const skillsColumns = build.skills
    .reduce(
      (prev, curr, index) => {
        const col = [
          (index + 1).toLocaleString(getLocale()),
          false,
          false,
          false,
          false,
        ];
        col[curr] = true;
        prev.push(col);
        return prev;
      },
      [[P?.image?.full ?? "", Q.id, W.id, E.id, R.id]]
    )
    .map((col, j) => {
      return {
        row: col.map((skill, k) => {
          const isImage = j === 0;
          const isTopRow = k === 0;

          const image = isImage
            ? isTopRow
              ? Static.getChampionPassiveImageById(skill)
              : Static.getChampionSpellImageById(skill)
            : null;
          return {
            isActive: j !== 0 && Boolean(skill),
            content: [j, ...SKILL_HOTKEYS][k],
            style: `--color: ${LoLColors.abilities[k]};${
              isImage ? ` --image: url(${image});` : ""
            }`,
          };
        }),
      };
    });

  const skillOrder = skillsColumns
    .slice(1, 4)
    .map((col) => col.row.slice(1, 4))
    .map((row) => row.find((skill) => skill.isActive));

  return computed({
    title: t("lol:builds.skillOrder", "Skill Order"),
    skillOrder,
    col: skillsColumns,
  });
}

// Sugestions
export const SUPPORTED_QUEUES = [-1, 420, 440, 400, 700]; // -1 is for custom games testing
export function isClash(actions = [], myTeam = []) {
  if (
    actions.length === 24 &&
    actions[0]?.type === "phase_transition" &&
    myTeam[0]?.assignedPosition === ""
  ) {
    return 700;
  }

  return 0;
}

let summonerCareerRequest;

function normalizeStat(val, max, min) {
  const nom = val - min;
  const denom = max - min || 1;
  const result = Number.isNaN(nom / denom) ? 0 : nom / denom;

  return result > 1 ? 1 : result < 0 ? 0 : result;
}

// Create a normalized sort of the champions report stats
// ex: DMG / Tank / CC / Healing
// Grouped by role, including 'all'
export function sortChampionsReportStats(championsReport) {
  const statsReport = {};
  if (!championsReport) return statsReport;

  const report = championsReport.map((c) => ({
    ...c,
    winrate: c.wins / c.games,
    winrateLane: c.laneWins / c.games,
    kda: (c.kills + c.assists) / (c.deaths || 1),
    playRate: c.pickRate,
    damage: c.totalDamageDealtToChampions,
    tankiness: c.damageSelfMitigated,
    cc: c.timeCcingOthers,
    healing: c.totalHeal,
  }));

  const lanes = [
    ROLE_SYMBOLS.all,
    ROLE_SYMBOLS.top,
    ROLE_SYMBOLS.jungle,
    ROLE_SYMBOLS.mid,
    ROLE_SYMBOLS.adc,
    ROLE_SYMBOLS.support,
  ];
  const stats = [
    { stat: "damage", avg: true },
    { stat: "tankiness", avg: true },
    { stat: "cc", avg: true },
    { stat: "healing", avg: true },
    { stat: "winrate", avg: false },
    { stat: "winrateLane", avg: false },
    { stat: "kda", avg: false },
    { stat: "playRate", avg: false },
  ];

  for (const lane of lanes) {
    const laneChampionsReport =
      lane !== ROLE_SYMBOLS.all
        ? report.filter((c) => c.role === lane)
        : report;

    statsReport[ROLE_SYMBOL_TO_STR[lane].internal] = {};

    for (const { stat, avg } of stats) {
      const statOrdered = laneChampionsReport
        .map((champ) => {
          const statVal = avg ? champ[stat] / champ.games : champ[stat];
          return { ...champ, [stat]: statVal };
        })
        .sort((a, z) => z[stat] - a[stat]);

      const statHighest = statOrdered[0][stat];
      const statLowest = statOrdered[statOrdered.length - 1][stat];

      statsReport[ROLE_SYMBOL_TO_STR[lane].internal][stat] = {
        ordered: statOrdered,
        highest: statHighest,
        lowest: statLowest,
      };
    }
  }

  return statsReport;
}

function getChampionScores(data = []) {
  const statsReport = sortChampionsReportStats(data);
  const scoredChampions = {};

  for (const champ of data) {
    const {
      championId,
      role,
      pickRate,
      tierListTier = {},
      totalGameCount,
      rolePercentage,
      physicalDamageDealtToChampions, // ad
      magicDamageDealtToChampions, // ap
      trueDamageDealtToChampions, // true
      totalDamageDealtToChampions, // dmg
      damageSelfMitigated, // tank
      totalHeal, // heal
      timeCcingOthers, // cc
      games,
      wins,
      laneWins,
      kills,
      deaths,
      assists,
    } = champ;
    if (!role) continue;

    const key = `${championId}_${ROLE_SYMBOL_TO_STR[role].internal}`;
    const keyAll = `${championId}_${
      ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].internal
    }`;

    if (!games) continue;

    scoredChampions[key] = {
      id: championId,
      role: role,
      roleCount: 1,
      rolePercentage,
      playRate: pickRate,
      tier: tierListTier?.tierRank || null,
      games: games,
      gamesTotal: totalGameCount,
      kills: kills,
      deaths: deaths,
      assists: assists,
      wins: wins,
      winsLane: laneWins,
      stats: {
        physicalDamageDealtToChampions,
        magicDamageDealtToChampions,
        trueDamageDealtToChampions,
        totalDamageDealtToChampions,
        damageSelfMitigated,
        totalHeal,
        timeCcingOthers,
      },
    };

    if (!scoredChampions[keyAll]) {
      scoredChampions[keyAll] = {
        id: championId,
        role: ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].internal,
        roleCount: 0,
        games: 0,
        gamesTotal: totalGameCount,
        kills: 0,
        deaths: 0,
        assists: 0,
        wins: 0,
        winsLane: 0,
        stats: {
          physicalDamageDealtToChampions: 0,
          magicDamageDealtToChampions: 0,
          trueDamageDealtToChampions: 0,
          totalDamageDealtToChampions: 0,
          damageSelfMitigated: 0,
          totalHeal: 0,
          timeCcingOthers: 0,
          rolePercentage: 1,
        },
      };
    }

    // Aggregate all roles of a champ
    const hash = scoredChampions[keyAll];
    hash.roleCount += 1;
    hash.games += games;
    hash.kills += kills;
    hash.deaths += deaths;
    hash.assists += assists;
    hash.wins += wins;
    hash.winsLane += laneWins;
    hash.stats.physicalDamageDealtToChampions += physicalDamageDealtToChampions;
    hash.stats.magicDamageDealtToChampions += magicDamageDealtToChampions;
    hash.stats.trueDamageDealtToChampions += trueDamageDealtToChampions;
    hash.stats.totalDamageDealtToChampions += totalDamageDealtToChampions;
    hash.stats.damageSelfMitigated += damageSelfMitigated;
    hash.stats.totalHeal += totalHeal;
    hash.stats.timeCcingOthers += timeCcingOthers;
  }

  // Second pass to build champ characteristic (useful for aggregated 'all' role)
  for (const key of Object.keys(scoredChampions)) {
    const [, role] = key.split("_");
    const champ = scoredChampions[key];
    const { games, stats } = champ;

    const roleStats = statsReport[role];

    const normDamage = normalizeStat(
      stats.totalDamageDealtToChampions / games,
      roleStats.damage.highest,
      roleStats.damage.lowest
    );
    const normTank = normalizeStat(
      stats.damageSelfMitigated / games,
      roleStats.tankiness.highest,
      roleStats.tankiness.lowest
    );
    const normCC = normalizeStat(
      stats.timeCcingOthers / games,
      roleStats.cc.highest,
      roleStats.cc.lowest
    );
    const normHealing = normalizeStat(
      stats.totalHeal / games,
      roleStats.healing.highest,
      roleStats.healing.lowest
    );

    const winrateIndex =
      roleStats.winrate.ordered.findIndex((c) => c.championId === champ.id) + 1;
    const winrateLaneIndex =
      roleStats.winrateLane.ordered.findIndex(
        (c) => c.championId === champ.id
      ) + 1;
    const kdaIndex =
      roleStats.kda.ordered.findIndex((c) => c.championId === champ.id) + 1;
    const playRateIndex =
      roleStats.playRate.ordered.findIndex((c) => c.championId === champ.id) +
      1;

    const {
      physicalDamageDealtToChampions,
      magicDamageDealtToChampions,
      trueDamageDealtToChampions,
      totalDamageDealtToChampions,
    } = stats;

    scoredChampions[key] = {
      ...champ,
      winRate: champ.wins / champ.games,
      winrateIndex,
      winRateLane: champ.winsLane / champ.games,
      winrateLaneIndex,
      playRate: champ.games / champ.gamesTotal,
      playRateIndex,
      kda: (champ.kills + champ.assists) / champ.deaths,
      kdaIndex,
      characteristics: {
        ad: physicalDamageDealtToChampions / totalDamageDealtToChampions,
        ap: magicDamageDealtToChampions / totalDamageDealtToChampions,
        true: trueDamageDealtToChampions / totalDamageDealtToChampions,
        damage: normDamage,
        tankiness: normTank,
        cc: normCC,
        healing: normHealing,
      },
    };
  }

  return scoredChampions;
}

let memoizedChampionMeta;
function getChampionMeta() {
  if (!memoizedChampionMeta) {
    const meta = (inGameState?.championStats || []).reduce((result, c) => {
      const {
        championId: id,
        role,
        tierListTier,
        totalGameCount,
        games,
        wins,
        laneWins,
        rolePercentage,
        kills,
        deaths,
        assists,
      } = c;
      if (rolePercentage < 0.1) return result;
      if (!result[id]) result[id] = {};

      result[id][role] = {
        role,
        winRate: wins / games,
        winRateLane: laneWins / games,
        kda: (kills + assists) / deaths,
        playRate: games / totalGameCount,
        gameCount: games,
        tier: tierListTier?.tierRank || 0,
      };

      return result;
    }, {});

    // assign main role
    for (const id in meta) {
      const champ = meta[id];
      let mainRole;
      let maxCount = 0;
      Object.getOwnPropertySymbols(champ).forEach((role) => {
        const { gameCount } = champ[role];
        if (gameCount > maxCount) {
          maxCount = gameCount;
          mainRole = role;
        }
      });
      champ.mainRole = mainRole;
    }

    memoizedChampionMeta = meta;
  }

  return memoizedChampionMeta;
}

function assignRootData({ summonerCareer }) {
  if (!inGameState.currentState) return;

  const champions = getStaticData("champions");
  const championsInfo = Object.entries(champions || []).reduce((acc, curr) => {
    const [key, val] = curr;
    acc[val.key] = { ...val, id: Number(val.key), key };
    return acc;
  }, {});
  const championMeta = inGameState.championStats || [];
  const championMetaMap = getChampionMeta();
  const championScores = getChampionScores(championMeta);

  const rolesList = {};
  const roleSymbols = [
    ROLE_SYMBOLS.all,
    ROLE_SYMBOLS.top,
    ROLE_SYMBOLS.jungle,
    ROLE_SYMBOLS.mid,
    ROLE_SYMBOLS.adc,
    ROLE_SYMBOLS.support,
  ];

  for (const symbol of roleSymbols) {
    const r = ROLE_SYMBOL_TO_STR[symbol].internal;

    if (!rolesList[r]) rolesList[r] = [];

    for (const id of Object.keys(championsInfo)) {
      const champ = championMetaMap[id];
      if (!champ) continue;
      const roleMeta =
        symbol !== ROLE_SYMBOLS.all ? champ[symbol] : champ[champ.mainRole];

      if (!roleMeta) continue;

      const scores =
        symbol !== ROLE_SYMBOLS.all
          ? championScores[`${id}_${r}`]
          : championScores[
              `${id}_${ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.all].internal}`
            ];

      if (!scores) continue;

      const key = championsInfo[id].key;
      const name = championsInfo[id].name;

      const result = {
        id,
        key,
        name,
        image: Static.getChampionImage(id),
        roleMeta,
        metaScores: scores,
        career: summonerCareer?.[id]?.[r] || {},
        mouseOver() {
          inGameState.options.suggestionsHoveredId = id;
        },
        mouseOut() {
          inGameState.options.suggestionsHoveredId = null;
        },
      };

      rolesList[r].push(result);
    }
  }

  return rolesList;
}

export async function processSuggestions() {
  const { currentState, suggestions, queueId } = inGameState;
  if (!currentState) return;

  // TODO: fix isClash detection
  // const { queueHash, statsData } = deps;
  // const queue = queueHash?.["enum"] || isClash(actions, players);
  if (!queueId || !SUPPORTED_QUEUES.includes(queueId)) return;

  if (!summonerCareerRequest) summonerCareerRequest = getCurrSummonerCareer();
  const summonerCareer = await summonerCareerRequest;

  if (!suggestions.rootList) {
    suggestions.rootList = assignRootData({ summonerCareer });
  }
}
export function isBanPhase(phase) {
  return phase === INGAME_PHASES[1];
}
export function isDeclarePhase(phase) {
  return phase === INGAME_PHASES[0];
}
export function matchupWR(matchup, fallback = 0) {
  if (!matchup) return fallback;
  return matchup.wins / (matchup.games || 1);
}
export function matchupLaneWR(matchup, fallback = 0) {
  if (!matchup) return fallback;
  return matchup.laneWins / (matchup.games || 1);
}
export function synergyWR(synergy, fallback = 0) {
  if (!synergy) return fallback;
  return synergy.wins / (synergy.games || 1);
}
export function champAvailable(availableIds, id) {
  // in the case that we didnt get bannable/pickable from LCU for some reason,
  // just fallback to showing everything anyway. Otherwise nothing would show
  return availableIds.length ? availableIds[id] : true;
}
export function displayMetaBans(rootList = {}, role, availableIds) {
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.roleMeta?.tier)
    .sort(
      (a, b) =>
        a.roleMeta.tier - b.roleMeta.tier ||
        b.roleMeta.winRate - a.roleMeta.winRate
    );
}
export function displayMetaPicks(rootList = {}, role, availableIds) {
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.roleMeta?.tier)
    .sort(
      (a, b) =>
        a.roleMeta.tier - b.roleMeta.tier ||
        b.roleMeta.winRate - a.roleMeta.winRate
    );
}
export function displayCareer(rootList = {}, role, availableIds) {
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.career?.games > 6)
    .sort(
      (a, b) =>
        b.career.wins / (b.career.games || 1) -
        a.career.wins / (a.career.games || 1)
    );
}
export function displayLaneCounters(
  rootList = {},
  role,
  champId,
  availableIds
) {
  if (!champId) return [];
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.matchups?.[champId])
    .sort(
      (a, b) =>
        matchupLaneWR(b.matchups[champId]) - matchupLaneWR(a.matchups[champId])
    );
}
export function displayGameCounters(
  rootList = {},
  role,
  champId,
  availableIds
) {
  if (!champId) return [];
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.matchups?.[champId])
    .sort(
      (a, b) => matchupWR(b.matchups[champId]) - matchupWR(a.matchups[champId])
    );
}
export function displayTeammateCounters(
  rootList = {},
  teammateId,
  teammateRole,
  availableIds
) {
  if (!teammateId) return [];
  return (rootList[teammateRole] || rootList["ALL"] || [])
    .filter(
      (s) => champAvailable(availableIds, s.id) && s.matchups?.[teammateId]
    )
    .sort((a, b) => {
      const winType = teammateRole ? "laneWins" : "wins";
      return (
        b.matchups[teammateId][winType] / (b.matchups[teammateId].games || 1) -
        a.matchups[teammateId][winType] / (a.matchups[teammateId].games || 1)
      );
    });
}
export function displayTeammateSynergies(
  rootList = {},
  teammateId,
  myRole,
  availableIds
) {
  if (!teammateId) return [];
  return (rootList[myRole] || rootList["ALL"] || [])
    .filter(
      (s) => champAvailable(availableIds, s.id) && s.synergies?.[teammateId]
    )
    .sort(
      (a, b) =>
        synergyWR(b.synergies[teammateId]) - synergyWR(a.synergies[teammateId])
    );
}
export function displayMetaPopularBans(rootList = {}, role, availableIds) {
  return (rootList[role] || rootList["ALL"] || [])
    .filter((s) => champAvailable(availableIds, s.id) && s.roleMeta?.tier)
    .sort(
      (a, b) =>
        a.roleMeta.tier - b.roleMeta.tier ||
        b.roleMeta.playRate - a.roleMeta.playRate
    );
}
export function displayPersonalPicks(
  rootList = {},
  matchups,
  synergies,
  role,
  availableIds,
  enemyID,
  pairID
) {
  const list = rootList[role] || rootList["ALL"] || [];

  if (enemyID || pairID) {
    return list
      .filter(
        (s) =>
          champAvailable(availableIds, s.id) &&
          s.roleMeta?.tier &&
          s.roleMeta?.tier < 4
      )
      .sort(
        (a, b) =>
          suggestionScore(b, enemyID, pairID, matchups, synergies) -
          suggestionScore(a, enemyID, pairID, matchups, synergies)
      );
  }

  return list
    .filter(
      (s) =>
        champAvailable(availableIds, s.id) &&
        s.roleMeta?.tier &&
        s.roleMeta?.tier < 4
    )
    .sort(
      (a, b) =>
        a.roleMeta?.tier - b.roleMeta?.tier ||
        Math.round((b.career.games || 0) / 12) -
          Math.round((a.career.games || 0) / 12) ||
        Math.round(b.career.goldDiff / b.career.games / 10) -
          Math.round(a.career.goldDiff / a.career.games / 10)
    );
}
const tierPts = { 1: 0.55, 2: 0.55, 3: 0.5, 4: 0, 5: 0 };
export function suggestionScore(
  suggestion,
  enemyID,
  pairID,
  matchups,
  synergies
) {
  const { id, roleMeta, career } = suggestion;
  const matchup = matchups?.[id]?.[enemyID];
  const synergy = synergies?.[id]?.[pairID];

  const wrCareer = (career?.games > 3 ? career.wins / career.games : 0) * 0.75;
  const wrMatchup =
    (matchupLaneWR(matchup, 0.5) * 1.15 + matchupWR(matchup, 0.5) * 0.85) / 2; // Lane weighted
  const wrSynergy = synergyWR(synergy, 0.5);
  const tier = tierPts[roleMeta?.tier] || 0;
  const score = wrCareer + wrMatchup + wrSynergy + tier;

  return score;
}

function mapItems(item) {
  return {
    isMythic: Boolean(MYTHICS[item]),
    image: Static.getItemImage(item),
  };
}

function mapSpells(item) {
  const spells = getStaticData("spells");
  return {
    isMythic: false,
    image: Static.getSpellImageById(spells, item),
  };
}

export function formatBuildOrder(build) {
  return computed({
    tSummoners: t("lol:championData.summoners", "Summoners"),
    tStarting: t("lol:championData.starting", "Starting"),
    tBuildOrder: t("lol:championData.coreBuildOrder", "Build Order"),
    tFinalBuild: t("lol:championData.coreFinal", "Final Build"),
    tSituational: t("lol:championData.situationalItems", "Situational Items"),
    summonerSpells: build.summoner_spells.map(mapSpells),
    startingItems: build.items_starting.map(mapItems),
    buildOrderItems: build.items_order.map(mapItems),
    finalBuildItems: build.items_completed.map(mapItems),
    situationalItems: build.items_situational.map(mapItems),
  });
}
