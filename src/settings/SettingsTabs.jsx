import React from "react";
import { useTranslation } from "react-i18next";

import {
  GAME_COLORS,
  GAME_ICON_SHAPES,
  GAME_SYMBOL_LOL,
} from "@/app/constants.mjs";
import { settingsTabs } from "@/routes/settings.mjs";
import { TabButton, TabsRow } from "@/settings/SettingsTabs.style.jsx";
import { IS_APP } from "@/util/dev.mjs";

function SettingsTabs({ activeTab }) {
  const { t } = useTranslation();
  const gameSelectTabs = [
    {
      key: settingsTabs.GENERAL,
      text: t("common:settings.allSettings", "All Settings"),
    },
    IS_APP && {
      key: settingsTabs.LOL,
      Icon: GAME_ICON_SHAPES[GAME_SYMBOL_LOL],
      text: t("common:settings.lol", "League of Legends"),
      color: GAME_COLORS[GAME_SYMBOL_LOL],
    },
  ];

  return (
    <TabsRow>
      {gameSelectTabs.filter(Boolean).map(({ key, Icon, text, color }) => (
        <TabButton
          className={`${key === activeTab ? "selected" : ""} type-form--button`}
          key={key}
          href={`/settings/${key}`}
          $gameColor={color}
        >
          {Icon && <Icon />}
          {text}
        </TabButton>
      ))}
    </TabsRow>
  );
}

export default SettingsTabs;
