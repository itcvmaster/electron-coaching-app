import { postData } from "@/__main__/get-data.mjs";
import { appURLs } from "@/app/constants.mjs";
import JoinResult from "@/feature-arena/arena-join-result.mjs";
import { challengeOptIn } from "@/feature-arena/m-graphql-template.mjs";
import getBearerToken from "@/feature-auth/get-auth-request-header.mjs";

export async function joinEvent(eventId, game, gameAccountId) {
  const bearerToken = await getBearerToken();
  return postData(
    {
      url: `${appURLs.CMS}/graphql`,
      body: {
        query: challengeOptIn,
        variables: {
          eventId,
          game,
          gameAccountId,
        },
      },
    },
    JoinResult,
    ["arena", "joinResult", eventId],
    { headers: { Authorization: bearerToken } }
  );
}
