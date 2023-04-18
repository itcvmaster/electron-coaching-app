import React from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import MannequinSvg from "@/inline-assets/mannequin.svg";
import { wepColorRange, wepOpacityRange } from "@/shared/WeaponHitStyle.jsx";
import {
  calcBodyshotPercent,
  calcHeadshotPercent,
  calcLegshotPercent,
} from "@/util/fps.mjs";

const WeaponHitItem = (props) => {
  const { t } = useTranslation();

  const { headshots, bodyshots, legshots, hasLegshots = true } = props;
  const stats = {
    headshots,
    bodyshots,
    legshots,
  };
  const headshotPercent = calcHeadshotPercent(stats, hasLegshots);
  const bodyshotPercent = calcBodyshotPercent(stats, hasLegshots);
  const legshotPercent = calcLegshotPercent(stats, hasLegshots);

  // Headshots
  const headshotColor = wepColorRange(headshotPercent);
  const headshotOpacity = wepOpacityRange(headshotPercent);

  // Bodyshots
  const bodyshotColor = wepColorRange(bodyshotPercent);
  const bodyshotOpacity = wepOpacityRange(bodyshotPercent);

  // Legshots
  const legshotColor = wepColorRange(legshotPercent);
  const legshotOpacity = wepOpacityRange(legshotPercent);

  const colorStyles = {
    "--headshotColor": headshotColor,
    "--headshotOpacity": headshotOpacity,
    "--bodyshotColor": bodyshotColor,
    "--bodyshotOpacity": bodyshotOpacity,
    "--legshotColor": legshotColor,
    "--legshotOpacity": legshotOpacity,
  };

  const hitTooltip = (
    <HitsTooltip style={colorStyles}>
      <div>
        <TooltipMannequin />
      </div>
      <div className="hit-stats">
        <div className="hit-stat">
          <div className="type-body2-form--active body-head">
            {t(
              "common:hitsPercent",
              "{{hits, percent}} ({{hitsNumber, number}})",
              {
                hits: headshotPercent / 100,
                hitsNumber: headshots,
              }
            )}
          </div>
        </div>
        <div className="hit-stat">
          <div className="type-body2-form--active body-torso">
            {t(
              "common:hitsPercent",
              "{{hits, percent}} ({{hitsNumber, number}})",
              {
                hits: bodyshotPercent / 100,
                hitsNumber: bodyshots,
              }
            )}
          </div>
        </div>
        {hasLegshots && (
          <div className="hit-stat">
            <div className="type-body2-form--active body-legs">
              {t(
                "common:hitsPercent",
                "{{hits, percent}} ({{hitsNumber, number}})",
                {
                  hits: legshotPercent / 100,
                  hitsNumber: legshots,
                }
              )}
            </div>
          </div>
        )}
      </div>
    </HitsTooltip>
  );

  const hitBreakdownTooltip = ReactDOMServer.renderToStaticMarkup(hitTooltip);

  return (
    <div data-tooltip={hitBreakdownTooltip}>
      <Mannequin style={colorStyles} />
    </div>
  );
};

export default WeaponHitItem;

const PersonBody = styled(MannequinSvg)`
  .body-head {
    color: var(--headshotColor);
    opacity: var(--headshotOpacity);
  }
  .body-torso {
    color: var(--bodyshotColor);
    opacity: var(--bodyshotOpacity);
  }
  .body-legs {
    color: var(--legshotColor);
    opacity: var(--legshotOpacity);
  }
`;

const Mannequin = styled(PersonBody)`
  width: var(--sp-3);
  height: auto;
`;

const HitsTooltip = styled("div")`
  display: flex;

  .hit-stats {
    gap: var(--sp-3);
    display: flex;
    flex-direction: column;
  }
  .hit-stat {
    text-align: center;
  }
  .body-head {
    color: var(--headshotColor);
    opacity: var(--headshotOpacity);
  }
  .body-torso {
    color: var(--bodyshotColor);
    opacity: var(--bodyshotOpacity);
  }
  .body-legs {
    color: var(--legshotColor);
    opacity: var(--legshotOpacity);
  }
`;

const TooltipMannequin = styled(PersonBody)`
  width: var(--sp-8);
  height: auto;
  margin-right: var(--sp-3);
`;
