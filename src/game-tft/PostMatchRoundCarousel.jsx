import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { styled } from "goober";

import { setPostMatchRoundIndex } from "@/game-tft/actions.mjs";
import TftColor from "@/game-tft/colors.mjs";
import { POSTMATCH_CAROUSEL } from "@/game-tft/constants.mjs";
import { calcCarouselScrollPositions, ref } from "@/game-tft/get-carousel.mjs";
import {
  useRBDPlayers,
  useRBDRound,
  useRBDRounds,
} from "@/game-tft/PostMatchRound.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import CheckIcon from "@/inline-assets/check.svg";
import ChevronLeftIcon from "@/inline-assets/chevron-left.svg";
import ChevronRightIcon from "@/inline-assets/chevron-right.svg";
import CloseIcon from "@/inline-assets/close-icon.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";

function PostMatchRoundCarousel() {
  // Hooks
  const [, setPosition] = useState(0);
  const { roundIdx } = useRBDRound();
  const rounds = useRBDRounds();
  const players = useRBDPlayers();
  const currentMatch = useMatch();
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const roundsForCarousel = useMemo(() => {
    // Data transformations for the UI
    return rounds.map((round) => {
      const result = {
        score: round.round?.replace("_", "-") || "-",
        status: round.player?.isWinner ? "win" : "loss",
      };
      if (round.enemy) {
        result.url = players.find((player) => player.id === round.enemy)?.url;
      }
      if (typeof result.url === "undefined") {
        result.url = getRoundUrlByTarget(round.round);
      }
      return result;
    });
  }, [getRoundUrlByTarget, players, rounds]);
  const scrollPositions = useMemo(
    () => calcCarouselScrollPositions(rounds.length),
    [rounds.length]
  );
  const carouselRef = useCallback((i) => {
    if (i) ref.carousel = i;
  }, []);
  const handleSelectRound = useCallback(
    (idx) => () => {
      if (!currentMatch || currentMatch instanceof Error) return;
      setPostMatchRoundIndex(currentMatch.data.matchid, idx);
    },
    [currentMatch]
  );
  const handleSetPosition = useCallback(
    (index) => {
      if (!currentMatch || currentMatch instanceof Error) return;
      const position = scrollPositions[index];
      ref.carousel.scrollLeft = position.offset; // Adjust scroll position
      setPostMatchRoundIndex(currentMatch.data.matchid, position.index); // Adjust round position
    },
    [currentMatch, scrollPositions]
  );
  const handleSelectLeft = useCallback(() => {
    setPosition((prev) => {
      let result = prev - 1;
      if (result < 0) result = 0;
      handleSetPosition(result);
      return result;
    });
  }, [handleSetPosition]);
  const handleSelectRight = useCallback(() => {
    setPosition((prev) => {
      let result = prev + 1;
      if (result >= scrollPositions.length) result = scrollPositions.length - 1;
      handleSetPosition(result);
      return result;
    });
  }, [handleSetPosition, scrollPositions.length]);
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  // Render
  return (
    <Container>
      <ButtonContainer $left>
        <Button onClick={handleSelectLeft}>
          <ChevronLeftIcon />
        </Button>
      </ButtonContainer>
      <Carousel ref={carouselRef}>
        {roundsForCarousel.map((round, idx) => (
          <Round key={idx} onClick={handleSelectRound(idx)}>
            <RoundScore>{round.score}</RoundScore>
            <RoundAvatar $url={round.url} $status={round.status}>
              <Icon status={round.status} />
            </RoundAvatar>
          </Round>
        ))}
        <RoundHighlight
          style={{
            left: `${POSTMATCH_CAROUSEL.ROUND_WIDTH * roundIdx}px`,
          }}
        />
      </Carousel>
      <ButtonContainer $right>
        <Button onClick={handleSelectRight}>
          <ChevronRightIcon />
        </Button>
      </ButtonContainer>
    </Container>
  );
}

export default PostMatchRoundCarousel;

// Utilities
function Icon({ status }) {
  const Target = {
    win: CheckIcon,
    loss: CloseIcon,
  }[status];
  if (typeof Target === "undefined") return null;
  return new Array(2)
    .fill(Target)
    .map((Component, idx) => <Component key={idx} />);
}

// Styles
const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ButtonContainer = styled("div")`
  padding: ${({ $left, $right }) =>
    $left ? "0 14px 0 24px" : $right ? "0 24px 0 14px" : 0};
  height: 100%;
  display: flex;
  align-items: center;
`;
const Button = styled("button")`
  width: 40px;
  height: 40px;
  background-color: var(--shade5);
  border-radius: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: var(--shade1);
    font-size: 35px;
  }
`;
const Carousel = styled("div", forwardRef)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 3;
  overflow-x: hidden;
`;
const Round = styled("button")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: ${POSTMATCH_CAROUSEL.ROUND_WIDTH}px;
  height: 100%;
  flex-basis: 67px;
  padding: 14px 16px;
  background: transparent;
`;
const RoundScore = styled("div")`
  z-index: 1;
  color: var(--shade0);
  font-size: 12px;
  font-weight: bold;
  line-height: 12px;
`;
const RoundHighlight = styled("div")`
  position: absolute;
  left: 0;
  top: 0;
  width: ${POSTMATCH_CAROUSEL.ROUND_WIDTH}px;
  height: 100%;
  background: ${TftColor.rarity[1]};
  border-bottom: 3px solid var(--blue);
  box-sizing: border-box;
  transition: left 250ms;
`;
const RoundAvatar = styled("div")`
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  background-color: var(--shade7);
  background-size: cover;
  background-image: url(${({ $url }) => $url});
  border-width: 2px;
  border-style: solid;
  border-color: ${({ $status }) =>
    ({
      win: "var(--blue)",
      loss: "var(--red)",
    }[$status] || "transparent")};
  svg {
    position: absolute;
    left: calc(50% - 8px);
    bottom: -8px;
    stroke-width: 8px;
    stroke: #202b43;
    font-size: 16px;
    color: ${({ $status }) =>
      ({
        win: "var(--blue)",
        loss: "var(--red)",
      }[$status] || "var(--blue")};
  }
  svg:first-child {
    stroke: none;
    z-index: 1;
  }
  &:hover {
    filter: brightness(1.2);
  }
`;
