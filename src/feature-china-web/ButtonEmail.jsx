import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "clutch";

import HeaderProfileIcon from "@/inline-assets/header-profile.svg";

const EmailButtonWrapper = () => {
  const route = "";
  const { t } = useTranslation();

  return (
    <Button
      href={route}
      text={t("common:placeholders.emailLogin", "邮箱登录")}
      iconLeft={<HeaderProfileIcon />}
      bgColor="var(--shade-8)"
      noHighlight
    />
  );
};

export default EmailButtonWrapper;
