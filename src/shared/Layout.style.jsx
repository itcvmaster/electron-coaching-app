import { styled } from "goober";

export const Center = styled("div")`
  display: flex;
  justify-content: ${({ $onlyVertically }) =>
    $onlyVertically ? "inherit" : "center"};
  align-items: ${({ $onlyHorizontally }) =>
    $onlyHorizontally ? "inherit" : "center"}; ;
`;
