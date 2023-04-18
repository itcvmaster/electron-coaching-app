import { styled } from "goober";

export const TabsRow = styled("nav")`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-2);
`;

export const TabButton = styled("a")`
  --game-color: ${(props) => props.$gameColor};
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 0 var(--sp-4) 0 var(--sp-3);
  height: var(--sp-10);
  color: var(--shade3);
  border-radius: var(--br-lg);
  transition: background var(--transition), color var(--transition),
    box-shadow var(--transition);

  &:hover {
    color: var(--shade2);
    background: var(--shade7);

    svg {
      fill: var(--game-color, var(--shade2));
    }
  }
  &.selected {
    color: var(--shade0);
    background: var(--shade6);
    box-shadow: inset 0px 1px 0px var(--shade5);
  }

  svg {
    width: var(--sp-6);
    height: var(--sp-6);
    transition: fill var(--transition);
  }
`;
