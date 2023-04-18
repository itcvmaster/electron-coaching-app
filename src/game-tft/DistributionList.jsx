import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";

import {
  BubbleContainer,
  ProgressBar,
  RankDistributionList,
  RankDistributionListClassName,
  RankDistributionListItem,
  StatsIconWrapper,
  StatsValue,
} from "@/game-lol/CommonComponents.jsx";
import {
  BAR_ANIMATION_DURATION,
  BAR_SHOW_INTERVAL,
} from "@/game-lol/constants.mjs";
import getKeyframeIncreaseTop from "@/game-lol/get-keyframe-increase-top.mjs";
import getYouValue from "@/game-lol/get-you-value.mjs";
import HextechBubble from "@/inline-assets/hextech-bubble.svg";

export default function DistributionList({
  allScores = [],
  maxRankValue = 0,
  $isPositive = false,
  yourRank = "",
  delay = 0,
}) {
  // Hooks
  const ref = useRef(null);
  const { t } = useTranslation();
  const [isHover, setHover] = useState(false);

  // Functions
  const toggleDistributionHover = (bool) => () => {
    setHover(bool);
  };

  const getElementMatch = () => {
    // This component must have RankDistributionListContainer as its direct parent
    // It has to be the exact component otherwise we won't trigger hover effects
    const result =
      ref.current?.parentNode?.className === RankDistributionListClassName;
    if (!result) {
      for (const item of ref.current?.parentNode?.classList || []) {
        if (item === RankDistributionListClassName) return true;
      }
    }
    return result;
  };

  // Effects
  useEffect(() => {
    const staticRef = ref.current;
    if (staticRef?.parentNode && getElementMatch()) {
      [
        ["mouseenter", true],
        ["mouseleave", false],
      ].forEach(([event, bool]) => {
        staticRef.parentNode.addEventListener(
          event,
          toggleDistributionHover(bool)
        );
      });
    }
    return () => {
      if (staticRef?.parentNode && getElementMatch()) {
        [
          ["mouseenter", true],
          ["mouseleave", false],
        ].forEach(([event, bool]) => {
          staticRef.parentNode.removeEventListener(
            event,
            toggleDistributionHover(bool)
          );
        });
      }
    };
  }, []);

  return (
    <RankDistributionList ref={ref}>
      {Array.isArray(allScores) && allScores.length
        ? allScores.map((item, index) => {
            if (typeof item?.key !== "string") return null;
            const { key, value, text, img, fillColor } = item;
            const isYou = key === "you";
            const isYourRank = key === yourRank;
            const Icon = img;

            const statColor = isYou
              ? $isPositive
                ? "var(--turq)"
                : "var(--red)"
              : fillColor;

            const bgProgressBar = isYou
              ? $isPositive
                ? "var(--turq)"
                : "var(--red)"
              : isYourRank
              ? fillColor
              : isHover
              ? fillColor
              : "var(--shade5)";
            return (
              <RankDistributionListItem
                key={"-list-" + key}
                id={"-list-" + key}
                style={{
                  "--stat-color": statColor,
                  "--top-value-opacity":
                    !isYou && !isYourRank && !isHover ? 0 : 1,
                  "--bg-progress-bar": bgProgressBar,
                  "--bg-progress-bar-hover": fillColor,
                }}
              >
                <StatsValue className={"top-value"}>{text}</StatsValue>
                <ProgressBar
                  key={"-bar-" + key}
                  id={"-bar-" + key}
                  percent={(value / maxRankValue) * 100}
                  delay={delay + index * BAR_SHOW_INTERVAL}
                  data-you={isYou}
                  data-positive={$isPositive}
                  style={{
                    "--bar-height": (value / maxRankValue) * 100,
                  }}
                  className={css`
                    &::after {
                      max-height: ${`${(value / maxRankValue) * 100}%`};
                    }
                  `}
                />
                {isYou ? (
                  <BubbleContainer
                    style={{
                      animation:
                        getKeyframeIncreaseTop(
                          getYouValue((value / maxRankValue) * 100)
                        ) +
                        " " +
                        BAR_ANIMATION_DURATION +
                        "s ease-in-out 1.3s forwards",
                    }}
                  >
                    <HextechBubble />
                  </BubbleContainer>
                ) : null}
                <StatsIconWrapper>
                  <StatsValue>
                    {isYou ? (
                      t("common:you", "You")
                    ) : typeof img === "function" ? (
                      <Icon />
                    ) : img ? (
                      img
                    ) : (
                      "a"
                    )}
                  </StatsValue>
                </StatsIconWrapper>
              </RankDistributionListItem>
            );
          })
        : null}
    </RankDistributionList>
  );
}
