export const extractTopRewards = (rewards, topRank) => {
  const result = [];
  rewards?.forEach((event) => {
    if (event.minRank < topRank) {
      let rank = event.minRank;
      while (rank <= event.maxRank && rank <= topRank) {
        result.push({ ...event, minRank: rank, maxRank: rank });
        rank++;
      }
      if (rank <= event.maxRank) {
        result.push({ ...event, minRank: rank, maxRank: event.maxRank });
      }
    } else {
      result.push(event);
    }
  });
  return result.sort((a, b) => a.minRank - b.minRank);
};

export const getManagedError = (error) => {
  if (!(error instanceof Error)) return null;

  switch (error.errorCode) {
    case "unprocessable_entity":
      return [
        "arena:error.alreadyJoinedDifferentAccount",
        "Unable to join challenge, you have already joined with a different account.",
      ];
    case "forbidden":
      return ["arena:error.eligible", "Country code or region not eligible"];
    case "gone":
      return ["arena:error.ended", "Event has ended"];
    case "unauthorized":
      return ["arena:error.notAuthorized", "Not authorized"];
    case "service_unavailable":
      return ["arena:error.ipAddress", "Cannot determine IP address"];
    case "bad_request":
      return [
        "arena:error.invalidAccountId",
        "arena:error.Invalid game account ID",
      ];
    case "not_found":
      return ["arena:error.notFound", "Cannot find event"];
    default:
      return ["", error.message];
  }
};
