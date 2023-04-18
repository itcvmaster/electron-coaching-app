import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import TooltipContainer from "@/game-val/TooltipContainer.jsx";
import {
  getAgentImage,
  getDeathmatchPositionColor,
  getMapDisplayName,
  getMatchPositionText,
  getQueueName,
  kdaColor,
} from "@/game-val/utils.mjs";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import InfoTag from "@/inline-assets/info-tag.svg";
import Star from "@/inline-assets/star.svg";
import { ProfileMatch } from "@/shared/ProfileMatch.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import { calcRate } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const MatchInfoSummary = styled("div")`
  display: flex;
  align-items: center;
  color: var(--shade2);
  flex: 3;
  justify-content: flex-end;

  .queue-name {
    text-transform: capitalize;
  }
`;

const MatchPositionContainer = styled("span")`
  display: flex;
  color: ${(props) => props.color};
  .star {
    width: var(--sp-3);
  }
  .position-text {
    padding-left: var(--sp-1);
  }
`;

const MatchRR = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
  color: ${(props) => props.$color};

  .rr-container {
    display: flex;
  }

  .rr-text {
    text-transform: uppercase;
  }
`;

const MatchStats = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-top: var(--sp-4);

  .avg-score {
    color: var(--shade2);
  }

  .match-kda {
    min-width: calc(var(--sp-px) * 108);
  }
  .match-stats,
  .match-hs-stats,
  .match-dmg {
    display: flex;
    flex: 2;
  }

  .tooltip-stat-line {
    display: flex;
    justify-content: space-between;
    min-width: var(--sp-40);
  }

  .hs-tooltip {
    padding: var(--sp-1);
  }
  .match-dmg {
    .match-description {
      min-width: calc(var(--sp-px) * 110);
    }
  }
  .headshot-caret-up {
    width: var(--sp-4);
    display: inline;
    color: rgb(73, 180, 255);
  }
  .headshot-caret-down {
    width: var(--sp-4);
    display: inline;
    color: rgb(250, 77, 81);
  }
`;

const MatchOutcome = styled("div")`
  display: flex;
  flex: 1 1 0%;
  min-width: var(--sp-15_5);
  justify-content: space-between;
  color: ${(props) => props.color};
