import getData, { postData } from "@/__main__/get-data.mjs";
import { appURLs, GAME_SHORT_NAMES } from "@/app/constants.mjs";
import EventModel from "@/feature-arena/arena-event-detail.mjs";
import EventsModel from "@/feature-arena/arena-events.mjs";
import GameRecordModel from "@/feature-arena/arena-game-record.mjs";
import { getEventsUrl, getEventUrl } from "@/feature-arena/m-event-api.mjs";
import getBearerToken from "@/feature-auth/get-auth-request-header.mjs";

export async function fetchEvents() {
  const bearerToken = await getBearerToken();

  return getData(
    getEventsUrl(Boolean(bearerToken)),
    EventsModel,
    ["arena", "eventList"],
    {
      shouldFetchIfPathExists: true,
      headers: { Authorization: bearerToken },
    }
  );
}

async function getOptedIn(id) {
  const events = await fetchEvents();

  return events.find((event) => event.id === id)?.optedIn || false;
}

export async function fetchEvent(params) {
  const bearerToken = await getBearerToken();
  const [id] = params;
  const optedIn = bearerToken ? await getOptedIn(id) : false;

  return getData(
    getEventUrl(id, [Boolean(bearerToken), optedIn]),
    EventModel,
    ["arena", "eventDetails", id],
    {
      shouldFetchIfPathExists: true,
      headers: { Authorization: bearerToken },
    }
  );
}

export async function loadMoreLeaderboard(id, count) {
  const bearerToken = await getBearerToken();
  const optedIn = bearerToken ? await getOptedIn(id) : false;

  return getData(
    getEventUrl(id, [Boolean(bearerToken), optedIn], count),
    EventModel,
    ["arena", "eventDetails", id],
    {
      shouldFetchIfPathExists: true,
      headers: { Authorization: bearerToken },
    }
  );
}

export function postChallengeRecord({
  gameSymbol,
  query,
  variables,
  primaryKey,
  bearerToken,
}) {
  if (!primaryKey) primaryKey = variables.gameId;

  const shortName = GAME_SHORT_NAMES[gameSymbol];

  return postData(
    {
      url: `${appURLs.CMS}/graphql`,
      body: {
        query,
        variables,
      },
    },
    GameRecordModel,
    ["arena", "gameRecords", shortName, primaryKey],
    { headers: { Authorization: `Bearer ${bearerToken}` } }
  );
}
