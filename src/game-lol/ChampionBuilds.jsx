import React, { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { Button, ButtonGroup } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import AbilitiesSmall from "@/game-lol/AbilitiesSmall.jsx";
import {
  BuildDetails,
  Container,
  ItemSeparatorContainer,
  Sidebar,
} from "@/game-lol/ChampionBuilds.style.jsx";
import ChampionImg from "@/game-lol/ChampionImg.jsx";
import {
  BOOTS,
  BUILD_TYPES,
  MYTHICS,
  PROS_FALLBACK_IMAGE,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  ROLE_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import DamageBreakdown from "@/game-lol/DamageBreakdown.jsx";
import ItemBuild from "@/game-lol/ItemBuild.jsx";
import ItemImg from "@/game-lol/ItemImg.jsx";
import ItemsContainer from "@/game-lol/ItemsContainer.jsx";
import RuneImg from "@/game-lol/RuneImg.jsx";
import RuneTree from "@/game-lol/RuneTree.jsx";
import SummonerSpells from "@/game-lol/SummonerSpells.jsx";
import TreeImg from "@/game-lol/TreeImg.jsx";
import {
  getBuildTeamImg,
  getChampionRoleById,
  getCurrentPatchForStaticData,
  getDefaultedFiltersForChampion,
  getRuneTreeObjectFromRuneArray,
  getSearchParamsForChampion,
  getStaticChampionByKey,
  getStaticData,
  getWinRateColor,
  mapRoleToSymbol,
} from "@/game-lol/util.mjs";
import {
  formatBuildPlaystyle,
  formatBuildProMatch,
} from "@/game-lol/util-builds.mjs";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import { TimeAgo } from "@/shared/Time.jsx";
import { getLocale } from "@/util/i18n-helper.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const ChampionBuilds = ({ championId, championRole }) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const [buildType, setBuildType] = useState("winrate");

  const itemsStaticData = getStaticData("items");

  const playstyleData = state.lol?.championBuilds?.[championId]?.[championRole];
  const probuildData =
    state.lol?.championProMatches?.[championId]?.[championRole];

  const playstyleBuilds = useMemo(() => {
    if (!playstyleData) return [];

    const queue = QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql;
    const role = ROLE_SYMBOL_TO_STR[mapRoleToSymbol(championRole)].gql;

    return (playstyleData.builds || [])
      .filter((b) => b.mythicId && b.primaryRune)
      .map((b) =>
        formatBuildPlaystyle({
          build: {
            key: `${championId}:${BUILD_TYPES.general}:${b.mythicId}_${b.primaryRune}:${queue}:${role}`,
            data: b,
          },
          type: buildType,
          role,
          itemsData: itemsStaticData,
        })
      );
  }, [playstyleData, itemsStaticData, championId, buildType, championRole]);

  const proMatchesBuilds = useMemo(() => {
    if (!probuildData) return [];

    const queue = QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].gql;
    const role = ROLE_SYMBOL_TO_STR[mapRoleToSymbol(championRole)].gql;

    return (probuildData.probuildMatches || []).map((b) =>
      formatBuildProMatch({
        build: {
          key: `${championId}:${BUILD_TYPES.probuild}:${b.id}:${queue}:${role}`,
          data: b,
        },
        type: buildType,
        itemsData: itemsStaticData,
      })
    );
  }, [probuildData, itemsStaticData, championId, buildType, championRole]);

  const [selectedBuild, setSelectedBuild] = useState(0);

  useEffect(() => {
    setSelectedBuild(0);
  }, [championId, championRole]);

  return (
    <Container padding="0">
      <Sidebar>
        <div className="toggleButtons">
          <ButtonGroup block>
            <Button
              className={buildType === "winrate" ? "active" : ""}
              onClick={() => setBuildType("winrate")}
            >
              {t("lol:winRate", "Win Rate")}
            </Button>
            <Button
              className={buildType === "common" ? "active" : ""}
              onClick={() => setBuildType("common")}
            >
              {t("common:common", "Common")}
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <p className="type-caption--bold">
            {t("lol:builds.playstyleBuilds", "Playstyle Builds")}
          </p>
        </div>
        <ol>
          {playstyleBuilds.map((build, i) => (
            <BuildListItem
              key={build.key}
              buildIndex={build.key}
              type="playstyle"
              buildKey={build.key}
              title={build.misc?.playstyleTitle}
              subtitle={build.games}
              keystone={build.runes[1]}
              runes={build.runes}
              handleBuildClick={() => setSelectedBuild(i)}
              mythic={
                build.items_completed.find(
                  (item) => MYTHICS[item]?.originalId
                ) || build.items_completed.find((item) => !BOOTS[item])
              }
              winrate={(build.wins / build.games) * 100}
              isSelectedKey={selectedBuild === i}
            />
          ))}
        </ol>
        {proMatchesBuilds.length ? (
          <>
            <div>
              <p className="type-caption--bold">
                {t("lol:championsPage.tabs.probuilds", "Pro Builds")}
              </p>
            </div>
            <ol>
              {proMatchesBuilds
                .sort((a, z) => a.misc.timestamp - z.misc.timestamp)
                .map((build, i) => (
                  <BuildListItem
                    key={build.key}
                    type="pro"
                    buildKey={build.key}
                    primaryImage={build.misc.playerImage}
                    title={build.misc.playerName}
                    teamImage={build.misc.player.team?.pictureUrl}
                    handleBuildClick={() =>
                      setSelectedBuild(i + playstyleBuilds.length)
                    }
                    subtitle={<TimeAgo date={build.misc?.timestamp} />}
                    keystone={build.runes[1]}
                    runes={build.runes}
                    mythic={
                      build.items_completed.find(
                        (item) => MYTHICS[item]?.originalId
                      ) || build.items_completed.find((item) => !BOOTS[item])
                    }
                    proOpponent={build.misc?.opponentChampion}
                    isSelectedKey={selectedBuild === i + playstyleBuilds.length}
                  />
                ))}
            </ol>
          </>
        ) : null}
      </Sidebar>
      <SelectedBuild
        championId={championId}
        build={[...playstyleBuilds, ...proMatchesBuilds][selectedBuild]}
      />
    </Container>
  );
};

