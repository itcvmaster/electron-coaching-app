import { updateRoute } from "@/__main__/router.mjs";
import { VAL_REGIONS } from "@/game-val/constants.mjs";

export const getParamsStr = (searchParams) =>
  new URLSearchParams(getParams(searchParams));

export const getParams = (searchParams) => {
  const {
    rank = "radiant",
    region = VAL_REGIONS[0].value,
    sortOrder = "asc",
    sortBy = "leaderboardRank",
    ...obj
  } = Object.fromEntries(searchParams);
  return { rank, region, sortOrder, sortBy, ...obj };
};

export const updateParams = ({ searchParams, currentPath, ...params }) => {
  const urlParams = getParamsStr(searchParams);

  Object.entries(params).forEach(([key, value]) => {
    if (key === "sortOrder") {
      urlParams.set(key, value.toLowerCase());
    } else {
      urlParams.set(key, value);
    }
  });

  updateRoute(currentPath, urlParams);
};

export const getLeaderboardData = (leaderboard, searchParams) =>
  leaderboard[btoa(getParamsStr(searchParams))] || [];
