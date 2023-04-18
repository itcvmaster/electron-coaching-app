import { styled } from "goober";

import { Card } from "clutch";

export const ItemContainer = styled("div")`
  font-size: var(--sp-3);
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-1);

  .item-icon {
    height: var(--sp-9);
    width: var(--sp-9);
    border-radius: var(--br);
  }

  .item-icon-wrapper {
    width: var(--sp-9);
    height: var(--sp-9);
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    display: flex;
    position: relative;
  }

  &.empty {
    .item-icon-wrapper {
      height: var(--sp-9);
      width: var(--sp-9);
      background: var(--shade8);
      border-radius: var(--br);

      &::before {
        display: none;
      }
    }
  }
`;

export const HeaderContainer = styled(Card)`
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: var(--page-tabs-height, 0);
  border-radius: var(--br-lg);
  z-index: 1;
`;

export const Section = styled("div")`
  display: flex;
  flex: ${(props) => (props.flex ? props.flex : 1)};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  justify-content: center;
  align-items: center;
`;

export const HeadText = styled("h4")`
  color: ${(props) => (props.color ? props.color : "white")};
`;

export const DescriptionText = styled("span")`
  color: ${(props) => (props.color ? props.color : "var(--shade2)")};
`;
