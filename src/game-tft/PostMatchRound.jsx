import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { ToggleSwitch } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import StaticLOL from "@/game-lol/static.mjs";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import { PostMatchContent } from "@/game-tft/CommonComponents.jsx";
import getStageFromRound from "@/game-tft/get-stage-from-round.mjs";
import PostMatchProNoData from "@/game-tft/PostMatchProNoData.jsx";
import PostMatchRoundCarousel from "@/game-tft/PostMatchRoundCarousel.jsx";
import PostMatchRoundNoBlitzPro, {
  refs,
} from "@/game-tft/PostMatchRoundNoBlitzPro.jsx";
import PostMatchRoundPlayerBoard from "@/game-tft/PostMatchRoundPlayerBoard.jsx";
import PostMatchRoundPlayerCard from "@/game-tft/PostMatchRoundPlayerCard.jsx";
import PostMatchRoundStageSelector from "@/game-tft/PostMatchRoundStageSelector.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import useItemUrl from "@/game-tft/use-item-url.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import usePlayerByMatch from "@/game-tft/use-player-by-match.mjs";
import useRoundManager from "@/game-tft/use-round-manager.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";
import useTraits from "@/game-tft/use-traits.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";
import isEmpty from "@/util/is-empty.mjs";

/**
 * PostMatch RoundBreakDown (RBD)
 * @returns {JSX.Element}
 * @constructor
 */
function PostMatchRound() {
  // Hooks
  const { t } = useTranslation();
  const currentMatch = useMatch();
  const enemy = useRBDEnemy(); // RBD specific
  const ally = useRBDAlly(); // RBD specific
  const players = useRBDPlayers(); // RBD specific
  const { summoner } = usePlayerByMatch();
  const [isToggle, setToggle] = useState(true);
  const player = useMemo(
    () => players.find((i) => i.id === summoner.name) || {},
    [players, summoner.name]
  );
  const isViewingExpired = useMemo(() => {
    // Users see promotion by visibility logic
    if (currentMatch && !(currentMatch instanceof Error)) {
      const expired = new Date(currentMatch.data.createdAt); // From scoreboard data
      expired.setHours(24 + expired.getHours()); // Give users 24 hour for free
      return new Date() > expired;
    }
    return true; // By default we don't show the feature
  }, [currentMatch]);
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const roundBreakdown = currentMatch.extra.RoundBreakDown;
  // Render
  if (!roundBreakdown.length) {
    if (!isViewingExpired) {
      // No data is available + user has 24h for the free feature
      // Note: BE destroys the RBD data after 24h
      return <PostMatchProNoData />;
    }
    // User has exceeded the free 24h feature
    return <PostMatchRoundNoBlitzPro />;
  }
  return (
    <div
      className={css`
        display: flex;
        gap: var(--sp-4);
        flex-direction: column;
      `}
    >
      <Container>
        <Header>
          <TitleContainer>
            <Title>
              {t("tft:postmatchInsights.roundBreakdown", "Round Breakdown")}
            </Title>
            <refs.PostMatchNotification />
          </TitleContainer>
          <Settings>
            <ToggleSwitch
              value={isToggle}
              labelText={t("tft:postmatchInsights.enemyBoard", "Enemy Board")}
              onChange={setToggle}
            />
          </Settings>
        </Header>
        <Box>
          <PostMatchContent style={{ overflow: "visible" }}>
            <PostMatchRoundStageSelector />
          </PostMatchContent>
          <PostMatchContent style={{ padding: 0 }}>
            <PostMatchRoundCarousel />
          </PostMatchContent>
          <Board>
            <Graphs>
              {isToggle ? (
                <PostMatchRoundPlayerBoard
                  isEnemy
                  units={enemy.units}
                  benchedUnits={enemy.benchedUnits}
                  benchedItems={enemy.benchedItems}
                  traits={enemy.traits}
                  username={enemy.username}
                  avatarUrl={enemy.avatarUrl}
                />
              ) : null}
              <PostMatchRoundPlayerBoard
                isAlly
                units={ally.units}
                benchedUnits={ally.benchedUnits}
                benchedItems={ally.benchedItems}
                traits={ally.traits}
                username={ally.username}
                avatarUrl={ally.avatarUrl}
              />
            </Graphs>
            <PostMatchContent
              className={css`
                padding: 0 !important;
                height: fit-content;
                max-width: 104px;
              `}
            >
              <Players>
                {isToggle ? (
                  <>
                    {players.map(({ id, username, hp, status, url }) => (
                      <Player
                        key={id}
                        $isPlayer={username === player.username}
                        $isDead={hp <= 0}
                        onClick={() => {}}
                      >
                        <PostMatchRoundPlayerCard
                          username={username}
                          hp={hp}
                          status={status}
                          url={url}
                        />
                      </Player>
                    ))}
                    {isToggle ? (
                      <div
                        className="SeeAllButton"
                        onClick={() => setToggle(false)}
                      >
                        {t("common:seeLess", "See Less")}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Player $isPlayer $isDead={player.hp <= 0}>
                      <PostMatchRoundPlayerCard
                        username={player.id}
                        hp={player.hp}
                        status={player.status}
                        url={player.url}
                      />
                    </Player>
                    <div
                      className="SeeAllButton"
                      onClick={() => setToggle(true)}
                    >
                      {t("common:seeAll", "See All")}
                    </div>
                  </>
                )}
              </Players>
            </PostMatchContent>
          </Board>
        </Box>
      </Container>
      <refs.PostMatchRoundNoBlitzProMini />
    </div>
  );
}

export default PostMatchRound;

// Utility + helper functions specific to this page and its children
export function useRBDRound() {
  const { t } = useTranslation();
  const currentMatch = useMatch();
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundNameByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const roundIdx = useMemo(() => {
    if (
      currentMatch &&
      !(currentMatch instanceof Error) &&
      typeof currentMatch.rbdRoundPosition === "number"
    )
      return currentMatch.rbdRoundPosition;
    return 0;
  }, [currentMatch]);
  const rounds = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.extra.RoundBreakDown.filter(
        (round) => round.player?.hp > 0
      );
    return [];
  }, [currentMatch]);
  const round = useMemo(() => rounds[roundIdx], [rounds, roundIdx]);
  const roundTransformed = useMemo(() => {
    const result = Object.create(null);
    if (round) {
      result.round = round.round.replace("_", "-") || "-";
      result.enemyName =
        round.enemy ||
        getRoundNameByTarget(round.round.replace("-", "_")) ||
        t("common:noEnemy", "No enemy");
      result.gold = round.player.goldCurrent;
      result.winStreak = round.player.winStreak;
      result.level = round.player.level;
    }
    return result;
  }, [getRoundNameByTarget, round, t]);
  return {
    round,
    roundIdx,
    roundTransformed,
  };
}

