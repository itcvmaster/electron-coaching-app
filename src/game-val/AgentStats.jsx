import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { AgentImage } from "@/game-val/CommonComponent.jsx";
import { calcAvgScore, getAgentImage, kdaColor } from "@/game-val/utils.mjs";
import ProfileShowMore from "@/shared/ProfileShowMore.jsx";
import {
  ListContainer,
  Row,
  RowContainer,
  StatLeft,
  StatRight,
} from "@/shared/ProfileStats.style.jsx";
import { displayRate } from "@/util/helpers.mjs";

const AgentStatsLoader = () => "";
const DEFAULT_SHOWN = 3;

const AgentStats = ({ agentStats, allAgents }) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const AgentRow = (agent, i) => {
    const agentId = agent[0];
    const { wins, matches, ties, kills, deaths, score, roundsPlayed } =
      agent[1];
    const kd = (kills / deaths).toFixed(2);
    const losses = matches - ties - wins;
    const winRate = displayRate(wins, matches, ties);
    const agentName =
      allAgents.find((agentObj) => agentObj.id === agentId)?.name || null;
    const combatScore = calcAvgScore(score, roundsPlayed);
    const agent_image = getAgentImage(agentName);
    return (
      <RowContainer key={i}>
        <Row>
          <AgentImage src={agent_image} />
          <StatLeft>
            <p className="type-subtitle2 name">
              {t("val:agentName", "{{agentName}}", { agentName: agentName })}
            </p>
            <p className="type-caption sub-stat">
              {t("val:combatScore", "{{combatScore}} Combat Score", {
                combatScore: combatScore,
              })}
            </p>
          </StatLeft>
          <StatRight>
            <span className="type-subtitle2 win-loss">
              {t("val:nWinAndnLosses", "{{wins}} - {{losses}}", {
                wins: wins,
                losses: losses,
              })}
            </span>
            &nbsp;
            <span className="type-subtitle2 win-loss-rate">
              {t("val:winPercent", `{{winPercent}}`, { winPercent: winRate })}
            </span>
            <p
              className="type-caption sub-stat match-kd"
              style={{ color: kdaColor(kd) }}
            >
              {t("val:kd", "{{kd}} KD", { kd: kd })}
            </p>
          </StatRight>
        </Row>
      </RowContainer>
    );
  };

  const setShowMore = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll]);

  let renderedList = agentStats
    ? Object.entries(agentStats).sort((a, b) => b[1].matches - a[1].matches)
    : null;

  if (!showAll) {
    renderedList = renderedList?.slice(0, DEFAULT_SHOWN);
  }
  return (
    <>
      {!agentStats ? (
        <>
          {[...Array(5)].map((e, i) => (
            <AgentStatsLoader key={i} />
          ))}
        </>
      ) : (
        <>
          <ListContainer>{renderedList.map(AgentRow)}</ListContainer>
          <div style={{ padding: "var(--sp-6)", paddingTop: "var(--sp-0)" }}>
            {Object.keys(agentStats)?.length > DEFAULT_SHOWN ? (
              <ProfileShowMore showAll={showAll} setShowMore={setShowMore} />
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default AgentStats;
