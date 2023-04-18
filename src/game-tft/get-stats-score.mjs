// Calculate tier for item points
export const calculateItemTier = (itemPoints = 0, itemsAvgPts = 0) => {
  const itemPerformance = itemPoints / itemsAvgPts;

  switch (true) {
    case itemPerformance >= 1.7:
      return 1;
    case itemPerformance >= 1.1:
      return 2;
    case itemPerformance >= 0.35:
      return 3;
    case itemPerformance >= 0.15:
      return 4;
    case itemPerformance >= -10:
      return 5;
    default:
      return "none";
  }
};

// Calculate tier for comps points
export const calculateCompTier = (compPoints = 0) => {
  switch (true) {
    case compPoints >= 3:
      return 1;
    case compPoints >= 2:
      return 2;
    case compPoints >= 1.0:
      return 3;
    case compPoints >= 0.4:
      return 4;
    default:
      return 5;
  }
};

// Calculate tier for champions
export const calculateChampTier = (
  champPoints = 0,
  champAvgPts,
  maxChampPts
) => {
  const champPerformance = champPoints / champAvgPts;
  const champMaxPerformance = maxChampPts / champAvgPts;
  switch (true) {
    case champPerformance >= champMaxPerformance * 0.68:
      return 1;
    case champPerformance >= champMaxPerformance * 0.55:
      return 2;
    case champPerformance >= champMaxPerformance * 0.4:
      return 3;
    case champPerformance >= 0:
      return 4;
    default:
      return 5;
  }
};
