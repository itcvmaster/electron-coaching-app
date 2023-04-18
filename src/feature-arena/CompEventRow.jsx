import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { GAME_SHORT_NAMES } from "@/app/constants.mjs";
import getGameIcon from "@/app/get-game-icon.mjs";
import { Board } from "@/feature-arena/CompGeneral.jsx";
import { TimeRelative } from "@/shared/Time.jsx";

const EventRow = ({ event }) => {
  const { t } = useTranslation();
  const LogoIcon = getGameIcon(event.game);
  const shortName = GAME_SHORT_NAMES[event.game];

  return (
    <Container
      className={`${event.endAt > Date.now() ? "past" : ""}`}
      href={`/${shortName}/arena/${event.id}/overview`}
    >
      <MainColumn>
        {Boolean(LogoIcon) && <LogoIcon className="logo" />}
        <CardHeaderContent>
          <SubTitle className="type-subtitle1">
            {event.displayName || event.title}
          </SubTitle>
          <Text className="type-caption">{event.topGames}</Text>
          <GradientCover id="gradient" />
        </CardHeaderContent>
      </MainColumn>

      <Column>
        <SubTitle
          className={`type-subtitle2 ${
            event.startAt < Date.now() ? "soon" : "live"
          }`}
        >
          {event.startAt > Date.now() ? (
            t("arena:event.live", "Live")
          ) : (
            <TimeRelative date={event.startAt} />
          )}
        </SubTitle>
      </Column>

      <Column>
        <Text className="type-caption">
          <TimeRelative date={event.endAt} />
        </Text>
      </Column>

      <Column id="registered">
        <SubTitle className="type-subtitle2">{event.participantCount}</SubTitle>
      </Column>

      <Column>
        <SubTitle className="type-subtitle2">{event.totalPrizePool}</SubTitle>
      </Column>

      <Column id="fee-container">
        <SubTitle id="fee" className="type-subtitle2">
          {/*t("arena:event.free", "Free")*/}
          {"-"}
        </SubTitle>
        <SubTitle id="detail" className="type-subtitle2">
          {t("arena:event.details", "Details")}
        </SubTitle>
      </Column>
    </Container>
  );
};

export default EventRow;

const Container = styled("a")`
  border-radius: var(--br);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  height: var(--sp-16);
  margin: var(--sp-1) 0;
  box-shadow: inset 0px 1px 0px rgba(227, 229, 234, 0.05);

  #detail {
    display: none;
  }
  &:hover #detail {
    display: flex;
  }
  &:hover #fee {
    display: none;
  }
  &:hover #fee-container {
    background-color: var(--primary);
    cursor: pointer;
  }
  #fee-container {
    justify-content: center;
  }
  &:hover > div {
    background-color: var(--shade6);
  }
  &:hover #gradient {
    background: linear-gradient(
      90deg,
      #272a3000 0.11%,
      #272a3077 90.22%,
      #272a30 100.11%
    );
  }
  .logo {
    width: var(--sp-7_5);
    height: var(--sp-7_5);
  }

  &.past {
    &:hover #detail {
      display: none;
    }
    &:hover #fee {
      display: flex;
    }
    &:hover #fee-container {
      background-color: var(--shade6);
      cursor: auto;
    }
  }
`;

const CardHeaderContent = styled("div")`
  margin-left: var(--sp-5);
  position: relative;
  flex: 1;
  overflow: hidden;
  margin-right: var(--sp-5);
`;

const GradientCover = styled("div")`
  background: linear-gradient(
    90deg,
    transparent 0%,
    transparent 90%,
    var(--shade7) 100%
  );
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const MainColumn = styled(Board)`
  flex: 1;
  padding-left: var(--sp-4);
`;

const Column = styled(Board)`
  width: var(--sp-24);
  padding: 0 var(--sp-2);
  #fee-container {
    padding: 0;
    justify-content: center;
  }
`;

const SubTitle = styled("div")`
  color: var(--shade0);
  white-space: nowrap;
  &.live {
    color: var(--primary);
  }
  &.soon {
    color: var(--turq);
  }
`;
const Text = styled("div")`
  color: var(--shade1);
`;
