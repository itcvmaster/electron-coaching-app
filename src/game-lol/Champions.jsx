import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "clutch";

import ChampionsCombat from "@/game-lol/ChampionsCombat.jsx";
import ChampionsObjectives from "@/game-lol/ChampionsObjectives.jsx";
import ChampionsOverview from "@/game-lol/ChampionsOverview.jsx";
import ChampionsSynergies from "@/game-lol/ChampionsSynergies.jsx";
import Statistics from "@/inline-assets/statistics.svg";
import Container from "@/shared/ContentContainer.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const TABS = {
  overview: {
    component: <ChampionsOverview />,
    url: "/lol/champions/overview",
    icon: <Statistics />,
    title: {
      key: "lol:championsPage.tabs.overview",
      value: "Overview",
    },
  },
  synergies: {
    component: <ChampionsSynergies />,
    url: "/lol/champions/synergies",
    icon: <Statistics />,
    title: {
      key: "lol:championsPage.tabs.synergies",
      value: "Synergies",
    },
  },
  objectives: {
    component: <ChampionsObjectives />,
    url: "/lol/champions/objectives",
    icon: <Statistics />,
    title: {
      key: "lol:championsPage.tabs.objectives",
      value: "Objectives",
    },
  },
  combat: {
    component: <ChampionsCombat />,
    url: "/lol/champions/combat",
    icon: <Statistics />,
    title: {
      key: "lol:championsPage.tabs.combat",
      value: "Combat",
    },
  },
};

function Champions() {
  const { t } = useTranslation();
  const {
    parameters: [tab],
  } = useRoute();
  const currTab = TABS[tab];

  if (!currTab) return <h1>{tab}</h1>;

  return (
    <>
      <PageHeader
        title={t(currTab.title.key, currTab.title.value)}
        icon={currTab.icon}
        links={Object.values(TABS).map((tab) => ({
          url: tab.url,
          text: t(tab.title.key, tab.title.value),
        }))}
      />
      <Container>
        <Card>{currTab.component && currTab.component}</Card>
      </Container>
    </>
  );
}

export function meta(tabs) {
  const tabName = tabs.length ? ` - ${tabs[0]}` : "";
  const descriptionInfo = tabs.length
    ? ` ${tabs[0]} level.}`
    : ` Combat, Objectives and Synergies level.`;

  return {
    title: [
      `lol:champions`,
      `LoL Champion Guides, Builds, Probuilds, Stats, Runes, Counters {{tabName}} – Blitz LoL`,
      { tabName },
    ],
    description: [
      `lol:champions`,
      `Blitz powers real time statistics on League of Legends across all regions! Check out LoL Stats on the {{descriptionInfo}}`,
      { descriptionInfo },
    ],
  };
}

export default Champions;
