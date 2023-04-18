import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  CarouselContent,
  Container,
  Dash,
  DashContainer,
  Gradient,
  InnerDash,
  Pagination,
} from "@/feature-arena/CompCarousel.style.jsx";

const CompCarousel = ({
  displayDuration = 4500,
  swipeDuration = 750,
  children,
}) => {
  const [dashIndex, setDashIndex] = useState(-1);
  const [cardIndex, setCardIndex] = useState(0);
  const dashIndexRef = useRef(0);
  const cardIndexRef = useRef(1);

  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const length = children.length;
  const timerRef = useRef({});

  const startPlay = useCallback(() => {
    clearTimeout(timerRef.current.carousel);
    dashIndexRef.current = cardIndexRef.current;

    (function loop() {
      const duration =
        dashIndexRef.current === cardIndexRef.current
          ? displayDuration
          : swipeDuration;

      timerRef.current.carousel = setTimeout(() => {
        setTransitionEnabled(true);
        if (dashIndexRef.current === cardIndexRef.current) {
          setCardIndex(cardIndexRef.current);
          cardIndexRef.current++;
        } else {
          if (cardIndexRef.current > length) {
            requestAnimationFrame(() => forceMove(0, false));
          }
          setDashIndex(dashIndexRef.current);
          dashIndexRef.current = cardIndexRef.current;
        }
        loop();
      }, duration);
    })();
  }, [length, displayDuration, swipeDuration]);

  const forceMove = (index, transition) => {
    setTransitionEnabled(transition);
    cardIndexRef.current = index + 1;
    dashIndexRef.current = index + 1;
    setCardIndex(index);
    setDashIndex(index);
  };

  const snapTo = (index) => {
    forceMove(index, true);
    startPlay();
  };

  const onNext = () => {
    snapTo(cardIndex + 1);
    if (cardIndex >= length - 1) {
      timerRef.current.next = setTimeout(
        () => forceMove(0, false),
        swipeDuration
      );
    }
  };

  useEffect(() => {
    setDashIndex(-1);
    requestAnimationFrame(() => {
      forceMove(0, false);
      startPlay();
    });
    const { current: timer } = timerRef;
    return () => {
      clearTimeout(timer.carousel);
      clearTimeout(timer.next);
    };
  }, [startPlay, children]);

  return (
    <Container>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-content-wrapper">
            <CarouselContent
              $enabled={transitionEnabled}
              duration={swipeDuration}
              index={cardIndex}
            >
              {children}
              {children[0]}
            </CarouselContent>
          </div>
          <Gradient onClick={onNext} />
        </div>
      </div>
      <Pagination>
        {children.map((_v, index) => (
          <DashContainer key={index} onClick={() => snapTo(index)}>
            <Dash $passed={index < dashIndex}>
              <InnerDash
                className={index === dashIndex ? "play" : ""}
                duration={displayDuration}
              />
            </Dash>
          </DashContainer>
        ))}
      </Pagination>
    </Container>
  );
};

export default CompCarousel;
