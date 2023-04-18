import React from "react";
import { styled } from "goober";

import Container from "@/shared/ContentContainer.jsx";

export const Header = styled("header", React.forwardRef)`
  --img-radius: 50%;
  display: flex;
  align-items: center;
  height: calc(var(--sp-1) * 26);
  opacity: 1;
  transition: opacity var(--transition);
  will-change: opacity, transform;

  &.scrolled-away {
    opacity: 0;
  }

  .header-image--outer {
    position: relative;
  }

  .header-image--inner,
  .header-image--img,
  .header-icon--inner {
    border-radius: var(--img-radius);
  }
  .header-icon--inner,
  .header-image--inner {
    position: relative;
    height: var(--sp-18);
    width: var(--sp-18);
    overflow: hidden;
  }
  .header-image--inner {
    border: 2px solid var(--shade6);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: var(--img-radius);
      box-shadow: inset 0 0 0 2px var(--app-bg);
    }
  }
  .header-image--img {
    width: 100%;
    transform: scale(1.2);
  }

  .header-icon--inner {
    display: grid;
    place-content: center;
    aspect-ratio: 1;
    background: var(--shade7);
    box-shadow: inset 0px 2px 2px var(--shade3-25);

    svg {
      width: var(--sp-9);
      height: auto;
    }
  }

  .accent-pill,
  .accent-icon {
    position: absolute;
    bottom: 0;
    left: 50%;
  }

  .accent-pill {
    padding: var(--sp-0_5) var(--sp-2);
    background: var(--app-bg);
    border-radius: var(--sp-10);
    transform: translate(-50%, var(--sp-2));
  }
  .accent-icon {
    transform: translate(-50%, 40%);

    svg {
      width: var(--sp-8);
    }
  }
`;

export const LinksContainer = styled("div")`
  position: sticky;
  top: 0;
  z-index: 10;
  background: transparent;

  &.stuck {
    background: var(--app-bg);
    &::before,
    &::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 100%;
      width: 100vw;
      height: 100%;
      background: var(--app-bg);
      pointer-events: none;
    }
    &::after {
      left: auto;
      right: 100%;
    }
  }
`;

export const Links = styled(Container)`
  display: flex;
  align-items: center;
  gap: var(--sp-4);

  a {
    display: flex;
    align-items: center;
    position: relative;
    height: var(--page-tabs-height, var(--sp-10));
    padding: 0 var(--sp-3);
    color: var(--shade2);
    transition: color var(--transition);
    overflow: hidden;

    &:hover {
      color: var(--shade0);
    }

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: var(--sp-6);
      height: 3px;
      background: var(--primary);
      border-top-left-radius: var(--br-sm);
      border-top-right-radius: var(--br-sm);
      transform: translate(-50%, 5px);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition), visibility var(--transition),
        transform var(--transition);
    }

    &.current {
      color: var(--shade0);

      &::before {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, 0);
      }
    }
  }
`;
