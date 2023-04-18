import { model as lolChampionBuildModel } from "@/data-models/lol-champion-builds.mjs";
import { model as lolChampionInsightsModel } from "@/data-models/lol-champion-insights.mjs";
import { model as lolChampionReportModel } from "@/data-models/lol-champion-report.mjs";
import { model as lolChampionRolesModel } from "@/data-models/lol-champion-roles.mjs";
import { model as lolChampionStatsModel } from "@/data-models/lol-champion-stats.mjs";
import { model as lolChampionStatsTrendsModel } from "@/data-models/lol-champion-stats-trends.mjs";
import { model as lolChampionSynergiesModel } from "@/data-models/lol-champion-synergies.mjs";
import { model as lolMatchModel } from "@/data-models/lol-match.mjs";
import { model as lolMatchHistoriesModel } from "@/data-models/lol-match-histories.mjs";
import { model as lolOfficialMatchListModel } from "@/data-models/lol-match-list-official.mjs";
import { model as lolUnofficialMatchListModel } from "@/data-models/lol-match-list-unofficial.mjs";
import { model as lolMatchRankStatsModel } from "@/data-models/lol-match-rank-stats.mjs";
import { model as lolPatchesModel } from "@/data-models/lol-patches.mjs";
import { model as lolPlayerChampionStatsModel } from "@/data-models/lol-player-champion-stats.mjs";
import { model as lolPlayerStylesModel } from "@/data-models/lol-player-styles.mjs";
import { model as lolProbuildMatchModel } from "@/data-models/lol-probuild-match.mjs";
import { model as lolProbuildMatchesModel } from "@/data-models/lol-probuild-matches.mjs";
import { model as lolProbuildProsModel } from "@/data-models/lol-probuild-pros.mjs";
import { model as lolProbuildSummaryModel } from "@/data-models/lol-probuild-summary.mjs";
import { model as lolProbuildTeamsModel } from "@/data-models/lol-probuild-teams.mjs";
import { model as lolRoleMatchups } from "@/data-models/lol-role-matchups.mjs";
import { model as lolSeasonsModel } from "@/data-models/lol-seasons.mjs";
import { model as lolSummonerModel } from "@/data-models/lol-summoner.mjs";
import gql from "@/util/graphql-query.mjs";

export const Seasons = gql`
  query Seasons {
    seasons { ${lolSeasonsModel} }
  }
`;

export const Patches = gql`
  query Patches {
    patches { ${lolPatchesModel} }
  }
`;

export const LeagueProfile = gql`
query LeagueProfile(
  $summoner_name: String
  $summoner_id: String
  $account_id: String
  $region: Region!
  $puuid: String
) {
  leagueProfile(
    summoner_name: $summoner_name
    summoner_id: $summoner_id
    account_id: $account_id
    region: $region
    puuid: $puuid
  ) { ${lolSummonerModel} }
}`;

export const ChampionPrimaryRole = gql`
  query ChampionPrimaryRole($championId: ID) {
    primaryRole(championId: $championId)
  }
`;

export const ChampionsReport = gql`
  query {
    allChampionStats(mostPopular: true) { ${lolChampionReportModel} }
  }
`;

export const AllChampionRoles = gql`
  query {
    allChampionStats(mostPopular: false) { ${lolChampionRolesModel} }
  }
`;

export const AllChampionsStats = gql`
  query AllChampionsStats(
    $tier: Tier
    $patch: String
    $region: Region
    $queue: Queue
  ) {
    allChampionStats(
      tier: $tier
      patch: $patch
      mostPopular: true
      region: $region
      queue: $queue
    ) { ${lolChampionStatsModel} }
  }
`;

export const ChampionStats = gql`
  query ChampionStats(
    $championId: Int
    $role: Role
    $tier: Tier
    $region: Region
    $queue: Queue
  ) {
    allChampionStats(
      championId: $championId
      role: $role
      tier: $tier
      region: $region
      queue: $queue
    ) { ${lolChampionStatsModel} }
  }
`;

export const RoleMatchups = gql`
  query RoleMatchups(
    $role: Role
  ) {
    allChampionStats(
      tier: PLATINUM_PLUS
      mostPopular: true
      role: $role
    ) { ${lolRoleMatchups} }
  }
`;

export const ChampionStatsTrends = gql`
  query ChampionStatsTrends(
    $championId: Int!
    $tier: Tier
    $region: Region
    $queue: Queue
    $role: Role
  ) {
    allChampionTrends(
      championId: $championId
      tier: $tier
      region: $region
      queue: $queue
      role: $role
    ) { ${lolChampionStatsTrendsModel} }
  }
`;

export const ChampionBuilds = gql`
  query ChampionBuilds(
    $championId: Int!
    $queue: Queue!
    $role: Role!
    $key: ChampionBuildKey
  ) {
    championBuildStats(
      championId: $championId
      queue: $queue
      role: $role
      key: $key
    ) { ${lolChampionBuildModel} }
  }
`;

