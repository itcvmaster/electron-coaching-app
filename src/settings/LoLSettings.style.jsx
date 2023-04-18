import { styled } from "goober";
import { Button } from "clutch/src/index.mjs";

export const InputGroup = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 460px;
  width: 100%;
`;

export const TextInput = styled("input")`
  background: var(--shade8);
  border: 1px solid var(--shade6);
  box-sizing: border-box;
  border-radius: 5px;
  padding: 11px var(--sp-4);
  width: 100%;

  &:focus {
    border: 1px solid var(--shade3);
    outline: 3px solid rgba(153, 156, 162, 0.15);
  }
  .invalid & {
    background: var(--primary-15);
    border: 1px solid var(--primary);
  }
`;

export const ProfileTag = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px 6px;
  background: var(--shade6);
  border-radius: 5px;
  text-transform: uppercase;
  color: var(--shade2);
  line-height: 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
`;

export const InputTag = styled("div")`
  padding: 2px var(--sp-2);
  background: var(--shade6);
  border-radius: 5px;
  color: var(--shade2);
  line-height: 20px;
  position: absolute;
  right: 10px;
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.25);
`;

export const ProfileAddButton = styled(Button)`
  height: 44px !important;
  margin-left: var(--sp-2);
  opacity: 0.38 !important;
  cursor: default !important;
  pointer-events: none !important;

  .valid &,
  .invalid & {
    color: white !important;
    background: var(--primary) !important;
  }

  .valid & {
    opacity: 1 !important;
    cursor: pointer !important;
    pointer-events: all !important;
  }
`;

export const AvatarContainer = styled("div")`
  position: relative;
  width: 184px;
  height: 120px;
  margin-bottom: var(--sp-3);
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--shade7);
  border-radius: 10px;
  &:hover:before {
    content: " ";
    position: absolute;
    z-index: -1;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid var(--shade4);
    border-radius: 12px;
  }
  &:hover button {
    display: flex;
  }
`;

export const AvatarBackdrop = styled("div")`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.15;
  background: radial-gradient(
      100% 100% at 50% 0%,
      rgba(14, 16, 21, 0) 0%,
      rgba(14, 16, 21, 0.5) 100%
    ),
    ${({ $src }) => ($src ? `url(${$src})` : "var(--shade7)")};
  background-size: cover;
  background-position: center center;
  border-radius: 8px;
`;

export const Avatar = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ $src }) => ($src ? `url(${$src})` : "var(--shade6)")};
  background-size: cover;
  z-index: 1;
  & path {
    fill: var(--shade0) !important;
  }
`;

export const CloseButton = styled("button")`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  background: var(--shade9);
  border-radius: 0px 8px;
  padding: var(--sp-1);
  cursor: pointer;
`;

export const AccountLabel = styled("div")`
  display: flex;
  gap: var(--sp-2);
`;

export const LinkedAccountContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: 28px;
`;

export const LinkedAccountList = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
`;

export const AccountsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
`;

export const LinkedAccount = styled("div")``;
