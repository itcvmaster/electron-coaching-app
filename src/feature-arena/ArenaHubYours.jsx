import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { SymbolGame } from "@/app/symbol-game.mjs";
import EmptySection from "@/feature-arena/CompEmptySection.jsx";
import EventSection from "@/feature-arena/CompEventSection.jsx";
import { useIsLoaded } from "@/util/router-hooks.mjs";

const ArenaHubYours = ({ gameSymbol }) => {
  const { t } = useTranslation();

  const state = useSnapshot(readState);
  const joinResult = state.arena.joinResult || {};
  const isLoaded = useIsLoaded();

  const allEvents = state.arena.eventList || [];
  const hasJoined = (id) =>
    joinResult[id] !== undefined && !(joinResult[id] instanceof Error);

  const gameFilter = (event) =>
    gameSymbol === undefined || SymbolGame(event.game) === gameSymbol;

  const liveEvents = allEvents
    .filter((o) => (o.optedIn || hasJoined(o.id)) && o.start?.type === "LIVE")
    .filter(gameFilter);
  const registeredEvents = allEvents
    .filter(
      (o) =>
        (o.optedIn || hasJoined(o.id)) &&
        (o.start?.type === "SOON" || o.start?.type === "LONG")
    )
    .filter(gameFilter);
  const pastEvents = allEvents
    .filter((o) => (o.optedIn || hasJoined(o.id)) && o.start?.type === "PAST")
    .filter(gameFilter);

  // Error handling for not logged in and not loaded.
  // For not registered or gql error, it has been setup already.
  if (!state.user) return <EmptySection type="NotLoggedIn" />;
  if (isLoaded === false) return null;

  return (
    <Container>
      {liveEvents.length + registeredEvents.length > 0 ? (
        <>
          <EventSection
            title={t("arena:section.live", "Live Now")}
            events={liveEvents}
            countPerPage={6}
          />

          <EventSection
            title={t("arena:section.registered", "Registered Events")}
            events={registeredEvents}
            countPerPage={6}
          />
        </>
      ) : (
        <EmptySection type="NoEvents" />
      )}

      <EventSection
        title={t("arena:section.past", "Past Events")}
        events={pastEvents}
        countPerPage={6}
        isPast
      />
    </Container>
  );
};

export default ArenaHubYours;

const Container = styled("div")``;
