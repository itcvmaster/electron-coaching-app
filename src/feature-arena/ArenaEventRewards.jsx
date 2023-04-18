import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { RewardItem } from "@/feature-arena/CompEventItems.jsx";
import EventExtraPanel from "@/feature-arena/CompExtraPanel.jsx";
import { Board, Container } from "@/feature-arena/CompGeneral.jsx";
import { extractTopRewards } from "@/feature-arena/m-utils.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { useIsLoaded, useRoute } from "@/util/router-hooks.mjs";

const ArenaEventRewards = () => {
  const {
    parameters: [id],
  } = useRoute();

  const state = useSnapshot(readState);
  const { eventDetails } = state.arena;
  const event = eventDetails?.[id];
  const { t } = useTranslation();
  const isLoaded = useIsLoaded();

  const rewards = extractTopRewards(event?.rewards, 10);
  const showError =
    isLoaded instanceof Error || (isLoaded && rewards.length === 0);

  return (
    <Container $row>
      <EventExtraPanel />
      <MainPanel>
        <Header>
          <SubTitle className="type-subtitle1">
            {t("arena:event.rewards", "Rewards")}
          </SubTitle>
        </Header>
        <ItemContainer>
          {rewards?.map((item, index) => (
            <RewardItem key={index} {...item} />
          ))}

          {showError && (
            <ErrorContainer>
              <ErrorComponent
                description={t("arena:error.noRewardsData", "No Rewards Data.")}
              />
            </ErrorContainer>
          )}
        </ItemContainer>
      </MainPanel>
    </Container>
  );
};

export default ArenaEventRewards;

const MainPanel = styled("div")`
  width: 672px;
  margin: var(--sp-7) 0;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled("div")`
  color: var(--shade0);
`;

const Header = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br) var(--br) 0 0;
  padding: var(--sp-4_5) var(--sp-6);
  margin-bottom: var(--sp-0_5);
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
