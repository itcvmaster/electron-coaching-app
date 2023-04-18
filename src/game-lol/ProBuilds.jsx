import React from "react";
import { useTranslation } from "react-i18next";

import History from "@/game-lol/ProBuildsHistory.jsx";
import Live from "@/game-lol/ProBuildsLive.jsx";
import ProBuildsIcon from "@/inline-assets/pro-builds-icon.svg";
import Container from "@/shared/ContentContainer.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const TABS = {
  history: {
    component: History,
    url: "/lol/probuilds/history",
    text: "Match History",
    title: {
      key: "lol:matchhistory",
      value: "Match History",
    },
  },
  live: {
    component: Live,
    url: "/lol/probuilds/live",
    title: {
      key: "lol:liveNow",
      value: "Live Now",
    },
  },
};

const ProBuilds = () => {
  const { t } = useTranslation();
  const {
    parameters: [tabKey],
  } = useRoute();

  const tab = tabKey || "history";

  // Default tab is Performance
  const currTab = TABS[tab] || TABS.history;
  const CurrContent = currTab.component;

  return (
    <>
      <PageHeader
        title={t("lol:proBuilds", "Pro builds")}
        icon={<ProBuildsIcon />}
        links={Object.values(TABS).map((tab) => ({
          url: tab.url,
          text: t(tab.title.key, tab.title.value),
        }))}
      />
      <Container>
        <CurrContent />
      </Container>
    </>
  );
};

export default ProBuilds;

export function meta() {
  return {
    title: [
      "lol:helmet.probuilds.title",
      "LoL Probuilds, Best Comps, Items, Summoner Spells, and Runes – Blitz LoL",
    ],
    description: [
      "lol:helmet.probuilds.description",
      "The latest Pro Player Builds, Profiles, Stats, Leaderboards, Ranking, TFT Databases, CheatSheet, Synergies, Builder, Guide, Items, Champion Stats for League of Legends.",
    ],
  };
}
