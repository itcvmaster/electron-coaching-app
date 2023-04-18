import { styled } from "goober";

import { mobile, tabletSmall } from "clutch";

export const FilterBar = styled("div")`
  .filter-controllers {
    box-sizing: border-box;
    display: flex;
    gap: var(--sp-2);
    margin-bottom: var(--sp-4);
    justify-content: flex-start;
    align-items: center;
    > :first-child {
      max-width: 22ch;
    }
  }
  .toggle-button-container {
    display: none;
  }
  ${mobile}, ${tabletSmall} {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-grow: 2;
    .filter-controllers {
      width: 100%;
      overflow: ${({ open }) => (open ? "unset" : "hidden")};
      max-height: ${({ open }) => (open ? "unset" : "36px")};
      margin-right: var(--sp-2);
      > :first-child {
        max-width: unset;
      }
      & > div:not(:last-child) {
        margin-bottom: var(--sp-2);
      }
    }
    .toggle-button-container {
      display: flex;
      height: var(--sp-9);
      > div {
        height: 100%;
      }
    }
  }
  .filter-controllers {
    ${tabletSmall} {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      max-width: 680px;
      & > div {
        white-space: nowrap;
        width: auto;
      }
      & > div:not(:last-child) {
        margin-right: var(--sp-2);
      }
    }
    ${mobile} {
      max-width: 323px;
      & > div {
        white-space: nowrap;
        width: 100%;
        & > button {
          width: 100%;
        }
      }
      & > div:not(:last-child) {
        margin-right: 0;
      }
    }
  }
`;
