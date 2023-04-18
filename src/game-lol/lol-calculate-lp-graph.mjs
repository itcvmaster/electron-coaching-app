import getData from "@/__main__/get-data.mjs";
import LoLMatchHistories from "@/data-models/lol-match-histories.mjs";
import * as API from "@/game-lol/api.mjs";
import {
  PROMOTION_STATES,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
  ROLE_SYMBOL_TO_STR,
  TIER_LIST,
} from "@/game-lol/constants.mjs";
import {
  absoluteRank,
  convertRankFromNumberToRoman,
  convertRankFromRomanToNumber,
  getAbsoluteRankDivision,
  getDerivedId,
  getTierInfoFromAbsoluteLp,
  mapQueueToSymbol,
} from "@/game-lol/util.mjs";
import get from "@/util/get.mjs";
import orderArrayBy from "@/util/order-array-by.mjs";

function findQueue(queue, leagues) {
  return leagues.find((l) => l.queue === queue);
}

const LP_FOR_WIN_MATCH = 19.3; // 31.8 - 12.5
const LP_FOR_LOSE_MATCH = -12.5;
const LP_INIT_FOR_MATCH = 2.8;

export function loadLPGraphData({ region, name, profile, queue, state }) {
  return getData(
    API.getLOLMatches({
      maxMatchAge: 300,
      first: 20,
      region: region.toUpperCase(),
      accountId: profile.accountId,
      queue,
    }),
    LoLMatchHistories,
    ["lol", "lpMatches", getDerivedId(region, name)],
    { shouldFetchIfPathExists: !(state?.softUpdate || false) }
  );
}

export function calculateLPGraphs({
  account,
  region,
  queueId,
  leagues,
  matches,
}) {
  const queueSymbol = mapQueueToSymbol(queueId);
  const queueObj = QUEUE_SYMBOL_TO_STR[queueSymbol];
  const queueType = queueObj?.gql === "ALL" ? "RANKED_SOLO_5X5" : queueObj?.gql;
  const soloData = findQueue(QUEUE_SYMBOLS.rankedSoloDuo, leagues);
  const flexData = findQueue(QUEUE_SYMBOLS.rankedFlex, leagues);

  const curLeagueData =
    QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedFlex].key ||
    queueId === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].key ||
    queueId === "all"
      ? queueId === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].key
        ? flexData
        : soloData
      : null;

  const variables = {
    first: 20,
    account,
    region,
    queue: queueType,
  };

  const isARAM = mapQueueToSymbol(variables.queue) === QUEUE_SYMBOLS.aram;
  const { lpDataByRole: lpDataByRoleRaw } = getLPStats(
    orderArrayBy(matches, "gameCreation"),
    account,
    isARAM
  );
  const { lpdata, minGraphValue, maxGraphValue } = (() => {
    if (!lpDataByRoleRaw || !curLeagueData)
      return { lpdata: [], maxGraphLp: 0, minGraphLp: 0 };

    const leagueTier =
      RANK_SYMBOL_TO_STR[curLeagueData?.tier].capped ||
      RANK_SYMBOL_TO_STR[RANK_SYMBOLS.bronze].capped;
    const leagueRank = curLeagueData?.rank || convertRankFromNumberToRoman(4);

    let gameTier = leagueTier;
    let gameRank = leagueRank;
    const leaguePoints = curLeagueData?.leaguePoints || 0;
    // Decide absolute lp and division per match
    const games = get(lpDataByRoleRaw, "ALL.matches", [])?.slice(-10);

    let gameAbsLp = absoluteRank({
      tier: gameTier,
      rank: gameRank,
      leaguePoints: leaguePoints,
    });

    for (const game of games) {
      // Check absolute lp
      if (typeof game?.tierAbsLp === "number") {
        gameAbsLp = absoluteRank({
          leaguePoints: game?.tierAbsLp || 0,
          tier: game.tier,
          rank: game.division,
        });
        game.absLp = gameAbsLp;
      } else {
        game.absLp = gameAbsLp;
        const tierInfo = getTierInfoFromAbsoluteLp(
          gameAbsLp,
          leagueTier,
          leagueRank
        );
        game.tierAbsLp = tierInfo.tierLp;
        gameTier = tierInfo.tier;
        gameRank = tierInfo.rank;
        gameAbsLp = gameAbsLp - (game?.lp || 0);
      }

      // Check tier
      if (!game.tier) {
        game.tier = gameTier;
      } else {
        gameTier = game.tier;
      }

      // Check rank tier division
      game.division = game?.division || gameRank;
      game.divisionNumber = convertRankFromRomanToNumber(game.division);
      gameRank = game.division;

      // Tier Level
      game.tierLevel = TIER_LIST.findIndex(
        (rankName) => rankName === game.tier
      );
      game.absDivisonLevel = getAbsoluteRankDivision({
        tier: game.tier,
        rank: game.division,
      });
    }

    // Check promotion/demotion points
    if (games.length > 0) {
      let oldAbsTierLevel = games[games.length - 1].absDivisonLevel;
      for (let idx = games.length - 2; idx >= 0; idx--) {
        const game = games[idx];
        const gameAbsTierLevel = game.absDivisonLevel;
        if (gameAbsTierLevel > oldAbsTierLevel) {
          game.promotion = PROMOTION_STATES.promotion.value;
        } else if (gameAbsTierLevel < oldAbsTierLevel) {
          game.promotion = PROMOTION_STATES.demotion.value;
        } else {
          game.promotion = PROMOTION_STATES.default.value;
        }
        oldAbsTierLevel = gameAbsTierLevel;
      }
    }

    // Calculate min and max of graph
    const initGame = games?.[0];
    const maxAbsLpGame = games?.reduce((maxGame, game) => {
      if (maxGame.absLp < game.absLp) {
        return game;
      }
      return maxGame;
    }, initGame);
    const minAbsLpGame = games?.reduce((minGame, game) => {
      if (minGame.absLp > game.absLp) {
        return game;
      }
      return minGame;
    }, initGame);

    const minGraphValue = (minAbsLpGame?.absLp || 0) - 0;
    const maxGraphValue = (maxAbsLpGame?.absLp || 0) + 0;

    return {
      lpdata: games || [],
      minGraphValue: minGraphValue,
      maxGraphValue: maxGraphValue,
    };
  })();

  return {
    lpdata,
    minGraphValue,
    maxGraphValue,
    queueObj,
  };
}

