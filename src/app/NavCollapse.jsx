import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { toggleIsManualExpanded } from "@/app/actions.mjs";
import CollapseIcon from "@/inline-assets/collapse-left.svg";
import ExpandIcon from "@/inline-assets/expand-left.svg";

const Container = styled("div")`
  margin-top: auto;
  border-top: 1px solid var(--shade7);
  width: 100%;
  padding: 0 var(--sp-3);
`;

const NavCollapse = () => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const { isManualExpanded } = state.settings;

  const handleCollapseBtn = () => {
    toggleIsManualExpanded(!isManualExpanded);
  };
  return (
    <Container>
      {/*readState.user ? (
        <div className="nav-item nav-item--collapse">
          <div className={`nav-item--title`}>{readState.user.email}</div>
        </div>
      ) : null*/}
      <div className="nav-item nav-item--collapse" onClick={handleCollapseBtn}>
        {isManualExpanded ? <CollapseIcon /> : <ExpandIcon />}

        <div className={`nav-item--title`}>
          {isManualExpanded
            ? t("common:navigation.collapse", "Collapse")
            : t("common:navigation.expand", "Expand")}
        </div>
      </div>
    </Container>
  );
};

export default NavCollapse;
