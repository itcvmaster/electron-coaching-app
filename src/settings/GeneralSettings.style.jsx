import { styled } from "goober";
import { Button } from "clutch/src/index.mjs";

import { desktop, mobile, mobileSmall, tabletLarge, tabletSmall } from "clutch";

export const BlitzVersion = styled("div")`
  flex: 1;
  padding-right: var(--sp-6);
  max-width: 50%;
  ${desktop} {
    max-width: 100%;
    padding-right: 0;
  }
`;

export const ButtonGroup = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  ${tabletLarge} {
    flex: 1;
    flex-direction: column;
    button {
      width: 100%;
    }
  }
`;

export const PrimaryButton = styled(Button)`
  color: white !important;
  background: var(--primary) !important;
  &:hover {
    color: white !important;
    background: var(--primary-hover) !important;
  }
`;

export const SecondaryButton = styled(Button)`
  &:hover path {
    fill: var(--shade0);
  }
  & path {
    fill: var(--shade1);
  }
`;

export const LanguageSelect = styled("div")`
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  ${tabletSmall} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 0 var(--sp-4);
  }
  ${mobileSmall} {
    grid-template-columns: repeat(1, 1fr);
  }
  & > label {
    display: flex;
    align-items: center;
    padding-block: var(--sp-4);

    cursor: pointer;
    & > input {
      appearance: none;
      font: inherit;
      color: var(--shade3);
      width: var(--sp-4);
      height: var(--sp-4);
      border: 0.15em solid var(--shade3);
      border-radius: 50%;
      margin-right: var(--sp-3);
      display: grid;
      place-content: center;
      &:checked {
        color: var(--blue);
        border-color: var(--blue);
      }
      &:checked::before {
        transform: scale(1);
      }
      &::before {
        content: "";
        width: var(--sp-2);
        height: var(--sp-2);
        border-radius: 50%;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--blue);
      }
    }
  }
`;