export function useRBDRounds() {
  const currentMatch = useMatch();
  if (currentMatch && !(currentMatch instanceof Error))
    return currentMatch.extra.RoundBreakDown.filter(
      (round) => round.player?.hp > 0
    );
  return [];
}

export function useRBDStage() {
  const { round } = useRBDRound();
  if (round) return getStageFromRound(round.round);
  return 0;
}

function useRBDEnemy() {
  const state = useSnapshot(readState);
  const { round } = useRBDRound();
  const players = useRBDPlayers();
  const { t } = useTranslation();
  const { getItemUrlById, getItemById } = useItemUrl();
  const currentMatch = useMatch();
  const selectedSet = useSetByMatch();
  const traitsStaticData = useTraits();
  const queueType = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return currentMatch.data.queueId;
    return "";
  }, [currentMatch]);
  const { getRoundNameByTarget, getRoundUrlByTarget } = useRoundManager({
    isDefaultPlaceholder: false,
    queueType,
  });
  const unitsStaticData = state.tft.champions;
  const roundEnemy = useMemo(() => {
    if (round) {
      for (const opponent of round.opponents) {
        if (typeof opponent.username === "undefined") break;
        if (
          typeof opponent.username === "string" ||
          new RegExp(opponent.username, "i").test(round.enemy)
        ) {
          return opponent;
        }
      }
    }
    return null;
  }, [round]);
  return useMemo(() => {
    let username = t("common:noEnemy", "No enemy"),
      avatarUrl = "",
      benchedUnits = [],
      benchedItems = [],
      traits = [];
    const unitBoardPlacementMap = new Map();
    if (roundEnemy) {
      roundEnemy.units.forEach((i, idx) => {
        const champKey = getChampionNameFromString(i.id || i.name);
        let url = "";
        if (champKey !== "")
          url = StaticTFT.getChampionImage(champKey, selectedSet);
        unitBoardPlacementMap.set(i.boardPosition, {
          id: idx,
          key: champKey,
          url,
          tier: i.stars || 0,
          items: Object.values(i.items).map((i) => getItemById(i).key),
        });
      });
      benchedUnits = roundEnemy.benchUnits
        .map((i, idx) => {
          const champKey = getChampionNameFromString(i.id || i.name);
          return {
            id: idx,
            key: champKey,
            url: StaticTFT.getChampionImage(champKey, selectedSet),
            tier: i.stars || 0,
            items: Object.values(i.items).map((i) => getItemById(i).key),
          };
        })
        .filter((unit) => unit.key !== "Hexcore");
      benchedItems = Object.values(roundEnemy.benchItems).map((item, idx) => {
        return { id: idx, key: item, url: getItemUrlById(item) };
      });
      traits = StaticTFT.inferTraitsFromUnits({
        units:
          roundEnemy.units.map((i) => {
            return {
              character_id: i.id || "",
            };
          }) || [],
        traitsStaticData,
        unitsStaticData,
        matchSet: selectedSet,
      });
      if (round) {
        username =
          round.enemy || getRoundNameByTarget(round.round.replace("-", "_"));
        avatarUrl =
          players.find((player) => player.username === round.enemy)?.url ||
          getRoundUrlByTarget(round.round.replace("-", "_"));
      }
    }
    return formatPlayer({
      username,
      avatarUrl,
      traits,
      units: unitBoardPlacement(unitBoardPlacementMap),
      benchedUnits,
      benchedItems,
    });
  }, [
    getItemById,
    getItemUrlById,
    getRoundNameByTarget,
    getRoundUrlByTarget,
    players,
    round,
    roundEnemy,
    selectedSet,
    t,
    traitsStaticData,
    unitsStaticData,
  ]);
}

