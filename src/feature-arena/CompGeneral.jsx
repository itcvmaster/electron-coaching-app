import React from "react";
import { styled } from "goober";

export const Container = styled("div")`
  display: flex;
  flex-direction: ${(props) => (props.$row ? "row" : "column")};
  margin: auto;
  width: 1016px;
`;

export const Board = styled("div")`
  display: flex;

  background: var(--shade7);
  align-items: center;
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  overflow: hidden;
`;

export const Space = styled("div")`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

export const Spring = styled("div")`
  flex: 1;
`;

export const StickyContainer = styled("div")`
  z-index: 10;
  position: sticky;
  top: 0;
  transition: 0.2s ease-out;
  width: 100%;
  overflow: hidden;
  padding: var(--sp-4) 0 var(--sp-4);
`;

export const LightText = styled("div")`
  color: var(--shade0);
`;

export const DarkText = styled("div")`
  color: var(--shade1);
`;

export const SafeIcon = ({ icon, component }) => {
  const Icon = icon;
  const Component = component;

  switch (typeof Icon) {
    case "string": // URL
    case "number": // import or require
      return <Component src={Icon} />;
    case "function": // SVG
      return <Icon />;
    default:
      return null;
  }
};
