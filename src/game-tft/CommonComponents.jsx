import React, { forwardRef } from "react";
import { styled } from "goober";

import { mobile, mobileSmall } from "clutch";

import {
  Body1,
  Body2FormActive,
  Caption,
} from "@/game-lol/CommonComponents.jsx";
import { borderColors, FLEX_SIZES, titleColor } from "@/game-tft/constants.mjs";
import ChevronRight from "@/inline-assets/chevron-right.svg";

export const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const Heading = styled("div")`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;
export const Title = styled("div")`
  font-size: 20px;
  line-height: 20px;
  color: var(--shade0);
`;
export const TitleScore = styled("span")`
  color: var(--shade1);
  margin-left: 1ch;
  margin-right: 1ch;

  span {
    font-size: var(--sp-3_5);
    color: var(--shade1);
  }

  &.positive {
    color: var(--yellow);
  }
`;
export const SubTitle = styled("span")`
  font-size: 14px;
  line-height: 14px;
  color: var(--shade3);
`;
export const Content = styled("div")`
  background: var(--shade7);
  border-radius: var(--sp-1);
  overflow: hidden;

  height: ${(props) => props.height || "unset"};
`;
export const CombinedItemImage = styled("img")`
  height: var(--sp-8);
  width: var(--sp-8);
  border-radius: 3px;
  border: 1px solid var(--shade5);
  &:hover {
    filter: brightness(1.4);
  }
`;
export const ItemContainer = styled("div")`
  position: relative;
  width: fit-content;

  svg {
    position: absolute;
    bottom: 0;
    right: calc(var(--sp-1_5) * -1);
    width: var(--sp-6);
    height: var(--sp-6);
    filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.5));
  }
`;

export const ChevronDownIcon = styled(ChevronRight)`
  transform: rotate(90deg);
  font-size: 40px;
  fill: var(--shade3);
`;

// Accordion
const PerformanceItemScoreCard = styled("details")`
  --card-radius: var(--br-lg);

  &[open] {
    --card-radius: 0;

    .chevron {
      transform: rotate(0.5turn);
    }
  }
`;
const PerformanceItemScoreHeading = styled("summary")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 2rem;
  background: hsla(var(--shade6-hsl) / 0.5);
  border-radius: var(--br-lg) var(--br-lg) var(--card-radius) var(--card-radius);

  .chevron {
    font-size: 2.5rem;
    color: var(--shade3);
    transition: transform var(--transition);
  }

  &:hover {
    .chevron {
      color: var(--shade1);
    }
  }
`;
const PerformanceItemScoreHeaderContent = styled("div")`
  display: flex;
  align-items: center;
  gap: 3rem;
  width: 100%;

  > *:nth-child(1) {
    flex: 1;
  }
  > *:nth-child(2) {
    flex: 2;
  }
  > *:nth-child(3) {
    flex: 1.5;
  }
`;
export const PerformanceItemScoreBody = styled("div")`
  padding: 2rem;
  background: linear-gradient(
    to top,
    var(--shade7),
    hsla(var(--shade6-hsl) / 0.25)
  );
  border-radius: 0 0 var(--br-lg) var(--br-lg);
`;
export const PerformanceItemScorePostMatchCard = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
`;
export function Accordion({ HeadingComponent, BodyComponent }) {
  return (
    <PerformanceItemScoreCard open>
      <PerformanceItemScoreHeading>
        <PerformanceItemScoreHeaderContent>
          <HeadingComponent />
        </PerformanceItemScoreHeaderContent>
        {BodyComponent && <ChevronDownIcon />}
      </PerformanceItemScoreHeading>
      {BodyComponent && (
        <PerformanceItemScoreBody>
          <BodyComponent />
        </PerformanceItemScoreBody>
      )}
    </PerformanceItemScoreCard>
  );
}

// Quick Box v1.0
export const Box = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-4);
`;
export const Quick = styled("div")`
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;
export const QuickData = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "var(--sp-2)",
  textAlign: "center",
});
export const QuickHeading = styled("div")({
  fontSize: "var(--sp-5)",
  fontWeight: "bold",
  color: "var(--shade0)",
  "& > span": {
    color: "var(--turq)", // Quick heading never gives any negative feedback for users
  },
});
export const QuickInfo = styled("div")({
  fontSize: "var(--sp-3)",
  fontWeight: "bold",
  color: "var(--shade1)",
});
export const QuickBox = styled("div")(({ $isPositive, $isNegative }) => {
  let color = "inherit";
  if ($isPositive) color = "var(--turq)";
  if ($isNegative) color = "var(--red)";
  return {
    backgroundColor: "var(--shade6)",
    color: "var(--shade0)",
    fontSize: "var(--sp-3)",
    padding: "var(--sp-7) var(--sp-8)",
    borderRadius: "var(--sp-1)",
    "& > *:last-child": {
      fontSize: "var(--sp-6)",
      fontWeight: "bold",
      color,
    },
  };
});

export const QuickComparison = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--sp-2)",
});

// Performance
export const PerformanceContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
  background: var(--shade8);
  padding: var(--sp-8);

  &:hover .expandIcon {
    fill: var(--shade1);
  }

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }
`;

