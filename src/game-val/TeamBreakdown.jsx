import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { AgentImage, ScoreText } from "@/game-val/CommonComponent.jsx";
import { RANKS } from "@/game-val/constants.mjs";
import {
  calcAvgEconomyForMatch,
  getAgentImage,
  getAvgScore,
  getMatchPositionText,
  getPlayerIdType,
  getValorantRankImage,
} from "@/game-val/utils.mjs";
import { calcRate } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import orderBy from "@/util/order-array-by.mjs";

const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);
  --border-color: var(--turq);

  .col-position {
    flex: 0.2 1 0%;
    text-align: left;
  }

  .col-agent {
    display: flex;
    align-items: center;
    text-align: left;
    flex: 1.4 1 0%;
  }
  .gold-bar {
    width: var(--sp-1);
    height: var(--sp-13);
    background: var(--yellow);
    margin-right: var(--sp-3);
  }
  .col-score {
    white-space: nowrap;
    flex: 0.4 1 0%;
  }
  .col-kda {
    flex: 0.7 1 0%;
  }
  .col-economy {
    flex: 0.4 1 0%;
  }
  .col-fb {
    flex: 0.3 1 0%;
  }
  .col-plants {
    flex: 0.3 1 0%;
  }
  .col-defuses {
    flex: 0.35 1 0%;
  }

  .agent-img-container {
    box-sizing: border-box;
    margin-right: var(--sp-3);
    width: var(--sp-9);
    height: var(--sp-9);
    border-radius: var(--br);
    background: var(--border-color);

    img {
      border: var(--sp-0_5) solid var(--border-color);
    }
  }
  .rank-img-container {
    margin-right: var(--sp-3_5);
    width: var(--sp-5);
    height: var(--sp-6_5);
  }
