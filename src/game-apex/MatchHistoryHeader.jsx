import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { kdaColorStyle } from "@/app/util.mjs";
import { getPlayerStatsByMatch } from "@/game-apex/utils.mjs";
import SharedMatchHistoryHeader from "@/shared/MatchHistoryHeader.jsx";

function MatchListHeader({ selectedAccountId, matchList }) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const state = useSnapshot(readState);
  const legends = state.apex.meta?.legends;

  const { statLines, topLegends } = useMemo(() => {
    let wins = 0,
      matches = 0,
      kills = 0,
      assists = 0,
      damage = 0,
      rp = 0;
    const hash = {};
    const legendStats = {};
    for (const match of matchList) {
      const playerStats = getPlayerStatsByMatch(match, selectedAccountId);
      if (!playerStats) continue;
      const {
        champion_id,
        survivaltime,
        kills: playerKills,
        assists: playerAssists,
        damagedealt,
        team: { placement } = {},
        ranked_points,
      } = playerStats;

      hash[champion_id] = hash[champion_id] || {
        id: champion_id,
        kills: 0,
        minutes: 0,
      };

      hash[champion_id].minutes += survivaltime / 60;
      hash[champion_id].kills += playerKills;

      // Get matches
      matches++;

      // Get kills
      if (playerKills) kills += playerKills;

      // Get assists
      if (playerAssists) assists += playerAssists;

      // Get damage
      if (damagedealt) damage += damagedealt;

      // Get wins
      if (placement === 1) wins++;

      if (ranked_points) rp += ranked_points;

      if (matches >= 20) break;
    }

    const sortedKeys = Object.keys(hash).sort((a, b) => {
      return hash[b].kills - hash[a].kills;
    });

    for (const symbol of sortedKeys) legendStats[symbol] = hash[symbol];

    const kd = kills / matches || 0;
    const ad = assists / matches || 0;
    const dmgPerMatch = damage / matches || 0;

    const statLines = [
      {
        stat: t("common:stats.winsCount", "{{count, number}} Wins", {
          count: wins,
        }),
        description: t("common:stats.lastCount", "Last {{count, number}}", {
          count: matches,
        }),
        statColor: matches > 0 ? "var(--turq)" : "var(--shade3)",
      },
      {
        stat: kd.toLocaleString(language),
        description: t("apex:stats.ePerMatch", "K/Match"),
        statColor: matches > 0 ? kdaColorStyle(kd) : "var(--shade3)",
      },
      {
        stat: ad.toLocaleString(language),
        description: t("apex:stats.aPerMatch", "A/Match"),
        statColor: matches > 0 ? kdaColorStyle(ad) : "var(--shade3)",
      },
      {
        stat: dmgPerMatch.toLocaleString(language, {
          maximumFractionDigits: 1,
        }),
        description: t("apex:stats.ePerMatch", "Dmg/Match"),
        statColor:
          matches > 0 ? kdaColorStyle(dmgPerMatch / 100) : "var(--shade3)",
      },
      {
        stat: rp?.toLocaleString(language),
        description: t("apex:stats.rp", "RP"),
        statColor:
          rp === 0 ? "var(--shade3)" : rp > 0 ? "var(--turq)" : "var(--red)",
      },
    ];

    const topLegends = Object.keys(legendStats)
      .concat(Array(3).fill())
      .slice(0, 3)
      .map((key) => {
        const stat = legendStats[key];
        if (!stat) return null;
        const { id } = stat;
        const legendInfo = legends?.[id];
        const iconUrl = legendInfo?.imageUrl || "";
        const keyString = key?.toString();
        const statColor =
          typeof stat.kills === "number" ? "inherit" : "var(--shade3)";

        return {
          key: keyString,
          iconUrl: iconUrl,
          statColor: statColor,
          stat: t("common:stats.countKills", "{{count, number}} Kills", {
            count: stat.kills,
          }),
        };
      });

    return {
      statLines,
      topLegends,
    };
  }, [selectedAccountId, matchList, legends, t, language]);

  return (
    <SharedMatchHistoryHeader
      padding={"var(--sp-5)"}
      statColumns={statLines}
      IconList={topLegends}
    />
  );
}

export default memo(MatchListHeader);
