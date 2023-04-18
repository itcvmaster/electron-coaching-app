import { t } from "i18next";
import s2, { computed } from "s2-engine";

import { readState } from "@/__main__/app-state.mjs";
import { kdaColorStyle, winRatecolorRange } from "@/app/util.mjs";
import LoLColors from "@/game-lol/colors.mjs";
import {
  BOOTS,
  INGAME_PHASES,
  MYTHICS,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  RANK_SYMBOL_TO_STR,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
  shardMap,
} from "@/game-lol/constants.mjs";
import getPlayStylesIcon from "@/game-lol/get-playstyle-icon.mjs";
import getRankIcon from "@/game-lol/get-rank-icon.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import { importBuild } from "@/game-lol/in-game-builds.mjs";
import derivedState from "@/game-lol/in-game-derived-state.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import template from "@/game-lol/in-game-template.mjs";
import {
  displayCareer,
  displayMetaBans,
  displayMetaPopularBans,
  displayPersonalPicks,
  formatBuildOrder,
  formatSkillOrder,
  isBanPhase,
} from "@/game-lol/in-game-util.mjs";
import lolClient from "@/game-lol/lol-client.mjs";
import Static from "@/game-lol/static.mjs";
import {
  calculateTeamDamages,
  getCurrentPatchForStaticData,
  getDamageTextPercentage,
  getShortTierFromRank,
  getStaticChampionById,
  getStaticData,
  mapRoleToSymbol,
} from "@/game-lol/util.mjs";
import * as BlitzLogo from "@/inline-assets/blitz-logo-bolt.svg";
import * as RoleAll from "@/inline-assets/lol-role-all.svg";
import * as RoleBot from "@/inline-assets/lol-role-bot.svg";
import * as RoleJng from "@/inline-assets/lol-role-jungle.svg";
import * as RoleMid from "@/inline-assets/lol-role-mid.svg";
import * as RoleSup from "@/inline-assets/lol-role-support.svg";
import * as RoleTop from "@/inline-assets/lol-role-top.svg";
import * as ProBuildsLogo from "@/inline-assets/probuilds.svg";
import * as Swords from "@/inline-assets/swords.svg";
import { devError, IS_NODE } from "@/util/dev.mjs";
import globals from "@/util/global-whitelist.mjs";
import { calcKDA, calcRate } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const roleIcons = {
  [ROLE_SYMBOLS.all]: RoleAll.svg,
  [ROLE_SYMBOLS.top]: RoleTop.svg,
  [ROLE_SYMBOLS.jungle]: RoleJng.svg,
  [ROLE_SYMBOLS.mid]: RoleMid.svg,
  [ROLE_SYMBOLS.adc]: RoleBot.svg,
  [ROLE_SYMBOLS.adc]: RoleBot.svg,
  [ROLE_SYMBOLS.support]: RoleSup.svg,
};

// TODO: move to module import
const tierIcons = {
  1: "#tier1",
  2: "#tier2",
  3: "#tier3",
  4: "#tier4",
  5: "#tier5",
};

// Disabling this lets us remove the root node from the DOM
// and continue updating as it should. Otherwise the default behavior
// is to call `unmount` when root nodes are removed from DOM.
s2.shouldUnmountRoot = false;

// [lolKey, fallback, options (optional)]
const lolTranslations = [
  ["rankedStats", "Ranked Stats"],
  ["championProficiency", "Champion proficiency"],
  ["teams.your", "Your Team"],
  ["teams.enemy", "Enemy Team"],
  ["teamDamageBreakdown", "Team damage breakdown"],
];

const parseTranslation = ([rawKey, fallback, opts = {}]) => {
  return t(rawKey, fallback, {
    ns: ["lol"],
    ...opts,
  });
};

const translations = lolTranslations.reduce((p, c) => {
  const sanitizedKey = c[0].replace(/\./g, "_");
  const fnKey = `t_${sanitizedKey}`;
  const value = parseTranslation(c);
  p[fnKey] = () => value;
  return p;
}, {});

