import React from "react";
import { styled } from "goober";

import { mobile, mobileSmall } from "clutch";

import Settings from "@/inline-assets/settings.svg";

const SettingsBtnFrame = styled("div")`
  color: var(--shade5);

  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: var(--sp-4);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    color: var(--shade3);
  }

  ${mobile} {
    margin-right: var(--sp-2);
  }

  ${mobileSmall} {
    margin-right: 0;
    margin-left: var(--sp-1);
  }
`;

const SettingsButton = ({ onClick }) => (
  <SettingsBtnFrame onClick={onClick}>
    <Settings />
  </SettingsBtnFrame>
);

export default SettingsButton;
