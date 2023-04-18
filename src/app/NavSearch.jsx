import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { toggleGlobalSearchAction } from "@/app/actions.mjs";
import SearchIcon from "@/inline-assets/search.svg";

const Container = styled("div")`
  padding: 0px 12px;
  height: var(--sp-11);
`;

const NavSearch = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <div
        className={`nav-item nav-item--search`}
        onClick={() => toggleGlobalSearchAction(true)}
      >
        <SearchIcon />
        <p className={`nav-item--title`}>
          {t("common:navigation.search", "Search")}
        </p>
      </div>
    </Container>
  );
};

export default NavSearch;