function computedSummoner(cellId) {
  const patch = getCurrentPatchForStaticData();
  const spells = getStaticData("spells");
  const champions = getStaticData("champions");
  const isARAM =
    inGameState.queueId?.toString() ===
    QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.aram].key;
  const isFLEX =
    inGameState.queueId?.toString() ===
    QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedFlex].key;

  return computed({
    isInProgress() {
      if (!inGameState.currentState) return null;
      const { isInProgress, championId, championPickIntent } =
        inGameState.currentState.summonersByCellId[cellId];
      return isInProgress
        ? "in-progress"
        : !!championId && !championPickIntent
        ? "picked"
        : "not-picked";
    },
    isLocalPlayer() {
      if (!inGameState.currentState) return null;
      const { localPlayerCellId } = inGameState.currentState;
      return localPlayerCellId === parseInt(cellId);
    },
    name() {
      if (!inGameState.currentState) return null;
      const { summonerNamesByCellId, currentState } = inGameState;
      const isBot = currentState.summonersByCellId[cellId].isBot;
      const name = summonerNamesByCellId[cellId];
      return isBot
        ? t("lol:roles.bot", "Bot")
        : name ?? t("lol:summoner", "Summoner");
    },
    isMVP() {
      const { currentMvp } = inGameState;
      return currentMvp.cellId === cellId;
    },
    premade() {
      if (!inGameState.currentState) return null;
      const { summonerPremadesByCellId, currentState } = inGameState;
      const { localPlayerCellId, summonersByCellId } = currentState;
      const allyTeamId = summonersByCellId[localPlayerCellId]?.team;
      const teamId = summonersByCellId[cellId]?.team;
      const isAlly = allyTeamId === teamId;
      const premades = summonerPremadesByCellId[cellId] ?? {};

      let premadeName = null;
      let premadeColor = isAlly ? "ap" : "ad";

      if (premades.team) {
        switch (premades.size) {
          case 2:
            premadeName = "duo";
            break;
          case 3:
            premadeName = "trio";
            break;
          case 4:
            premadeName = "quad";
            break;
          case 5:
            premadeName = "penta";
            break;
        }
        if (premades.team === "B") {
          premadeColor = isAlly ? "turq" : "tier2";
        }
      }

      return {
        premadeSvg: premadeName ? getPlayStylesIcon(premadeName, true) : null,
        premadeStyle: `--premade-color: var(--${premadeColor});`,
      };
    },
    enemyWinRate() {
      const { summonerChampionStatsByCellId } = inGameState;
      const allChampStats = summonerChampionStatsByCellId[cellId] ?? null;

      let wins = 0;
      let games = 0;
      let losses = 0;

      if (allChampStats) {
        for (const entry of allChampStats) {
          if (!entry || !entry.basicStats) continue;
          games += entry.gameCount || 0;
          wins += entry.basicStats.wins || 0;
        }
        losses = games - wins;
      }

      const percent = Math.round(calcRate(wins, wins + losses, 0) * 100);

      return allChampStats ? t("lol:percentWinrate", { winrate: percent }) : ``;
    },
    tags() {
      if (!inGameState.currentState) return null;
      const { summonerTagsByCellId, currentState } = inGameState;
      const tags = summonerTagsByCellId[cellId] ?? [];
      const assignedPosition =
        currentState.summonersByCellId[cellId]?.assignedPosition;

      return tags
        .filter(
          (tag) =>
            !tag.role ||
            (tag.role === "JUNGLE" && assignedPosition === "jungle") ||
            (tag.role === "NOT_JUNGLE" && assignedPosition !== "jungle")
        )
        .map((tag) => ({
          tagText: tag.content,
          tagIcon: tag.icon,
          tagClass: `summoner__tag ${tag.color ? tag.color : "neutral"}`,
        }));
    },
    onMouseOver(event) {
      event.target.scrollTo({
        top: 0,
        left: 500,
        behavior: "smooth",
      });
    },
    onMouseOut(event) {
      event.target.scrollTo({
        top: 0,
        left: -500,
        behavior: "smooth",
      });
    },
    badge() {
      if (!inGameState.currentState) return null;
      const { summonerPlayStylesByCellId } = inGameState;
      const { championId, championPickIntent } =
        inGameState.currentState.summonersByCellId[cellId];
      const playStyles = summonerPlayStylesByCellId[cellId];
      const id = String(championId || championPickIntent);
      const badge = { show: false, svg: "" };

      if (!playStyles || !id) return badge;

      const { championCounts, totalGames } = playStyles;
      const currentChamp = championCounts.find((item) => {
        return item.id === id;
      });
      const champGamesPercent = Math.round(
        ((currentChamp?.count ?? 0) / totalGames) * 100
      );

      if (Number.isNaN(champGamesPercent)) return badge;

      switch (true) {
        case champGamesPercent < 1:
          badge.svg = getPlayStylesIcon("rusty", true);
          break;
        case champGamesPercent < 15:
          badge.svg = "";
          break;
        case champGamesPercent < 25:
          badge.svg = getPlayStylesIcon("fan", true);
          break;
        case champGamesPercent < 50:
          badge.svg = getPlayStylesIcon("lover", true);
          break;
        case champGamesPercent >= 50:
          badge.svg = getPlayStylesIcon("otp", true);
          break;
        default:
          return badge;
      }
      badge.show = true;
      return badge;
    },
    spell1() {
      if (!inGameState.currentState) return null;
      const { spell1Id } =
        inGameState.currentState.summonersByCellId[cellId] ?? {};

      if (spell1Id) {
        const spellUrl = Static.getSpellImageById(spells, spell1Id);
        return `background-image: url(${spellUrl});`;
      }
      return undefined;
    },
    spell2() {
      if (!inGameState.currentState) return null;
      const { spell2Id } =
        inGameState.currentState.summonersByCellId[cellId] ?? {};

      if (spell2Id) {
        const spellUrl = Static.getSpellImageById(spells, spell2Id);
        return `background-image: url(${spellUrl});`;
      }
      return undefined;
    },
    hasAssignedPosition() {
      if (!inGameState.currentState) return null;
      return Boolean(
        inGameState.currentState.summonersByCellId[cellId].assignedPosition
      );
    },
    roleSvg() {
      if (!inGameState.currentState) return null;
      const { summonersByCellId } = inGameState.currentState;
      const assignedPosition =
        summonersByCellId[cellId]?.assignedPosition ?? null;
      const svg = getRoleIcon(assignedPosition, true);
      return svg ?? null;
    },
    rankedStats() {
      if (!inGameState.currentState) return null;
      const { summonerAccountsByCellId, summonerChampionStatsByCellId } =
        inGameState;
      const accounts = summonerAccountsByCellId[cellId];
      const allChampStats = summonerChampionStatsByCellId[cellId] ?? null;

      const { championId, championPickIntent } =
        inGameState.currentState.summonersByCellId[cellId];
      const id = String(championId || championPickIntent);

      let wins = 0;
      let games = 0;
      let losses = 0;

      const champ = {
        // Calculated
        kda: "-",
        kdaColor: `color: ${kdaColorStyle(0, 0, 0)};`,
        kdaString: "- / - / -",
        winRate: 0,

        // Aggregated
        games: 0,
        wins: 0,
        kills: [],
        killsAve: 0,
        deaths: [],
        deathsAve: 0,
        assists: [],
        assistsAve: 0,
      };

      if (allChampStats) {
        for (const entry of allChampStats) {
          if (!entry || !entry.basicStats) continue;
          games += entry.gameCount || 0;
          wins += entry.basicStats.wins || 0;

          if (entry.championId === id) {
            champ.kills.push(entry.basicStats.kills || 0);
            champ.deaths.push(entry.basicStats.deaths || 0);
            champ.assists.push(entry.basicStats.assists || 0);
            champ.games += entry.gameCount || 0;
            champ.wins += entry.basicStats.wins || 0;
          }
        }

        if (id) {
          ["kills", "deaths", "assists"].forEach((key) => {
            const sum = champ[key].reduce((a, b) => a + b, 0);
            champ[key + "Ave"] = champ.games === 0 ? 0 : sum / champ.games;
          });
          champ.kda = calcKDA(
            champ.killsAve,
            champ.deathsAve,
            champ.assistsAve,
            2
          ).toFixed(2);
          champ.winRate = Math.round(calcRate(champ.wins, champ.games) * 100);
          champ.winRateColor = `color: ${winRatecolorRange(champ.winRate)};`;
          champ.kdaColor = `color: ${kdaColorStyle(
            champ.killsAve,
            champ.deathsAve,
            champ.assistsAve
          )};`;
          champ.kdaString = `${champ.killsAve
            .toFixed(1)
            .toLocaleString()} / ${champ.deathsAve
            .toFixed(1)
            .toLocaleString()} / ${champ.assistsAve
            .toFixed(1)
            .toLocaleString()}`;
        }
        losses = games - wins;
      }

      const rankings = [];

      for (const idx in accounts?.latestRanks) {
        const { rank, tier, queue, insertedAt } =
          accounts?.latestRanks[idx] ?? {};
        rankings.push({ queue, rank, tier, insertedAt });
      }

      const { rank, tier } =
        rankings
          .filter((r) => {
            if (!r.queue) {
              return false;
            }
            if (isARAM) {
              return r.queue === QUEUE_SYMBOLS.aram;
            }
            switch (r.queue) {
              case QUEUE_SYMBOLS.rankedFlex:
              case QUEUE_SYMBOLS.rankedSoloDuo:
                return true;
              default:
                return false;
            }
          })
          .sort((a, b) => {
            // Sort same queues to most recent first
            return a.insertedAt > b.insertedAt ? -1 : 1;
          })
          .sort((a, b) => {
            // Sort Ranked Solo/Duo (420) > Ranked Flex (440) > Unranked
            return a.queue === b.queue
              ? 0
              : isFLEX
              ? a.queue === QUEUE_SYMBOLS.rankedFlex &&
                b.queue === QUEUE_SYMBOLS.rankedSoloDuo
              : a.queue === QUEUE_SYMBOLS.rankedSoloDuo &&
                b.queue === QUEUE_SYMBOLS.rankedFlex
              ? 1
              : -1;
          })[0] ?? {};

      const {
        text: shortTierRankText,
        colors: { text: rankColor },
      } = getShortTierFromRank(rank, tier);

      const percent = Math.round(calcRate(wins, wins + losses, 0) * 100);

      if (
        inGameState.currentMvp.score < champ.winRate &&
        champ.games > 25 &&
        champ.winRate > 60
      ) {
        inGameState.currentMvp.score = champ.winRate;
        inGameState.currentMvp.cellId = cellId;
      }

      return {
        hasLeagueProfile: !!accounts,
        champSelected: !!accounts && id !== "0",
        svg:
          getRankIcon(RANK_SYMBOL_TO_STR[tier]?.capped ?? "NONE", true) ?? null,
        tier: shortTierRankText,
        rankColor: `color: ${rankColor};`,
        percent: t("lol:percent", { number: percent }),
        winRateColor: `color: ${winRatecolorRange(percent)};`,
        gamesPlayed: t("lol:countGame", { count: games }),
        champWinRate: t("lol:percent", { number: champ.winRate }),
        champWinRateColor: champ.winRateColor,
        champGames: t("lol:countPlayed", {
          count: champ.games,
        }),
        champKDA: `${champ.kda}`,
        champKDAColor: champ.kdaColor,
        t_stats_kda: t("common:stats.kda", "KDA"),
        champKDAString: `${champ.kdaString}`,
      };
    },
    championImgUrl() {
      if (!inGameState.currentState) return null;
      const state = readState;
      const { championId, championPickIntent, isBot } =
        inGameState.currentState.summonersByCellId[cellId];
      const id = championId || championPickIntent;

      if (!id && !isBot) {
        return null;
      }

      const champion = getStaticChampionById(id, patch, state);

      return Static.getChampionImage(champion?.key);
    },
    championSplashBackgroundImg() {
      if (!inGameState.currentState) return null;
      const { championId, championPickIntent, isBot } =
        inGameState.currentState.summonersByCellId[cellId];
      const id = championId || championPickIntent;

      if (!id && !isBot) {
        return null;
      }

      const bgImg = Static.getChampionSplashImageById(champions, id);

      return `background-image: url(${bgImg});`;
    },
  });
}

