import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button, mobile } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { authTokenHandler } from "@/feature-auth/auth-token-handler.mjs";
import { IS_APP } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";

const Wrap = styled("div")`
  position: fixed;
  display: flex;
  align-items: center;
  left: 50%;
  transform: translate(-50%);
  bottom: var(--sp-3);
  color: inherit;
  padding: 12px 8px 12px var(--sp-4);
  transition: var(--transition);
  background: var(--shade10);
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.5);
  border-radius: var(--br);
  z-index: 11;
  width: 526px;

  ${mobile} {
    display: none;
  }
`;

const WrapLeft = styled("div")`
  display: flex;
  padding-right: var(--sp-4);
  align-items: center;
`;
const WrapRight = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-right: 8px;
  }
  flex: 0 0 218px;
`;

const WaveEmoji = styled("i")`
  font-size: var(--sp-7);
  font-style: normal;
  margin-right: var(--sp-4);
`;

export function LoginToApp() {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const user = state.user;
  const [isHidden, setIsHidden] = useState(!user || IS_APP);

  const openInApp = async () => {
    if (!IS_APP) {
      const token = await authTokenHandler.getToken();
      const tokenExpiry = await authTokenHandler.getTokenExpiry();
      if (token && tokenExpiry) {
        globals.open(
          `blitz://authenticate?token=${encodeURIComponent(
            token
          )}&&tokenExpiry=${encodeURIComponent(tokenExpiry)}`
        );
      } else {
        globals.open(`blitz://openHome`);
      }
    }
  };

  const hidePopup = () => {
    setIsHidden(true); // TODO: needs to be stored pernamently later.
  };

  return !isHidden ? (
    <Wrap>
      <WrapLeft>
        {/* eslint-disable-next-line */}
        <WaveEmoji>👋</WaveEmoji>
        <div className="type-caption">
          {t(
            "common:signup.wantToOpenInApp",
            "You know we have a Desktop App, right? Would you like to open up the app now?"
          )}
        </div>
      </WrapLeft>
      <WrapRight>
        <Button
          onClick={openInApp}
          bgColor="var(--primary)"
          textColor="var(--white)"
        >
          {t("common:signup.openInApp", "Open In App")}
        </Button>
        <Button
          emphasis="high"
          bgColor="transparent"
          textColor="var(--shade3)"
          bgColorHover="var(--shade9)"
          textColorHover="var(--shade2)"
          onClick={hidePopup}
        >
          {t("common:signup.dismiss", "Dismiss")}
        </Button>
      </WrapRight>
    </Wrap>
  ) : null;
}