export default memo(ChampionBuilds);

const BuildListItem = ({
  buildIndex,
  type,
  handleBuildClick,
  buildKey,
  primaryImage,
  title,
  subtitle,
  teamImage,
  keystone,
  runes,
  mythic,
  winrate,
  proOpponent,
  lockedBuild,
  isSelectedKey,
}) => {
  const { t } = useTranslation();
  const perks = getStaticData("runes");
  const isBlitzProUser = false;
  const teamImg = getBuildTeamImg(teamImage);
  const { secondTreeKey } = getRuneTreeObjectFromRuneArray(runes, perks) || {};

  const isMatchupBuild = type === "matchup";
  const isProBuild = type === "pro" || type === "competitive";

  const isSelectable =
    isBlitzProUser ||
    !(
      lockedBuild ||
      buildKey.includes(BUILD_TYPES.PREMIUM) ||
      buildKey.includes(BUILD_TYPES.PREMIUM_MATCHUP)
    );

  // Occasionally BE matchups bug out and have no items for some reason
  // We dont want these builds to render/be selectable
  if (!mythic || !keystone || (isMatchupBuild && !primaryImage)) return null;

  return (
    <li
      key={buildIndex}
      className={`itemContainer ${isSelectedKey ? "selected" : ""}`}
      onClick={handleBuildClick}
      data-selectable={isSelectable}
      style={{
        "--winrate-color": isSelectable
          ? getWinRateColor(winrate)
          : "var(--pro-solid)",
      }}
    >
      <div className="left">
        {isMatchupBuild ? (
          <div className="playerTeamImage">
            <ChampionImg
              size={40}
              disableDataTip
              championId={primaryImage}
              className="matchupChampion"
            />
            {teamImg && (
              <div className="teamImg">
                <img src={teamImg} width="15px" />
              </div>
            )}
          </div>
        ) : type === "pro" ? (
          <div className="playerTeamImage">
            <img
              src={primaryImage}
              className="matchupChampion"
              onError={(e) => (e.target.src = PROS_FALLBACK_IMAGE)}
            />
            {teamImg && (
              <div className="teamImg">
                <img src={teamImg} width="15px" />
              </div>
            )}
          </div>
        ) : type === "competitive" ? (
          <div className="playerTeamImage">
            <img
              src={primaryImage}
              className="competitiveRegion"
              onError={(e) => (e.target.src = PROS_FALLBACK_IMAGE)}
            />
            {teamImg && (
              <div className="teamImg">
                <img src={teamImg} width="15px" />
              </div>
            )}
          </div>
        ) : null}
        <div>
          <div className="itemTitle" data-selectable={isSelectable}>
            <p
              className="type-caption--bold"
              dangerouslySetInnerHTML={{
                __html: title || t("lol:builds.blitzBuild", "Blitz Build"),
              }}
            />
          </div>
          <p className={`type-caption itemSubtitle`}>
            {!isProBuild
              ? t("lol:countGame_plural", "{{count}} Games", {
                  count: subtitle.toLocaleString(),
                })
              : subtitle}
          </p>
        </div>
      </div>
      <div className="buildInfo">
        {!isSelectable ? (
          <div className="unlockContainer">
            <Button className="lockedBtn" iconLeft={null}>
              {t("common:locked", "Locked")}
            </Button>
            <Button className="unlockBtn" iconLeft={null}>
              {t("common:unlock", "Unlock")}
            </Button>
          </div>
        ) : (
          <>
            <div className="runes">
              <RuneImg size={1.75} currRune={{ id: keystone }} noTooltip />
              <div className="secondary">
                <TreeImg
                  size={0.75}
                  tree={{ key: secondTreeKey }}
                  isActive={true}
                  noBorder
                  noTooltip
                />
              </div>
            </div>
            <div className="mythic">
              <ItemImg itemId={mythic} size={1.75} noTooltip />
            </div>
            {isProBuild ? (
              <div className="opponentChampion">
                <p className="type-caption">{t("lol:vs", "vs")}</p>
                <ChampionImg
                  size={20}
                  disableDataTip
                  championId={proOpponent}
                />
              </div>
            ) : (
              <div className="winrateBadge">
                <p className="type-caption--bold">
                  {t("lol:percent", "{{number}}%", {
                    number: winrate.toLocaleString(getLocale(), {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }),
                  })}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
};

const SelectedBuild = ({ championId, build }) => {
  const { t } = useTranslation();
  const {
    parameters: [championKey],
    searchParams,
  } = useRoute();

  const state = useSnapshot(readState);

  if (!build) return null;

  const patch = getCurrentPatchForStaticData();
  const defaultRole = getChampionRoleById(championId);
  const filters = getDefaultedFiltersForChampion(searchParams, defaultRole);
  const urlParams = getSearchParamsForChampion(filters);

  const champion = getStaticChampionByKey(championKey, patch);
  const championStats =
    state.lol?.championPage?.[championId]?.[btoa(urlParams)]?.[0];

  return (
    <BuildDetails>
      <div>
        <p className="type-body2-form--active build-title">
          {t("lol:championData.coreBuildOrder", "Core Build Order")}
        </p>
        <div className="desktop">
          <ItemBuild
            starting={build.items_starting}
            items={build.items_completed}
            size={48}
          />
        </div>
        <div className="mobile">
          <ItemBuild
            starting={build.items_starting}
            items={build.items_completed}
            size={28}
          />
        </div>
      </div>
      <div className="build-container">
        <div className="flex column gap-sp-6">
          <div>
            <p className="type-body2-form--active build-title">
              {t("lol:championData.corePath", "Core Build Path")}
            </p>
            <ItemsContainer
              hideTitle
              itemOrder
              patch={patch}
              items={build.items_order}
              renderSeparator={() => {
                return (
                  <ItemSeparatorContainer>
                    <ChevronRight />
                  </ItemSeparatorContainer>
                );
              }}
            />
          </div>
          <div>
            <p className="type-body2-form--active build-title">
              {t("lol:championData.summonerSpells", "Summoner Spells")}
            </p>
            <SummonerSpells spells={build.summoner_spells} patch={patch} />
          </div>
          <div>
            <p className="type-body2-form--active build-title">
              {t("lol:abilities.damageBreakdown", "Damage Breakdown")}
            </p>
            <DamageBreakdown teamStats={[championStats]} hiddenThreshold={12} />
          </div>
        </div>
        <div className="flex column align-center">
          <p className="type-body2-form--active build-title">
            {t("lol:runes.runes", "Runes")}
          </p>
          <RuneTree
            patch={patch}
            runesList={build.runes}
            shardsList={build.rune_shards}
            hideCaption
          />
        </div>
      </div>
      <AbilitiesSmall
        champion={champion}
        skills={build.skills}
        championStats={championStats}
        showSkillOrder
      />
    </BuildDetails>
  );
};