let remainingTime = 0;
let lastTotalTime = 0;
let lastTimeout = 0;
let lastPhaseType = "UNKNOWN";

const computedDamages = (teamCellIds) => {
  if (!inGameState.currentState) return null;

  const {
    championStats,
    currentState: { summonersByCellId, localPlayerCellId },
  } = inGameState;
  const myTeam = summonersByCellId[localPlayerCellId]?.team;
  const team = teamCellIds.map((cellId) => summonersByCellId[cellId]);
  const { apDamageShare, adDamageShare, trueDamageShare } =
    calculateTeamDamages(team, championStats);

  return {
    t_teamDamageBreakdown:
      myTeam === team[0]?.team
        ? t("lol:allyDamageBreakdown", "Team damage breakdown")
        : t("lol:enemyDamageBreakdown", "Enemy damage breakdown"),
    adPercentText: getDamageTextPercentage(adDamageShare, "AD"),
    apPercentText: getDamageTextPercentage(apDamageShare, "AP"),
    truePercentText: getDamageTextPercentage(trueDamageShare, "True"),
    apStyles: `width: ${apDamageShare}%;`,
    adStyles: `width: ${adDamageShare}%;`,
    trueStyles: `width: ${trueDamageShare}%;`,
  };
};

// Suggestions stuff
const max = 15;
const min = 3;

