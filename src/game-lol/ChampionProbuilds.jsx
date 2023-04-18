import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Card, mobile } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import ProBuildMostChosen from "@/game-lol/ProBuildMostChosen.jsx";
import ProBuildSummary from "@/game-lol/ProBuildSummary.jsx";
import ProMatchesList from "@/game-lol/ProMatchesList.jsx";
import useChampionFilter from "@/game-lol/useChampionFilter.jsx";
import {
  getCurrentPatchForStaticData,
  getFilteredSummoners,
  getStaticData,
} from "@/game-lol/util.mjs";

const Blocks = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);

  ${mobile} {
    grid-template-columns: 1fr;
  }
`;

const ChampionProbuilds = ({ champion, matchupChampion }) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const viewMode = "desktop";

  const championId = champion?.id;
  const matchupChampionId = matchupChampion?.id;

  const { FilterBar, victoryOnly, ...filters } = useChampionFilter(
    "probuilds",
    champion,
    matchupChampion
  );
  const championRole = filters.role;
  const patch = getCurrentPatchForStaticData();

  const items = getStaticData("items", patch);
  const probuilds = matchupChampionId
    ? state.lol?.championProMatches?.[championId]?.[championRole]?.[
        matchupChampionId
      ]
    : state.lol?.championProMatches?.[championId]?.[championRole];
  const probuildChampion = probuilds;
  const matches = probuildChampion?.probuildMatches;
  const filteredMatches = victoryOnly
    ? matches?.filter((e) => e.win === true)
    : matches;
  const summaries = probuildChampion?.aggregateSummaries;

  return (
    <>
      {FilterBar}
      <Card>
        {champion && (
          <ProBuildSummary
            champData={probuildChampion}
            matches={filteredMatches}
            itemsStaticData={items}
            viewMode={viewMode}
            css={`
              margin-bottom: var(--sp-4);
            `}
          />
        )}
        <ProMatchesList matches={filteredMatches || []} />
      </Card>

      <Blocks>
        <ProBuildMostChosen
          cardHeaderTitle={t(
            "lol:probuilds.mostPurchasedItems",
            "Most Purchased Items"
          )}
          items={summaries?.items?.slice(0, 10).map((item) => {
            return {
              id: item.id,
              data: items && items[item.id],
              winrate: item.winRate,
              pickrate: item.pickRate,
            };
          })}
          itemsType="ITEM"
          loadingRows={7}
        />
        <ProBuildMostChosen
          cardHeaderTitle={t(
            "lol:probuilds.mostPickedRunes",
            "Most Picked Runes"
          )}
          items={summaries?.runes?.slice(0, 10).map((rune) => {
            return {
              id: rune.id,
              winrate: rune.winRate,
              pickrate: rune.pickRate,
            };
          })}
          itemsType="RUNE"
          loadingRows={3}
        />
        <ProBuildMostChosen
          cardHeaderTitle={t(
            "lol:probuilds.mostPurchasedBoots",
            "Most Purchased Boots"
          )}
          items={summaries?.boots?.map((item) => {
            return {
              id: item.id,
              data: items && items[item.id],
              winrate: item.winRate,
              pickrate: item.pickRate,
            };
          })}
          itemsType="ITEM"
          loadingRows={4}
        />
        <ProBuildMostChosen
          cardHeaderTitle={t(
            "lol:probuilds.mostPickedSummoners",
            "Most Picked Summoners"
          )}
          items={getFilteredSummoners(summaries?.spells || []).map((item) => {
            return {
              spells: [item.ids[0], item.ids[1]],
              winrate: item.winRate,
              pickrate: item.pickRate,
            };
          })}
          itemsType="SKILL"
          loadingRows={3}
        />
      </Blocks>
    </>
  );
};

export default ChampionProbuilds;
