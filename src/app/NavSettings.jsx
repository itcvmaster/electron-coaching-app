import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import SettingsIcon from "@/inline-assets/gear.svg";
import { settingsRoute } from "@/routes/settings.mjs";
import { useTransientRoute } from "@/util/router-hooks.mjs";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-3);
`;

const NavSettings = () => {
  const { t } = useTranslation();
  const { currentPath } = useTransientRoute();
  const isMatch = settingsRoute.path.test(currentPath);

  return (
    <Container>
      <a className={`nav-item ${isMatch ? "active" : ""}`} href="/settings">
        <SettingsIcon />
        <p className={`nav-item--title`}>
          {t("common:settings.settings", "Settings")}
        </p>
      </a>
    </Container>
  );
};

export default NavSettings;
