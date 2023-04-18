import { styled } from "goober";

import { mobile, mobileSmall } from "clutch";

export const Row = styled("li")`
  position: relative;
  display: flex;
  padding: var(--sp-4);

  &:hover {
    &::before {
      opacity: 1;
      width: var(--sp-1);
    }
    &::after {
      opacity: 1;
      opacity: 0.05;
    }
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    transition: var(--transition);
  }
  &::before {
    width: var(--sp-0);
    background: var(--tier-color);
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
  }
  &::after {
    width: 100%;
    background: linear-gradient(to right, var(--tier-color), transparent);
  }

  > * {
    position: relative;
    z-index: 1;
  }

  ${mobileSmall} {
    padding: 0;
  }
  ${mobile} {
    flex-wrap: wrap;
  }
`;

export const Tier = styled("div")`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: var(--sp-18);

  > svg {
    font-size: var(--sp-10);
    margin-top: var(--sp-4);
  }

  ${mobile} {
    width: 100%;
    padding-right: 0;
    padding-bottom: var(--sp-4);
    > svg {
      margin-top: 0;
    }
  }
`;

export const TierGroup = styled("ol")`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  flex: 1;

  ${mobile} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ChampionBlock = styled("a")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--sp-4) 0;
  border-radius: var(--br);

  &:hover {
    .champion-image {
      filter: brightness(1.4);
      transform: translate3d(0, 0, 0) scale(1.1);
    }
  }

  .champion-image {
    position: relative;
    transform: translate3d(0, 0, 0);
    transition: var(--transition);
    box-shadow: 0 0 0 2px var(--tier-color);
  }
  .champion-role {
    position: relative;
    padding: 0.25rem;
    margin-top: calc(var(--sp-3) * -1);
    color: var(--shade0);
    background: var(--shade7);
    border-radius: 50%;
  }
`;

export const LoadingContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

  svg {
    width: 7rem;
    height: 7rem;
  }
`;
