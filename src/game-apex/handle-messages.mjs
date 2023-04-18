import { readState } from "@/__main__/app-state.mjs";
import { handleMessage } from "@/__main__/ipc-core.mjs";
import router, { setRoute } from "@/__main__/router.mjs";
import {
  addMatch,
  updateLiveGame,
  updateLoggedInAccountId,
  updatePlayerStats,
  updateProfile,
} from "@/game-apex/actions.mjs";
import { SEASONS_OBJ } from "@/game-apex/constants.mjs";
import { formatMode, getLastGameMode } from "@/game-apex/utils.mjs";

(() => {
  handleMessage("apexPlayer", ({ playerId, username, hardwareId }) => {
    const loggedInAccountId = readState.settings.loggedInAccounts.apex;
    if (loggedInAccountId !== playerId) {
      updateLoggedInAccountId(playerId);
    }
    updateProfile(playerId, {
      displayName: username,
      id: playerId,
      hardwareId,
    });
    if (playerId && router.route?.currentPath?.startsWith("/apex"))
      setRoute(`/apex/profile/${playerId}`);
  });

  handleMessage(
    "apexGameStart",
    ({ matchId, mapName, gameStartedAt, gameMode }) => {
      const loggedInAccountId = readState.settings.loggedInAccounts.apex;
      updateLiveGame({
        matchId,
        mapName,
        gameStartedAt,
        mode: formatMode(getLastGameMode(gameMode), gameMode),
      });
      setRoute(`/apex/profile/${loggedInAccountId}`);
      // Snowflake.trackEvent(SNOWFLAKE_EVENTS.APEX_START, {
      //   matchId,
      //   playerId: loggedInAccountId,
      // });
    }
  );

  handleMessage(
    "apexGameDeploy",
    ({ players, gameMode, gameStartedAt, matchId, mapName }) => {
      updateLiveGame(
        players?.length > 1
          ? {
              playerMatchChampionStats: players,
              matchId,
              mapName,
              gameStartedAt,
              mode: formatMode(getLastGameMode(gameMode), gameMode),
            }
          : null
      );
    }
  );

  handleMessage("apexGameEnd", () => {
    //   const loggedInAccountId = readState.settings.loggedInAccounts.apex;
    updateLiveGame(null);
    //   Snowflake.trackEvent(SNOWFLAKE_EVENTS.APEX_END, {
    //     matchId,
    //     playerId: loggedInAccountId,
    //   });
  });

  handleMessage("apexUpdate", ({ dataStr, diffsStr, lastMatchStr }) => {
    const loggedInAccountId = readState.settings.loggedInAccounts.apex;
    const data = JSON.parse(dataStr);
    const { matchId, mapName, gameMode, gameStartedAt, teamId } =
      JSON.parse(lastMatchStr);
    const {
      games_played_any_mode: gamesPlayedDiff,
      weapons: weaponsDiff,
      rank: rankDiff,
    } = JSON.parse(diffsStr);

    const {
      Enums: { eseasonflavor },
      allrankeddata,
      arenasrankeddata,
      lastgamemode,
      lastgametime,
      lastgamesquadstats,
      lastgamerank,
      characterforxp,
      stats: {
        arenasrankedperiods,
        modes,
        rankedperiods,
        seasons,
        assists,
        damage_done,
        deaths,
        dooms,
        games_played,
        kills,
        kills_max_single_game,
        placements_win,
        revived_ally,
        times_respawned_ally,
        win_streak_current,
        win_streak_longest,
        characters,
        weapons,
      },
      stats_sopm: { account_level },
      xp,
    } = data;

    const currentSeason = eseasonflavor.slice(-1)[0];

    const stats = {
      all: {
        all: {
          assists,
          damage_done,
          deaths,
          dooms,
          games_played,
          kills,
          kills_max_single_game,
          wins: placements_win,
          revived_ally,
          times_respawned_ally,
          win_streak_current,
          win_streak_longest,
          characters,
          weapons,
        },
        ranked: {},
        rankedArenas: {},
      },
    };

    for (const [mode, data] of Object.entries(modes)) {
      stats.all[mode] = { ...data, wins: data.placements_win };
      delete stats.all[mode].seasons;
    }

    const sumFields = [
      "assists",
      "damage_done",
      "deaths",
      "dooms",
      "games_played",
      "kills",
      "revived_ally",
      "times_respawned_ally",
      "wins",
    ];

    for (const season in seasons) {
      stats[season] = {};
      stats[season].all = {
        ...seasons[season],
        wins: seasons[season].placements_win,
      };
      const rankedPeriod = SEASONS_OBJ[season]?.rankedPeriod;
      if (rankedPeriod) {
        const rankedData = rankedperiods[rankedPeriod];
        const allRankedData = allrankeddata[rankedPeriod];
        if (season === currentSeason) {
          stats.all.ranked.current_rank_score = rankedData.current_rank_score;
          stats.all.ranked.firstsplitrankedscore =
            allRankedData.firstsplitrankedscore;
          stats.all.ranked.hassplitresetoccured =
            allRankedData.hassplitresetoccured;
        }
        stats[season].ranked = {
          ...rankedData,
          ...allRankedData,
          wins: rankedData.placements_win,
        };
        for (const f of sumFields) {
          if (typeof stats[season].ranked[f] === "number")
            stats.all.ranked[f] =
              (stats.all.ranked[f] ?? 0) + stats[season].ranked[f];
        }
      }
      for (const [mode, data] of Object.entries(modes)) {
        stats[season][mode] = {
          ...data.seasons[season],
          wins: data.seasons[season].placements_win,
        };
        if (mode !== "arenas") continue;
        const arenaRankedPeriod = SEASONS_OBJ[season]?.arenaRankedPeriod;
        if (arenaRankedPeriod) {
          const rankedData = arenasrankedperiods[arenaRankedPeriod];
          const allRankedData = arenasrankeddata[arenaRankedPeriod];
          if (season === currentSeason) {
            stats.all.rankedArenas.current_rank_score =
              rankedData.current_rank_score;
            stats.all.rankedArenas.firstsplitrankedscore =
              allRankedData.firstsplitrankedscore;
            stats.all.rankedArenas.hassplitresetoccured =
              allRankedData.hassplitresetoccured;
          }
          stats[season].rankedArenas = {
            ...rankedData,
            ...allRankedData,
            wins: rankedData.placements_win,
          };
          for (const f of sumFields) {
            if (typeof stats[season].rankedArenas[f] === "number")
              stats.all.rankedArenas[f] =
                (stats.all.rankedArenas[f] ?? 0) +
                stats[season].rankedArenas[f];
          }
        }
      }
    }

    const level = account_level + 1;

    updateProfile(loggedInAccountId, {
      level,
      experience_points: xp,
      hovered_champion_apex_id: characterforxp,
    });

    updatePlayerStats(loggedInAccountId, stats);

    if (gamesPlayedDiff === 1) {
      const mode = formatMode(lastgamemode, gameMode);
      const match = {
        season: currentSeason,
        matchId,
        mapName: mapName.match(new RegExp("(?<=maps/)(.*)(?=.bsp)"))[0],
        mode,
        gameStartedAt,
        gameEndedAt: lastgametime,
        playerMatchChampionStats: lastgamesquadstats
          .filter((p) => p.platformuid)
          .map((p) => {
            const { platformuid, character, ...restStats } = p;
            const apex_id = parseInt(platformuid);
            const stats = {
              apex_id,
              champion_id: character,
              team: {
                placement: lastgamerank,
                teamId,
              },
              ...restStats,
            };
            if (apex_id === loggedInAccountId) {
              if (Object.keys(weaponsDiff).length) {
                stats.weapons = weaponsDiff;
                const fields = ["dooms", "headshots", "hits", "shots"];
                Object.values(stats.weapons).forEach((w) => {
                  fields.forEach((f) => {
                    if (typeof w[f] === "number")
                      stats[f] = (stats[f] ?? 0) + w[f];
                  });
                });
              }
              if (rankDiff?.games_played === 1) {
                stats.ranked_points = rankDiff.current_rank_score;
              }
            }
            return stats;
          }),
      };

      addMatch(loggedInAccountId, match);
      setRoute(`/apex/match/${loggedInAccountId}/${match.matchId}`);
    }

    // console.log("ffffff", data, weaponsDiff, rankDiff);

    // For determining weapon id
    // const loadout = Object.entries(data.loadouts).filter(([key]) =>
    //   key.startsWith('weapon_charm_for_')
    // );
    // console.log('loadout', loadout)
  });

  handleMessage("isApexRunning", (apexGame) => {
    if (apexGame && !router.route?.currentPath?.startsWith("/apex"))
      setRoute("/apex");
    if (!apexGame) updateLiveGame(null);
  });
})();
