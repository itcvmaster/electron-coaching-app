import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption, Overline } from "@/game-lol/CommonComponents.jsx";

const TagTooltip = styled("div")`
  padding: var(--sp-2);
  max-width: 240px;

  .type-overline {
    color: var(--shade4);
    margin-bottom: var(--sp-3);
  }

  .type-caption {
    color: var(--shade1);
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    span {
      color: var(--shade0);
      margin-left: var(--sp-6);
    }
  }

  .pts-total {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 8px;
    padding-top: 8px;
    border-top: var(--sp-px) solid var(--shade8);
  }
`;

export const TagTooltipDescription2 = () => {
  const { t } = useTranslation();

  return (
    <TagTooltip>
      <Overline>
        {t("lol:matchScore.scoreBreakdownTitle", "Score Breakdown")}:
      </Overline>
      <Caption>
        {t(
          "lol:matchScore.scoreBreakdownDescription",
          "User scores are a combination of KDA, Damage, Kill Participation, Vision, and a few other metrics to provide a generalized score of match performance."
        )}
      </Caption>
    </TagTooltip>
  );
};

// Unused currently. Shows exact point breakdown
export const TagTooltipDescription = (props) => {
  const { points } = props;
  const { t } = useTranslation();

  if (!points) return null;

  return (
    <TagTooltip>
      <Overline>
        {t("lol:matchScore.scoreBreakdownTitle", "Score Breakdown")}:
      </Overline>
      <Caption>
        {t("common:stats.kda", "KDA")}:{" "}
        <span className="type-caption--bold">
          {(points.kda * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:dmgDealt", "Damage Dealt")}:{" "}
        <span className="type-caption--bold">
          {(points.dmg * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:specificMatchup.killParticipation", "Kill Participation")}:{" "}
        <span className="type-caption--bold">
          {(points.kp * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:stats.vision", "Vision")}:{" "}
        <span className="type-caption--bold">
          {(points.vision * 10).toFixed(1)}
        </span>
      </Caption>
      <Caption>
        {t("lol:stats.towerDmg", "Tower Damage")}:{" "}
        <span className="type-caption--bold">
          {(points.towerDmg * 10).toFixed(1)}
        </span>
      </Caption>
      {props.isSupport && (
        <>
          <Caption>
            {t("lol:stats.healing", "Healing")}:{" "}
            <span className="type-caption--bold">
              {(points.healing * 10).toFixed(1)}
            </span>
          </Caption>
          <Caption>
            {t("lol:stats.tanking", "Tanking")}:{" "}
            <span className="type-caption--bold">
              {(points.tank * 10).toFixed(1)}
            </span>
          </Caption>
        </>
      )}
      {props.isWinner && (
        <Caption>
          {t("lol:results.victory", "Victory")}:{" "}
          <span className="type-caption--bold">
            {(points.victory * 10).toFixed(1)}
          </span>
        </Caption>
      )}
      <Caption className="pts-total">
        {t("lol:csStats.total", "Total")}:{" "}
        <span className="type-caption--bold">
          {(points.total * 10).toFixed(1)}
        </span>
      </Caption>
    </TagTooltip>
  );
};
