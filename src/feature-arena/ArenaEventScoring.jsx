import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { ScoringItem } from "@/feature-arena/CompEventItems.jsx";
import EventExtraPanel from "@/feature-arena/CompExtraPanel.jsx";
import { Board, Container } from "@/feature-arena/CompGeneral.jsx";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { useIsLoaded, useRoute } from "@/util/router-hooks.mjs";

const ArenaEventScoring = () => {
  const {
    parameters: [id],
  } = useRoute();

  const state = useSnapshot(readState);
  const { eventDetails } = state.arena;
  const event = eventDetails?.[id];
  const { t } = useTranslation();
  const isLoaded = useIsLoaded();

  const showError =
    isLoaded instanceof Error || (isLoaded && event.missions.length === 0);

  return (
    <Container $row>
      <EventExtraPanel />
      <MainPanel>
        {Boolean(event?.gameMode) && (
          <HeaderScoringTile>
            <span>{event?.gameMode} </span>
          </HeaderScoringTile>
        )}
        <Header>
          <SubTitle className="type-subtitle1">
            {t("arena:event.playLimit", "Play Limit")}
          </SubTitle>
          <Text className="type-body2">
            {t(
              "arena:event.scoring.description",
              "You may play up to {{count}} games that will count towards this Challenge. These qualifying games may occur at any time while the Challenge is live. Good luck!",
              { count: event?.gameLimit }
            )}
          </Text>
        </Header>
        <ItemContainer>
          {event?.missions?.map((item, index) => (
            <ScoringItem key={index} {...item} />
          ))}

          {showError && (
            <ErrorContainer>
              <ErrorComponent
                description={t("arena:error.noScoringData", "No Scoring Data.")}
              />
            </ErrorContainer>
          )}
        </ItemContainer>
      </MainPanel>
    </Container>
  );
};

export default ArenaEventScoring;

const MainPanel = styled("div")`
  width: 672px;
  margin: var(--sp-7) 0;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled("div")`
  color: var(--shade0);
`;

const Text = styled("div")`
  color: var(--shade1);
  margin-top: var(--sp-2);
`;

const Header = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br) var(--br) 0 0;
  padding: var(--sp-4_5) var(--sp-6);
  margin-bottom: var(--sp-0_5);
`;

const HeaderScoringTile = styled("div")`
  display: flex;
  align-items: center;
  height: var(--sp-14);
  position: relative;
  background: rgba(48, 217, 212, 0.15);
  padding: var(--sp-3_5) 0 var(--sp-3_5) var(--sp-6);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);

  span {
    font-family: Inter;
    font-weight: bold;
    font-size: var(--sp-3_5);
    line-height: var(--sp-6);
    color: var(--turq);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: var(--turq);
    border-radius: var(--sp-1) 0 0 var(--sp-1);
    width: var(--br-sm);
  }
`;

const ItemContainer = styled("div")`
  > div:last-child {
    border-radius: 0 0 var(--br) var(--br);
  }
`;

const ErrorContainer = styled(Board)`
  height: 28rem;
  align-items: center;
  justify-content: center;
`;
