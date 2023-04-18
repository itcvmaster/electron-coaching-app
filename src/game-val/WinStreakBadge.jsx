import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css, keyframes, styled } from "goober";

const StreakSvg = () => {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 4.6875C5.23349 3.87948 5 0.5 5 0.5C7.95208 1.73493 9.92647 5.69489 9 8.625C7.88191 12.132 2.85094 12.5362 1.1875 9.25C-0.633862 5.66182 2.875 2.6875 2.875 2.6875C2.87834 3.36288 3.02334 4.0504 3.25 4.6875ZM3.9375 10.1875C4.54647 10.6707 5.41028 10.6707 6.01925 10.1875C6.62822 9.70428 7.0551 8.9422 7.0625 8.125C7.0625 6.18409 5 4.5625 5 4.5625C5 4.5625 2.875 6.18201 2.875 8.125C2.88341 8.94195 3.26905 9.7075 3.9375 10.1875Z"
        fill="#FF9417"
      />
    </svg>
  );
};
const LooseSvg = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 5.99999C0.5 5.6456 0.787284 5.35832 1.14167 5.35832L2.66752 5.35832L1.83794 4.52874C1.58735 4.27816 1.58735 3.87188 1.83794 3.62129C2.08853 3.3707 2.49481 3.3707 2.74539 3.62129L4.48242 5.35832L5.35851 5.35832L5.35851 4.48289L3.62101 2.74539C3.37043 2.49481 3.37043 2.08853 3.62101 1.83794C3.8716 1.58735 4.27788 1.58735 4.52847 1.83794L5.35851 2.66798L5.35851 1.14167C5.35851 0.787284 5.64579 0.5 6.00018 0.5C6.35456 0.5 6.64184 0.787284 6.64184 1.14167L6.64184 2.66711L7.47101 1.83794C7.7216 1.58735 8.12788 1.58735 8.37847 1.83794C8.62905 2.08853 8.62905 2.49481 8.37847 2.74539L6.64184 4.48202L6.64184 5.35832L7.51757 5.35832L9.25461 3.62129C9.50519 3.3707 9.91147 3.3707 10.1621 3.62129C10.4126 3.87188 10.4126 4.27816 10.1621 4.52874L9.33248 5.35832L10.8583 5.35832C11.2127 5.35832 11.5 5.6456 11.5 5.99999C11.5 6.35437 11.2127 6.64165 10.8583 6.64165L9.33242 6.64165L10.1621 7.47129C10.4126 7.72188 10.4126 8.12816 10.1621 8.37874C9.91147 8.62933 9.50519 8.62933 9.25461 8.37874L7.51752 6.64165L6.64184 6.64165L6.64184 7.51798L8.37847 9.25461C8.62905 9.50519 8.62905 9.91147 8.37847 10.1621C8.12788 10.4126 7.7216 10.4126 7.47101 10.1621L6.64184 9.33289L6.64184 10.8583C6.64184 11.2127 6.35456 11.5 6.00018 11.5C5.64579 11.5 5.35851 11.2127 5.35851 10.8583L5.35851 9.33202L4.52847 10.1621C4.27788 10.4126 3.8716 10.4126 3.62101 10.1621C3.37043 9.91147 3.37043 9.50519 3.62101 9.25461L5.35851 7.51711L5.35851 6.64165L4.48248 6.64165L2.74539 8.37874C2.49481 8.62933 2.08853 8.62933 1.83794 8.37874C1.58735 8.12816 1.58735 7.72188 1.83794 7.47129L2.66757 6.64165L1.14167 6.64165C0.787284 6.64165 0.5 6.35437 0.5 5.99999Z"
        fill="#49B4FF"
      />
    </svg>
  );
};
const WIN_COLOR = "#FF9417";
const DEFEAT_COLOR = "#49B4FF";

