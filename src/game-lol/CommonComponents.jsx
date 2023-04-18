import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { css, keyframes, styled } from "goober";

import { Button, mobile, tablet, tabletLarge } from "clutch";

import { BAR_ANIMATION_DURATION } from "@/game-lol/constants.mjs";

export const View = styled("div")`
  display: flex;
  flex-direction: ${(props) =>
    props.column === "true"
      ? "column"
      : props.row === "false"
      ? "column"
      : "row"};

  ${(props) =>
    props.center
      ? `
    justify-content: center;
    align-items: center;
    padding: 15px 10px;
  `
      : ``}
`;

export const CenterView = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--sp-4) var(--sp-2);
`;

export const Link = styled("a")`
  font-size: var(--sp-4);
  font-weight: 500;
  line-height: 1.25;
  text-decoration: none;
`;

export const LayoutColumns = styled("div")`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--sp-4);
  margin-bottom: var(--sp-15);

  .col-md-12 {
    grid-column: span 12;
  }
  .col-md-8 {
    grid-column: span 8;
  }
  .col-md-6 {
    grid-column: span 6;
  }
  .col-md-4 {
    grid-column: span 4;
  }
  ${mobile}, ${tablet} {
    .col-sm-12 {
      grid-column: span 12;
    }
    .col-sm-6 {
      grid-column: span 6;
    }
  }
`;

export const Column = styled("div")`
  ${({ colSpan }) => colSpan && `grid-column: span ${colSpan};`}
`;

export const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }

  .scroll::-webkit-scrollbar-thumb {
    background-color: var(--shade6);
    border: 4px solid var(--shade7);
  }
`;

export const CardHeader = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 -1px var(--shade3-15);
  background: var(--shade7)
    linear-gradient(to top, var(--shade5-15) 0%, transparent 100%);
  border-radius: var(--br);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0 var(--sp-6);
  min-height: var(--sp-14);

  > * {
    position: relative;
  }

  .header-contents {
    position: relative;
  }

  @media screen and (max-width: 1024px) {
    padding: 0 var(--sp-4);
  }
`;

export const CardInner = styled("div")`
  padding: var(--sp-6);

  ${tabletLarge} {
    padding: var(--sp-4);
    overflow-x: ${({ champion }) => (champion ? "unset" : "hidden")};
  }

  ${mobile} {
    padding: var(--sp-2);
  }
`;

// Headings
export const H5 = styled((props) => (
  <h5 {...props} className={`type-h5 ${props.className}`} />
))``;
export const H6 = styled((props) => (
  <h6 {...props} className={`type-h6 ${props.className}`} />
))``;

// Article Headline
export const ArticleHeadline = styled((props) => (
  <p {...props} className={`type-article-headline ${props.className}`} />
))``;

// Subtitle 1 & 2
export const Subtitle1 = styled((props) => (
  <p {...props} className={`type-subtitle1 ${props.className}`} />
))``;
export const Subtitle2 = styled((props) => (
  <p {...props} className={`type-subtitle2 ${props.className}`} />
))``;

// Body1
export const Body1 = styled((props) => (
  <p {...props} className={`type-body1 ${props.className}`} />
))``;
export const Body1Form = styled((props) => (
  <p {...props} className={`type-body1-form ${props.className}`} />
))``;
export const Body1FormActive = styled((props) => (
  <p {...props} className={`type-body1-form--active ${props.className}`} />
))``;

// Body2
export const Body2 = styled((props) => (
  <p {...props} className={`type-body2 ${props.className}`} />
))``;
export const Body2Form = styled((props) => (
  <p {...props} className={`type-body2-form ${props.className}`} />
))``;
export const Body2FormActive = styled((props) => (
  <p {...props} className={`type-body2-form--active ${props.className}`} />
))``;

// Caption
export const Caption = styled((props) => (
  <p {...props} className={`type-caption ${props.className}`} />
))``;
export const CaptionBold = styled((props) => (
  <p {...props} className={`type-caption--bold ${props.className}`} />
))``;

// Overline
export const Overline = styled((props) => (
  <span {...props} className={`type-overline ${props.className}`} />
))``;

// Mini
export const Mini = styled((props) => (
  <span {...props} className={`type-mini ${props.className}`} />
))``;

export const VerticalLine = styled("div")`
  margin-left: var(--sp-6);
  margin-right: var(--sp-6);
  align-self: stretch;
  min-width: var(--sp-px);
  background: var(--shade5);
