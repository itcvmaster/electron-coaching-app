import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "clutch";

import ChevronLeft from "@/inline-assets/chevron-left.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import HitPercent from "@/shared/HitPercent.jsx";
import {
  DamageHeader,
  HitBlock,
  HitBlocks,
  VS,
  VSBlock,
} from "@/shared/HitStats.style.jsx";
import { getLocale } from "@/util/i18n-helper.mjs";

/**
 * Hit Overview for postmatch
 *
 * @param {*} matchStats = {
 *   avgDamagePerRound,
 *   kills,
 *   weaponHits: {
 *     headshots,
 *     bodyshots,
 *     legshots,
 *   }
 * };
 *
 * @param {*} comparisonStats = {
 *   avgDamagePerRound,
 *   matches,
 *   weaponHits: {
 *     headshots,
 *     bodyshots,
 *     legshots,
 *   },
 * };
 */

const HitStats = ({
  matchStats,
  comparisonStats,
  table,
  division,
  hasDmgPerRound,
  hideHeadshotData,
  hasLegshots,
}) => {
  const { t } = useTranslation();

  const matchAvgDmgPerRound = matchStats?.avgDamagePerRound || 0;
  const matchWeaponHits = matchStats?.weaponHits;

  const comparisonAvgDmgPerRound = comparisonStats?.avgDamagePerRound || 0;
  const comparisonWeaponHits = comparisonStats?.weaponHits;
  const comparisonMatches = comparisonStats?.matches || 0;

  const beatDmgAvg = matchAvgDmgPerRound > comparisonAvgDmgPerRound;

  const matchDmgAvg = matchAvgDmgPerRound.toLocaleString(getLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const comparisonAvgDmg = comparisonAvgDmgPerRound.toLocaleString(
    getLocale(),
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );

  const betterHeadshots =
    matchWeaponHits.headshots > comparisonWeaponHits.headshots
      ? "better-match"
      : "better-avg";

  return (
    <Card>
      <DamageHeader className={beatDmgAvg && "beatDmgAvg"}>
        <div className="header-left">
          <p className="type-caption--bold header-title">
            {t("common:thisMatch", "This Match")}
          </p>
          {hasDmgPerRound && (
            <p className="type-subtitle2 header-value">
              {matchDmgAvg}{" "}
              {t("common:stats.damagePerRound", "Damage Per Round")}
            </p>
          )}
        </div>
        <VSBlock>
          <div className="arrows arrows-left">
            <ChevronLeft />
            <ChevronLeft />
          </div>
          <VS>
            <p className={"type-body2-form--active"}>{t("common:vs", "VS")}</p>
          </VS>
          <div className="arrows arrows-right">
            <ChevronRight />
            <ChevronRight />
          </div>
        </VSBlock>

        <div className="header-right">
          {division ? (
            division
          ) : (
            <p className="type-caption--bold header-title">
              {t("common:recentMatchCountAvg", "Recent {{count}} Avg.", {
                count: comparisonStats.matches,
              })}
            </p>
          )}
          {hasDmgPerRound && (
            <p className="type-subtitle2 header-value">
              {comparisonAvgDmg}{" "}
              {t("common:stats.damagePerRound", "Damage Per Round")}
            </p>
          )}
        </div>
      </DamageHeader>

      {!hideHeadshotData && (
        <HitBlocks>
          {matchWeaponHits && (
            <HitBlock
              className={
                betterHeadshots === "better-match" && "better-headshots"
              }
            >
              <HitPercent
                side="right"
                size={52}
                stats={matchWeaponHits}
                hiddenLegshots={!hasLegshots}
              />
            </HitBlock>
          )}
          {comparisonWeaponHits && (
            <HitBlock
              className={betterHeadshots === "better-avg" && "better-headshots"}
            >
              <HitPercent
                side="left"
                size={52}
                stats={{
                  ...comparisonWeaponHits,
                  matches: comparisonMatches,
                }}
                hiddenLegshots={!hasLegshots}
              />
            </HitBlock>
          )}
        </HitBlocks>
      )}

      {table}
    </Card>
  );
};

export default HitStats;
