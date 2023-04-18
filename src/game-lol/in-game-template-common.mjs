import { css } from "goober";

export const tagContainerClass = css/*css*/ `
  --radius: var(--br);
  --gap: var(--sp-1);
  --color: currentColor;
  --icon-size: var(--sp-4);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--gap);
  font-family: "Inter", sans-serif;
  white-space: nowrap;
  color: var(--color);
  border-radius: var(--radius);

  > * {
    position: relative;
  }

  svg,
  img {
    height: var(--icon-size);
    width: var(--icon-size);
    display: block;
  }

  svg {
    fill: currentColor;
  }

  .icon-left {
    margin-left: calc(var(--sp-0_5) * -1);
  }
  .icon-right {
    margin-right: calc(var(--sp-0_5) * -1);
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--color);
    opacity: 0.15;
    border-radius: var(--radius);
  }

  &.xs {
    --radius: var(--sp-1);
    --gap: var(--sp-0_5);
    --icon-size: var(--sp-3);

    padding: 0 var(--sp-1);
  }

  &.sm {
    --radius: var(--sp-1);
    --icon-size: var(--sp-3_5);

    padding: calc(var(--sp-0_5) / 2) var(--sp-1_5);
  }

  &.med {
    --icon-size: var(--sp-4);

    padding: var(--sp-0_5) var(--sp-2);
  }

  &.lg,
  &.large {
    --icon-size: var(--sp-4_5);
    padding: var(--sp-1_5) var(--sp-2);
  }
`;