export const Synergies = gql`
  query Synergies(
    $region: Region
    $queue: RoledQueue
    $tier: Tier
    $role: Role!
    $duoRole: Role!
  ) {
    allSynergies(
      region: $region
      queue: $queue
      tier: $tier
      role: $role
      duoRole: $duoRole
    ) { ${lolChampionSynergiesModel} }
  }
`;

export const GetUnofficialMatchList = gql`
  query Matches($region: Region!, $account_id: String) {
    matches(region: $region, accountId: $account_id, first: 60) { ${lolUnofficialMatchListModel} }
  }
`;

// TODO: Garena. Test this w/ garena data
export const GetUnofficialMatch = gql`
  query Matches($region: Region!, $riot_match_id: String) {
    matches(region: $region, riot_match_id: $riot_match_id) { ${lolMatchModel} }
  }
`;

export const GetOfficialMatchList = gql`
  query LeagueMatchlist($region: Region!, $puuid: ID!) {
    matchlist(region: $region, puuid: $puuid) { ${lolOfficialMatchListModel} }
  }
`;

export const rankStatsQuery = gql`
  query DivisionStats($queue: Queue!, $role: Role, $championId: Int) {
    divisionStats(queue: $queue, role: $role, championId: $championId) { ${lolMatchRankStatsModel} }
  }
`;

export const fetchUserChampions = gql`
  query PlayerChampionStats(
    $accountId: String!
    $region: Region!
    $queue: Queue
    $championId: Int
    $role: Role
  ) {
    playerChampionsStats(
      accountId: $accountId
      region: $region
      queue: $queue
      championId: $championId
      role: $role
    ) { ${lolPlayerChampionStatsModel} }
  }
`;

export const getLeagueMatch = gql`
  query LeagueMatch($region: Region!, $matchId: ID!) {
    match(region: $region, matchId: $matchId)
  }
`;

export const getMatchListForPlayer = gql`
  query matches(
    $region: Region!
    $accountId: String!
    $first: Int
    $role: Role
    $queue: Queue
    $championId: Int
    $riotSeasonId: Int
    $maxMatchAge: Int
  ) {
    matches(
      region: $region
      accountId: $accountId
      first: $first
      role: $role
      queue: $queue
      championId: $championId
      riotSeasonId: $riotSeasonId
      maxMatchAge: $maxMatchAge
    ) {
      ${[lolMatchHistoriesModel, { playerMatches: "(accountId: $accountId)" }]}
    }
  }
`;

export const GetChampionInsights = gql`
  query LeagueChampionInsights($language: String) {
    championInsights {
      ${[
        lolChampionInsightsModel,
        {
          tips: ["insights", "strengths", "weaknesses"].reduce((acc, key) => {
            acc[key] = { localizedInsights: "(language: $language)" };
            return acc;
          }, {}),
        },
      ]}
    }
  }
`;

export const ChampionProMatches = gql`
  query ProBuildsMatchesForChampion($id: ID!, $first: Int, $lane: String){
    probuildChampion(id: $id) { ${[
      lolProbuildMatchModel,
      { probuildMatches: "(first: $first, lane : $lane)" },
    ]} }
  }`;

export const ProMatches = gql`
  query ProMatchHistory($lane: String, $first: Int, $teamIds: [ID]) {
    probuildMatches(lane: $lane, first: $first, teamIds: $teamIds) { ${lolProbuildMatchesModel} }
  }`;

export const fetchProBuildsSummariesForChampion = gql`
query ProBuildsSummariesForChampion($id: ID){
  probuildChampion(id: $id) { ${lolProbuildSummaryModel} }
}
`;

export const queryProBuildPros = gql`
  query ProbuildPlayers { probuildPlayers { ${lolProbuildProsModel} } }
`;

export const getProBuildTeams = gql`
  query ProbuildTeams { probuildTeams { ${lolProbuildTeamsModel} } }
`;

export const GetMatchTimeline = gql`
  query LeagueTimeline($region: Region!, $matchId: ID!) {
    timeline(region: $region, matchId: $matchId)
  }
`;

export const buildsForChampion = gql`
  query buildsForChampion(
    $championId: Int!
    $queue: Queue!
    $role: Role
    $key: ChampionBuildKey
  ) {
    championBuildStats(
      championId: $championId
      queue: $queue
      role: $role
      key: $key
    ) { ${lolChampionBuildModel} }
  }
`;

export const fetchPlayStyles = gql`
  query playstyles($region: Region!, $accountId: String!, $queue: Queue) {
    playstyles(region: $region, accountId: $accountId, queue: $queue) { ${lolPlayerStylesModel} }
  }
`;
