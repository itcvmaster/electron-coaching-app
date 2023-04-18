import React, { useState } from "react";
import { styled } from "goober";

import { Spring } from "@/feature-arena/CompGeneral.jsx";
import { ArrowIcons } from "@/feature-arena/m-assets.mjs";
import { RankColors } from "@/feature-arena/m-constants.mjs";
import GemIcon from "@/inline-assets/event-gem.svg";

export const RewardItem = ({ minRank, maxRank, details, small }) => (
  <ItemContainer $small={small} className={"rank" + minRank}>
    <LightText className={small ? "type-caption--bold" : "type-subtitle1"}>
      {minRank}
      {maxRank > minRank ? " ~ " + maxRank : ""}
    </LightText>
    <LightText className="type-caption right">{details?.type}</LightText>
  </ItemContainer>
);

export const LeaderBoardItem = ({ rank, icon, name, score }) => (
  <ItemContainer className={"rank" + rank}>
    <LightText className="type-subtitle2 rank">{rank}</LightText>
    <AvatarWrapper className={"rank" + rank}>
      <Avatar src={icon} />
    </AvatarWrapper>
    <LightText className="type-subtitle2 name">{name}</LightText>
    <Spring />
    <LightText className="type-caption--bold">{score}</LightText>
    <GemIcon />
  </ItemContainer>
);

export const ScoringItem = ({ title, blitzPointValue, small }) => (
  <ItemContainer $small={small}>
    <LightText className={small ? "type-caption--bold" : "type-subtitle1"}>
      {title}
    </LightText>
    <Spring />
    <LightText className="type-caption--bold">{blitzPointValue}</LightText>
    <GemIcon />
  </ItemContainer>
);

export const FaqItem = ({ title, content }) => {
  const [opened, setOpened] = useState(false);
  return (
    <FaqitemContainer onClick={() => setOpened(!opened)}>
      <ItemHeader>
        <FaqTitle className="type-subtitle2" $selected={opened}>
          {title}
        </FaqTitle>
        <ArrowButton>
          {opened ? <ArrowIcons.UP /> : <ArrowIcons.DOWN />}
        </ArrowButton>
      </ItemHeader>
      {opened ? <DarkText className="type-caption">{content}</DarkText> : null}
    </FaqitemContainer>
  );
};

const ItemContainer = styled("div")`
  display: flex;
  position: relative;
  height: ${({ $small }) => ($small ? "var(--sp-10)" : "var(--sp-13)")};
  background: rgba(39, 42, 48, 0.5);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  align-items: center;
  padding: ${({ $small }) => ($small ? "0 var(--sp-3)" : "0 var(--sp-6)")};
  overflow: hidden;
  margin-bottom: var(--sp-0_5);

  &.rank1,
  &.rank2,
  &.rank3 {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.15;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: var(--br-sm);
      height: 100%;
    }
  }

  &.rank1 {
    &::before {
      background: linear-gradient(
        270deg,
        transparent 0%,
        ${RankColors.FIRST} 100%
      );
    }
    &::after {
      background: ${RankColors.FIRST};
    }
  }
  &.rank2 {
    &::before {
      background: linear-gradient(
        270deg,
        transparent 0%,
        ${RankColors.SECOND} 100%
      );
    }
    &::after {
      background: ${RankColors.SECOND};
    }
  }
  &.rank3 {
    &::before {
      background: linear-gradient(
        270deg,
        transparent 0%,
        ${RankColors.THIRD} 100%
      );
    }
    &::after {
      background: ${RankColors.THIRD};
    }
  }
`;

const Avatar = styled("img")`
  width: var(--sp-7);
  height: var(--sp-7);
  border-radius: 100%;
  margin: var(--sp-0_5);
`;

const AvatarWrapper = styled("div")`
  width: var(--sp-9);
  height: var(--sp-9);
  border-radius: 100%;
  border: solid var(--sp-0_5) var(--shade5);

  &.rank1 {
    border-color: ${RankColors.FIRST};
  }
  &.rank2 {
    border-color: ${RankColors.SECOND};
  }
  &.rank3 {
    border-color: ${RankColors.THIRD};
  }
`;

const FaqitemContainer = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  padding: var(--sp-4) var(--sp-6);
  margin-bottom: var(--sp-0_5);
  cursor: pointer;
  border-radius: ${({ round }) =>
    round === "bottom"
      ? "0 0 var(--br) var(--br)"
      : round === "top"
      ? "var(--br) var(--br) 0 0"
      : "0"};
`;

const ItemHeader = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ArrowButton = styled("div")`
  width: var(--sp-6);
  height: var(--sp-6);
  background: var(--shade6);
  box-shadow: 0px 1px 4px rgba(7, 8, 12, 0.05),
    inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FaqTitle = styled("div")`
  color: ${({ $selected }) => ($selected ? "var(--shade0)" : "var(--shade1)")};
`;

const LightText = styled("div")`
  color: var(--shade0);
  &.rank {
    width: var(--sp-20);
  }
  &.name {
    margin-left: var(--sp-3);
  }
  &.right {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: right;
    margin-left: var(--sp-4);
  }
  white-space: nowrap;
`;

const DarkText = styled("div")`
  color: var(--shade1);
  margin-top: var(--sp-2);
`;
