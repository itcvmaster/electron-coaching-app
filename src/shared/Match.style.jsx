import { styled } from "goober";

export const MatchTileEmptyContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 4rem;
    height: 4rem;
  }
`;

export const ErrorIconContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MatchLink = styled("a")`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