const Badge = ({
  streakType,
  streakCount,
  hideBackground,
  className,
  showTooltip,
  onMouseOut,
  onMouseOver,
}) => {
  const { t } = useTranslation();
  return (
    <BadgeContainer
      style={{
        background:
          !hideBackground &&
          (streakType === "win"
            ? "rgba(255, 148, 23, 0.1)"
            : "rgba(73, 180, 255, 0.15)"),
      }}
      className={className}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {streakType === "win" ? <StreakSvg /> : <LooseSvg />}
      <CaptionBold
        style={{ color: streakType === "win" ? "#ff9417" : "#49B4FF" }}
      >
        {streakCount}
      </CaptionBold>
      <div></div>
      <span className="bub-1"></span>
      <span className="bub-2"></span>
      <span className="bub-3"></span>
      <span className="bub-4"></span>
      <span className="bub-5"></span>
      <span className="bub-6"></span>
      <span className="bub-7"></span>
      <span className="bub-8"></span>
      <span className="bub-9"></span>
      <span className="bub-10"></span>
      {showTooltip && (
        <div className={TooltipContainerWithArrow}>
          <StreakSvg />
          &nbsp;
          <p style={{ textAlign: "center", color: WIN_COLOR }}>{streakCount}</p>
          &nbsp;
          <p>{t("val:streak", "Win Streak")}</p>
        </div>
      )}
    </BadgeContainer>
  );
};

const ValBadge = ({ streakCount, streakType }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <Badge
        streakType={streakType}
        streakCount={streakCount}
        showTooltip={showTooltip}
        onMouseOver={() => {
          setShowTooltip(true);
        }}
        onMouseOut={() => {
          setShowTooltip(false);
        }}
      />
    </>
  );
};

const ValWinStreakBadge = memo(ValBadge);

export { ValWinStreakBadge };

/**
 * Animations
 */
const TRBorder = (val) => keyframes`
 0% {
   width: 0;
   height: 0;
   border-top-color: ${val};
   border-right-color: transparent;
   border-bottom-color: transparent;
   border-left-color: transparent;
 }

 50% {
   width: 100%;
   height: 0;
   border-top-color: ${val};
   border-right-color: ${val};
   border-bottom-color: transparent;
   border-left-color: transparent;
 }

 100% {
   width: 100%;
   height: 100%;
   border-top-color: ${val};
   border-right-color: ${val};
   border-bottom-color: transparent;
   border-left-color: transparent;
 }
`;

const LBBorder = (val) => keyframes`
 0% {
   width: 0;
   height: 0;
   border-top-color: transparent;
   border-right-color: transparent;
   border-bottom-color: transparent;
   border-left-color: ${val};
 }

 50% {
   width: 0;
   height: 100%;
   border-top-color: transparent;
   border-right-color: transparent;
   border-bottom-color: ${val};
   border-left-color: ${val};
 }

 100% {
   width: 100%;
   height: 100%;
   border-top-color: transparent;
   border-right-color: transparent;
   border-bottom-color: ${val};
   border-left-color: ${val};
 }
`;

const FadeIn = keyframes`
 0% {
   opacity: 0;
 }

 60% {
   opacity: 0;
 }

 100% {
   opacity: 1;
 }
`;

const FlareUp = keyframes`
 0% {
   transform: translateY(0px) scale(1);
   opacity: 1
   filter: blur(0px)
 }

 75% {
   opacity: 1;
 }

 100% {
   transform: translateY(-30px) scale(1.4);
   filter: blur(4px);
   margin-left: 0px;
   opacity: 0;
 }
`;

const FlareDown = keyframes`
 0% {
   transform: translateY(32px) scale(1);
   opacity: 1
   filter: blur(0px)
 }

 75% {
   opacity: 1;
 }

 100% {
   transform: translateY(60px) scale(1.4);
   filter: blur(4px);
   margin-left: 0px;
   opacity: 0;
 }
`;

/**
 * Styles
 */
