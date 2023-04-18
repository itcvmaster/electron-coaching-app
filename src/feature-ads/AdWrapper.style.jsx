import { styled } from "goober";

export const Container = styled("div")`
  width: calc(
    var(--sp-container) + var(--sp-container-gap) + var(--sp-right-rail-ads)
  );
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 auto;
  position: relative;
`;

export const InnerContainer = styled("div")`
  width: var(--sp-container);
  align-self: stretch;
`;

export const AdsColumn = styled("div")`
  position: sticky;
  top: var(--page-tabs-height);
  margin-top: ${({ $yOffset }) =>
    `calc((${$yOffset} * 1px) - var(--content-header-height))`};

  > * {
    margin: 0 0 var(--sp-4);
  }
`;

export const DisplayAdContainer = styled("div")`
  height: 250px;
  width: 300px;
  background: var(--shade7);
  color: var(--shade3);
  display: flex;
  justify-content: center;
  align-items: center;
`;