/**
 *
 * Get last games with net lp and stats aggregated by champions
 * and all roles' stats
 * from matches
 *
 * @param {*} games: { netLp, matches }
 *
 * return { lpDataByRole }
 * lpDataByRole: { TOP: {}, MID: {}, ADC: {}, SUPPORT: {}, JUNGLE: {} }
 *
 */
const getLPStats = (matches, account, isARAM) => {
  if (!matches?.length)
    return {
      lpDataByRole: undefined,
    };

  const _lpDataByRole = {
    ALL: { netLp: 0, matches: [] },
    TOP: { netLp: 0, matches: [] },
    JUNGLE: { netLp: 0, matches: [] },
    MID: { netLp: 0, matches: [] },
    ADC: { netLp: 0, matches: [] },
    SUPPORT: { netLp: 0, matches: [] },
    ARAM: { netLp: 0, matches: [] },
  };

  const numMatchesByRoleChamp = matches.reduce((acc, m) => {
    const me = m.participants?.find((p) => p?.summonerName === account.name);
    const { championId, role } = me || {};
    acc[`${ROLE_SYMBOL_TO_STR[role]?.key || ""}${championId}`] =
      (acc[`${ROLE_SYMBOL_TO_STR[role]?.key || ""}${championId}`] || 0) + 1;
    return acc;
  });

  for (const match of matches) {
    if (!match.playerMatches && !match.playerMatches.length) continue;
    const me = match.playerMatches?.[0];
    const { gameCreation, gameId } = match;
    const {
      champion: { id: championId },
      role: roleSymbol,
      matchStatsFromClient,
      playerMatchStats: { win, opponentChampionId, goldDiffAtLaneEnd = 0 },
    } = me;

    const role = ROLE_SYMBOL_TO_STR[roleSymbol]?.key || "";
    let deltaLp = matchStatsFromClient?.deltaLp;
    const tier = matchStatsFromClient?.tier;
    const division = matchStatsFromClient?.division;
    const tierAbsLp = matchStatsFromClient?.lp;
    let isLpEstimated;
    numMatchesByRoleChamp[`${role}${championId}`] =
      (numMatchesByRoleChamp[`${role}${championId}`] || 0) + 1;

    const lpOffset =
      LP_INIT_FOR_MATCH / numMatchesByRoleChamp[`${role}${championId}`];
    if (deltaLp === undefined) {
      deltaLp = Math.round(
        win ? LP_FOR_WIN_MATCH + lpOffset : LP_FOR_LOSE_MATCH + lpOffset
      );
      isLpEstimated = true;
    }

    const newRole = isARAM ? "ARAM" : role.toUpperCase();

    if (_lpDataByRole[newRole]) {
      const data = {
        lp: deltaLp ?? 0,
        isLpEstimated,
        championId,
        enemyChampionId: opponentChampionId,
        gameCreation,
        win,
        gameId,
        tier,
        division,
        tierAbsLp,
        goldDiffAtLaneEnd: goldDiffAtLaneEnd,
      };
      _lpDataByRole[newRole].netLp += deltaLp ?? 0;
      _lpDataByRole[newRole].matches.push(data);
      _lpDataByRole["ALL"].netLp += deltaLp ?? 0;
      _lpDataByRole["ALL"].matches.push(Object.assign({}, data));
    }
  }

  return {
    lpDataByRole: _lpDataByRole,
  };
};