`;

function MatchHistoryRow(props) {
  const { match, allAgents } = props;
  const { t } = useTranslation();

  const isComp = match.queue === "competitive";
  const hsAverage = match.hsStats.all.last20Avg;
  const increasedHeadshots = match.hsStats.current > hsAverage;
  const rounds = match.roundsPlayed;

  const kd = calcRate(match.kills, match.deaths, 2);
  const kdScore = useMemo(() => {
    return kd.toLocaleString(getLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [kd]);

  const kpr = calcRate(match.kills, rounds, 2);
  const kprScore = useMemo(() => {
    return kpr.toLocaleString(getLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [kpr]);
  const adr = calcRate(match.damage, rounds, 2);
  const adrScore = useMemo(() => {
    return adr.toLocaleString(getLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [adr]);

  const matchAvgScore = Math.floor(calcRate(match.score, rounds, 1));
  const avgScore = useMemo(() => {
    return matchAvgScore.toLocaleString(getLocale());
  }, [matchAvgScore]);
  const rr = match?.rankedRatingEarned;
  const agentName =
    allAgents.find((agentObj) => agentObj.id === match.agentId)?.name || null;
  const agent_image = getAgentImage(agentName);

  const mapName = getMapDisplayName(match.map);
  const queueDisplayName =
    match.queue === "" ? "custom" : getQueueName(match.queue);

  const MatchPosition = ({ match }) => {
    let positionColor = "var(--shade2)";
    let matchPositionText = getMatchPositionText(t, match.matchPosition);
    let isMVP = true;
    if (match.matchPosition === 1) {
      matchPositionText = t("val:mvp", "MVP");
      positionColor = "var(--yellow)";
    } else if (match.teamPosition === 1) {
      positionColor = "var(--turq)";
    } else {
      isMVP = false;
    }

    return (
      <MatchPositionContainer color={positionColor}>
        {isMVP && <Star className="star" />}
        <p
          className="type-caption--bold match-sub-stat position-text"
          style={{ color: positionColor }}
        >
          {matchPositionText}
        </p>
      </MatchPositionContainer>
    );
  };

  const RRText = ({ rr }) => {
    if (!rr)
      return (
        <p className="type-caption--bold rr-text">
          {t("val:rrPlaceholder", "- RR")}
        </p>
      );
    if (rr < 0) {
      return (
        <p className="type-caption--bold rr-text">
          {t("val:negativeRR", "{{rr}} RR", { rr: rr })}{" "}
        </p>
      );
    }
    return (
      <p className="type-caption--bold rr-text">
        {t("val:positiveRR", "+{{rr}} RR", { rr: rr })}{" "}
      </p>
    );
  };

  const MatchInfoContainer = styled("div")`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  const getRRColor = (won, rr) => {
    if (!rr) return "var(--shade3)";
    return won ? "var(--turq)" : "var(--red)";
  };
  const getOutcomeColor = (match) => {
    if (match.queue === "deathmatch") {
      return getDeathmatchPositionColor(match.matchPosition);
    }
    // isComp
    if (match.winStatus === "loss") return "var(--red)";
    if (match.winStatus === "win") return "var(--turq)";
    return "var(--shade3)";
  };

  const getMatchOutcomeText = (match) => {
    if (match.queue === "deathmatch") {
      const position = getMatchPositionText(t, match.matchPosition);
      return t("val:matchPosition", "{{position}} Place", {
        position: position,
      });
    }
    if (match.winStatus === "loss") return t("val:defeat", "Defeat");
    if (match.winStatus === "win") return t("val:victory", "Victory");
    return t("val:tie", "tie");
  };

  const ADR = ({ adr }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
      <p
        onMouseOver={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        className="type-caption match-sub-stat"
      >
        {showTooltip && (
          <TooltipContainer transformX="-30" transformY="-120">
            <p className="tooltip-text">
              {t("val:avgdamagePerRound", "Avg. Damage Per Round")}
            </p>
          </TooltipContainer>
        )}
        {t("val:adr", "{{adr}} ADR", { adr: adr ? adr : 0 })}
      </p>
    );
  };

  const KPR = ({ kpr }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
      <p
        onMouseOver={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        className="type-subtitle2 match-stat"
      >
        {showTooltip && (
          <TooltipContainer transformX="-30" transformY="-120">
            <p className="tooltip-text">
              {t("val:avgkpr", "Avg. Kills Per Round")}
            </p>
          </TooltipContainer>
        )}

        {t("val:kpr", "{{kpr}} KPR", { kpr: kpr ? kpr : "-" })}
      </p>
    );
  };

  const HeadshotStat = ({ currentHs, hsAverage, Carret }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <span
        onMouseOver={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        className="type-subtitle2 match-stat"
      >
        {showTooltip && (
          <TooltipContainer transformX="-30" transformY="-120">
            <div className="hs-tooltip">
              <div className="tooltip-stat-line">
                <p>{t("val:thismatchheadshots", "This Match")}</p>
                <div>
                  {t("val:hsPercent", "{{hs}}%", { hs: currentHs })}
                  <Carret />
                </div>
              </div>
              <div className="tooltip-stat-line">
                <span>{t("val:last20hs", "Last 20 Avg.")}</span>
                <span style={{ paddingRight: "var(--sp-4)" }}>
                  {t("val:hsPercent", "{{hs}}%", { hs: hsAverage })}
                </span>
              </div>
            </div>
          </TooltipContainer>
        )}
        {t("val:hs", "{{hs}}% HS", { hs: currentHs })}
        <Carret />
      </span>
    );
  };
  return (
    <ProfileMatch match={match} image={agent_image}>
      <MatchInfoContainer>
        <div className="match-title">
          <MatchOutcome color={getOutcomeColor(match)}>
            {getMatchOutcomeText(match)}
          </MatchOutcome>

          {isComp && (
            <MatchRR $color={getRRColor(match.winStatus !== "loss", rr)}>
              <div className="rr-container">
                <RRText rr={rr} />
                {!rr && <InfoTag className="info-tag" />}
              </div>
            </MatchRR>
          )}

          <MatchInfoSummary>
            {isComp && <MatchPosition match={match} />}{" "}
            {isComp && <div className="gap-dot" />}
            <p className="type-caption queue-name">
              {t("val:queueName", "{{queueName}}", {
                queueName: queueDisplayName,
              })}
            </p>
          </MatchInfoSummary>
        </div>

        <MatchStats>
          <div className="match-kda">
            <p className="type-subtitle2 match-stat">
              {match.roundsWon
                ? t("val:nWinAndnLosses", "{{wins}} - {{losses}}", {
                    wins: match.roundsWon,
                    losses: match.roundsPlayed - match.roundsWon,
                  })
                : null}
            </p>
            {mapName ? (
              <p className="type-caption match-sub-stat">
                {t("val:map.{{map}}", "{{map}}", {
                  map: mapName,
                })}
              </p>
            ) : null}
          </div>

          <div className="match-stats">
            <div className="match-description">
              <p
                className="type-subtitle2 match-stat"
                style={{ color: kdaColor(kdScore) }}
              >
                {t("val:kd", "{{kd}} KD", { kd: kdScore ? kdScore : "-" })}
              </p>
              <p className="type-caption match-sub-stat">
                {match.kills}/ {match.deaths}/ {match.assists}
              </p>
            </div>
          </div>

          <div className="match-dmg">
            <div className="match-description">
              <KPR kpr={kprScore} />
              <ADR adr={adrScore} />
            </div>
          </div>

          <div className="match-hs-stats">
            <div className="match-description">
              {match.hsStats.current ? (
                <HeadshotStat
                  currentHs={match.hsStats.current}
                  hsAverage={hsAverage}
                  Carret={() => {
                    return increasedHeadshots ? (
                      <CaretUp className="headshot-caret-up" />
                    ) : (
                      <CaretDown className="headshot-caret-down" />
                    );
                  }}
                />
              ) : (
                `-`
              )}
              <p className="type-caption avg-score">
                {avgScore ? avgScore : "--"}&nbsp;
                {t("val:avgScore", "Avg. Score")}
              </p>
            </div>
          </div>

          <div>
            <div className="match-description">
              <p className="type-subtitle2 match-stat">&nbsp;</p>
              <p className="type-caption time-ago">
                <TimeAgo date={match.matchDate} />
              </p>
            </div>
          </div>
        </MatchStats>
      </MatchInfoContainer>
    </ProfileMatch>
  );
}

export default MatchHistoryRow;
