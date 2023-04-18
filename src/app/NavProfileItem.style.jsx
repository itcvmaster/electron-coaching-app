import { styled } from "goober";

export const ProfileIconContainer = styled("div")`
  position: relative;
  display: flex;
`;

export const ProfileStatus = styled("div")`
  position: absolute;
  bottom: 0;
  right: 0;
  height: var(--sp-2);
  width: var(--sp-2);
  background: var(--shade3);
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--shade8);

  .collapsed & {
    box-shadow: 0 0 0 3px var(--shade9);
  }

  &.online {
    background: #1fd26a;
  }
`;

export const ProfileIcon = styled("img")`
  width: var(--sp-6);
  height: var(--sp-6);
  border: var(--sp-0-5) solid var(--shade6);
  border-radius: 50%;
`;

export const NameContainer = styled("div")`
  display: flex;
`;

export const TagContainer = styled("div")`
  margin-left: var(--sp-1);
`;
