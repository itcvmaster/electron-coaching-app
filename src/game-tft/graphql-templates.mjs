import { model as tftMatchListModel } from "@/data-models/tft-match-list.mjs";
import { model as tftPlayerModel } from "@/data-models/tft-player.mjs";
import gql from "@/util/graphql-query.mjs";

export const Profile = gql`
  query s(
    $name: String!
    $region: String!
    $user: Boolean
    $getLatest: Boolean
  ) {
    s(name: $name, region: $region, user: $user, getLatest: $getLatest) { ${tftPlayerModel} }
  }
`;

export const Matchlist = gql`
  query ms($ids: [String]!) {
    ms(ids: $ids) { ${tftMatchListModel} }
  }
`;

export const ProBuildsSummoners = `
  query TftProbuildPlayers {
    probuilds {
      summoners {
        name
        region
        puuid
        accountid
        profileiconid
        leagues
        summonerlevel
      }
    }
   }
`;

export const ProBuildsMatches = `
  query TftProbuildMatches($offset: Int!) {
    probuilds {
      matches(offset: $offset) {
        matchid
        createdAt
        players
        data
        length
        queueId
        patch
      }
    }
  }
`;
