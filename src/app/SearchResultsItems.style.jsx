import { styled } from "goober";

export const SearchItemContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: var(--sp-1_5) 0 var(--sp-1_5) var(--sp-6);
  cursor: pointer;

  &.active {
    background: var(--shade5);
  }
`;

export const SearchIconContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--sp-6);
  height: var(--sp-6);
  background: var(--shade8);
  border-radius: 50%;
  margin-right: 9px;

  svg {
    width: var(--sp-4);
    height: var(--sp-4);
  }
`;
