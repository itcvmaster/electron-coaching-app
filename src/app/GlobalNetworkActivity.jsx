import React, { useEffect, useState } from "react";
import { keyframes, styled } from "goober";

import { EVENT_FETCHING_DATA, events } from "@/util/hook-fetch.mjs";
import { useIsLoaded } from "@/util/router-hooks.mjs";

const anim = keyframes`
  0% {
    transform-origin: top left;
    transform: scaleX(0);
  }
  50% {
    transform-origin: top left;
    transform: scaleX(1);
  }
  50.01% {
    transform-origin: top right;
  }
  100% {
    transform-origin: top right;
    transform: scaleX(0);
  }
`;

const ActivityIndicator = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 999;
  background: var(--cta-gradient);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  animation: ${({ $animation }) => $animation || "none"};
  transition: opacity 0.3s ease;
`;

const GlobalNetworkActivity = () => {
  const isLoaded = useIsLoaded();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      events.off(EVENT_FETCHING_DATA);
      setIsFetching(false);
      return;
    }
    events.once(EVENT_FETCHING_DATA, () => {
      setIsFetching(true);
    });
  }, [isLoaded, setIsFetching]);

  return (
    <ActivityIndicator
      $show={isFetching}
      $animation={isFetching ? `${anim} 1.5s ease infinite` : null}
    />
  );
};

export default GlobalNetworkActivity;
