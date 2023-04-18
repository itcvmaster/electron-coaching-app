import getData from "@/__main__/get-data.mjs";
import LoLChampionReport from "@/data-models/lol-champion-report.mjs";
import LoLMatch from "@/data-models/lol-match.mjs";
import LoLMatchRankStats from "@/data-models/lol-match-rank-stats.mjs";
import LolMatchTimeline from "@/data-models/lol-match-timeline.mjs";
import LoLSummoner from "@/data-models/lol-summoner.mjs";
import * as API from "@/game-lol/api.mjs";
import { ARAM_QUEUE_TYPES } from "@/game-lol/constants.mjs";
import {
  getChampionDivStatsId,
  getDerivedId,
  roleHumanize,
} from "@/game-lol/util.mjs";

const PATCH_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
let patchesFetchedAt = null;

// path regExp: /lol/profile/(.*)/(.*)
async function fetchData([region, name, matchId], searchParam, state) {
  const shouldFetchAfterDuration =
    !patchesFetchedAt || Date.now() - patchesFetchedAt > PATCH_TIMEOUT;
  if (shouldFetchAfterDuration) {
    patchesFetchedAt = Date.now();
  }

  const profile = await getData(
    API.getSummoner({ region, name }),
    LoLSummoner,
    ["lol", "profiles", getDerivedId(region, name)],
    { shouldFetchIfPathExists: !(state?.softUpdate || false) }
  );

  const championReportPromise = getData(
    API.getChampionReport(),
    LoLChampionReport,
    ["lol", "championReport"],
    {
      shouldFetchIfPathExists: shouldFetchAfterDuration,
    }
  );

  const timelinePromise = getData(
    API.getMatchTimeline({ matchId, region }),
    LolMatchTimeline,
    ["lol", "matchTimeline", matchId],
    {
      shouldFetchIfPathExists: true,
    }
  );

  const championDivStatsPromises = {};
  let leagueProfilesPromise = [];
  const matchPromise = getData(
    API.getMatch(region, Number(matchId)),
    LoLMatch,
    ["lol", "matches", `${region.toUpperCase()}_${matchId}`]
  ).then((match) => {
    if (match instanceof Error) return;
    const { participants, queueId: queue } = match;
    const { role, championId } = participants.find(
      (p) => p.puuid === profile.puuid
    );

    leagueProfilesPromise = participants.map((p) => {
      const playerDerivedId = getDerivedId(region, p?.summonerName);
      if (profile.puuid !== p.puuid && p.puuid !== "BOT") {
        return getData(
          API.getSummoner({ region, puuid: p?.puuid }),
          LoLSummoner,
          ["lol", "profiles", playerDerivedId]
        );
      }
      return true;
    });
    const roleName = roleHumanize(role)?.toUpperCase();
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
    }
  });

  return Promise.all([
    matchPromise,
    championReportPromise,
    championDivStatsPromises,
    timelinePromise,
    leagueProfilesPromise,
  ]);
}

export default fetchData;