function useRBDAlly() {
  const state = useSnapshot(readState);
  const { round } = useRBDRound();
  const players = useRBDPlayers();
  const { t } = useTranslation();
  const { getItemUrlById, getItemById } = useItemUrl();
  const selectedSet = useSetByMatch();
  const unitsStaticData = state.tft.champions;
  const traitsStaticData = useTraits();
  const unitBoardPlacementMap = new Map();
  let username = t("common:noUser", "No user"),
    avatarUrl = "",
    traits = [],
    benchedUnits = [],
    benchedItems = [];
  if (round) {
    round.player.units.forEach((i, idx) => {
      const champKey = getChampionNameFromString(i.id || i.name);
      let url = "";
      if (champKey !== "")
        url = StaticTFT.getChampionImage(champKey, selectedSet);
      unitBoardPlacementMap.set(i.boardPosition, {
        id: idx,
        key: champKey,
        url,
        tier: i.stars || 0,
        items: Object.values(i.items).map((i) => getItemById(i).key),
      });
    });
    username = round.player.username;
    avatarUrl = players.find(
      (player) => player.username === round.player.username
    ).url;
    traits = StaticTFT.inferTraitsFromUnits({
      units:
        round.player.units.map((i) => {
          return {
            character_id: i.id || "",
          };
        }) || [],
      traitsStaticData,
      unitsStaticData,
      matchSet: selectedSet,
    });
    benchedUnits = round.player.benchUnits
      .map((i, idx) => {
        const champKey = getChampionNameFromString(i.id || i.name);
        return {
          id: idx,
          key: champKey,
          url: StaticTFT.getChampionImage(champKey, selectedSet),
          tier: i.stars || 0,
          items: Object.values(i.items).map((i) => getItemById(i).key),
        };
      })
      .filter((unit) => unit.key !== "Hexcore");
    benchedItems = Object.values(round.player.benchItems).map((item, idx) => {
      return { id: idx, key: item, url: getItemUrlById(item) };
    });
  }
  return formatPlayer({
    username,
    avatarUrl,
    traits,
    units: unitBoardPlacement(unitBoardPlacementMap),
    benchedUnits,
    benchedItems,
  });
}

