import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import ArenaHubDiscover from "@/feature-arena/ArenaHubDiscover.jsx";
import ArenaHubYours from "@/feature-arena/ArenaHubYours.jsx";
import FilterNavigation from "@/feature-arena/CompFilterNavigation.jsx";
import { Container, Space } from "@/feature-arena/CompGeneral.jsx";
import { TABS_HUB } from "@/feature-arena/m-constants.mjs";
import PageHeader from "@/shared/PageHeader.jsx";
import { useGameSymbol } from "@/util/game-route.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const extra = [
  {
    label: ["arena:tab.discover", "Discover"],
    component: ArenaHubDiscover,
  },
  {
    label: ["arena:tab.yourEvents", "Your Events"],
    component: ArenaHubYours,
  },
];

const tabs = TABS_HUB.map((tab, i) => ({ tab, ...extra[i] }));

function ArenaHub() {
  const {
    parameters: [tab],
  } = useRoute();
  const { t } = useTranslation();
  const gameSymbol = useGameSymbol();
  const basePath = gameSymbol ? `/${GAME_SHORT_NAMES[gameSymbol]}` : "";

  const { component: TabComponent } = tabs.find(({ tab: t }) => t === tab);

  return (
    <Container>
      <PageHeader
        title={t("arena:arenaHub", "Arena Hub")}
        links={tabs.map(({ tab, label }) => ({
          url: `${basePath}/arena/${tab}`,
          text: t(...label),
        }))}
      >
        <FilterContainer>
          <FilterNavigation />
        </FilterContainer>
      </PageHeader>
      <Splitter />
      <TabComponent />
      <Space height="var(--sp-20)" />
    </Container>
  );
}

export function meta() {
  return {
    title: ["arena:title", "Blitz Arena"],
    description: [
      "arena:description",
      "Participate in in-game challenges to earn prizes.",
    ],
  };
}

export default ArenaHub;

const FilterContainer = styled("div")`
  margin: var(--sp-8) 0;
`;

const Splitter = styled("div")`
  width: 100%;
  height: 1px;
  background-color: var(--shade6);
`;
