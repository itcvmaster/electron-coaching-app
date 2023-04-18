import React, { useMemo } from "react";
import { styled } from "goober";

import { kdaColorStyle, winRatecolorRange } from "@/app/util.mjs";
import Static from "@/game-lol/static.mjs";
import { calcKDA } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const ColumnInfo = styled("div")`
  display: flex;
  flex-direction: column;
  white-space: nowrap;

  .match-info-title {
    color: var(--shade2);
  }
  .match-info-content {
    color: var(--shade0);
  }
`;
const IconFrame = styled("div")`
  position: relative;
  width: var(--sp-10);
  height: var(--sp-10);
  max-width: var(--sp-10);
  max-height: var(--sp-10);
  border-radius: var(--br);
  overflow: hidden;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%) translate3d(0px, 0px, 0px) scale(1.1);
  }
`;

function ChampionOverallStats({ data, t, champions }) {
  const { assists, kills, deaths, championId, wins, plays } = data;

  const kda = calcKDA(kills, deaths, assists);
  const winRate = Math.floor(((wins || 0) / (plays || 1)) * 100);

  const tileImage = Static.getChampionImageById(champions, championId);
  const champName = Static.getChampionKeyFromId(champions, championId);
  const kdaScore = useMemo(() => {
    return kda.toLocaleString(getLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [kda]);
  return (
    <div className="flex align-center gap-sp-1">
      <IconFrame>
        <img src={tileImage} alt={champName} />
      </IconFrame>
      <ColumnInfo>
        <span className="type-caption--bold match-info-title">
          <span style={{ color: winRatecolorRange(winRate) }}>
            {t("lol:matchHistory.winRate", "{{winRate}}%", {
              winRate: winRate,
            })}
          </span>
          &nbsp;&nbsp;
          <span className="wins-losses">
            {t(
              "lol:matchHistory.winsAndLossesWithHypen",
              "{{wins}}W-{{losses}}L",
              {
                wins: wins ?? 0,
                losses: (plays ?? 0) - (wins ?? 0),
              }
            )}
          </span>
        </span>
        <span
          className="type-caption match-info-content"
          style={{ color: kdaColorStyle(kda) }}
        >
          {t("lol:matchHistory.kda", "{{kda}} KDA", { kda: kdaScore })}
        </span>
      </ColumnInfo>
    </div>
  );
}

export default ChampionOverallStats;
