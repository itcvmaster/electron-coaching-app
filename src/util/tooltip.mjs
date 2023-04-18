import { css } from "goober";

import { TOOLTIP_MAX_WIDTH } from "@/app/constants.mjs";
import globals from "@/util/global-whitelist.mjs";

// Rationale: all open-source solutions we've looked at fail to do 2 things
// we want from a tooltip:
// - use html attributes (the DOM is the API)
// - handle dynamic content being added/removed

function getTooltipValue(node) {
  const {
    dataset: { tooltip, tip },
  } = node;
  return tooltip || tip;
}

let tooltipElement = null;
let tooltipTarget = null;
const tooltipObserver =
  typeof ResizeObserver === "undefined"
    ? null
    : new ResizeObserver(() => {
        updatePosition();
      });

let timerID;

export function attachListeners(rootNode = globals.document?.body) {
  rootNode?.addEventListener("mouseover", mouseover);
  rootNode?.addEventListener("mouseout", mouseout);
}

export function removeListeners(rootNode = globals.document?.body) {
  rootNode?.removeEventListener("mouseover", mouseover);
  rootNode?.removeEventListener("mouseout", mouseout);
}

function mouseover(e) {
  if (timerID) {
    cancelAnimationFrame(timerID);
  }
  timerID = requestAnimationFrame(() => {
    const target = e.target;
    const tooltipContent = getTooltipValue(target);
    if (!tooltipContent) return;
    tooltipTarget = target;
    show();
  });
}

function mouseout() {
  hide();
}

function hide() {
  if (!tooltipElement) return;
  tooltipObserver.unobserve(tooltipElement);
  tooltipElement.remove();
  tooltipElement = null;
}

function updatePosition() {
  const tooltipPlacement = "top";
  const coords = tooltipTarget.getBoundingClientRect();

  let left =
    coords.left + (tooltipTarget.offsetWidth - tooltipElement.offsetWidth) / 2;
  if (left < 0) left = 0;

  let top = coords.top - tooltipElement.offsetHeight - 5;
  if (top < 0) {
    top = coords.top + tooltipTarget.offsetHeight + 5;
    tooltipElement.classList.add(tooltipPlacement === "top" ? "bottom" : "top");
    tooltipElement.classList.remove(tooltipPlacement);
  }

  tooltipElement.style.left = left + "px";
  tooltipElement.style.top = top + "px";
  tooltipElement.style.maxWidth = TOOLTIP_MAX_WIDTH + "px";
}

function show() {
  const tooltipContent = getTooltipValue(tooltipTarget);
  const tooltipPlacement = "top";

  tooltipElement = globals.document.createElement("div");
  tooltipElement.classList.add(TooltipContainer);
  tooltipElement.classList.add(tooltipPlacement);
  tooltipElement.innerHTML = tooltipContent;
  globals.document?.body?.append(tooltipElement);
  updatePosition();
  tooltipObserver.observe(tooltipElement);
}

const TooltipContainer = css`
  --bg: var(--shade10, black);

  position: fixed;
  background: var(--bg);
  color: var(--shade0);
  border-radius: var(--br);
  pointer-events: none;
  padding: var(--sp-2) var(--sp-4);
  z-index: 999;

  &::after {
    --size: 0.75rem;

    content: "";
    position: absolute;
    background: var(--bg);
    width: var(--size);
    height: var(--size);
  }
  &.top::after,
  &.bottom::after {
    left: calc(50% - calc(var(--size) / 2));
  }
  &.top::after {
    bottom: 0;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    transform: translateY(50%) rotate(45deg);
  }
  &.bottom::after {
    top: 0;
    clip-path: polygon(100% 0, 0 0, 0 100%);
    transform: translateY(-50%) rotate(45deg);
  }
`;