`;

export const EmptyContentContainer = styled("div")`
  font-size: var(--sp-4);
  text-align: center;
  line-height: var(--sp-6);
  color: var(--shade3);
`;

const TabContainer = styled("div")`
  display: flex;
  flex-direction: row;
  &::-webkit-scrollbar-thumb {
    background-color: var(--shade6);
    border: 4px solid var(--shade7);
  }

  .tab {
    font-size: var(--sp-3_5);
    padding: 0 var(--sp-3);
    height: var(--sp-13);

    .type-form--button {
      font-size: var(--sp-4);
      letter-spacing: -0.009em;
      line-height: var(--sp-4);
      font-weight: 700;
    }
  }
  .reveal-underline-from-center::before {
    content: "";
    position: absolute;
    z-index: 0;
    left: 51%;
    right: 51%;
    bottom: 0px;
    background: var(--primary);
    height: 3px;
    transition-property: left, right;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }
  .reveal-underline-from-center-active::before {
    left: 0px;
    right: 0px;
  }
`;

const TagTooltip = styled("div")`
  padding: var(--sp-2);
  max-width: 240px;

  ${Overline} {
    color: var(--shade4);
    margin-bottom: var(--sp-3);
  }

  ${Caption} {
    color: var(--shade1);
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    span {
      color: var(--shade0);
      margin-left: var(--sp-6);
    }
  }

  .pts-total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: var(--sp-px) solid var(--shade8);
  }

  > :last-child {
    margin-bottom: 0;
  }
`;

export const TabView = ({
  renderExtra,
  renderTabView,
  data,
  role,
  defaultPosition,
  ...restProps
}) => {
  const [position, setPosition] = useState(defaultPosition || 0);

  return (
    <div {...restProps}>
      <div className="flex between align-center">
        <TabContainer data-role={role ? role : "tab-parent"}>
          {(data || []).map((item, i) => (
            <Button
              key={`tab-${item.replace(" ", "-").toLowerCase()}`}
              onClick={() => setPosition(i)}
              text={item}
              className={`tab reveal-underline-from-center ${
                i === position ? "reveal-underline-from-center-active" : ""
              }`}
              bgColor="transparent"
              bgColorHover="transparent"
              textColor={i === position ? "var(--shade0)" : "var(--shade1)"}
              noHighlight
            />
          ))}
        </TabContainer>
        {renderExtra && renderExtra()}
      </div>
      {renderTabView(data[position], position)}
    </div>
  );
};

export const TagTooltipDescription = (props) => {
  const { points } = props;
  const { t } = useTranslation();

  if (!points) return null;

  return (
    <TagTooltip>
      <Overline>
        {t("lol:matchScore.scoreBreakdownTitle", "Score Breakdown")}:
      </Overline>
      <Caption>
        {t("common:stats.kda", "KDA")}:{" "}
        <span className="type-caption--bold">
          {(points.kda * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:dmgDealt", "Damage Dealt")}:{" "}
        <span className="type-caption--bold">
          {(points.dmg * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:specificMatchup.killParticipation", "Kill Participation")}:{" "}
        <span className="type-caption--bold">
          {(points.kp * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:stats.vision", "Vision")}:{" "}
        <span className="type-caption--bold">
          {(points.vision * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:stats.towerDmg", "Tower Damage")}:{" "}
        <span className="type-caption--bold">
          {(points.towerDmg * 10).toFixed(1)}
        </span>
      </Caption>
      {props.isSupport && (
        <>
          <Caption>
            {t("lol:stats.healing", "Healing")}:{" "}
            <span className="type-caption--bold">
              {(points.healing * 10).toFixed(1)}
            </span>
          </Caption>
          <Caption>
            {t("lol:stats.tanking", "Tanking")}:{" "}
            <span className="type-caption--bold">
              {(points.tank * 10).toFixed(1)}
            </span>
          </Caption>
        </>
      )}
      {props.isWinner && (
        <Caption>
          {t("lol:results.victory", "Victory")}:{" "}
          <span className="type-caption--bold">
            {(points.victory * 10).toFixed(1)}
          </span>
        </Caption>
      )}
      <Caption className="pts-total">
        {t("lol:csStats.total", "Total")}:{" "}
        <span className="type-caption--bold">
          {(points.total * 10).toFixed(1)}
        </span>
      </Caption>
    </TagTooltip>
  );
};

export const RankTrend = styled("div")`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 80px;

  .progress-bar {
    width: 122px;
    z-index: 1;
    .CircularProgressbar-path {
      transition: stroke-dashoffset ${(props) => props.duration}s linear
        ${(props) => props.delay}s !important;
    }
  }

  svg.rank-icon {
    width: 40px;
  }

  .rank-icon {
    display: flex;
    position: absolute;
    height: inherit;
    font-size: var(--sp-13);
    font-weight: 700;
    ${(props) => (props.color ? `color: ${props.color};` : "")};
  }
