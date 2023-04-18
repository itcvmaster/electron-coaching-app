import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile, tablet } from "clutch";

import AbilitiesSmall from "@/game-lol/AbilitiesSmall.jsx";
import { VerticalLine } from "@/game-lol/CommonComponents.jsx";
import ItemsContainer from "@/game-lol/ItemsContainer.jsx";
import RuneTree from "@/game-lol/RuneTree.jsx";
import SummonerSpells from "@/game-lol/SummonerSpells.jsx";
import { getStaticChampionById, getStaticPatchOf } from "@/game-lol/util.mjs";
import ChevronRight from "@/inline-assets/chevron-right.svg";

const ProMatchOverviewContainer = styled("div")`
  padding: var(--sp-10);

  ${tablet} {
    .match-overview-content {
      flex-wrap: wrap;
    }
  }

  ${mobile} {
    padding: var(--sp-10) var(--sp-4) var(--sp-4);
  }

  .game-breakdown {
    margin-top: var(--sp-3);
    color: var(--shade2);
  }
`;

const DetailContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);

  ${tablet} {
    margin-top: var(--sp-8);
    margin-left: auto;
    margin-right: auto;
  }

  ${mobile} {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ItemSeparatorContainer = styled("div")`
  align-items: center;
  background: var(--shade9);
  height: var(--sp-5);
  justify-content: center;
  width: var(--sp-6);
  margin-top: var(--sp-4);
`;

const ProMatchOverview = ({ championStats = {}, matchData = {} }) => {
  const { t } = useTranslation();

  const items = [];
  const startingItems = [];

  if (matchData.buildPaths)
    matchData.buildPaths.forEach((e) => {
      if (e.timestamp < 90000 && !startingItems.includes(e.itemId))
        startingItems.push(e.itemId);
    });
  matchData.skillOrder.sort((a, b) => a.timestamp - b.timestamp);
  let lastTs = 0;
  let lastObj = {};
  if (matchData.buildPaths) {
    matchData.buildPaths.sort((a, b) => a.timestamp - b.timestamp);
    for (const item of matchData.buildPaths) {
      const id = item.itemId;
      const ts = item.timestamp;
      if (lastTs === 0) {
        lastObj = { ts, ids: [id] };
        lastTs = ts;
        continue;
      }
      if (ts - lastTs > 15000) {
        items.push(lastObj);
        lastObj = { ts, ids: [id] };
        lastTs = ts;
      } else {
        lastObj.ids = [...lastObj.ids, id];
        lastTs = ts;
      }
    }
    items.push(lastObj);
  }

  const patch = getStaticPatchOf(matchData.patch);
  const champion = getStaticChampionById(
    Number.parseInt(matchData.champion),
    patch
  );

  const mainRunes = matchData.runes.map((rune) => rune.id);
  const runes = [
    matchData.runePrimaryTree,
    mainRunes[0],
    mainRunes[1],
    mainRunes[2],
    mainRunes[3],
    matchData.runeSecondaryTree,
    mainRunes[4],
    mainRunes[5],
  ]
    .filter(Boolean)
    .map((rune) => Number(rune));

  return (
    <ProMatchOverviewContainer>
      <div className="flex gap-sp-6 match-overview-content">
        <div className="flex column gap-sp-6">
          <div className="flex row gap-sp-6">
            <div>
              <p className="type-body2 mb-sp-1">
                {t("lol:championData.summonerSpells", "Summoner Spells")}
              </p>
              <SummonerSpells
                spells={
                  matchData.spells.length > 0
                    ? matchData.spells[0].ids.map((id) => Number.parseInt(id))
                    : []
                }
                patch={patch}
              />
            </div>
            <VerticalLine />
            <ItemsContainer
              itemTitle={t("lol:championData.startingItems", "Starting Items")}
              stats={championStats}
              items={startingItems}
              itemStyle={{
                borderRadius: 4,
                height: 28,
                width: 28,
              }}
            />
          </div>
          <ItemsContainer
            hideWinrate
            items={items}
            itemTitle={t("lol:championData.buildPath", "Build Path") + ":"}
            wins={championStats?.stats?.core_builds?.wins || 0}
            games={championStats?.stats?.core_builds?.games || 0}
            itemContainerStyle={{
              marginBottom: "8px",
            }}
            size={2.25}
            renderSeparator={() => {
              return (
                <ItemSeparatorContainer>
                  <ChevronRight />
                </ItemSeparatorContainer>
              );
            }}
          />
          <ItemsContainer
            hideWinrate
            itemTitle={t("lol:championData.finalItems", "Final Items")}
            items={matchData.items.map((e) => e.id)}
            size={2.25}
          />
          <AbilitiesSmall
            probuildsTab
            showSkillOrder
            champion={champion}
            skills={
              matchData.skillOrder
                ? matchData.skillOrder.map((entry) => entry.skillSlot)
                : []
            }
            championStats={championStats}
          />
        </div>
        <DetailContent>
          <div className="flex">
            {runes.length > 0 && (
              <RuneTree
                keystoneSize={3.25}
                runesList={runes}
                shardsList={matchData.runeShards}
              />
            )}
          </div>
        </DetailContent>
      </div>
    </ProMatchOverviewContainer>
  );
};

export default ProMatchOverview;
