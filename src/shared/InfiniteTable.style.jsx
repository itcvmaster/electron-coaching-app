import { css, styled } from "goober";

import { tabletSmall } from "clutch";

export const TabContainer = styled("div")`
  width: 100%;
  display: flex;
  flex-flow: column;
  position: relative;
`;

export const FlexContainer = styled("div")`
  opacity: ${(props) => props.opacity || 1};

  ${tabletSmall} {
    overflow-x: auto;
  }

  .infinite-table {
    min-width: 800px;
  }
`;

// TODO: this component is used everywhere, refactor to its own file and include the spinner.
export const LoadingContainer = styled("div")`
  width: 100%;
  height: var(--content-window-height);
  display: flex;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    width: 7rem;
    height: 7rem;
  }
`;

export const FilterSelectContainer = styled("div")`
  display: flex;
  margin-bottom: var(--sp-6);
  gap: var(--sp-2);
`;

export const HeaderWrapper = styled("div")`
  position: relative;
  display: flex;
  text-align: center;
  align-items: center;
`;
export const HeaderLabel = styled("p")`
  font-size: var(--sp-3);
  font-weight: ${(props) => (props.active ? 700 : 500)};
  color: ${(props) => (props.active ? "var(--shade0)" : "var(--shade1)")};
`;
export const SortIconWrapper = styled("div")`
  position: absolute;
  right: -18px;
  color: var(--shade0);
  text-align: center;
  display: flex;
  font-size: var(--sp-4);

  svg {
    width: 1em;
    height: 1em;
    stroke-width: 0;
    fill: currentcolor;
    color: currentcolor;
  }
`;

export const RoundedIcon = () =>
  css`
    display: flex;
    text-align: center;
    align-items: center;
    font-size: var(--sp-3_5);
    justify-content: flex-start;
    color: var(--shade0);

    img {
      width: var(--sp-9);
      height: var(--sp-9);
      margin-right: var(--sp-6);
      border-radius: 50%;
    }

    span {
      color: var(--shade0);
    }
  `;

export const DefaultIcon = () =>
  css`
    display: flex;
    text-align: center;
    align-items: center;
    font-size: var(--sp-3_5);
    justify-content: flex-start;
    color: var(--shade0);

    img {
      height: var(--sp-9);
      margin-right: var(--sp-6);
    }

    span {
      color: var(--shade0);
    }
  `;
