import { styled } from "goober";

import { Card } from "clutch";

export const Grid = styled(Card)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--sp-16) * 4), 1fr));
  gap: var(--sp-3);
`;

export const Container = styled("div")`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-3);
  padding-top: var(--sp-6);
  background: var(--shade8);
  border-radius: var(--br);
  transition: var(--transition);

  &:hover {
    background: var(--shade6);
  }

  &.loading {
    height: 17rem;
  }

  .title {
    text-align: center;
    margin: var(--sp-4) 0 var(--sp-4) 0;
  }
  .title--champion {
    color: var(--shade1);
  }
  .match-info {
    display: flex;
    align-items: center;
  }
  .match-data {
    width: 100%;
    justify-content: space-between;
    margin-bottom: var(--sp-2);
  }
  .match-duration {
    margin-left: var(--sp-2);
  }
  .footer--pro-info {
    margin-left: var(--sp-2);
  }

  .live-dot {
    display: inline-block;
    position: relative;
    width: var(--sp-2);
    height: var(--sp-2);
    margin-left: var(--sp-2);
    background: var(--turq);
    border-radius: 50%;

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: var(--sp-2);
      height: var(--sp-2);
      top: 0%;
      left: 0;
      background: var(--turq);
      border-radius: 50%;
      animation: dotPulse 2.5s ease-in-out infinite;
    }

    &::after {
      animation-delay: 0.5s;
    }
  }

  @keyframes dotPulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(3.25);
      opacity: 0;
    }
    100% {
      transform: scale(3.25);
      opacity: 0;
    }
  }
`;
export const LowerBox = styled("div")`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-2);
  background: var(--shade7);
  border-radius: var(--br-sm);
  width: 100%;
`;

export const BrandImage = styled("img")`
  width: var(--sp-10);
  height: var(--sp-10);
  border-radius: 50%;
  background: var(--shade10);
`;
export const TeamImage = styled("img")`
  width: var(--sp-8);
  height: var(--sp-8);
`;
