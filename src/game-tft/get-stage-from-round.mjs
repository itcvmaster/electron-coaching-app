export default function getStageFromRound(str) {
  if (typeof str === "string") {
    const result = Number((str.match(/(\d*)(_|-)/) || [])[1]);
    if (Number.isFinite(result)) return result;
  }
  return 0;
}
