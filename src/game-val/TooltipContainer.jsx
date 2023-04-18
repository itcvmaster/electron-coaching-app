import React from "react";
import { css } from "goober";

const TooltipContainer = ({
  children,
  transformX = "-50",
  transformY = "-115",
}) => {
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
    transform: translate(${transformX}%, ${transformY}%);
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

  return <div className={TooltipContainerWithArrow}>{children}</div>;
};
export default TooltipContainer;
