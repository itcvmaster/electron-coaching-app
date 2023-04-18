import React, { memo } from "react";
import { styled } from "goober";

import PostMatchProNoData from "@/game-tft/PostMatchProNoData.jsx";
import PostMatchTimelineCoin from "@/game-tft/PostMatchTimelineCoin.jsx";
import PostMatchTimelineHealthPoints from "@/game-tft/PostMatchTimelineHealthPoints.jsx";
import PostMatchTimelineItemTimeline from "@/game-tft/PostMatchTimelineItemTimeline.jsx";
import PostMatchTimelineRoundByRound from "@/game-tft/PostMatchTimelineRoundByRound.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";

function PostMatchTimeline() {
  const currentMatch = useMatch();
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const goldInterest = currentMatch.extra.Timeline.goldInterest || 0;
  if (goldInterest === 0) return <PostMatchProNoData />;
  return (
    <Container>
      <PostMatchTimelineRoundByRound />
      <PostMatchTimelineHealthPoints />
      <PostMatchTimelineCoin />
      <PostMatchTimelineItemTimeline />
    </Container>
  );
}

export default memo(PostMatchTimeline);

const Container = styled("div")({
  display: "flex",
  gap: "var(--sp-2)",
  flexDirection: "column",
});