export function useRBDPlayers() {
  const state = useSnapshot(readState);
  const { round } = useRBDRound();
  const latestPatch = getCurrentPatchForStaticData() || "";
  const summoners = state.tft.summoners;
  const players = [];
  if (round) {
    if (typeof round.player === "object" && !isEmpty(round.player)) {
      let summoner = {};
      if (
        typeof round.player.username === "string" &&
        typeof summoners === "object"
      ) {
        for (const key in summoners) {
          const i = summoners[key];
          if (new RegExp(round.player.username, "i").test(i?.name)) {
            summoner = i;
            break;
          }
        }
      }
      players.push({
        id: round.player.username,
        username: round.player.username || "",
        room: round.player.room || 0,
        hp: round.player.hp || 0,
        status: round.player.isWinner ? "win" : "loss",
        url: StaticLOL.getProfileIcon(
          summoner.profileiconid || 29,
          latestPatch
        ),
      });
    }
    if (Array.isArray(round.opponents) && round.opponents.length) {
      round.opponents.forEach((player) => {
        let summoner = {};
        for (const key in summoners) {
          const i = summoners[key];
          if (new RegExp(player.username, "i").test(i?.name)) {
            summoner = i;
            break;
          }
        }
        players.push({
          id: player.username,
          username: player.username || "",
          room: player.room || 0,
          hp: player.hp || 0,
          status: player.isWinner
            ? "win"
            : player.isWinner === false
            ? "loss"
            : "",
          url: StaticLOL.getProfileIcon(
            summoner.profileiconid || 29,
            latestPatch
          ),
        });
      });
    }
  }
  players.sort((a, b) => b.hp - a.hp);
  return players;
}

function formatPlayer(player = {}) {
  fillArray(player.benchedUnits, 9);
  fillArray(player.benchedItems, 9);
  return player;
}

function getChampionNameFromString(string) {
  // eg. "TFT6_Twitch"
  // eg. "U2000168_TFT6_Twitch_2"
  return ((string || "").match(/TFT\d_([a-zA-Z]*)/) || [])[1] || "";
}

function unitBoardPlacement(placementMap) {
  // Settings for TFT board UI
  const rows = 4;
  const cols = 7;
  const result = [];

  for (let i = 0; i < rows; i++) {
    result.push([]);
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      const unitAtPosition = placementMap.get(index);
      if (unitAtPosition) {
        result[i].push(unitAtPosition);
      } else {
        result[i].push(Object.create(null));
      }
    }
  }
  return result;
}

function fillArray(target = [], num) {
  if (!Array.isArray(target)) return;
  for (let i = target.length; i < num; i += 1) {
    target.push({
      id: i,
      key: "",
      url: "",
    });
  }
}

// Styles
const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Box = styled("div")({
  background: "var(--shade8)",
  padding: "var(--sp-5)",
  borderRadius: "var(--sp-1)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});
const Header = styled("div")({
  color: "var(--shade0)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
const Players = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  transition: height 500ms;
  overflow: hidden;

  .SeeAllButton {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    background: var(--shade6);

    font-weight: bold;
    font-size: 13px;
    line-height: 19px;
    color: var(--shade2);
  }

  .SeeAllButton:hover {
    color: var(--shade1);
  }
`;
const Player = styled("div")`
  padding: 16px;
  border-bottom: 1px solid var(--shade5);
  background: ${({ $isPlayer, $isDead }) =>
    $isPlayer ? "var(--shade5)" : $isDead ? "var(--shade9)" : "transparent"};
  width: 100%;
  &:last-of-type {
    border-bottom: none;
  }
  &:hover {
    ${({ $isPlayer, $isDead }) =>
      !$isPlayer &&
      !$isDead &&
      `
      background: var(--shade5-50);`}
  }
`;
const Title = styled("h1")`
  font-size: 20px;
  color: var(--shade0);
`;
const Board = styled("div")`
  display: flex;
  gap: 8px;
  & > * {
    flex: 1 100%;
  }
`;
const Graphs = styled("div")`
  flex-direction: column;
  display: flex;
  gap: 8px;
`;
const Settings = styled("div")`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 24px;
`;
const TitleContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: var(--sp-3);
`;
