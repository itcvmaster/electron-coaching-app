import { model as arenaEventDetailsModel } from "@/feature-arena/arena-event-detail.mjs";
import { model as arenaEventModel } from "@/feature-arena/arena-events.mjs";
import { model as arenaGameRecordModel } from "@/feature-arena/arena-game-record.mjs";
import { model as arenaJoinResultModel } from "@/feature-arena/arena-join-result.mjs";
import { IS_DEV } from "@/util/dev.mjs";
import gql from "@/util/graphql-query.mjs";

export const leagueGameRecord = gql`
  mutation ChallengeLeagueGameRecord(
    $gameId: String!
    $premadePuuids: [String!]!
    $region: Region!
    $postMatch: Boolean!
    $userAccountId: ID!
    $leagueProfileId: ID!
  ) {
    challengeLeagueGameRecord(
      gameId: $gameId
      region: $region
      premadePuuids: $premadePuuids
      postMatch: $postMatch
      userAccountId: $userAccountId
      leagueProfileId: $leagueProfileId
    ) { ${arenaGameRecordModel} }
  }
`;

export const eventList = gql`
query events($title: String, $isLoggedIn: Boolean!) {
    events(
      title: $title
      restricted: ${String(!!IS_DEV)}
    ) { ${[arenaEventModel, { optedIn: "@include(if: $isLoggedIn)" }]} }
}`;

export const eventDetails = gql`
query event($eventId: ID, $fetchCount: Int, $isLoggedIn: Boolean!, $optedIn: Boolean!){
    event(
      id: $eventId
      restricted: ${String(!!IS_DEV)}
    ) { ${[
      arenaEventDetailsModel,
      {
        leaderboard: "(first: $fetchCount)",
        optedIn: "@include(if: $isLoggedIn)",
        optIn: "@include(if: $optedIn)",
      },
    ]} }
}`;

export const challengeOptIn = gql`
  mutation challengeOptIn(
    $eventId: ID!
    $game: Game!
    $gameAccountId: String!
  ) {
    challengeOptIn(
      eventId: $eventId
      game: $game
      gameAccountId: $gameAccountId
    ) {${arenaJoinResultModel}}
  }
`;
