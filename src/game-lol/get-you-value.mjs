import { scoreWeights } from "@/game-lol/constants.mjs";

export default function getYouValue(value) {
  const you = scoreWeights.distribution.you;
  return (100 - value) * you.ratio + you.offset;
}
