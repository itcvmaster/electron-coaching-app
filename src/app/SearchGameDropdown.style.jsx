import { styled } from "goober";

import { mobile } from "clutch";

export const GameDropdownWrapper = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--br);
`;

export const DropdownButton = styled("div")`
  display: flex;
  align-items: center;
  min-width: 60px;
  font-size: var(--sp-3);
  color: var(--shade1);
  white-space: nowrap;
  padding: var(--sp-3) var(--sp-4);
  background: var(--shade7);
  border-radius: var(--br) 0 0 var(--br);
  box-shadow: inset 0 var(--sp-px) var(--shade3-25);
  cursor: pointer;
  transition: background 0.15s var(--bezier);

  &:hover {
    background: var(--shade6);
  }

  img {
    width: var(--sp-6);
    height: var(--sp-6);
  }

  svg {
    font-size: var(--sp-4);
    margin-left: auto;
  }
`;

export const GameIcon = styled("img")`
  width: var(--sp-5);
  height: var(--sp-5);
`;

export const EmptyIcon = styled("div")`
  width: var(--sp-5);
  height: var(--sp-5);
  margin-right: var(--sp-4);
`;

export const RegionBox = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--sp-3);
  line-height: var(--sp-2_5);
  letter-spacing: var(--sp-px);
  text-align: center;
  color: var(--shade1);
  padding: var(--sp-2) var(--sp-3);
  background: var(--shade9);
  border-radius: var(--br-sm);
  margin: 0 var(--sp-2) 0 var(--sp-3);
  box-shadow: inset 0 var(--sp-px) var(--shade3-25);
`;

export const RegionBigBox = styled(RegionBox)`
  height: var(--sp-7);
  padding: 4px 11.5px 0 0.875rem;
  margin-left: auto;
  cursor: pointer;
  transition: background 0.5s ease-in-out;

  &:hover {
    background: var(--shade8);
  }

  svg {
    margin-left: var(--sp-2_5);
    margin-top: -3px;
  }

  ${mobile} {
    display: none;
  }
`;

export const DropdownContent = styled("div")`
  position: absolute;
  top: 64px;
  display: flex;
  z-index: 2;
`;

export const DropdownList = styled("div")`
  display: flex;
  flex-direction: column;
  width: 263px;
  height: fit-content;
  animation: easeInFromTop 0.25s ease-in-out 0s 1 normal forwards running;
  background: var(--shade7);
  border-radius: var(--br);
  padding-bottom: 6px;
  margin-right: 6px;

  @keyframes easeInFromTop {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
  }
`;

export const DropdownListHeader = styled("div")`
  display: flex;
  align-items: center;
  font-size: var(--sp-3);
  line-height: var(--sp-4);
  color: var(--shade1);
  padding: 12px 11px var(--sp-2_5);
  background: var(--shade7);
  border-radius: var(--br) 5px 0 0;
  border-bottom: var(--sp-px) solid var(--shade5);
  margin-bottom: 6px;

  & > svg:nth-child(1) {
    width: var(--sp-5);
    height: var(--sp-5);
    margin-right: var(--sp-4);
  }
`;

export const DropdownListNoHeader = styled("div")`
  display: flex;
  height: var(--sp-3);
  border-radius: var(--br) 5px 0 0;
`;

export const DropdownItem = styled("div")`
  display: flex;
  align-items: center;
  font-size: var(--sp-3);
  line-height: var(--sp-4);
  color: var(--shade1);
  padding: 11px 11px 9px;
  margin: 0 10px 6px 9px;
  cursor: pointer;

  &:hover {
    background: var(--shade9) b3;
    border-radius: var(--br-sm);
  }

  img {
    margin-right: var(--sp-4);
  }

  &.active {
    background: var(--shade9);
    border-radius: var(--br-sm);
  }
`;

export const RegionListView = styled("div")`
  display: flex;
  flex-direction: column;
  width: 260px;
  animation: easeInFromLeft 0.25s ease-in-out 0s 1 normal forwards running;
  background: var(--shade7);
  border-radius: var(--br);
  padding: 11px 0;

  @keyframes easeInFromLeft {
    0% {
      transform: translateX(-10px);
      opacity: 0;
    }
  }
`;

export const RegionListItem = styled("div")`
  font-size: var(--sp-3);
  line-height: var(--sp-4);
  color: var(--shade1);
  padding: 11px 0 9px 19px;
  margin: 0 var(--sp-2_5);
  cursor: pointer;

  &:hover {
    background: var(--shade9) b3;
    border-radius: var(--br-sm);
  }

  &.active {
    background: var(--shade9);
    border-radius: var(--br-sm);
  }
`;
