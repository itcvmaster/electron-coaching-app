import { styled } from "goober";

export const Badge = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sp-5);
  height: var(--sp-5);
  border-radius: var(--br);

  > svg {
    width: 90%;
    height: auto;
    fill: var(--shade9);
  }
`;

export const BadgeTitle = styled("span")`
  color: var(--shade1);
`;
