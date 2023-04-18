import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { LeaderBoardItem } from "@/feature-arena/CompEventItems.jsx";
import EventExtraPanel from "@/feature-arena/CompExtraPanel.jsx";
import {
  Board,
  Container,
  DarkText,
  LightText,
} from "@/feature-arena/CompGeneral.jsx";
import {
  LEADERBOARD_FETCH_COUNT,
  LEADERBOARD_PAGE_SIZE as PAGE_SIZE,
} from "@/feature-arena/m-constants.mjs";
import { loadMoreLeaderboard } from "@/feature-arena/m-fetch-events.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { toPercent } from "@/util/i18n-helper.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const ArenaEventOverview = () => {
  const {
    parameters: [id],
  } = useRoute();

  const state = useSnapshot(readState);
  const { eventDetails } = state.arena;
  const event = eventDetails?.[id];
  const { t } = useTranslation();

  const topGames = event?.topGames || 0;
  const gameLimit = event?.gameLimit || 1;
  const playedGames = event?.optIn?.gameCount || 0;
  const userItem = event?.leaderboard?.find(
    (item) => item?.leagueProfile.accountId === state.user?.id
  );
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const onLoadMore = () => {
    const count = event?.leaderboard?.length || 0;
    if (count < displayCount + PAGE_SIZE) {
      loadMoreLeaderboard(event?.id, count + LEADERBOARD_FETCH_COUNT);
    }
    setDisplayCount(displayCount + PAGE_SIZE);
  };

  const hasNoItem = event?.leaderboard && event?.leaderboard.length === 0;
  const hasMore =
    event?.leaderboard && event?.leaderboard.length >= displayCount;

  return (
    <Container $row>
      <EventExtraPanel />
      <MainPanel>
        <OverviewTop>
          <SubTitle className="type-subtitle1">
            {t("arena:event.bestNGame.title", "Best N Games")}
          </SubTitle>
          <Text className="type-body2">
            {t(
              "arena:event.bestNGame.description",
              "Get points for your top {{X}} matches. You can play up to {{Y}} total games. If you play more than {{X}} games, new high-scoring games will replace the lowest-scoring games in your top {{X}}",
              { X: topGames, Y: gameLimit }
            )}
          </Text>
        </OverviewTop>

        {Boolean(userItem) && (
          <>
            <OverviewBot>
              <SubTitle className="type-subtitle1">
                {t("arena:event.gameLeft", "{{count}} Games Left", {
                  count: gameLimit - playedGames,
                })}
              </SubTitle>
              <ProgressBarContainer>
                <ProgressBarInfo>
                  <LightText className="type-caption">
                    {toPercent(playedGames)}
                  </LightText>
                  <DarkText className="type-caption">
                    {playedGames} / {gameLimit}
                  </DarkText>
                </ProgressBarInfo>
                <ProgressBar percent={(100 * playedGames) / gameLimit} />
              </ProgressBarContainer>
            </OverviewBot>
            <LeaderBoardItem {...userItem} round="all" />
          </>
        )}

        <ListContainer>
          <Header>
            <SubTitle className="type-subtitle1">
              {t("arena:event.leaderboard", "Leaderboard")}
            </SubTitle>
          </Header>

          {event?.leaderboard?.map(
            (item, index) =>
              index < displayCount && <LeaderBoardItem key={index} {...item} />
          )}

          {hasNoItem && (
            <ErrorContainer>
              <ErrorComponent
                description={t(
                  "arena:error.noLeaderboard",
                  "No Leaderboard Data."
                )}
              />
            </ErrorContainer>
          )}
        </ListContainer>

        {hasMore && (
          <LoadMore className="type-form--button" onClick={onLoadMore}>
            {t("common:more", "More")}
          </LoadMore>
        )}
      </MainPanel>
    </Container>
  );
};

export default ArenaEventOverview;

const MainPanel = styled("div")`
  width: 672px;
  margin: var(--sp-7) 0;
  display: flex;
  flex-direction: column;
`;

const OverviewTop = styled("div")`
  display: flex;
  flex-direction: column;
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br) var(--br) 0 0;
  padding: var(--sp-4_5) var(--sp-7);
  margin-bottom: var(--sp-0_5);
`;

const OverviewBot = styled(OverviewTop)`
  flex-direction: row;
  margin-bottom: var(--sp-4);
  align-items: center;
  border-radius: 0 0 var(--br) var(--br);
  justify-content: space-between;
`;

const Text = styled("div")`
  color: var(--shade1);
  margin-top: var(--sp-2);
`;

const SubTitle = styled("div")`
  color: var(--shade0);
`;

const Header = styled("div")`
  background: var(--shade7);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: ${({ $isfaq }) =>
    $isfaq ? "var(--br)" : "var(--br) var(--br) 0 0"};
  padding: var(--sp-4_5) var(--sp-6);
  margin-bottom: ${({ $isfaq }) => ($isfaq ? "var(--sp-4)" : "var(--sp-0_5)")};
`;

const ProgressBar = styled("div")`
  position: relative;
  height: var(--sp-1);
  width: 306px;
  border-radius: var(--sp-0_5);
  background-color: var(--shade4);
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.percent}%;
    height: 100%;
    background-color: ${(props) =>
      props.percent <= 25
        ? "#30D9D4"
        : props.percent <= 75
        ? "#FF9417"
        : "#DD344A"};
    border-radius: var(--sp-0_5);
  }
`;

const LoadMore = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: var(--sp-8);
  background: var(--shade6);

  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br);
  cursor: pointer;
  color: var(--shade1);
  margin-top: var(--sp-4);
`;

const ProgressBarContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ProgressBarInfo = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-1);
`;

const ErrorContainer = styled(Board)`
  height: 28rem;
  align-items: center;
  justify-content: center;
`;

const ListContainer = styled("div")`
  margin-top: var(--sp-4);
  > div:last-child {
    border-radius: 0 0 var(--br) var(--br);
  }
`;