async function instaBanPick(e) {
  e.preventDefault();
  if (!inGameState.currentState) return;
  const { id } = this; // eslint-disable-line no-invalid-this
  const { options, currentState } = inGameState;
  const { localPlayerCellId, phase, actions } = currentState;
  const phaseType = phase?.type === INGAME_PHASES[1] ? "ban" : "pick";

  // find the action id...
  let pickAction;
  if (!actions) return;

  for (const group of actions) {
    for (const action of group) {
      const { type, actorCellId } = action;

      if (actorCellId === localPlayerCellId && type === phaseType) {
        pickAction = action;
        break;
      }
    }
  }
  if (!pickAction) return;
  options.suggestionsClickedId = id;
  pickAction.championId = id;
  pickAction.isInProgress = false;
  pickAction.completed = true;
  await lolClient.request(
    "patch",
    `/lol-champ-select/v1/session/actions/${pickAction.id}`,
    pickAction
  );
  console.log(`[Suggestions] ${phaseType}: ${id}`); // eslint-disable-line no-console
}

// Click event to declare a ban/pick
function declareClick(event) {
  event.preventDefault();
  if (!inGameState.currentState) return;
  const { id } = this; // eslint-disable-line no-invalid-this
  const { currentState, options } = inGameState;

  const phase = currentState?.phase?.type;

  if (phase === "BANNING") {
    options.suggestionsClickedBanId = id;
  } else {
    options.suggestionsClickedPickId = id;
  }

  console.log(`[Suggestions] Declared ${phase}: ${id}`); // eslint-disable-line no-console
}