`;

const TeamPanelContainer = styled("div")``;

const PlayerRow = styled("div")`
  display: flex;
  align-items: center;
  height: var(--sp-13);
  text-align: center;
  padding: ${(props) =>
    props.$isUser ? "0 var(--sp-4) 0 0" : "0 var(--sp-4)"};
  color: var(--shade1);
  height: var(--sp-13);
  --border-color: ${(props) => props.$color};
  --user-background: ${(props) => props.$background};

  background: ${(props) =>
    props.$background ? "var(--user-background)" : null};

  &:nth-child(even) {
    background: ${(props) =>
      props.$background ? "var(--user-background)" : "var(--shade8)"};
  }

  .player-name {
    color: ${(props) => (props.$isUser ? "#FCC668" : "var(--shade0)")};
  }
  .rank-name-container {
    display: flex;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .panel-title {
    color: var(--turq);
  }
`;

const Row = ({
  agentImg,
  title,
  competitiveTier,
  playerName,
  score,
  kda,
  econ,
  fb,
  plants,
  defuses,
  kpm,
  borderColor,
  isUser,
  isTitleRow = false,
  isDeathmatch,
  isEscalation,
  position,
  href,
}) => {
  const { t } = useTranslation();
  const rank = competitiveTier ? RANKS[competitiveTier]?.rank : null;
  const tier = competitiveTier ? RANKS[competitiveTier]?.tier : null;
  const rankImg = getValorantRankImage({ tier, rank });
  const background = isUser
    ? "linear-gradient(to left, rgba(239, 191, 108, 0) 0%, #efbf6c26 100%);"
    : null;

  const isDmType = isEscalation || isDeathmatch;
  const PlayerNameAndRank = () => {
    return (
      <>
        {!isTitleRow ? (
          <div className="agent-img-container">
            <AgentImage src={agentImg} />
          </div>
        ) : null}
        {tier && (
          <div className="rank-img-container">
            <AgentImage src={rankImg} />
          </div>
        )}
        <p className="type-subtitle2 player-name">{playerName}</p>
      </>
    );
  };
  return (
    <PlayerRow $color={borderColor} $background={background} $isUser={isUser}>
      <div className={isUser ? "gold-bar" : ""} />
      {isDeathmatch && !!position && (
        <div className="col-position">
          <p className="type-body2">{getMatchPositionText(t, position)}</p>
        </div>
      )}
      <div className="col-agent">
        <div>
          <span className="panel-title">{title ? title : null}</span>
          {href ? (
            <a href={href} className="rank-name-container">
              {PlayerNameAndRank()}
            </a>
          ) : (
            PlayerNameAndRank()
          )}
        </div>
      </div>
      <div className="col-score">
        <ScoreText
          className={isTitleRow ? "type-caption" : "type-body2"}
          $score={score}
        >
          {score}
        </ScoreText>
      </div>
      <div className="col-kda">
        <p className={isTitleRow ? "type-caption" : "type-body2"}>{kda}</p>
      </div>
      {isDmType ? null : (
        <div className="col-economy">
          <p className={isTitleRow ? "type-caption" : "type-body2"}>{econ}</p>
        </div>
      )}
      {isDmType ? null : (
        <div className="col-fb">
          <p className={isTitleRow ? "type-caption" : "type-body2"}>{fb}</p>
        </div>
      )}
      {isDmType ? null : (
        <div className="col-plants">
          <p className={isTitleRow ? "type-caption" : "type-body2"}>{plants}</p>
        </div>
      )}
      {isDmType ? null : (
        <div className="col-defuses">
          <p className={isTitleRow ? "type-caption" : "type-body2"}>
            {defuses}
          </p>
        </div>
      )}
      {isDmType ? (
        <div className="col-defuses">
          <p className={isTitleRow ? "type-caption" : "type-body2"}>{kpm}</p>
        </div>
      ) : null}
    </PlayerRow>
  );
};

const TeamBreakdown = ({
  currentPlayerStats,
  playerType,
  players,
  matchInfo,
  playersMatchStats,
  allAgents,
  isDeathmatch,
  isEscalation,
}) => {
  const { t } = useTranslation();

  const enemyTeam = players.filter(
    (p) => p.teamId !== currentPlayerStats.teamId
  );
  const myTeam = players.filter((p) => p.teamId === currentPlayerStats.teamId);

  const TeamPanel = ({ title, team, isDeathmatch, isEscalation }) => {
    return (
      <TeamPanelContainer>
        <Row
          title={title}
          score={t("val:avgScore", "Avg. Score")}
          kda={t("val:KDA", "KDA")}
          econ={t("val:Econ", "Econ")}
          fb={t("val:FB", "FB")}
          plants={t("val:Plants", "Plants")}
          defuses={t("val:Defuses", "Defuses")}
          kpm={t("common:killPerMinute", "kills/Min.")}
          isTitleRow
          isDeathmatch={isDeathmatch || isEscalation}
        />
        {team.map((p, index) => {
          const playerType = getPlayerIdType(p);
          const playerId = p[playerType];

          const playerStats = playersMatchStats[playerId];
          const agentName =
            allAgents.find((agentObj) => agentObj.id === p.characterId)?.name ||
            null;
          const agent_image = getAgentImage(agentName);

          const kdaText = t("val:kdaWritteOut", "{{k}} / {{d}} / {{a}}", {
            k: playerStats.kills,
            d: playerStats.deaths,
            a: playerStats.assists,
          });

          const isUser = p?.[playerType] === currentPlayerStats?.[playerType];
          const teamColor = p.teamId === "Blue" ? "var(--turq)" : "#E44C4D";
          const borderColor = isUser ? "var(--yellow);" : teamColor;

          const avgScorePerRound = getAvgScore(
            playerStats.score,
            matchInfo.roundResults.length
          );
          const econScore = calcAvgEconomyForMatch(
            matchInfo.roundResults,
            playerId,
            playerType
          ).toLocaleString(getLocale(), {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          const minutes = calcRate(matchInfo.length, 60000, 2);
          const killPerMinute = calcRate(playerStats.kills, minutes, 1).toFixed(
            1
          );
          const fullDisplayName = `${p.gameName}-${p.tagLine}`;
          return (
            <Row
              key={p.gameName}
              competitiveTier={p.competitiveTier}
              agentImg={agent_image}
              playerName={p.gameName}
              score={avgScorePerRound}
              kda={kdaText}
              econ={econScore}
              fb={playerStats.firstBloodsTaken}
              plants={playerStats.plants}
              kpm={killPerMinute}
              defuses={playerStats.defuses}
              borderColor={borderColor}
              isUser={isUser}
              isDeathmatch={isDeathmatch}
              isEscalation={isEscalation}
              position={index + 1}
              href={`/valorant/profile/${fullDisplayName}`}
            />
          );
        })}
      </TeamPanelContainer>
    );
  };

  if (isDeathmatch) {
    const sortedPlayers = orderBy(
      players,
      (player) => playersMatchStats?.[player?.[playerType]]?.kills || 0,
      "desc"
    );
    return (
      <CardContainer>
        <TeamPanel
          title={t("common:player", "Player")}
          team={sortedPlayers}
          playersMatchStats={playersMatchStats}
          isDeathmatch
        />
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <TeamPanel
        title={t("common:myteam", "My Team")}
        team={myTeam}
        playersMatchStats={playersMatchStats}
        isEscalation={isEscalation}
      />
      <TeamPanel
        title={t("common:enemyteam", "Enemy Team")}
        team={enemyTeam}
        playersMatchStats={playersMatchStats}
        isEscalation={isEscalation}
      />
    </CardContainer>
  );
};

export default TeamBreakdown;