const BadgeContainer = styled("div")`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  mix-blend-mode: normal;
  backdrop-filter: blur(4px);
  border-radius: var(--br-sm);
  padding: var(--sp-0_5) var(--sp-1_5);
  margin-left: var(--sp-1);
  cursor: pointer;

  ::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 0;
    height: 0;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 4px;
  }

  ::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 0;
    height: 0;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 4px;
  }

  &.win {
    &::before {
      width: 100%;
      height: 100%;
      border-color: ${WIN_COLOR};
      animation: ${TRBorder(WIN_COLOR)} 1s linear forwards;
    }
    &::after {
      width: 100%;
      height: 100%;
      border-color: ${WIN_COLOR};
      animation: ${LBBorder(WIN_COLOR)} 1s linear forwards;
    }
    span {
      background: ${WIN_COLOR};
      animation: ${FlareUp} 1s ease-in-out forwards;
      animation-iteration-count: 3;
    }
    div {
      background: ${WIN_COLOR};
    }
  }
  &.loss {
    &::before {
      width: 100%;
      height: 100%;
      border-color: ${DEFEAT_COLOR};
      animation: ${TRBorder(DEFEAT_COLOR)} 1s linear forwards;
    }
    &::after {
      width: 100%;
      height: 100%;
      border-color: ${DEFEAT_COLOR};
      animation: ${LBBorder(DEFEAT_COLOR)} 1s linear forwards;
    }
    span {
      background: ${DEFEAT_COLOR};
      animation: ${FlareDown} 1s ease-in-out forwards;
      animation-iteration-count: 3;
    }
    div {
      background: ${DEFEAT_COLOR};
    }
  }

  span {
    position: absolute;
    display: block;
    border: 5px;
    border-radius: 50%;
  }

  div {
    mix-blend-mode: screen;
    filter: blur(20px);
    width: 60px;
    height: var(--sp-5);
    position: absolute;
    animation: ${FadeIn} 1s ease-in-out forwards;
  }

  span.bub-1 {
    width: 3px;
    height: 3px;
    left: 5px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0s;
    animation-duration: 1s;
  }
  span.bub-2 {
    width: 3px;
    height: 3px;
    left: 9px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.5s;
    animation-duration: 1s;
  }
  span.bub-3 {
    width: 3px;
    height: 3px;
    left: 15px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 1s;
    animation-duration: 1s;
  }
  span.bub-4 {
    width: 3px;
    height: 3px;
    left: var(--sp-5);
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.3s;
    animation-duration: 1s;
  }

  span.bub-5 {
    width: 3px;
    height: 3px;
    left: var(--sp-6);
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.8s;
    animation-duration: 1s;
  }
  span.bub-6 {
    width: 3px;
    height: 3px;
    left: var(--sp-7_5);
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.5s;
    animation-duration: 1s;
  }
  span.bub-7 {
    width: 3px;
    height: 3px;
    left: var(--sp-9);
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.7s;
    animation-duration: 1s;
  }
  span.bub-8 {
    width: 3px;
    height: 3px;
    left: 40px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.2s;
    animation-duration: 1s;
  }
  span.bub-9 {
    width: 3px;
    height: 3px;
    left: 45px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.9s;
    animation-duration: 1s;
  }
  span.bub-10 {
    width: 3px;
    height: 3px;
    left: 50px;
    top: -3px;
    opacity: 0;

    filter: blur(1px);
    animation-delay: 0.3s;
    animation-duration: 1s;
  }
`;

const CaptionBold = styled("p")`
  font-weight: bold;
  line-height: var(--sp-4);
  margin-left: 3px;
  font-size: var(--sp-3);
  color: grey;
`;

const TooltipContainerWithArrow = css`
  display: flex;
  align-items: baseline;
  font-family: "Inter", Arial, Helvetica, sans-serif;
  position: absolute !important;
  z-index: 999999;
  color: #fff;
  background-color: var(--shade10);
  padding: var(--sp-2_5);
  border-radius: var(--br);
  font-size: var(--sp-3_5);
  font-family: "Inter", Arial, Helvetica, sans-serif;
  pointer-events: none;
  transform: translate(-45%, -85%);
  white-space: nowrap;
  filter: none !important;
  width: auto !important;
  height: auto !important;
  animation: none !important;

  &::after {
    content: " " !important;
    border: 8px solid var(--shade10) !important;
    position: absolute !important;
    top: 100% !important; /* At the bottom of the tooltip */
    left: 50% !important;
    border-left-width: 8px !important;
    border-right-width: 8px !important;
    border-bottom-width: 0px !important;
    /* transform: translate(50%, 0%)!important; */
    margin-left: -6px !important;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
  }
`;
