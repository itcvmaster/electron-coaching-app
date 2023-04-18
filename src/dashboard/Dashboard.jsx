import React from "react";
import { useTranslation } from "react-i18next";

import {
  GAME_ACTIVE_MAP,
  GAME_NAME_MAP,
  GAME_SHORT_NAMES,
  GAME_SYMBOL_LOL,
} from "@/app/constants.mjs";
import DashboardAll from "@/dashboard/DashboardAll.jsx";
import DashboardLoL from "@/dashboard/DashboardLoL.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const tabComponents = {
  [GAME_SHORT_NAMES[GAME_SYMBOL_LOL]]: DashboardLoL,
};

function Dashboard() {
  const { t } = useTranslation();
  const {
    parameters: [tab],
  } = useRoute();
  const games = Object.getOwnPropertySymbols(GAME_SHORT_NAMES)
    .map((gameSymbol) => {
      if (!GAME_ACTIVE_MAP[gameSymbol]) return null;
      return {
        url: `/dashboard/${GAME_SHORT_NAMES[gameSymbol]}`,
        text: t(...GAME_NAME_MAP[gameSymbol]),
      };
    })
    .filter(Boolean);

  const TabComponent = tabComponents[tab] || DashboardAll;

  return (
    <>
      <PageHeader
        title={t("common:navbar.dashboard", "Dashboard")}
        links={[
          {
            url: "/dashboard",
            text: t("common:allGames", "All Games"),
          },
          ...games,
        ]}
      />
      <TabComponent />
    </>
  );
}

export function meta() {
  return {
    title: ["common:blitz", "Blitz App - Your personal gaming coach"],
    description: ["home:downloadLanding.description", "Play smart."],
  };
}

export default Dashboard;
