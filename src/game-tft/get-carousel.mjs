import { POSTMATCH_CAROUSEL } from "@/game-tft/constants.mjs";

// Ref
export const ref = {
  carousel: null,
};

// Functions
export function calcCarouselScrollPositions(
  rounds = 0,
  slide = 0,
  inc = 0,
  results = []
) {
  if (slide > rounds) {
    if (inc * POSTMATCH_CAROUSEL.ROUNDS_VIEWABLE !== rounds - 1) {
      results[results.length - 1].index =
        rounds - POSTMATCH_CAROUSEL.ROUNDS_VIEWABLE;
      results.push({
        offset: rounds * POSTMATCH_CAROUSEL.ROUND_WIDTH,
        index: rounds - 1,
      });
    }
    return results;
  }
  results.push({
    offset: slide * POSTMATCH_CAROUSEL.ROUND_WIDTH,
    index: inc * POSTMATCH_CAROUSEL.ROUNDS_VIEWABLE,
  });
  return calcCarouselScrollPositions(
    rounds,
    slide + POSTMATCH_CAROUSEL.ROUNDS_VIEWABLE,
    inc + 1,
    results
  );
}
