import React, { memo } from "react";

import { PerformanceContainer } from "@/game-tft/CommonComponents.jsx";
import PostMatchPerformanceItemBenchPerRound from "@/game-tft/PostMatchPerformanceItemBenchPerRound.jsx";
import PostMatchPerformanceItemEffectiveness from "@/game-tft/PostMatchPerformanceItemEffectiveness.jsx";
import PostMatchPerformanceItemTier from "@/game-tft/PostMatchPerformanceItemTier.jsx";

function PostMatchPerformanceItemScore() {
  return (
    <PerformanceContainer>
      <PostMatchPerformanceItemEffectiveness />
      <PostMatchPerformanceItemBenchPerRound />
      <PostMatchPerformanceItemTier />
    </PerformanceContainer>
  );
}

export default memo(PostMatchPerformanceItemScore);
