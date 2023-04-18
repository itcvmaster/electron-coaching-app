import {
  __ONLY_WRITE_STATE_FROM_ACTIONS as writeState,
  readState,
} from "@/__main__/app-state.mjs";
import { RANK_SYMBOL_TO_STR, REGION_LIST } from "@/game-lol/constants.mjs";
import { POSTMATCH_CAROUSEL } from "@/game-tft/constants.mjs";
import { ref } from "@/game-tft/get-carousel.mjs";
import getStageFromRound from "@/game-tft/get-stage-from-round.mjs";

export function updateStats(stats = {}) {
  if (typeof stats !== "object") return;
  for (const key in stats) {
    if (
      typeof readState.tft.stats[key] !== "undefined" &&
      readState.tft.stats[key] === stats[key]
    ) {
      continue;
    }
    writeState.tft.stats.filters[key] = stats[key];
  }
}

export function updateStatsFilters(filters = {}) {
  if (typeof filters !== "object") return;
  for (const key in filters) {
    if (
      typeof readState.tft.stats.filters[key] !== "undefined" &&
      readState.tft.stats.filters[key] === filters[key]
    ) {
      continue;
    }
    writeState.tft.stats.filters[key] = filters[key];
  }
}

export function setDefaultStatsFilters() {
  updateStatsFilters({
    sort: "avgplacement",
    tab: "stats",
    rank: RANK_SYMBOL_TO_STR[
      Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)[0]
    ].key,
    region: REGION_LIST[0].key,
  });
}

export function setPostMatchRoundIndex(matchId, index) {
  if (typeof matchId === "undefined") return;
  writeState.tft.matches[matchId].rbdRoundPosition = index;
}

export function setPostMatchRoundStage(matchId, stage) {
  if (typeof stage === "string") stage = Number(stage);
  if (!Number.isInteger(stage) || stage <= 0 || typeof matchId === "undefined")
    return;
  const match = readState.tft.matches[matchId] || {};
  const rounds = match.extra?.RoundBreakDown || [];
  if (stage > getStageFromRound(rounds[rounds.length - 1].round)) return;
  for (let i = 0; i < rounds.length; i += 1) {
    const round = rounds[i] || {};
    if (getStageFromRound(round.round) === stage) {
      if (ref.carousel)
        ref.carousel.scrollLeft = i * POSTMATCH_CAROUSEL.ROUND_WIDTH;
      setPostMatchRoundIndex(matchId, i);
      break;
    }
  }
}
