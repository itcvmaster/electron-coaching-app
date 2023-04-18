import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import TooltipContainer from "@/game-val/TooltipContainer.jsx";
import {
  calcRate,
  displayRate,
  getAgentImage,
  getWinRateColor,
  kdaColor,
} from "@/game-val/utils.mjs";
import SharedMatchHistoryHeader from "@/shared/MatchHistoryHeader.jsx";

const Tooltip = styled("div")`
  min-width: var(--sp-22_5);
  display: flex;
  .tooltip-text {
    color: var(--shade3);
  }
  .tooltip-kd {
    margin-right: var(--sp-4);
  }
`;

const AgentToolTip = ({
  statLeft,
  statLeftColor,
  leftDescription,
  statRight,
  rightDescription,
}) => {
  return (
    <TooltipContainer style={{ zIndex: 2 }} transformX="0" transformY="-110">
      <Tooltip>
        <div className="tooltip-kd">
          <p className="type-caption--bold" style={{ color: statLeftColor }}>
            {statLeft}
          </p>
          <p className="type-caption--bold tooltip-text">{leftDescription}</p>
        </div>
        <div>
          <p className="type-caption--bold">{statRight}</p>

          <p className="tooltip-text">{rightDescription}</p>
        </div>
      </Tooltip>
    </TooltipContainer>
  );
};

function MatchHistoryHeader({ stats, matchList, allAgents }) {
  const { t } = useTranslation();

  const { statLines, topThree } = useMemo(() => {
    const mainStats = stats?.overall?.last20;
    if (!mainStats) return;
    const kd = calcRate(mainStats.kills, mainStats.deaths, 2);
    const winRate = displayRate(
      mainStats.wins,
      mainStats.matches,
      mainStats.ties
    );

    const score = calcRate(mainStats.score, mainStats.roundsPlayed, 1);

    const topIds = Array.from(
      new Set(matchList.map((match) => match.agentId))
    ).slice(0, 3);

    const topThree = topIds.map((agentKey) => {
      const agentName =
        allAgents.find((agentObj) => agentObj.id === agentKey)?.name || "";
      const agentInfo = mainStats?.agentsStats?.[agentKey];
      if (!agentInfo || !agentName) return null;

      const agent_image = getAgentImage(agentName);
      const winRate = displayRate(
        agentInfo.wins,
        agentInfo.matches,
        agentInfo.ties
      );
      const losses = agentInfo.matches - agentInfo.wins - (agentInfo.ties || 0);
      const kd = calcRate(agentInfo.kills, agentInfo.deaths, 2);
      const statColor = getWinRateColor(parseInt(winRate));
      const tooltipInfo = {
        statLeft: t("val:kd", "{{kd}}", { kd: kd || "-" }),
        leftDescription: t("val:kd", "KD"),
        statLeftColor: kdaColor(kd),
        statRight: t("val:winsAndLosses", "{{wins}}W - {{losses}}L", {
          wins: agentInfo.wins || 0,
          losses: losses || 0,
        }),
        rightDescription: t("val:winloss", "Record"),
      };
      const iconTooltip = AgentToolTip(tooltipInfo);
      return {
        key: agentKey,
        iconUrl: agent_image,
        statColor: statColor,
        stat: winRate,
        iconTooltip: iconTooltip,
      };
    });

    const statLines = [
      {
        stat: t("val:nWinsnLoses", "{{wins}}W {{loses}}L", {
          wins: mainStats.wins,
          loses: mainStats.matches - mainStats.wins - mainStats.ties,
        }),
        description: t("val:lastNMatches", "Last {{matches}}", {
          matches: mainStats.matches,
        }),
      },
      {
        stat: winRate,
        description: t("val:winRate", "Winrate"),
        statColor: getWinRateColor(parseInt(winRate)),
      },
      {
        stat: kd ? kd : "- - -",
        description: t("vak:stats.kd", "KD"),
        statColor: "rgb(151, 141, 135)",
      },
      {
        stat: score ? score : 0,
        description: t("val:avgScore", "Avg. Score"),
      },
    ];

    return { statLines, topThree };
  }, [stats, matchList, allAgents, t]);

  if (!stats?.overall?.last20) {
    return null;
  }

  return (
    <SharedMatchHistoryHeader
      statColumns={statLines}
      IconList={topThree}
      padding={"var(--sp-2)"}
    />
  );
}

export default memo(MatchHistoryHeader);