const inGameView = computed({
  currentStateDisplay() {
    return JSON.stringify(inGameState.currentState, null, 2);
  },

  flow() {
    return inGameState.currentState?.phase?.type === "STARTING"
      ? "GAME"
      : "PICK";
  },

  currPhase() {
    return inGameState.currentState?.phase?.type;
  },

  phaseHeading() {
    if (!inGameState.currentState) return null;

    const { phase } = inGameState.currentState;
    const { remaining, totalTime, type } = phase;

    if (lastPhaseType !== type) {
      remainingTime = remaining;
      lastTotalTime = totalTime;
      lastPhaseType = type;
    }

    const percentTranslate = remainingTime / lastTotalTime;
    const translateBy = 100 - percentTranslate * 100;

    clearTimeout(lastTimeout);

    lastTimeout = setTimeout(() => {
      if (!inGameState.currentState) return;
      if (remainingTime > 0) {
        remainingTime -= 100;
        inGameState.currentState.phase.remaining = remainingTime;
      }
    }, 100);

    function getPhaseTranslation(phaseType) {
      switch (phaseType) {
        case INGAME_PHASES[0]:
          return t("lol:phase.declaringIntent");
        case INGAME_PHASES[1]:
          return t("lol:phase.banningChampions");
        case INGAME_PHASES[2]:
          return t("lol:phase.pickingChampions");
        case INGAME_PHASES[3]:
          return t("lol:phase.chooseLoadout");
        case INGAME_PHASES[4]:
          return t("lol:liveData.requesting");
        case INGAME_PHASES[5]:
          return t("lol:liveData.inGame");
        default:
          return t("lol:phase.unknownPhase");
      }
    }

    return {
      phaseProgress: `transform: translateX(-${
        remainingTime ? translateBy : 100
      }%);`,
      t_phaseTitle: getPhaseTranslation(phase.type),
      t_phaseTimer: remainingTime
        ? `${Math.max(
            0,
            Math.floor(remainingTime / 1000)
          )} seconds remaining...`
        : "",
    };
  },

  summoners() {
    if (!inGameState.currentState) return null;
    const {
      currentState: { summonersByCellId, localPlayerCellId },
    } = inGameState;
    const myTeam = summonersByCellId[localPlayerCellId]?.team;
    const allyCellIds = Object.keys(summonersByCellId).filter(
      (cellId) => summonersByCellId[cellId].team === myTeam
    );
    const enemyCellIds = Object.keys(summonersByCellId).filter(
      (cellId) => summonersByCellId[cellId].team !== myTeam
    );

    return computed({
      ...translations,
      hasMyTeam() {
        return allyCellIds.length > 0;
      },
      hasTheirTeam() {
        return enemyCellIds.length > 0;
      },
      myTeam() {
        return allyCellIds.map(computedSummoner);
      },
      theirTeam() {
        return enemyCellIds.map(computedSummoner);
      },
      myTeamDamage() {
        return computedDamages(allyCellIds);
      },
      theirTeamDamage() {
        return computedDamages(enemyCellIds);
      },
    });
  },

  tabs() {
    if (!inGameState.currentState) return null;

    return computed({
      tabslist() {
        if (!inGameState.currentState) return null;
        const {
          options,
          currentState: { summonersByCellId, localPlayerCellId },
        } = inGameState;
        const { championId, championPickIntent } =
          summonersByCellId[localPlayerCellId];
        const localPlayerChampionId = championId || championPickIntent;
        return [
          {
            icon: BlitzLogo.svg,
            label: t("lol:championSuggestions", "Champion Suggestions"),
            isActive: options.selectedTab === "suggestions",
            disabled: false,
            onclick: (e) => {
              e.preventDefault();
              options.selectedTab = "suggestions";
            },
          },
          {
            icon: Swords.svg,
            label: t("lol:builds.blitzBuilds", "Blitz Builds"),
            isActive: options.selectedTab === "builds",
            disabled: !localPlayerChampionId,
            onclick: (e) => {
              e.preventDefault();
              options.selectedTab = "builds";
            },
          },
          {
            icon: ProBuildsLogo.svg,
            label: t("lol:builds.proBuilds", "Pro Builds"),
            isActive: options.selectedTab === "probuilds",
            disabled: !localPlayerChampionId,
            onclick: (e) => {
              e.preventDefault();
              options.selectedTab = "probuilds";
            },
          },
        ];
      },

      activeTab() {
        const { options } = inGameState;
        return options.selectedTab;
      },

      primaryRoleKey() {
        return ROLE_SYMBOL_TO_STR[derivedState.role]?.key;
      },

      roleSelect() {
        if (!inGameState.currentState) return null;
        const { options } = inGameState;
        const role = derivedState.role;
        const roleSymbol = mapRoleToSymbol(role);

        return computed({
          selectedRoleIcon: roleIcons[roleSymbol],
          text: t(ROLE_SYMBOL_TO_STR[roleSymbol]?.t.name, role),
          selectOpen: options.selectingRole,
          toggleSelectOpen: () => {
            options.selectingRole = !options.selectingRole;
          },
          roleOptions: Object.values(ROLE_SYMBOLS)
            .filter((symbol) => symbol !== ROLE_SYMBOLS.all)
            .map((symbol) => {
              const roleStr = ROLE_SYMBOL_TO_STR[symbol].internal;
              const roleT = ROLE_SYMBOL_TO_STR[symbol].t;

              return computed({
                selectRole: () => {
                  options.selectedRole = roleStr;
                  options.selectingRole = false;
                },
                selected: role === roleStr,
                text: t(roleT, roleStr),
              });
            }),
        });
      },

      builds() {
        const { options, currentState } = inGameState;
        if (currentState) return null;

        return computed({
          playstyleBuilds() {
            const runesStaticData = getStaticData("runes");

            return {
              title: t("lol:builds.playstyleBuilds", "Playstyle Builds"),
              buildsList: (derivedState.playstyleBuilds ?? []).map((hash) => {
                const { buildKey, index, build } = hash;
                const { runes, games, items_completed, misc } = build;

                const secondaryTree = runesStaticData
                  .find((tree) => tree.id === build.runes[5])
                  ?.key?.toLowerCase();

                const mainItem =
                  items_completed.find((item) => MYTHICS[item]?.originalId) ||
                  items_completed.find((item) => !BOOTS[item]);

                return {
                  title: misc.playstyleTitle,
                  games: games.toLocaleString(getLocale()),
                  keystone: Static.getRuneImage(runes[1]),
                  secondaryTree: Static.getRuneImage(secondaryTree),
                  mainItem: Static.getItemImage(mainItem),
                  isSelected: buildKey === options.selectedBuildKey,
                  initiateImport() {
                    options.selectedBuildKey = buildKey;
                    importBuild(buildKey, index).catch((error) => {
                      devError("BUILD IMPORT FAILED", error);
                    });
                  },
                };
              }),
            };
          },
          proBuilds() {
            // TODO: Implement pro builds
            return {
              title: t("lol:builds.proBuilds", "proBuilds"),
              buildsList: derivedState.proBuilds ?? [],
            };
          },
          selectedBuild() {
            if (!inGameState.currentState) return null;
            const runesStaticData = getStaticData("runes");

            const allBuilds = [
              ...(derivedState.playstyleBuilds ?? []),
              ...(derivedState.proBuilds ?? []),
            ];

            const hash =
              allBuilds.find(
                (build) => build.key === options.selectedBuildKey
              ) ?? allBuilds[0];
            if (!hash) return null;
            const { build } = hash;

            // Primary runes
            const tree1 = build.runes[0];
            const runesPrimaryTree = runesStaticData.find(
              (tree) => tree.id === tree1
            ) ?? {
              slots: [],
            };
            const runesPrimaryRows = runesPrimaryTree.slots.map(
              (row, rowIndex) => ({
                keystoneRow: rowIndex === 0,
                row: row.runes.map((rune) => ({
                  ...rune,
                  image: Static.getRuneImage(rune.id),
                  active: build.runes.includes(rune.id),
                  isKeystone: rowIndex === 0,
                })),
              })
            );
            const runeTreesLeft = runesStaticData.map((tree) => ({
              id: tree.id,
              image: Static.getRuneImage(tree.key.toLowerCase()),
              active: tree.id === tree1,
            }));

            // Secondary Runes
            const tree2 = build.runes[5];
            const runesSecondaryTree = runesStaticData.find(
              (tree) => tree.id === tree2
            );
            const runesSecondaryRows = runesSecondaryTree.slots
              .filter((_, rowIndex) => rowIndex !== 0)
              .map((row) => ({
                row: row.runes.map((rune) => ({
                  ...rune,
                  image: Static.getRuneImage(rune.id),
                  active: build.runes.includes(rune.id),
                })),
              }));
            const runeTreesRight = runesStaticData.map((tree) => ({
              id: tree.id,
              image: Static.getRuneImage(tree.key.toLowerCase()),
              active: tree.id === tree2,
            }));

            // Rune shards
            const runeShards = shardMap.map((shardRow, i) => ({
              row: shardRow.map((shardId) => ({
                id: shardId,
                image: Static.getRuneImage(shardId),
                active: build.rune_shards[i] === Number(shardId),
              })),
            }));

            return {
              title: build.misc.playstyleTitle,
              winrate: (build.wins / build.games || 1).toLocaleString(
                getLocale(),
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  style: "percent",
                }
              ),
              runes: {
                title: t("lol:builds.runes", "Runes"),
                tImportStatus: t("lol:autoImport.imported", "Imported"), //TODO@(artokun): use computed
                runeTreesLeft,
                runeTreesRight,
                primaryRows: runesPrimaryRows,
                secondaryRows: runesSecondaryRows,
                primaryColor: `${
                  LoLColors.runes[runesPrimaryTree?.key.toLowerCase()]
                }`,
                secondaryColor: `${
                  LoLColors.runes[runesSecondaryTree?.key.toLowerCase()]
                }`,
                shards: runeShards,
              },
              skillOrder: formatSkillOrder(build),
              buildOrder: formatBuildOrder(build),
            };
          },
          // TEMPORARY!
          buildString() {
            const allBuilds = [
              ...(derivedState.playstyleBuilds ?? []),
              ...(derivedState.proBuilds ?? []),
            ];

            const hash =
              allBuilds.find(
                (build) => build.key === options.selectedBuildKey
              ) ?? allBuilds[0];

            if (!hash) return null;
            const { build } = hash;

            return JSON.stringify(build, null, 2);
          },
        });
      },

      suggestions() {
        if (!inGameState.currentState) return null;

        return computed({
          hide() {
            return false;
          },
          title() {
            return inGameState.currentState?.phase?.type === "BANNING"
              ? t("lol:suggestions.banSuggestions", "Ban Suggestions")
              : t("lol:suggestions.pickSuggestions", "Pick Suggestions");
          },
          loading() {
            return !inGameState.suggestions.rootList;
          },
          suggestionsLoading() {
            const root = inGameState.suggestions.rootList;
            const error = inGameState.suggestions.error;

            return {
              isLoading: !root,
              didError: !!error,
              text: !error
                ? t(
                    "lol:suggestions.loadingData",
                    "Loading Suggestions Data..."
                  )
                : t(
                    "lol:suggestions.loadingDataError",
                    "Error Loading Suggestions Data 😞"
                  ),
              subtext: error,
            };
          },
          suggestionsPhase() {
            return inGameState.currentState?.phase?.type;
          },

          // Search
          handleSearch(e) {
            e.preventDefault();
            inGameState.options.suggestionsSearch = e.target.value;
          },
          clearSearch(e) {
            e.preventDefault();
            inGameState.options.suggestionsSearch = "";
          },
          searchText() {
            return inGameState.options.suggestionsSearch;
          },
          searchResults() {
            if (!inGameState.currentState) return null;
            const { currentState, suggestions, options } = inGameState;
            const root = suggestions.rootList;
            const searchText = options.suggestionsSearch;
            const clickedId = options.suggestionsClickedSearchId;
            const bannedIds = currentState.bannedIds;

            if (!root || (root && !searchText)) return null;

            const searchResults = (root["ALL"] || [])
              .filter((s) =>
                (s.name || s.key)
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name));

            if (!searchResults.length) return null;

            return computed({
              title: t("common:searchResults", "Search Results"),
              hasResults: !!searchResults.length,
              list: searchResults.map((s) => {
                return computed({
                  id: s.id,
                  declareClick,
                  mouseOver: s.mouseOver,
                  mouseOut: s.mouseOut,
                  selected: s.id === clickedId,
                  name: s.name,
                  image: s.image,
                  banned: !!bannedIds[s.id],
                  subtext1: t("lol:countGame_plural", "{{count}} Games", {
                    count: s.roleMeta.gameCount.toLocaleString(getLocale()),
                  }),
                  stat1: {
                    value: s.roleMeta.winRate.toLocaleString(getLocale(), {
                      style: "percent",
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }),
                    text: "Game",
                    style: `--stat-color: ${winRatecolorRange(
                      s.roleMeta.winRate * 100
                    )}`,
                  },
                });
              }),
            });
          },
          noSearchResults() {
            const root = inGameState.suggestions.rootList;
            const searchText = inGameState.options.suggestionsSearch;

            if (!root || (root && !searchText)) return null;

            const searchResults = (root["ALL"] || []).filter((s) =>
              (s.name || s.key).toLowerCase().includes(searchText.toLowerCase())
            );

            if (!searchText || searchResults.length) return null;

            return computed({
              title: t("common:noResults", "No results"),
              subtitle: t(
                "lol:suggestions.noSearchResultsSubtitle",
                "What you typed yielded no results. Check the spelling and see if you mispelled something."
              ),
            });
          },
          searchActive() {
            return inGameState.options.suggestionsSearch.length > 0;
          },

          // Ban Suggestions
          metaBans() {
            if (!inGameState.currentState) return null;
            const { options, currentState, suggestions } = inGameState;
            const role = derivedState.role;

            const root = suggestions.rootList;
            const searchText = options.suggestionsSearch;
            const phase = currentState.phase.type;
            const availableIds = derivedState.availableIds;
            const more = options.metaPicksMore;
            const amt = more ? max : min;

            const banIntent = options.suggestionsClickedBanId;

            const list = displayMetaBans(root, role, availableIds);

            if (!root || !isBanPhase(phase) || searchText.length) return null;

            return computed({
              title: t("lol:suggestions.bansTierList", "Bans Tier List"),
              titleImg: null,
              hasResults: !!list.length,
              list: list.slice(0, amt).map((s) => {
                return computed({
                  id: s.id,
                  declareClick,
                  mouseOver: s.mouseOver,
                  mouseOut: s.mouseOut,
                  selected: s.id === banIntent,
                  name: s.name,
                  image: s.image,
                  metaTier: tierIcons[s.roleMeta.tier] && {
                    tierIcon: tierIcons[s.roleMeta.tier],
                  },
                  subtext1: t("lol:countGame_plural", "{{count}} Games", {
                    count: s.roleMeta.gameCount.toLocaleString(getLocale()),
                  }),
                  stat1: {
                    value: s.roleMeta.winRate.toLocaleString(getLocale(), {
                      style: "percent",
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }),
                    text: "Game",
                    style: `--stat-color: ${winRatecolorRange(
                      s.roleMeta.winRate * 100
                    )}`,
                  },
                });
              }),
              showMore:
                list.length >= amt || more
                  ? {
                      click: (e) => {
                        e.preventDefault();
                        inGameState.options.metaPicksMore =
                          !inGameState.options.metaPicksMore;
                      },
                      text: more
                        ? t("common:showLess", "Show Less")
                        : t("common:showMore", "Show More"),
                    }
                  : null,
            });
          },

          // Pick Suggestions
          career() {
            if (!inGameState.currentState) return null;
            const { options, currentState, suggestions } = inGameState;
            const role = derivedState.role;

            const root = suggestions.rootList;
            const searchText = options.suggestionsSearch;
            const phase = currentState?.phase.type;
            const availableIds = derivedState.availableIds;
            const more = options.careerMore;
            const amt = more ? max : min;

            const pickIntent = options.clickedPickId;

            const list = displayCareer(root, role, availableIds);

            if (
              !root ||
              !list?.length ||
              isBanPhase(phase) ||
              searchText.length
            )
              return null;

            return computed({
              title: t("lol:suggestions.careerBest", "Your Personal Best"),
              hasResults: !!list.length,
              list: list.slice(0, amt).map((s) => {
                const career = s.career;
                const gameWR = career.wins / (career.games || 1);

                return computed({
                  id: s.id,
                  declareClick,
                  mouseOver: s.mouseOver,
                  mouseOut: s.mouseOut,
                  selected: s.id === pickIntent,
                  name: s.name,
                  image: s.image,
                  subtext1: t("lol:countGame_plural", "{{count}} Games", {
                    count: career.games.toLocaleString(getLocale()),
                  }),
                  stat1: {
                    value: gameWR.toLocaleString(getLocale(), {
                      style: "percent",
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    }),
                    text: t("lol:championData.game", "Game"),
                    style: `--stat-color: ${winRatecolorRange(gameWR * 100)}`,
                  },
                });
              }),
              showMore:
                list.length >= amt || more
                  ? {
                      click: (e) => {
                        e.preventDefault();
                        inGameState.options.careerMore =
                          !inGameState.options.careerMore;
                      },
                      text: more
                        ? t("common:showLess", "Show Less")
                        : t("common:showMore", "Show More"),
                    }
                  : null,
            });
          },

          selectedSuggestion() {
            return null;
          },

          nothingSelected() {
            if (!inGameState.currentState) return null;
            const { currentState, suggestions, roleMatchups, synergies } =
              inGameState;
            const root = suggestions.rootList;
            const phase = currentState.phase.type;
            const availableIds = derivedState.availableIds;

            const role = derivedState.role;
            const enemyID = derivedState.enemyLaner;
            const pairID = derivedState.pairTeammate;

            const list = isBanPhase(phase)
              ? displayMetaPopularBans(root, role, availableIds)
              : displayPersonalPicks(
                  root,
                  roleMatchups,
                  synergies,
                  role,
                  availableIds,
                  enemyID,
                  pairID
                );

            const title = isBanPhase(phase)
              ? t("lol:suggestions.placeholderBanTitle", "Meta ban suggestions")
              : t(
                  "lol:suggestions.placeholderPickTitle",
                  "Real-time personalized pick suggestions"
                );

            // TODO: fix these
            const active = true;
            const activeId = false;

            if (!root || activeId) return null;

            return computed({
              hide: !root,
              title,
              role,
              enemyLaner: Static.getChampionImage(enemyID),
              pairTeammate: Static.getChampionImage(pairID),
              subtitle: isBanPhase(phase)
                ? t(
                    "lol:suggestions.placeholderBanSuggestions",
                    "The strongest popular champions in your role."
                  )
                : t(
                    "lol:suggestions.placeholderPickSuggestions",
                    "Updates in real-time based on the meta, your stats, teammate picks, and lane opponent."
                  ),
              listTitle: isBanPhase(phase)
                ? t("lol:suggestions.banSuggestions", "Ban Suggestions")
                : t(
                    "lol:suggestions.personalizedPickSuggestions",
                    "Personalized Pick Suggestions"
                  ),
              list: list.slice(0, 6).map((s, i) => ({
                id: s.id,
                btnClick: instaBanPick,
                btnDisabled: !active,
                name: s.name,
                image: s.image,
                subtitle: t(
                  "lol:suggestions.numSuggestion",
                  "#{{num}} Suggestion",
                  {
                    num: i + 1,
                  }
                ),
                metaTier: tierIcons[s.roleMeta.tier] && {
                  tierIcon: tierIcons[s.roleMeta.tier],
                },
                style: s.roleMeta.tier
                  ? `--tier-color: var(--tier${s.roleMeta.tier});`
                  : "--tier-color: var(--shade3);",
                btnText: isBanPhase(phase)
                  ? t("lol:suggestions.ban", "Ban")
                  : t("lol:lockIn", "Lock In"),
              })),
            });
          },
        });
      },
    });
  },

  rosterbar() {
    if (!inGameState.currentState) return null;
    const {
      options,
      currentState: { summonersByCellId, localPlayerCellId },
    } = inGameState;
    const localPlayerTeam = summonersByCellId[localPlayerCellId]?.team;

    return computed({
      toggleShowBans(e) {
        e.preventDefault();
        options.showBans = !options.showBans;
      },
      showBans() {
        return options.showBans;
      },
      myTeam() {
        const teammates = Object.entries(summonersByCellId).filter(
          ([, s]) => s.team === localPlayerTeam
        );
        return teammates.map(([cellId, s], i) => {
          const {
            championId,
            championPickIntent,
            championBanIntent,
            isInProgress,
            bans,
            assignedPosition,
          } = s;
          const pickId = championId || championPickIntent;
          const banId = championBanIntent || bans[bans.length - 1];
          const roleSymbol = mapRoleToSymbol(assignedPosition);

          return computed({
            isUser: localPlayerCellId === parseInt(cellId),
            isInProgress: isInProgress,
            championImage: pickId ? Static.getChampionImage(pickId) : null,
            championBanImage: banId ? Static.getChampionImage(banId) : null,
            hasBanned: !!bans.length,
            role: !!roleSymbol,
            roleIcon: roleSymbol && roleIcons[roleSymbol],
            missing: false,
            style: `--index: ${i}`,
          });
        });
      },
      enemyTeam() {
        const opponents = Object.entries(summonersByCellId).filter(
          ([, s]) => s.team !== localPlayerTeam
        );
        return opponents.map(([, s], i) => {
          const {
            championId,
            championPickIntent,
            championBanIntent,
            isInProgress,
            bans,
            assignedPosition,
          } = s;
          const pickId = championId || championPickIntent;
          const banId = championBanIntent || bans[bans.length - 1];
          const role = assignedPosition || derivedState.enemyRolesHash[pickId];
          const roleSymbol = role && mapRoleToSymbol(role);

          return computed({
            isUser: false,
            isInProgress: isInProgress,
            championImage: pickId ? Static.getChampionImage(pickId) : null,
            championBanImage: banId ? Static.getChampionImage(banId) : null,
            hasBanned: !!bans.length,
            role: !!roleSymbol,
            roleIcon: roleSymbol && roleIcons[roleSymbol],
            missing: false,
            style: `--index: ${i}`,
          });
        });
      },
      ctaButton() {
        return computed({
          text: "Lock In",
          enabled: false,
        });
      },
    });
  },
});

const [, /*inGameViewProxy*/ fragment] = !IS_NODE
  ? s2(inGameView, template)
  : [];

let container;

if (!IS_NODE) {
  container = globals.document.createElement("div");
  container.classList.add("in-game-container");
  container.appendChild(fragment);
}

export default inGameView;
export { container };
