import React from "react";
import { styled } from "goober";

export const Container = styled("div")`
  color: var(--green);
  height: var(--content-header-height);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function HeaderWrapper() {
  const header = "ChaMpioN.gG";
  return <Container>{header}</Container>;
}

export function NavigationWrapper() {
  return null;
}
