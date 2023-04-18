import React from "react";
import { keyframes, styled } from "goober";

import BRONZE_FLARE_PNG from "@/inline-assets/Bronze-Flare.png";
import BRONZE_RING_PNG from "@/inline-assets/Bronze-Ring.png";
import GOLD_FLARE_PNG from "@/inline-assets/Gold-Flare.png";
import GOLD_RING_PNG from "@/inline-assets/Gold-Ring.png";
import SILVER_FLARE_PNG from "@/inline-assets/Silver-Flare.png";
import SILVER_RING_PNG from "@/inline-assets/Silver-Ring.png";

const PlayerPostStatsIcon = ({ accolade, delay, tooltip }) => {
  const [showTooltip, toggleTooltip] = React.useState(false);
  const { fancyIcon, fancyIconPure, title, flare } = accolade;
  const FancyIcon = fancyIcon;
  const FancyIconPure = fancyIconPure;

  return (
    fancyIcon && (
      <Container>
        <div
          style={{ position: "relative" }}
          onMouseOver={() => {
            if (!showTooltip) {
              toggleTooltip(!showTooltip);
            }
          }}
          onMouseLeave={() => {
            if (showTooltip) {
              toggleTooltip(!showTooltip);
            }
          }}
        >
          <FancyIconContainer>
            <FancyIcon delay={delay} />
          </FancyIconContainer>
          <PureIconWrapper>
            <FancyPureIconContainer delay={delay}>
              <FancyIconPure />
            </FancyPureIconContainer>
          </PureIconWrapper>
          {flare === "Gold" && (
            <>
              <Flare src={GOLD_RING_PNG} delay={delay} />
              <Flare src={GOLD_FLARE_PNG} delay={delay} />
            </>
          )}
          {flare === "Silver" && (
            <>
              <Flare src={SILVER_RING_PNG} delay={delay} />
              <Flare src={SILVER_FLARE_PNG} delay={delay} />
            </>
          )}
          {flare === "Bronze" && (
            <>
              <Flare src={BRONZE_RING_PNG} delay={delay} />
              <Flare src={BRONZE_FLARE_PNG} delay={delay} />
            </>
          )}
        </div>
        <span className="type-form--sortcut">{title}</span>
        {tooltip && showTooltip && (
          <TooltipContainer>{tooltip}</TooltipContainer>
        )}
      </Container>
    )
  );
};

export default PlayerPostStatsIcon;

/**
 * Animations
 */
const IconZoomOut = keyframes`
    from {
      opacity: 0;
    }
  
    53% {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,-5px,0) scale(.3);
      opacity: 0;
    }
  
    80%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,0,0) scale(1);
      opacity: 1;
      visibility: visible;
    }
  `;

const IconBounceFadeOut = keyframes`
    from, 20% {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,0,0) scale(.85);
      opacity: 0;
    }
  
    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
      transform: translate3d(0, -10px, 0) scale(.85);
      opacity: 1;
    }
  
    53% {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,-5px,0) scale(.85);
      opacity: 1;
    }
  
    to {
      animation-timing-function: cubic-bezier(.47,.09,0,1);
      transform: translate3d(0,0,0) scale(2);
      opacity: 0;
      visibility: visible;
    }
  `;

const RingFlareZoomRotate = keyframes`
    from {
      opacity: 0;
      transform: rotate3d(0, 0, 1, 45deg);
    }
  
    53% {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: rotate3d(0, 0, 1, 45deg) scale(0.3);
      opacity: 0;
    }
  
    80%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: rotate3d(0, 0, 1, 0deg) scale(1);
      opacity: 1;
      visibility: visible;
    }
  `;

/**
 * Components
 */
const Container = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-4) 0;
  width: var(--sp-22);

  img {
    max-width: none;
  }

  span {
    text-align: center;
  }
`;

const FancyIconContainer = styled("div")`
  position: relative;
  display: flex;
  margin-bottom: var(--sp-2);
  animation: ${IconZoomOut} 2s ease-in-out ${(props) => props.delay}s forwards;
`;

const PureIconWrapper = styled("div")`
  position: absolute;
  width: 50px;
  height: 50px;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FancyPureIconContainer = styled("div")`
  position: relative;
  opacity: 0;
  animation: ${IconBounceFadeOut} 2s ease-in-out ${(props) => props.delay}s
    forwards;
`;

const Flare = styled("img")`
  position: absolute;
  mix-blend-mode: screen;
  left: -41px;
  top: -43px;
  animation: ${RingFlareZoomRotate} 2s ease-in-out ${(props) => props.delay}s
    forwards;
`;

const TooltipContainer = styled("div")`
  position: absolute;
  top: 75px;
  padding: 10px;
  background-color: black;
  max-width: 300px;
  font-size: 14px;
  white-space: pre;
  z-index: 10;

  &::before {
    content: " ";
    position: absolute;
    bottom: 100%; /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;
  }
`;