// Common
export const HR = styled("div")({
  width: "100%",
  height: "1px",
  background: "var(--shade6)",
});

export const Label = styled("p")`
  color: var(--shade1);
  font-weight: bold;
`;

export const Type = styled("p")`
  & > span {
    color: var(--highlight);
  }
`;

export const StatsValue = styled("div")`
  font-size: var(--sp-3);
  line-height: var(--sp-3);
  font-weight: bold;
  color: var(--shade3);

  &.top-value {
    margin-bottom: var(--sp-2);
  }

  img,
  svg {
    width: var(--sp-5);
    height: var(--sp-5);
  }
`;

export const OverallScore = styled("h3")`
  font-size: 3rem;
  line-height: 1;
  font-weight: 700;

  &.positive {
    color: var(--yellow);
  }
`;

export const Star = styled("img")`
  height: var(--sp-3);
  width: var(--sp-3);
  margin: 0 -2px;
`;

export const EffectivenessHeading = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-5)",
  justifyContent: "space-between",
});

export const CircularButton = styled("button")({
  borderRadius: "100%",
  flexShrink: 0,
  padding: "var(--sp-1)",
  background: "transparent",
  svg: {
    color: "var(--shade3)",
    fontSize: "var(--sp-5)",
  },
});

export const OverallScoreHeading = styled("div")({
  textAlign: "center",
  display: "flex",
  flexFlow: "column",
  justifyContent: "center",
});

export const PostMatchContent = styled(
  "div",
  forwardRef
)({
  background: "var(--shade6)",
  borderRadius: "var(--sp-2)",
  boxSizing: "border-box",
  padding: "12px",
  overflow: "hidden",
});

// ProBuilds
export const UnitList = styled("div")`
  display: flex;
  align-items: center;
  flex: ${FLEX_SIZES.UNITS};
`;
export const TraitsText = styled(Caption)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: var(--shade3);
  margin-top: var(--sp-1);
  text-align: center;

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: var(--sp-15);
    margin: 0 var(--sp-1);
  }
`;
export const MatchContainer = styled("a")`
  display: block;
  position: relative;
  background: var(--shade8);
  cursor: pointer;
  transition: var(--transition);

  &.out-of-date {
    opacity: 0.5;
  }

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:hover {
    background: var(--shade9);
  }

  .bg-companion {
    position: absolute;
    width: 240px;
    height: 100%;
    background-image: url(${(props) => props.companion});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    pointer-events: none;
    transition: var(--transition);
    mask-image: linear-gradient(to left, transparent, rgba(0, 0, 0, 0.2));
  }
