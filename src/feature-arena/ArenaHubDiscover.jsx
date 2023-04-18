import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import CompCarousel from "@/feature-arena/CompCarousel.jsx";
import CompEventCard from "@/feature-arena/CompEventCard.jsx";
import CompEventSection from "@/feature-arena/CompEventSection.jsx";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { useGameSymbol } from "@/util/game-route.mjs";

const ArenaHubDiscover = () => {
  const gameSymbol = useGameSymbol();
  const { t } = useTranslation();
  const {
    arena: { eventList },
  } = useSnapshot(readState);

  if (eventList instanceof Error) {
    return (
      <ErrorComponent
        description={t("arena:failedEvents", "Fetching events failed.")}
      />
    );
  }

  const events = eventList.filter(
    ({ game }) => gameSymbol === undefined || game === gameSymbol
  );

  const timeFilter = ({ startAt, endAt }) =>
    startAt < new Date() && endAt > new Date();

  const featuredEvents = events.filter(({ featuredInHub }) => featuredInHub);
  // .filter(timeFilter);

  return (
    <Container>
      {featuredEvents.length > 0 && (
        <>
          {/* <SubTitle className="type-subtitle1">
            {t("arena:featuredEvents", "Featured Events")}
          </SubTitle> */}
          <CompCarousel>
            {featuredEvents.map((event, index) => (
              <CompEventCard key={index} event={event} isInCarousel />
            ))}
          </CompCarousel>
        </>
      )}
      <CompEventSection
        title={t("arena:section.browseEvent", "Browse Events")}
        events={events.filter(timeFilter)}
      />
    </Container>
  );
};

export default ArenaHubDiscover;

const Container = styled("div")`
  margin: auto;
  width: var(--sp-container);
`;

// const SubTitle = styled("div")`
//   color: var(--shade0);
//   font-size: var(--sp-5);
//   margin-bottom: var(--sp-4);
//   margin-top: var(--sp-10);
// `;
