import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
// import getOSType from "@/util/get-os-type.mjs";

const SearchNavigation = styled("div")`
  display: flex;
  padding: 0 var(--sp-6);
  font-size: var(--sp-2_5);
  height: var(--sp-9);
  background: var(--shade9);
  border-bottom-left-radius: var(--br-8);
  border-bottom-right-radius: var(--br-8);
`;
const NavItem = styled("div")`
  display: flex;
  align-items: center;
  margin-right: var(--sp-6);
`;
const NavBox = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--sp-4);
  padding: 0 var(--sp-1_5);
  margin-right: var(--sp-1);
  text-transform: uppercase;
  letter-spacing: var(--sp-px);
  color: var(--shade1);
  background: var(--shade6);
  border-radius: var(--br-sm);

  svg {
    height: var(--sp-3);
    width: var(--sp-3);
  }
`;
const NavText = styled("span")`
  color: var(--shade3);
`;

const SearchNav = () => {
  const { t } = useTranslation();
  // const platform = getOSType();

  const enter = "enter";
  const esc = "esc";
  // const openKey = `${platform === "MacOS" ? "CMD" : "CTRL"} + K`;
  return (
    <SearchNavigation>
      <NavItem>
        <NavBox>
          <CaretUp />
        </NavBox>
        <NavBox>
          <CaretDown />
        </NavBox>
        <NavText>{t("common:search.toNavigate", "to navigate")}</NavText>
      </NavItem>
      <NavItem>
        <NavBox>{enter}</NavBox>
        <NavText>{t("common:search.toSelect", "to select")}</NavText>
      </NavItem>
      <NavItem>
        <NavBox>{esc}</NavBox>
        <NavText>{t("common:search.toDismiss", "to dismiss")}</NavText>
      </NavItem>
      {/* TODO: not implemented, so hidden */}
      {/* <NavItem> */}
      {/*   <NavBox>{openKey}</NavBox> */}
      {/*   <NavText>{t("common:search.toOpen", "to open")}</NavText> */}
      {/* </NavItem> */}
    </SearchNavigation>
  );
};

export default SearchNav;