`;
export const MatchMainInfo = styled("div")`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--sp-3) var(--sp-5);

  .tablet-container {
    width: 100%;

    .tablet-content {
      &__main {
        display: flex;
        padding-bottom: var(--sp-5);
      }
    }
  }

  .mobile-container {
    width: 100%;

    .mobile-content {
      &__player-info {
        display: flex;
        justify-content: space-between;
        padding-bottom: var(--sp-5);
        & > div:last-child {
          flex: 1;
        }
      }

      &__match-stats {
        display: flex;
        padding-bottom: var(--sp-5);
        align-items: flex-start;

        & > div:nth-child(2) {
          flex: 20;
        }

        ${mobileSmall} {
          & > div:first-child {
            flex: 12;
          }
        }
      }

      &__units {
        & > div > div {
          flex-wrap: wrap;
          justify-content: flex-start;

          & > div {
            margin-bottom: var(--sp-1);
          }
        }
      }
    }
  }

  ${mobile} {
    padding-left: var(--sp-4);
    padding-right: var(--sp-4);
  }
`;
export const MatchBorder = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: ${({ placement }) =>
    placement < 5 ? borderColors[placement] : "transparent"};
`;
export const MetaDataContainer = styled("div")`
  text-align: end;
  flex: ${FLEX_SIZES.META};
`;
export const PlacementTitle = styled(Body2FormActive)`
  ${({ place }) => titleColor(place)};
`;
export const GameRecord = styled(Caption)`
  color: var(--shade3);
`;
export const PlayerInfoContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: ${FLEX_SIZES.PLAYER_PROFILE};
`;
export const ProBuildsProfileImage = styled("img")`
  height: var(--sp-9);
  width: var(--sp-9);
  margin-right: var(--sp-3);
  background: var(--shade9);
  border-radius: 50%;
`;
export const ProBuildsPlayerDetails = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;
export const MatchChampion = styled("div")`
  position: relative;
  margin-right: var(--sp-1_5);
  margin-top: var(--sp-3);

  & > * {
    pointer-events: none;
  }

  &:last-of-type {
    margin-right: 0;
  }

  .chosenIcon {
    position: absolute;
    z-index: 2;
    right: -2px;
    top: -5px;
    width: 0.825rem;
  }
`;
export const ProBuildsChampion = styled("div")`
  position: relative;
  margin-right: var(--sp-1_5);
  margin-top: var(--sp-3);

  &:last-of-type {
    margin-right: 0;
  }

  .chosenIcon {
    position: absolute;
    z-index: 2;
    right: -2px;
    top: -5px;
    width: 0.825rem;
  }
`;
export const ProBuildsChampionsList = styled("div")`
  display: flex;
  justify-content: flex-end;

  ${mobile} {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;
export const ProBuildsChampionEmpty = styled("div")`
  box-sizing: border-box;
  border-radius: var(--br-sm);
  border: var(--sp-px) solid var(--shade7);
  background: var(--shade8);
  box-shadow: inset 0 0 0 var(--sp-px) var(--shade9);
  ${({ size }) =>
    size &&
    `height: ${size}px;
    width: ${size}px;
  `};
`;
export const ProBuildsStar = styled("img")`
  height: var(--sp-3);
  width: var(--sp-3);
  margin: 0 -2px;
`;
export const ProBuildsToolTipName = styled("div")`
  display: flex;
  align-items: center;

  ${Body1} {
    margin-right: var(--sp-1);
  }

  ${Star} {
    height: var(--sp-4);
    width: var(--sp-4);
  }
`;
export const ProBuildsToolTipItem = styled("div")`
  display: flex;
  align-items: center;

  ${Caption} {
    color: var(--shade2);
  }

  img {
    width: var(--sp-6);
    height: auto;
    margin-right: var(--sp-2);
    margin-bottom: var(--sp-1);
    border-radius: var(--br);
  }
`;
