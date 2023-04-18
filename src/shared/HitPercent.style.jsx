import { styled } from "goober";

import MannequinSvg from "@/inline-assets/mannequin.svg";

export const Container = styled("div")`
  .weapon-exclusion {
    display: flex;
    justify-content: center;
    margin-top: var(--sp-4);
  }
`;
export const DmgStats = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;

  .hidehits {
    justify-content: flex-start;
  }
  padding-top: var(--sp-2);

  .bump {
    padding-top: var(--sp-6);
  }

  .stat-value {
    color: var(--shade1);
  }
  .body-head {
    color: var(--headshotColor);
    opacity: var(--headshotOpacity);
  }
  .body-torso {
    color: var(--bodyshotColor);
    opacity: var(--bodyshotOpacity);
  }
  .body-legs {
    color: var(--legshotColor);
    opacity: var(--legshotOpacity);
  }
`;
export const Mannequin = styled(MannequinSvg)`
  height: auto;
  margin: 0 var(--sp-4);

  .left & {
    order: 1;
  }
  .right & {
    order: 2;
  }
`;

export const Stats = styled("div")`
  display: flex;
  margin-top: calc(var(--sp-2) * -1);

  .bump {
    margin-top: calc(var(--sp-6) * -1);
  }

  .left & {
    order: 2;
  }
  .right & {
    order: 1;
  }
`;

export const StatColumn = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 0.25rem;

  .stats-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    > * {
      display: flex;
      align-items: baseline;
      justify-content: center;
    }
    p {
      margin: 0 0.25rem;
    }
  }
  .stat-value--subtitle {
    color: var(--shade3);
  }
  .seperator {
    height: var(--sp-px);
    width: var(--sp-3);
    background: var(--shade5);
  }
`;

export const ColumnHitsPercent = styled(StatColumn)`
  .left & {
    order: 1;
  }
  .right & {
    order: 3;
  }
`;

export const ColumnHitTotal = styled(StatColumn)`
  .left & {
    order: 3;
  }
  .right & {
    order: 1;
  }
`;

export const ColumnTitle = styled("p")`
  color: var(--shade3);
  margin-bottom: var(--sp-2);
`;

export const ColumnSeperator = styled(StatColumn)`
  order: 2;

  ${ColumnTitle} {
    opacity: 0;
    visibility: hidden;
  }
`;
