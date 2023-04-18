import { appURLs } from "@/app/constants.mjs";
import { LEADERBOARD_FETCH_COUNT } from "@/feature-arena/m-constants.mjs";
import {
  eventDetails,
  eventList,
} from "@/feature-arena/m-graphql-template.mjs";
import parseSearchParams from "@/util/parse-search-params.mjs";

export function getEventsUrl(isLoggedIn = false) {
  const searchParams = parseSearchParams({
    query: eventList,
    variables: { isLoggedIn },
  });

  const url = `${appURLs.CMS}/graphql?${searchParams}`;
  return url;
}

export function getEventUrl(
  eventId,
  [isLoggedIn = false, optedIn = false],
  fetchCount = LEADERBOARD_FETCH_COUNT
) {
  const searchParams = parseSearchParams({
    query: eventDetails,
    variables: { eventId, fetchCount, isLoggedIn, optedIn },
  });
  const url = `${appURLs.CMS}/graphql?${searchParams}`;
  return url;
}
