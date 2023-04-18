import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { css, styled } from "goober";

import { Card } from "clutch";

import { formatDuration } from "@/app/util.mjs";
import MatchTimeline from "@/game-lol/MatchTimeline.jsx";

const textImg = css`
  display: inline-block;
  margin-bottom: calc(var(--sp-1) * -1);
  margin-left: var(--sp-1);
  font-size: var(--sp-5);
  color: var(--shade2);
`;
const TimelineItemTitle = styled("p")`
  color: var(--shade1);
`;
const TimelineItemBar = styled("div")`
  margin-right: var(--sp-2);
  margin-top: var(--sp-1);
  align-items: center;
  display: flex;
  flex-direction: column;

  .dot {
    width: var(--sp-2);
    height: var(--sp-2);
    background: hsla(var(--match-color) / 1);
    border: 2px solid var(--shade7);
    border-radius: 50%;
  }
  .bar {
    width: var(--sp-0_5);
    min-height: 50px;
    flex: 1;
    background: hsla(var(--match-color) / 0.15);
  }
`;

const ScrollingTimeline = styled("div")`
  display: flex;
  height: 360px;
  overflow: auto;
  flex-direction: column;
  &::-webkit-scrollbar-thumb {
    background-color: var(--shade6);
    border: 4px solid var(--shade7);
  }
`;
const TimelineItem = ({ item, match, currParticipant, t }) => {
  const { participants } = match;
  const isKiller = item.killerId === currParticipant.participantId;
  const isVictim = item.victimId === currParticipant.participantId;

  const content = MatchTimeline({
    t,
    item,
    isKiller,
    isVictim,
    playerChampionID: currParticipant.championId,
    playerChampionKey: currParticipant.championName,
    participants,
    textImg,
  });

  if (!content) return null;

  return (
    <div className="flex">
      <TimelineItemBar
        style={{
          "--match-color": isVictim ? "var(--red-hsl)" : "var(--blue-hsl)",
        }}
      >
        <div className="dot" />
        <div className="bar" />
      </TimelineItemBar>
      <div>
        <TimelineItemTitle className="type-caption--bold">
          {t("common:minutes", "{{minutes}} mins", {
            minutes: (formatDuration(item.timestamp, "ss") / 60).toFixed(0),
          })}
        </TimelineItemTitle>
        {content}
      </div>
    </div>
  );
};

const PostMatchTimeline = ({ timeline, match, currParticipant }) => {
  const { t } = useTranslation();
  if (!timeline || !currParticipant) return null;

  const eventsData = timeline.frames.reduce((allEvents, frame) => {
    const { events } = frame;
    const yourEvents = events.filter((event) => {
      return (
        (event.type === "CHAMPION_KILL" &&
          [
            event.killerId,
            event.victimId,
            ...(event.assistingParticipantIds || []),
          ].includes(currParticipant.participantId)) ||
        (event.type === "BUILDING_KILL" &&
          [event.killerId, ...(event.assistingParticipantIds || [])].includes(
            currParticipant.participantId
          )) ||
        (event.type === "ELITE_MONSTER_KILL" &&
          [event.killerId].includes(currParticipant.participantId)) ||
        (event.type === "WARD_PLACED" &&
          [event.creatorId].includes(currParticipant.participantId) &&
          ["YELLOW_TRINKET", "CONTROL_WARD"].includes(event.wardType))
      );
    });
    return [...allEvents, ...yourEvents];
  }, []);

  return (
    <Card
      title={t("lol:postmatch.yourMatchTimeline", "Your Match Timeline")}
      padding="1.5rem 0.5rem 1.5rem 1.5rem"
    >
      <ScrollingTimeline>
        {eventsData.map((item, i) => {
          return (
            <div
              key={`${currParticipant?.puuid}-${i}` || i}
              style={{ paddingRight: "var(--sp-2)" }}
            >
              <TimelineItem
                item={item}
                currParticipant={currParticipant}
                match={match}
                t={t}
              />
            </div>
          );
        })}
      </ScrollingTimeline>
    </Card>
  );
};

export default withTranslation(["lol"])(PostMatchTimeline);
