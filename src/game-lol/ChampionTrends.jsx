import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { translateRoles } from "@/game-lol/translate-roles.mjs";
import TrendsGraphLarge from "@/game-lol/TrendsGraphLarge.jsx";
import useChampionFilter from "@/game-lol/useChampionFilter.jsx";
import { getSearchParamsForChampion } from "@/game-lol/util.mjs";

const Blocks = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);

  > .full {
    grid-column: span 2;
  }

  ${mobile} {
    grid-template-columns: 1fr;

    > .full {
      grid-column: unset;
    }
  }
`;

const ChampionTrends = ({ champion, matchupChampion }) => {
  const { t } = useTranslation();
  const { FilterBar, ...filters } = useChampionFilter(
    "trends",
    champion,
    matchupChampion
  );
  const championId = champion?.id;
  const championDesc = `${champion?.name}'s ${translateRoles(t, filters.role)}`;
  const legend = [champion?.name, "Mage Average"];

  const urlParams = getSearchParamsForChampion(filters);
  const championTrends =
    readState.lol?.championStatsTrends?.[championId]?.[btoa(urlParams)] || [];

  return (
    <>
      {FilterBar}
      <Blocks>
        <div className="full">
          <TrendsGraphLarge
            title={`${championDesc} ${t("lol:winRate", "Win Rate")}`}
            yLabel={t("lol:winRate", "Win Rate")}
            height={320}
            legend={legend}
            points={championTrends.map((stats) => ({
              patch: stats.patch,
              value: stats.wins / (stats.games || 1),
            }))}
            numIntervals={6}
          />
        </div>
        <TrendsGraphLarge
          title={`${championDesc} ${t(
            "lol:stats.laneWinRate",
            "Lane Win Rate"
          )}`}
          yLabel={t("lol:stats.laneWinRate", "Lane Win Rate")}
          height={200}
          legend={legend}
          points={championTrends.map((stats) => ({
            patch: stats.patch,
            value: stats.laneWins / (stats.games || 1),
          }))}
          numIntervals={6}
        />
        <TrendsGraphLarge
          title={`${championDesc} ${t("lol:playRate", "Play Rate")}`}
          yLabel={t("lol:playRate", "Play Rate")}
          height={200}
          numIntervals={6}
          legend={legend}
          points={championTrends.map((stats) => ({
            patch: stats.patch,
            value: stats.pickRate,
          }))}
        />
        <TrendsGraphLarge
          title={`${championDesc} ${t("lol:banRate", "Ban Rate")}`}
          yLabel={t("lol:banRate", "Ban Rate")}
          height={200}
          numIntervals={3}
          legend={legend}
          points={championTrends.map((stats) => ({
            patch: stats.patch,
            value: stats.banRate,
          }))}
        />
        <TrendsGraphLarge
          title={`${championDesc} DMG/min`}
          yLabel={t("lol:damagePerMinute", "Damage per Minute")}
          height={200}
          numIntervals={3}
          legend={legend}
          valueType="number"
          valueLabel="DMG/min"
          points={championTrends.map((stats) => ({
            patch: stats.patch,
            value: stats.totalDamageDealtToChampions / (stats.timePlayed / 60),
          }))}
        />
      </Blocks>
    </>
  );
};

export default ChampionTrends;
