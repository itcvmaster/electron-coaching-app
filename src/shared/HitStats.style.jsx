import { styled } from "goober";

export const DamageHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);

  .header-title {
    color: var(--shade3);
  }

  &.beatDmgAvg {
    .header-left .header-value {
      color: var(--blue);
    }
  }
  &:not(.beatDmgAvg) {
    .header-right .header-value {
      color: var(--red);
    }
  }

  .header-left,
  .header-right {
    flex: 1;
  }
  .header-left {
    text-align: left;
  }

  .header-right {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

export const VSBlock = styled("div")`
  display: flex;
  align-items: center;

  .arrows {
    display: flex;
    margin: 0 var(--sp-1);
    font-size: var(--sp-10);
    color: var(--shade1);
    opacity: 0.2;
  }
  .arrows-left {
    svg:first-child {
      margin-right: calc(var(--sp-7) * -1);
    }
  }
  .arrows-right {
    svg:last-child {
      margin-left: calc(var(--sp-7) * -1);
    }
    color: var(--red);
    opacity: 1;
  }

  .beatDmgAvg & {
    .arrows-left {
      color: var(--blue);
      opacity: 1;
    }
    .arrows-right {
      color: var(--shade1);
      opacity: 0.2;
    }
  }
`;

export const VS = styled("div")`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 var(--sp-2_5);
  height: var(--sp-9);
  width: var(--sp-9);
  background: var(--shade8);
  color: var(--shade1);
  border: var(--sp-0_5) solid var(--shade5);
  transform: rotate(45deg);

  > * {
    transform: rotate(-45deg);
  }
`;

export const HitBlocks = styled("div")`
  display: flex;
  justify-content: space-between;
  margin: 0 calc(var(--sp-2) * -1);
  /* margin-bottom: var(--sp-5); */
`;

export const HitBlock = styled("div")`
  flex: 1;
  margin: 0 var(--sp-2);
  padding: var(--sp-6) 0;
  background: linear-gradient(to bottom, transparent, var(--shade6-50));
  border-radius: var(--br);

  &.better-headshots {
    background: linear-gradient(to bottom, transparent, var(--shade6));
  }
`;
