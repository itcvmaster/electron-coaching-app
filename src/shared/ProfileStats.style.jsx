import { styled } from "goober";

export const ListContainer = styled("div")`
  padding: var(--sp-3) 0;
`;

export const RowContainer = styled("li")`
  display: flex;
  align-items: center;
  background: var(--shade7);

  & > a {
    width: 100%;
    min-height: var(--sp-16);
    box-sizing: border-box;
  }
`;

export const StatLeft = styled("div")`
  display: block;
  margin-left: var(--sp-3);

  .name {
    text-transform: capitalize;
  }
`;

export const StatRight = styled("div")`
  display: block;
  margin-left: auto;
  text-align: right;
  white-space: nowrap;

  .win-loss {
    color: white;
    font-size: var(--sp-3);
    font-weight: 700;
  }
  .win-loss-rate {
    font-size: var(--sp-3);
    color: var(--shade3);
  }
`;

export const Row = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: var(--sp-2) var(--sp-6);
  position: relative;
  overflow: hidden;
  transition: background-color var(--transition);

  &:first-of-type {
    margin-top: 0;
  }

  &:hover {
    background: var(--shade6);

    .role-icon {
      background: var(--shade6);
    }
  }

  img {
    width: ${(props) => (props.$imgSize ? props.$imgSize : "var(--sp-10)")};
    height: auto;
    border-radius: var(--br);
    background-image: url(${(props) => props.src});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    flex-shrink: 0;
  }

  .sub-stat {
    color: var(--shade1);
  }

  @media screen and (max-width: 1024px) {
    padding: var(--sp-2) var(--sp-4);
  }
`;