`;

export const ScoreTrend = styled("div")`
  display: flex;
  margin-top: calc(var(--sp-5) * -1);
  align-items: flex-end;
  font-weight: 700;

  .value {
    font-size: var(--sp-6);
    line-height: var(--sp-12);
    color: white;
    margin-right: var(--sp-2_5);
  }

  .label {
    line-height: var(--sp-11);
    color: var(--shade2);

    .sub-content {
      font-size: var(--sp-3_5);
      line-height: var(--sp-5);
      text-align: center;
    }
  }
`;

export const Divider = styled("div")`
  background: var(--shade6);
  height: var(--sp-px);
  width: 100%;
  margin-bottom: var(--sp-6);
  margin-top: var(--sp-6);
`;

export const VerticalDivider = styled("div")`
  width: 1px;
  background: var(--shade3-15);
`;

export const RankDistributionListClassName = css`
  display: flex;
  flex-direction: row;
  margin-bottom: var(--sp-3);
`;

const RankDistCont = (props, ref) => (
  <div className={RankDistributionListClassName} ref={ref} {...props} />
);

export const RankDistributionListContainer = React.forwardRef(RankDistCont);

export const StatsIconWrapper = styled("div")`
  display: flex;
  margin-top: 5px;
  min-height: var(--sp-5);
  align-items: center;
`;

export const BubbleContainer = styled("div")`
  width: var(--sp-3);
  height: 9px;
  position: absolute;
`;

export const RankDistributionList = styled("div", React.forwardRef)`
  position: relative;
  height: 128px;
  display: flex;
  flex-direction: row;
  border-radius: var(--br);
  transform: translateX(0px);
  transition: 0.5s;
  width: 100%;
  justify-content: space-around;
  margin-top: var(--sp-6);

  &.hide {
    transform: translateX(265px);
  }
  & > div:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Animations
 */
const IncreaseHeight = (val) => keyframes`
  from {
    height: 0;
  }
  to {
    height: ${val}%;
  }
`;

export const ProgressBar = styled("div")`
  position: relative;
  height: calc(100% - var(--sp-6));
  width: 6px;
  background: var(--shade9);
  border-radius: var(--br-sm);
  margin-right: auto;
  margin-left: auto;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 6px;
    background: var(--bg-progress-bar);
    border-radius: var(--br-sm);
    animation: ${({ delay, percent }) =>
      `${IncreaseHeight(
        percent
      )} ${BAR_ANIMATION_DURATION}s ease-in-out ${delay}s forwards;`};
  }
`;

export const StatsValue = styled("div")`
  font-size: var(--sp-2_5);
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

export const RankDistributionListItem = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(var(--sp-1) * 32);
  margin-bottom: var(--sp-1);
  width: var(--sp-7);
  ${StatsValue}, svg {
    color: var(--stat-color);
  }
  .top-value {
    opacity: var(--top-value-opacity);
  }
  ${ProgressBar} {
    &::after {
      background-color: var(--bg-progress-bar);
    }
  }
  &:hover {
    ${ProgressBar} {
      &::after {
        &[data-you="true"] {
          background-color: var(--bg-progress-bar-hovers);
        }
      }
    }
  }
`;

export const PlayerStatWrapper = styled("div")`
  --bg-gold: radial-gradient(
      175% 66% at 50% 0%,
      rgba(214, 156, 60, 0.15) 0%,
      rgba(214, 156, 60, 0) 100%
    ),
    #181b21;
  --bg-green: radial-gradient(
      140% 53% at 40% 0%,
      rgba(48, 217, 212, 0.15) 0%,
      rgba(48, 217, 212, 0) 100%
    ),
    #181b21;
  --bg-red: radial-gradient(
      140% 53% at 40% 0%,
      rgba(255, 88, 89, 0.15) 0%,
      rgba(255, 88, 89, 0) 100%
    ),
    #181b21;

  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;

  background: ${({ tilebgcolor }) => tilebgcolor};

  border-radius: var(--br-lg);
  padding: var(--sp-4) var(--sp-5) var(--sp-2) var(--sp-5);
`;
