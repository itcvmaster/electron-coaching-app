import { forwardRef } from "react";
import { styled } from "goober";

import { tablet } from "clutch";

export const Container = styled("div")`
  position: fixed;
  top: 0;
  left: var(--left-nav-width);
  right: 0;
  width: calc(100vw - var(--left-nav-width));
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--shade9-75);
  border-radius: var(--br);
  z-index: 11;
  transition: opacity var(--transition);
  --left-nav-width: var(--left-nav-width-collapsed);

  &.full-screen {
    width: 100vw;
    left: 0;
  }

  &.inert {
    opacity: 0;
    pointer-events: none;
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background: var(--shade9-75);
    backdrop-filter: blur(24px);
  }

  ${tablet} {
    left: 0;
    right: 0;
    width: 100vw;
  }
`;

export const SearchContentBackground = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
`;

export const SearchInputBoxContainer = styled("div")`
  width: 60%;
  display: flex;

  @media (max-width: 1024px) {
    width: 615px;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const SearchInputBox = styled("div")`
  width: 100%;
  height: 100%;
  display: grid;
  cursor: text;
  grid-template-columns: var(--sp-12) 1fr 0fr var(--sp-12);
  place-content: stretch;
  background: var(--shade6);
  border-radius: 0 var(--br) var(--br) 0;
  box-shadow: inset 0 var(--sp-px) var(--shade3-25);
  border svg {
    width: var(--sp-6);
    height: var(--sp-6);

    path {
      fill: var(--shade3);
    }
  }

  svg:nth-of-type(1) {
    margin: 0 var(--sp-3);
  }

  @media (max-width: 480px) {
    & > svg:nth-of-type(1) {
      display: none;
    }
  }
`;

export const InputWrapper = styled("div")`
  position: relative;
  font-size: 0;
  min-height: 20px;
  min-width: ${({ $w = "60px" }) => $w};
  padding-right: ${({ $pr = "0" }) => `var(--sp-${$pr})`};
`;

export const InputPad = styled("span")`
  pointer-events: none;
  visibility: hidden;
  font-size: var(--sp-3_5);
  line-height: 1;

  @media (max-width: 480px) {
    padding-left: var(--sp-3);
  }
`;

export const InputItem = styled("input", forwardRef)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: var(--sp-3_5);
  line-height: 1;
  color: var(--shade0);
  background: transparent;
  border: none;
  outline: none;
  box-sizing: border-box;
`;

export const InputValTagItemContainer = styled("div")`
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  background: var(--shade5);
  padding: var(--sp-2_5) var(--sp-2_5) var(--sp-2);
  border-radius: var(--br);
`;

export const TagPrefix = styled("div")`
  line-height: var(--sp-4);
  color: var(--shade1);
  margin-right: var(--sp-1);
`;

export const InputValTagItem = styled("input", forwardRef)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: var(--sp-3_5);
  line-height: var(--sp-4);
  color: var(--shade0);
  background: transparent;
  border: none;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: var(--shade1);
  }
`;

export const ClearBtn = styled("div")`
  font-size: var(--sp-3_5);
  line-height: var(--sp-5);
  color: var(--shade3);
  margin-left: auto;
  cursor: pointer;

  &:hover {
    color: var(--shade1);
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const CloseBtn = styled("div")`
  cursor: pointer;

  svg {
    margin: 0 19px 0 15px;
  }

  &:hover {
    svg {
      path {
        fill: var(--shade1);
      }
    }
  }
`;

export const SearchResultBoxContainer = styled("div")`
  width: 60%;
  height: calc(70% - 70px);
  background: var(--shade7);
  border-radius: var(--br-lg);
  margin-top: var(--sp-4);

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background: var(--shade7-50);
  }

  @media (max-width: 1024px) {
    width: 615px;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const SearchResultContent = styled("div")`
  display: flex;
  height: calc(100% - 36px);
`;
