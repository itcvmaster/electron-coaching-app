import React from "react";
import { styled } from "goober";

export const Container = styled("div")`
  display: flex;
  height: 100vh;

  --left-nav-width-collapsed: calc(var(--sp-18));
  --left-nav-width-expanded: calc(var(--sp-1) * 60);

  --left-nav-padding: var(--sp-3);
  --content-header-height: var(--sp-14);
  --nav-tabs-height: var(--sp-11);

  --content-window-width: calc(100vw - var(--left-nav-width-expanded));
  --content-window-height: calc(100vh - var(--content-header-height));

  @keyframes spin {
    from {
      transform: rotate(-1turn);
    }
  }

  .blitz-loading-spinner {
    animation: spin 1s linear forwards infinite;
  }
`;

export const Content = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;

  > * {
    position: relative;
  }
`;

export const ContentBody = styled("div", React.forwardRef)`
  position: relative;
  height: ${({ $isStandalone, $shouldShowWrapper }) => {
    if ($isStandalone) return "calc(100vh - 72px)";
    if ($shouldShowWrapper) return "var(--content-window-height)";
    return "100%";
  }};
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  &:first-child {
    height: 100%;
    overflow: auto;
  }
`;

export const RouteWrapper = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
`;

export const Backdrop = styled("div")`
  position: absolute;
  width: 100%;
  height: 264px;
  background: linear-gradient(to top, var(--app-bg), var(--shade3));
  opacity: 0.15;
  -webkit-mask-image: linear-gradient(to top, transparent, black);
`;

export const BGImageContainer = styled("div")`
  position: absolute;
  width: 100%;
  height: 264px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to top, transparent, black);

  img {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    filter: blur(40px);
    opacity: 0.15;
  }
`;
