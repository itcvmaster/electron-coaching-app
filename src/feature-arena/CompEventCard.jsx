import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import getGameIcon from "@/app/get-game-icon.mjs";
import { Board } from "@/feature-arena/CompGeneral.jsx";
import CompJoinModal from "@/feature-arena/CompJoinModal.jsx";
import { showModal } from "@/feature-arena/m-actions.mjs";
import { getFullAssetsUrl } from "@/feature-arena/m-constants.mjs";
import SquareCheck from "@/inline-assets/SquareCheck.svg";
import { setRoute } from "@/root.mjs";
import { TimeRelative } from "@/shared/Time.jsx";
import { toDecimal } from "@/util/i18n-helper.mjs";

// TODO: This is a temporary code and should be replaced with featureFlags.blitzPro later.
const enableBlitzPro = false;
const IMAGE_HEIGHT = 230;

const CompEventCard = ({
  isInCarousel,
  event: {
    eventPageHeaderImg,
    game,
    title,
    displayName,
    participantCount,
    startAt,
    endAt,
    optedIn,
    totalPrizePool,
    topGames,
    id,
  },
}) => {
  const state = useSnapshot(readState);
  const { t } = useTranslation();
  const Logo = getGameIcon(game);
  const shortName = GAME_SHORT_NAMES[game];
  const isLoggedIn = Boolean(state.user);

  const onJoin = () => {
    if (isInCarousel) {
      setRoute(`/${shortName}/arena/${id}/overview`);
    } else if (state.user) {
      showModal(
        () => (
          <CompJoinModal
            title={t("arena:termsTitle", "Terms & Conditions")}
            eventId={id}
            gameSymbol={game}
          />
        ),
        { backdrop: false }
      );
    } else {
      setRoute("/account");
    }
  };

  const hasJoined = () => {
    const joinResult = state.arena.joinResult || {};
    return joinResult[id] !== undefined && joinResult[id] instanceof Error;
  };

  return (
    <Container>
      <CardImage src={getFullAssetsUrl(eventPageHeaderImg)} />
      <CardHeader>
        <GameIconContainer>{Boolean(Logo) && <Logo />}</GameIconContainer>
        <CardHeaderContent>
          <Title className="type-h6">{displayName || title}</Title>
          <Text className="type-caption">
            {t("arena:event.bestGames", "Best {{count}} Games", {
              count: toDecimal(topGames),
            })}
          </Text>
          <GradientCover id="gradient" />
        </CardHeaderContent>
      </CardHeader>
      <CardBody>
        <Cell>
          <SubTitle className="type-h6">{toDecimal(participantCount)}</SubTitle>
          <Text className="type-caption">
            {t("arena:event.registered", "Registered")}
          </Text>
        </Cell>

        <Cell>
          <SubTitle
            className={`type-h6 ${startAt < Date.now() ? "soon" : "live"}`}
          >
            {startAt > Date.now() ? (
              t("arena:event.live", "Live")
            ) : (
              <TimeRelative date={startAt} />
            )}
          </SubTitle>
          <Text className="type-caption">
            <TimeRelative date={endAt} />
          </Text>
        </Cell>

        <Cell>
          <SubTitle className="type-h6">
            {toDecimal(totalPrizePool || 0)}
          </SubTitle>
          <Text className="type-caption">
            {t("arena:event.prizePool", "Prize Pool")}
          </Text>
        </Cell>

        <Cell>
          <SubTitle className="type-h6">{"-"}</SubTitle>
          <Text className="type-caption" id="pro">
            {enableBlitzPro
              ? t("common:freeBlitzPro", "Free with Blitz Pro")
              : t("common:free", "Free")}
          </Text>
          <Text className="type-caption" id="entry">
            {t("arena:event.entryFee", "Entry Fee")}
          </Text>
        </Cell>

        <LastCell>
          {!(optedIn || hasJoined()) || isInCarousel ? (
            <Button
              text={
                isInCarousel
                  ? t("arena:event.details", "Details")
                  : isLoggedIn
                  ? t("arena:event.join", "Join Challenge")
                  : t("arena:event.login", "Log in to Join")
              }
              bgColor={"var(--primary)"}
              textColor={"var(--shade0)"}
              onClick={onJoin}
            />
          ) : (
            <GreenCell>
              <SquareCheck color={"var(--turq)"} />
              <GreenText className="type-form--button">
                {t("arena:event.youIn", "You're in!")}
              </GreenText>
            </GreenCell>
          )}
        </LastCell>
      </CardBody>
    </Container>
  );
};

export default CompEventCard;

const Container = styled("div")`
  border-radius: var(--sp-2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  #entry {
    display: none;
  }
`;

const CardImage = styled("img")`
  height: ${IMAGE_HEIGHT}px;
  width: 100%;
  object-fit: cover;
  background-color: rgba(100, 100, 100, 0.1);
`;

const CardHeader = styled(Board)`
  width: 100%;
  height: var(--sp-21);
  padding: 0 var(--sp-5);
  margin: var(--sp-0_5) 0;
`;

const CardBody = styled("div")`
  height: var(--sp-20);
  width: 100%;
  display: flex;
`;

const GameIconContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sp-12);
  height: var(--sp-12);
  background: var(--shade6-75);
  border-radius: var(--br);
`;

const CardHeaderContent = styled("div")`
  flex: 1;
  margin: 0 var(--sp-5);
  overflow: hidden;
  position: relative;
`;

const GradientCover = styled("div")`
  background: linear-gradient(
    90deg,
    transparent 0,
    transparent 90,
    var(--shade7) 100%
  );
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const Cell = styled(Board)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 var(--sp-5);
  margin-right: var(--sp-0_5);
`;

const LastCell = styled(Board)`
  padding: 0 var(--sp-5);
`;

const Title = styled("div")`
  white-space: nowrap;
  color: var(--shade0);
  font-size: var(--sp-5);
`;

const SubTitle = styled("div")`
  white-space: nowrap;
  color: var(--shade0);
  &.live {
    color: var(--primary);
  }
  &.soon {
    color: var(--turq);
  }
`;

const Text = styled("div")`
  color: var(--shade1);
  &#pro {
    font-weight: 600;
    color: var(--pro-solid);
  }
`;

const GreenCell = styled("div")`
  background: hsla(var(--turq-hsl) / 0.15);
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);
  border-radius: var(--br);
  padding: var(--sp-2_5) var(--sp-5);
  display: flex;
  align-items: center;
`;

const GreenText = styled("div")`
  color: var(--turq);
  margin-left: var(--sp-2_5);
`;
