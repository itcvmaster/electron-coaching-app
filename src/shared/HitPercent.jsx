import React from "react";
import { Trans, useTranslation } from "react-i18next";

import {
  ColumnHitsPercent,
  ColumnHitTotal,
  ColumnSeperator,
  ColumnTitle,
  Container,
  DmgStats,
  Mannequin,
  Stats,
} from "@/shared/HitPercent.style.jsx";
import { wepColorRange, wepOpacityRange } from "@/shared/WeaponHitStyle.jsx";
import { displayRate } from "@/util/helpers.mjs";

/**
 * Hit Percent for all parts
 *
 * @param {*} hiddenLegshots: flags to hidden legshots, legshots is the same as bodyshots
 * @returns
 */
const HitPercent = ({
  side = "left",
  size = 48,
  stats,
  showColumnTitles = true,
  showValueSubtitles = false,
  hideHits = false,
  hiddenLegshots,
  // excludeShotguns = false,
}) => {
  const { t } = useTranslation();

  const { headshots = 0, bodyshots = 0, legshots = 0 } = stats;

  const total = headshots + bodyshots + (hiddenLegshots ? 0 : legshots);

  const headshotPercent = displayRate(headshots, Math.max(total, 1), 0, 1);

  const bodyshotPercent = displayRate(bodyshots, Math.max(total, 1), 0, 1);

  const legshotPercent = displayRate(legshots, Math.max(total, 1), 0, 1);

  // Headshots
  const headshotColor = wepColorRange(Number.parseFloat(headshotPercent));
  const headshotOpacity = wepOpacityRange(Number.parseFloat(headshotPercent));

  // Bodyshots
  const bodyshotColor = wepColorRange(Number.parseFloat(bodyshotPercent));
  const bodyshotOpacity = wepOpacityRange(Number.parseFloat(bodyshotPercent));

  // Legshots
  const lgeshotColor = wepColorRange(Number.parseFloat(legshotPercent));
  const legshotOpacity = wepOpacityRange(Number.parseFloat(legshotPercent));

  const colorStyles = {
    "--headshotColor": headshotColor,
    "--headshotOpacity": headshotOpacity,
    "--bodyshotColor": bodyshotColor,
    "--bodyshotOpacity": bodyshotOpacity,
    "--legshotColor": lgeshotColor,
    "--legshotOpacity": legshotOpacity,
  };

  return (
    <Container>
      <DmgStats
        style={colorStyles}
        className={`${side} === "left" ? "left" : "right" ${hideHits} && 'hidehits' ${showColumnTitles} && 'bump'`}
      >
        <Mannequin style={{ width: size }} />
        <Stats className={`${side} && 'bump' `}>
          <ColumnHitsPercent>
            {showColumnTitles && (
              <ColumnTitle className="type-overline">
                {t("val:hit", "Hit")}
              </ColumnTitle>
            )}
            <div className="stats-list">
              <div>
                {showValueSubtitles ? (
                  <Trans i18nKey="val:numberOfHits">
                    <p className="type-body2-form--active stat-value body-head">
                      {{
                        hits: headshotPercent,
                      }}
                    </p>
                    <p className="type-caption stat-value--subtitle">of Hits</p>
                  </Trans>
                ) : (
                  <p className="type-body2-form--active stat-value body-head">
                    {headshotPercent}
                  </p>
                )}
              </div>
              <div>
                {showValueSubtitles ? (
                  <Trans i18nKey="val:numberOfHits">
                    <p className="type-body2-form--active stat-value body-torso">
                      {{
                        hits: bodyshotPercent,
                      }}
                    </p>
                    <p className="type-caption stat-value--subtitle">of Hits</p>
                  </Trans>
                ) : (
                  <p className="type-body2-form--active stat-value body-torso">
                    {bodyshotPercent}
                  </p>
                )}
              </div>
              {!hiddenLegshots && (
                <div>
                  {showValueSubtitles ? (
                    <Trans i18nKey="val:numberOfHits">
                      <p className="type-body2-form--active stat-value body-legs">
                        {{
                          hits: legshotPercent,
                        }}
                      </p>
                      <p className="type-caption stat-value--subtitle">
                        of Hits
                      </p>
                    </Trans>
                  ) : (
                    <p className=" type-body2-form--activestat-value body-torso">
                      {legshotPercent}
                    </p>
                  )}
                </div>
              )}
            </div>
          </ColumnHitsPercent>
          {!hideHits && (
            <>
              <ColumnSeperator>
                {showColumnTitles && (
                  <ColumnTitle className="type-overline">
                    {t("common:vsDot", "vs.")}
                  </ColumnTitle>
                )}
                <div className="stats-list">
                  <div className="seperator" />
                  <div className="seperator" />
                  {!hiddenLegshots && <div className="seperator" />}
                </div>
              </ColumnSeperator>
              <ColumnHitTotal>
                {showColumnTitles && (
                  <ColumnTitle className="type-overline">
                    {t("common:total", "Total")}
                  </ColumnTitle>
                )}
                <div className="stats-list">
                  <div>
                    {showValueSubtitles ? (
                      <Trans i18nKey="val:numberHits">
                        <p className="type-body2-form--active stat-value">
                          {{ hits: headshots || 0 }}
                        </p>
                        <p className="type-caption stat-value--subtitle">
                          Hits
                        </p>
                      </Trans>
                    ) : (
                      <p className="type-body2-form--activetype-body2-form--active stat-value">
                        {headshots || 0}
                      </p>
                    )}
                  </div>
                  <div>
                    {showValueSubtitles ? (
                      <Trans i18nKey="val:numberHits">
                        <p className="type-body2-form--active stat-value">
                          {{ hits: bodyshots || 0 }}
                        </p>
                        <p className="type-caption stat-value--subtitle">
                          Hits
                        </p>
                      </Trans>
                    ) : (
                      <p className="type-body2-form--active stat-value">
                        {bodyshots || 0}
                      </p>
                    )}
                  </div>
                  {!hiddenLegshots && (
                    <div>
                      {showValueSubtitles ? (
                        <Trans i18nKey="val:numberHits">
                          <p className="type-body2-form--active stat-value">
                            {{ hits: legshots || 0 }}
                          </p>
                          <p className="type-caption stat-value--subtitle">
                            Hits
                          </p>
                        </Trans>
                      ) : (
                        <p className="type-body2-form--active stat-value">
                          {legshots || 0}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </ColumnHitTotal>
            </>
          )}
        </Stats>
      </DmgStats>
    </Container>
  );
};

export default HitPercent;
