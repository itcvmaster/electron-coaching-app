import { readState } from "@/__main__/app-state.mjs";
import getData from "@/__main__/get-data.mjs";
import LoLMatch from "@/data-models/lol-match.mjs";
import LCUMatch from "@/data-models/lol-match-lcu.mjs";
import LCUMatchList from "@/data-models/lol-match-list-lcu.mjs";
import LoLMatchListOfficial from "@/data-models/lol-match-list-official.mjs";
import LoLMatchListUnofficial from "@/data-models/lol-match-list-unofficial.mjs";
import LoLMatchRankStats from "@/data-models/lol-match-rank-stats.mjs";
import LoLPlayerChampionStats from "@/data-models/lol-player-champion-stats.mjs";
import LoLPlayerStyles from "@/data-models/lol-player-styles.mjs";
import LoLSummoner from "@/data-models/lol-summoner.mjs";
import LCUSummoner from "@/data-models/lol-summoner-lcu.mjs";
import { updateRecentlySearchedAccounts } from "@/game-lol/actions.mjs";
import * as API from "@/game-lol/api.mjs";
import {
  ARAM_QUEUE_TYPES,
  GARENA_REGIONS,
  ROLE_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import { loadLPGraphData } from "@/game-lol/lol-calculate-lp-graph.mjs";
import * as LCUAPI from "@/game-lol/lol-client-api.mjs";
import {
  getChampionDivStatsId,
  getDerivedId,
  getDerivedQueue,
  isAbandonedMatch,
  isExternalAPIRegion,
  isMatchInQueue,
  roleHumanize,
} from "@/game-lol/util.mjs";
import { devError } from "@/util/dev.mjs";

// path regExp: /lol/profile/(.*)/(.*)
async function fetchData([region, name], searchParam, state) {
  const softUpdate = Boolean(state?.softUpdate);
  const derivedId = getDerivedId(region, name);

  const shouldUseLCUData =
    LCUAPI.GetLCUAvailable() && !isExternalAPIRegion(region);
  const isOwnAccount = Boolean(
    readState.settings.loggedInAccounts.lol[derivedId]
  );

  // Extend expiry time for own accounts.
  const expiryTime = !isOwnAccount
    ? null
    : Date.now() + 1000 * 60 * 60 * 24 * 365; // 1 year

  const profileOptions = {
    shouldFetchIfPathExists: !softUpdate,
    expiryTime,
  };
  const profilePath = ["lol", "profiles", derivedId];
  const profile = shouldUseLCUData
    ? await getData(
        () => LCUAPI.getLCUSummonerProfile(name),
        LCUSummoner,
        profilePath,
        profileOptions
      )
    : await getData(
        API.getSummoner({ region, name }),
        LoLSummoner,
        profilePath,
        profileOptions
      );

  const isLoggedInAccount = readState.volatile.currentSummoner === derivedId;

  if (!softUpdate) {
    updateRecentlySearchedAccounts(region, name, profile);
  }

  const playerStylePromise = getData(
    API.getPlayStyles(region, profile.accountId),
    LoLPlayerStyles,
    ["lol", "playerStyle", derivedId],
    { shouldFetchIfPathExists: !softUpdate, expiryTime }
  );

  const champStatsPromise = getData(
    API.getPlayerChampionStats({
      region: region.toUpperCase(),
      accountId: profile.accountId,
      ...(searchParam && searchParam.queue ? { queue: searchParam.queue } : {}),
    }),
    LoLPlayerChampionStats,
    [
      "lol",
      "playerChampionStats",
      getDerivedQueue(derivedId, searchParam.queueId),
    ],
    { shouldFetchIfPathExists: !softUpdate, expiryTime }
  );

  const lpGraphPromise = loadLPGraphData({
    profile,
    region,
    queue: "RANKED_SOLO_5X5",
    name,
    state,
  });

  const matchListOptions = {
    shouldFetchIfPathExists: !softUpdate,
    expiryTime,
    mergeFn: (curValues, newValues) => {
      for (const newMatch of newValues) {
        if (!curValues.find((c) => c.id === newMatch.id)) {
          curValues.push(newMatch);
        }
      }
      return curValues;
    },
  };
  const matchListPath = ["lol", "matchlists", derivedId];

  const matchOptions = {
    expiryTime,
    shouldFetchIfPathExists: !softUpdate,
  };

  const matchlistPromise = (
    shouldUseLCUData
      ? getData(
          isLoggedInAccount ? () => LCUAPI.getLCUMatchList(profile.puuid) : [],
          LCUMatchList,
          matchListPath,
          matchListOptions
        )
      : getData(
          API.getMatchList(region, profile.puuid),
          GARENA_REGIONS.includes(region)
            ? LoLMatchListUnofficial
            : LoLMatchListOfficial,
          matchListPath,
          matchListOptions
        )
  ).then((matchlist) => {
    if (!state) return null;
    const matchesToLoad = matchlist.filter(
      ({ id }) => /*index < 20 ||*/ state?.visibleMatches?.[id]
    );

    const championDivStatsPromises = {};

    return Promise.all(
      matchesToLoad.map(({ id }) => {
        const matchPath = ["lol", "matches", id];
        const [region, gameId] = id.split("_");
        return (
          shouldUseLCUData
            ? getData(
                () => LCUAPI.getLCUMatch(gameId),
                LCUMatch,
                matchPath,
                matchOptions
              )
            : getData(
                API.getMatch(region, Number(gameId)),
                LoLMatch,
                matchPath,
                matchOptions
              )
        )
          .then((match) => {
            if (match instanceof Error) return null;
            const { participants, queueId: queue } = match;
            const self = participants.find((p) => p.puuid === profile.puuid);
            if (
              !self ||
              !isMatchInQueue(match, queue) ||
              isAbandonedMatch(match)
            )
              return null;

            const { role, championId } = self;

            const roleData = ROLE_SYMBOL_TO_STR[role];
            const roleName = roleHumanize(roleData?.key).toUpperCase();
            const isARAM = ARAM_QUEUE_TYPES.includes(queue);
            const variables = {
              ...(isARAM ? {} : { role: roleName }),
              championId: championId,
              queue: isARAM ? "HOWLING_ABYSS_ARAM" : "RANKED_SOLO_5X5",
            };
            const key = getChampionDivStatsId(variables);

            if (roleName !== "NONE" && !championDivStatsPromises[key]) {
              championDivStatsPromises[key] = getData(
                API.getLolRankStats(variables),
                LoLMatchRankStats,
                ["lol", "championDivStats", key]
              );
              return championDivStatsPromises[key];
            }
            return null;
          })
          .catch((error) => {
            devError("LOL PROFILE", error);
          });
      })
    );
  });

  return Promise.all([
    matchlistPromise,
    playerStylePromise,
    champStatsPromise,
    lpGraphPromise,
  ]);
}

export default fetchData;
