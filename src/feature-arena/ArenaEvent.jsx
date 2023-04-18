import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import ArenaEventFaq from "@/feature-arena/ArenaEventFaq.jsx";
import ArenaEventOverview from "@/feature-arena/ArenaEventOverview.jsx";
import ArenaEventRewards from "@/feature-arena/ArenaEventRewards.jsx";
import ArenaEventScoring from "@/feature-arena/ArenaEventScoring.jsx";
import ErrorNotification from "@/feature-arena/CompErrorNotification.jsx";
import CompEventCard from "@/feature-arena/CompEventCard.jsx";
import { Container } from "@/feature-arena/CompGeneral.jsx";
import { TABS_EVENT } from "@/feature-arena/m-constants.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { LoadingContainer } from "@/shared/InfiniteTable.style.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useGameSymbol } from "@/util/game-route.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const extra = [
  {
    label: ["arena:tab.overview", "Overview"],
    component: ArenaEventOverview,
  },
  {
    label: ["arena:tab.scoring", "Scoring"],
    component: ArenaEventScoring,
  },
  {
    label: ["arena:tab.rewards", "Rewards"],
    component: ArenaEventRewards,
  },
  {
    label: ["arena:tab.faq", "FAQ & Rules"],
    component: ArenaEventFaq,
  },
];

const tabs = TABS_EVENT.map((tab, i) => ({ tab, ...extra[i] }));

const ArenaEvent = () => {
  const {
    parameters: [id, tab],
  } = useRoute();

  const state = useSnapshot(readState);
  const { eventDetails } = state.arena;
  const event = eventDetails?.[id];
  const { t } = useTranslation();
  const game = useGameSymbol();
  const basePath = `/${GAME_SHORT_NAMES[game]}/arena/${id}/`;

  if (event instanceof Error) {
    return (
      <ErrorComponent description={t("arena:event.error", "Invalid event.")} />
    );
  }

  if (!event)
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );

  const { component: TabComponent, label } = tabs.find(
    ({ tab: t }) => t === tab
  );

  return (
    <Container>
      <PageHeader
        title={t(...label)}
        links={tabs.map(({ tab, label }) => ({
          url: `${basePath}${tab}`,
          text: t(...label),
        }))}
      >
        <CardContainer>
          <CompEventCard event={event} />
          <ErrorNotification id={id} />
        </CardContainer>
      </PageHeader>
      <TabComponent />
    </Container>
  );
};

export default ArenaEvent;

export function meta() {
  return {
    title: ["arena:title", "Blitz Arena"],
    description: [
      "arena:description",
      "Participate in in-game challenges to earn prizes.",
    ],
  };
}

const CardContainer = styled("div")`
  margin: var(--sp-7) 0;
`;
