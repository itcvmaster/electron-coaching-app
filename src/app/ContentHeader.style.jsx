import { styled } from "goober";

import Container from "@/shared/ContentContainer.jsx";

export const Outer = styled("header")`
  /* The purpose of this wrapper is to align the header contents with the page content
  // Page content is indented due to the width of the scrollbar */
  -webkit-app-region: drag;
  -webkit-user-select: none;
  padding-right: var(--scrollbar-width);
  background: transparent;

  .hidden {
    opacity: 0;
    visibility: hidden;
    transform: translateY(0.5rem);
    transition: opacity var(--transition), visibility var(--transition),
      transform var(--transition);
  }

  &.page-header--hidden {
    background: var(--app-bg);

    .hidden {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
`;

export const Header = styled(Container)`
  display: flex;
  align-items: center;
  height: var(--content-header-height);

  .page-info {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  .image {
    display: grid;
    place-content: center;
    width: var(--sp-6);
    height: var(--sp-6);
    border-radius: 50%;
    overflow: hidden;

    > img {
      transform: scale(1.1);
      border-radius: 50%;
    }
  }

  .title {
    transition-delay: 75ms;
  }
`;

export const HistoryBtns = styled("div")`
  display: flex;
  -webkit-app-region: no-drag;

  button {
    all: unset;
    display: grid;
    place-content: center;
    width: var(--sp-8);
    height: var(--sp-8);
    cursor: pointer;
    pointer-events: all;

    &.disabled {
      opacity: 0.38l
      pointer-events: none;
    }

    &:hover {
      svg {
        fill: var(--shade0);
      }
    }

    svg {
      width: var(--sp-4_5);
      height: var(--sp-4_5);
      fill: var(--shade2);
      transition: fill var(--transition);
    }
  }
`;
