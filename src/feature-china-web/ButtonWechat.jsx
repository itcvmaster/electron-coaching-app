import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "clutch";

import WechatLogo from "@/inline-assets/wechat-logo-icon.svg";

const EmailButton = () => {
  const { t } = useTranslation();

  return (
    <Button
      href={"/auth"}
      text={t("common:weixin.loginToWeChat", "微信登录")}
      iconLeft={<WechatLogo />}
    />
  );
};

export default EmailButton;
