import { computed, observable } from "s2-engine";

import {
  ROLE_PAIRS,
  ROLE_SYMBOL_TO_STR,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import { BUILD_DELIMITER, buildToRoleMap } from "@/game-lol/in-game-builds.mjs";
import inGameState from "@/game-lol/in-game-state.mjs";
import { getChampionPrimaryRole } from "@/game-lol/in-game-util.mjs";
import { getStaticData, mapRoleToSymbol } from "@/game-lol/util.mjs";
import { formatBuildPlaystyle } from "@/game-lol/util-builds.mjs";

const derivedState = observable(
  computed({
    enemyRoles() {
      if (!inGameState.currentState) return;
      const {
        championRoles,
        currentState: { summonersByCellId, localPlayerTeam },
      } = inGameState;
      const enemyTeam = Object.values(summonersByCellId).filter(
        (p) => p.team !== localPlayerTeam
      );
      const enemyChampions = enemyTeam
        .map((p) => p.championId || p.championPickIntent)
        .filter(Boolean);
      const numEnemies = enemyTeam.length ?? 0;

      const rolesData = championRoles;

      const roleAssignments = {
        [ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.top].internal]: null,
        [ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.jungle].internal]: null,
        [ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.mid].internal]: null,
        [ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.adc].internal]: null,
        [ROLE_SYMBOL_TO_STR[ROLE_SYMBOLS.support].internal]: null,
      };

      if (!enemyChampions.length || !rolesData) {
        return roleAssignments;
      }

      let championsRolesData = [];

      for (const championId of enemyChampions) {
        const champRoles = (rolesData[championId] || []).map((c) => {
          const roleSymbol = mapRoleToSymbol(c.role);
          const role = ROLE_SYMBOL_TO_STR[roleSymbol].internal;
          return { ...c, role };
        });
        if (!champRoles.length) continue;

        championsRolesData = [...championsRolesData, ...champRoles];
      }

      championsRolesData.sort((a, z) => z.rolePercentage - a.rolePercentage);

      const assignedChamps = {};
      for (const laneChamp of championsRolesData) {
        const champID = laneChamp.championId;
        const role = laneChamp.role;

        if (!roleAssignments[role] && !assignedChamps[champID]) {
          // Lane hasnt been assigned and champ hasnt been assigned to a lane
          roleAssignments[role] = {
            role,
            championId: champID,
            rolePercentage: laneChamp.rolePercentage,
          };
          assignedChamps[champID] = true;
        }
      }

      // TODO: Handle unassigned champions/lanes
      // const unassignedLanes = Object.entries(roleAssignments)
      //   .filter(([, stats]) => !stats)
      //   .map(([role]) => role);
      // const unassignedChamps = enemyChampions.filter((id) => !assignedChamps[id]);
      // if (
      //   enemyChampions.length === numEnemies &&
      //   unassignedLanes.length &&
      //   unassignedChamps.length
      // ) {
      // }

      // After entire enemy team exists, compare lowest role percent champ
      // to that champs highest in the same role and swap if reasonable
      // TODO: add the players ban as a weight/confidence factor
      if (enemyChampions.length > 1 && enemyChampions.length === numEnemies) {
        const sorted = Object.values(roleAssignments)
          .filter(Boolean)
          .sort((a, z) => a.rolePercentage - z.rolePercentage);
        const weakest = sorted[0];
        const weakestBestRole = rolesData[weakest.championId].sort(
          (a, z) => z.rolePercentage - a.rolePercentage
        )?.[0];
        const candidate =
          weakestBestRole && roleAssignments[weakestBestRole.role];
        const candidateInOtherRole =
          candidate &&
          rolesData[candidate.championId].find((c) => c.role === weakest.role);
        if (
          weakestBestRole &&
          candidateInOtherRole &&
          candidateInOtherRole.rolePercentage > weakest.rolePercentage
        ) {
          roleAssignments[candidate.role] = weakestBestRole;
          roleAssignments[weakest.role] = candidateInOtherRole;
        }
      }
      return roleAssignments;
    },

    enemyRolesHash() {
      const hash = {};
      if (!this.enemyRoles) return hash;

      for (const [role, champ] of Object.entries(this.enemyRoles)) {
        if (champ) hash[champ.championId] = role;
      }

      return hash;
    },

    // The local players role in the current game
    // Priority: Manually UI selected -> LCU assigned -> Champion primary role
    role() {
      if (!inGameState.currentState) return null;
      const {
        options,
        currentState: { summonersByCellId, localPlayerCellId, localPlayerRole },
      } = inGameState;
      const { championId, championPickIntent } =
        summonersByCellId[localPlayerCellId];

      const localPlayerChampionId = championId || championPickIntent;

      const lcuRole = localPlayerRole;
      const selectedRole = options.selectedRole;
      const statsRole = getChampionPrimaryRole(`${localPlayerChampionId}`);

      const role = selectedRole || lcuRole || statsRole || null;

      return role;
    },

    enemyLaner() {
      if (!inGameState.currentState || !this.enemyRoles || !this.role)
        return null;

      return this.enemyRoles[this.role]
        ? this.enemyRoles[this.role].championId
        : null;
    },

    pairTeammate() {
      if (!inGameState.currentState) return;
      const {
        currentState: { summonersByCellId },
      } = inGameState;
      if (!this.role) return;
      const roleSymbol = mapRoleToSymbol(this.role);

      const rolePair = ROLE_PAIRS[roleSymbol];

      const teammates = Object.values(summonersByCellId).filter(
        (p) => !p.isUser && p.isUserTeammate
      );

      const pair = teammates.find((p) => p.role === rolePair);

      return pair ? pair.championId || pair.championPickIntent : null;
    },

    availableIds() {
      if (!inGameState.currentState) return [];
      const {
        bannableChampionIds,
        pickableChampionIds,
        currentState: {
          summonersByCellId,
          localPlayerCellId,
          bannedIds,
          pickedIds,
          localPlayerBanComplete,
        },
      } = inGameState;

      const { championId, championPickIntent } =
        summonersByCellId[localPlayerCellId];

      const localPlayerChampionId = championId || championPickIntent;

      const phaseIds = localPlayerBanComplete
        ? pickableChampionIds
        : bannableChampionIds;

      const available = phaseIds.filter(
        (id) =>
          !bannedIds[id] && (id === localPlayerChampionId || !pickedIds[id])
      );

      return available.reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {});
    },

    playstyleBuilds() {
      if (!inGameState.currentState) return null;

      const {
        currentState: { summonersByCellId, localPlayerCellId },
        lolGameStatePersistedKeys: { builds },
      } = inGameState;
      const itemsStaticData = getStaticData("items");

      // Just need to read this.
      void inGameState.buildsUpdatedAt;

      const { championId, championPickIntent } =
        summonersByCellId[localPlayerCellId];
      const localId = `${championId || championPickIntent}`;
      const buildKeys = Object.keys(builds);

      const result = [];

      for (const buildKey of buildKeys) {
        const [stringId] = buildKey.split(BUILD_DELIMITER);
        if (localId !== stringId) continue;
        const buildsArray = builds[buildKey];
        for (let i = 0; i < buildsArray.length; i++) {
          const build = buildsArray[i];
          const role = buildToRoleMap.get(build);
          if (role !== this.role) continue;
          result.push({
            build: formatBuildPlaystyle({
              build: {
                data: build,
              },
              type: "common",
              role: ROLE_SYMBOL_TO_STR[this.role]?.key,
              itemsData: itemsStaticData,
            }),
            buildKey,
            index: i,
          });
        }
      }
      return result;
    },

    proBuilds() {
      return [];
    },
  })
);

export default derivedState;
