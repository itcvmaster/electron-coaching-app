import { forwardRef } from "react";
import { styled } from "goober";

import { IS_APP } from "@/util/dev.mjs";
import getOSType from "@/util/get-os-type.mjs";

const OS_TYPE = getOSType();
const IS_MAC_APP = IS_APP && OS_TYPE === "darwin";

export const InnerContainer = styled("div")`
  width: var(--left-nav-width);
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: var(--top-spacing);
  transition: width var(--transition);
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--nav-bar);
  border-right: 1px solid var(--shade7);
  box-sizing: border-box;
  font-size: var(--sp-4);
`;

export const NavigationBar = styled("div", forwardRef)`
  width: var(--left-nav-width-collapsed);
  z-index: 15;
  user-select: none;
  position: sticky;
  top: 0;
  transition: width var(--transition);

  --top-spacing: ${IS_MAC_APP ? "20px" : "0px"};
  --left-nav-width: var(--left-nav-width-collapsed);

  &.expanded {
    width: var(--left-nav-width-expanded);
  }
  &.expanded,
  &:hover {
    --left-nav-width: var(--left-nav-width-expanded);
    ${InnerContainer} {
      box-shadow: 0 0 var(--sp-6) rgba(14, 16, 21, 1);
    }
  }

  .nav-item {
    cursor: pointer;
    --text-color: var(--shade2);
    --nav-item-radius: var(--br);
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    height: var(--sp-10);
    width: 100%;
    left: var(--sp-3);
    color: var(--text-color);
    border-radius: var(--nav-item-radius);
    transition: color var(--transition), opacity var(--transition),
      visibility var(--transition);

    &:hover {
      --text-color: var(--shade0);

      .nav-item--title {
        opacity: 1;
        visibility: inherit;
        transform: translateX(calc(var(--sp-2) * -1));
        transition: opacity var(--transition), visibility var(--transition),
          transform var(--transition);
      }
    }

    &.active {
      --text-color: var(--shade0);
    }

    .nav-item--title {
      position: absolute;
      margin-left: var(--sp-10);
      flex: 1;
      text-align: left;
      max-width: 15ch;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      visibility: hidden;
      transform: translateX(0);
    }

    svg {
      width: var(--sp-6);
      height: auto;
    }
  }

  .nav-item--search {
    background: var(--shade7);
    border-radius: var(--br-lg);
    box-shadow: var(--highlight);
    padding-left: var(--sp-3);
    transform: translateX(calc(var(--sp-3) * -1));
    transition: background var(--transition), color var(--transition);
    &:hover {
      background: var(--shade6);
    }
  }

  .nav-item--collapse {
    height: var(--sp-12);
  }
  &.expanded .nav-item--title,
  &:hover .nav-item--title {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateX(calc(var(--sp-2) * -1));
    transition: opacity var(--transition), visibility var(--transition);

    /* These rules arent really visible, but are
      used to provive a background so can be seen
      when overlapping the side ads in production */

    padding: var(--sp-1) var(--sp-2);
    border-radius: var(--br-sm);
  }
`;

export const LogoContainer = styled("div")`
  width: 100%;
  height: var(--sp-19);
  display: flex;
  align-items: center;
  .logo {
    display: flex;
    align-items: center;
    margin-left: var(--sp-6);
    left: 24px;

    svg {
      display: block;
    }
    .logo-wordmark {
      margin-left: var(--sp-4);
      opacity: 0;
      visibility: hidden;
      &.visible {
        opacity: 1;
        visibility: visible;
        transition: opacity var(--transition), visibility var(--transition);
      }
    }
  }
`;

export const Divider = styled("hr")`
  position: relative;
  margin: 0 var(--sp-5);
  border-top: 1px solid var(--shade7);
`;
