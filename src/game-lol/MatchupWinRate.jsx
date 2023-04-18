import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption, H6 } from "@/game-lol/CommonComponents.jsx";
import WinRateText from "@/game-lol/WinRateText.jsx";

const MatchupWinRate = ({ matchupStat, enemyChampion, champion }) => {
  const { t } = useTranslation();
  if (!champion || !enemyChampion) return null;

  return (
    <div>
      <Caption>
        {t("lol:matchupStatsVs", `{{champion}}'s Matchup Stats vs {{enemy}}`, {
          champion: champion.name,
          enemy: enemyChampion.name,
        })}
      </Caption>
      <StatBlocks>
        <StatBlock>
          {matchupStat ? (
            <WinRateText
              wins={matchupStat.stats.lane_wins}
              total={matchupStat.stats.games}
              precision={0}
            />
          ) : (
            <UnavailableData>{t("lol:notAvailable", "N/A")}</UnavailableData>
          )}
          <Subtitle
            data-tip={`${t(
              "lol:whoWinsWithStats",
              "Who wins during laning phase or early game (higher CSD, XPD, and Gold)?"
            )}`}
          >
            {t("lol:stats.laneWinRate", "Lane Win Rate")}
          </Subtitle>
        </StatBlock>
        <StatBlock>
          {matchupStat ? (
            <WinRateText
              wins={matchupStat.stats.wins}
              total={matchupStat.stats.games}
              precision={0}
            />
          ) : (
            <UnavailableData>{t("lol:notAvailable", "N/A")}</UnavailableData>
          )}
          <Subtitle
            data-tip={`${t(
              "lol:championData.whoWins.overall",
              "Who wins in overall games?"
            )}`}
          >
            {t("lol:stats.gameWinRate", "Game Win Rate")}
          </Subtitle>
        </StatBlock>
      </StatBlocks>
    </div>
  );
};

export default memo(MatchupWinRate);

const StatBlocks = styled("div")`
  display: flex;
  margin-top: var(--sp-2);
`;
const StatBlock = styled("div")`
  margin-right: var(--sp-6);

  &:last-of-type {
    margin-right: 0;
  }
`;
const UnavailableData = styled(H6)`
  color: var(--shade2);
`;
const Subtitle = styled(Caption)`
  color: var(--shade2);
`;
