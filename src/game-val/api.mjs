import { appURLs } from "@/app/constants.mjs";

export function getValorantPlayer(
  nameTag,
  params = { version: 1623763267687 }
) {
  return `${appURLs.VALORANT}/player/${nameTag}?${new URLSearchParams(
    params
  ).toString()}`;
}

/*
  Parameters
    @ profileId - playerId (puuid, not name tag)
    @ params : { type, actId, updatedAt }
*/
export function getValorantPlayerStats(playerId, params) {
  return `${appURLs.VALORANT}/player/${playerId}/stats?${new URLSearchParams(
    params
  ).toString()}`;
}

export const getLatestValorantContent = () => {
  const url =
    appURLs.VALORANT + `/stats/contents/latest/sanitized-contents.json`; //?updatedAt=${Date.now()}
  return url;
};

export function getValorantMatchPartial(playerId) {
  return `${appURLs.VALORANT}/match-partial/${playerId}`;
}

//   https://valorant.iesdev.com/
// match/e92b7be2-cd3b-43dd-8480-7536787c442d?type=subject&actId=573f53ac-41a5-3a7d-d9ce-d6a6298e5704

export function getValorantMatch(matchId, params) {
  return `${appURLs.VALORANT}/match/${matchId}?${new URLSearchParams(
    params
  ).toString()}`;
}

export function getMatchPlayerByMatch(playerId, matchId) {
  // /matchplayer/:matchId/:playerId
  return `${appURLs.VALORANT}/matchplayer/${matchId}/${playerId}`;
}

export function getMatchPlayer(playerId) {
  // /matchplayer/:playerId
  return `${appURLs.VALORANT}/matchplayer/${playerId}`;
}

// export function getValorantMatch(playerId, type) {
//   return `${appURLs.VALORANT}/match/${playerId}?${new URLSearchParams({
//     type,
//   }).toString()}`;
// }

export function getValorantMatchesByPlayerId(playerId, params) {
  return `${appURLs.VALORANT}/matches/${playerId}?${new URLSearchParams(
    params
  ).toString()}`;
}

export function getValorantSkillsByPlayerId(playerId, params) {
  return `${appURLs.VALORANT}/skills/${playerId}?${new URLSearchParams(
    params
  ).toString()}`;
}
/*
  Parameters
    @ profileId - Profile Id with region
    @ params : { offset, queues, type, updatedMPs, actId }
*/
export function getValorantMatchStatsByPlayerId(playerId, params) {
  return `${appURLs.VALORANT}/matchplayer/${playerId}?${new URLSearchParams(
    params
  ).toString()}`;
}

export function getValorantHNByPlayerId(playerId) {
  return `${appURLs.VALORANT}/player/headshot-notifications/${playerId}`;
}

export function getValorantLeaderboard() {
  return `${appURLs.VALORANT}/leaderboards`;
}

export function getOfficialLeaderboard(queryString) {
  return `${appURLs.VALORANT}/official-leaderboard?${queryString}`;
}

export function getValorantLeaderboardByFilter(sortBy, agent) {
  return `${appURLs.VALORANT}/stats/leaderboards/${sortBy}_${agent}.json`;
}

export function getValorantFilteredLeaderboard() {
  return `${appURLs.VALORANT}/stats/counts/users-analyzed.json`;
}

export function getValorantOverallByTier(tier) {
  return `${appURLs.VALORANT}/stats/overall_${tier}.json`;
}

export function getValorantStatsByFilter(page, filtersStr) {
  return `${appURLs.VALORANT}/stats/${page}/${filtersStr}.json`;
}

export function getValorantRankStats() {
  return `${appURLs.VALORANT}/stats/ranks/all.json`;
}

export function getValorantDivisionStats() {
  return `${appURLs.VALORANT}/stats/divisions/all.json`;
}

export function getValorantConstDataByType(type) {
  return `${appURLs.VALORANT_DATA}/${type}.json`; // type: abilities or weapons
}
