import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Select, ToggleSwitch } from "clutch";

import { View } from "@/game-lol/CommonComponents.jsx";
import {
  FILTER_SYMBOLS,
  QUEUE_SYMBOL_TO_STR,
  RANK_SYMBOL_TO_STR,
  REGION_LIST,
  ROLE_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import getRankIcon from "@/game-lol/get-rank-icon.mjs";
import getRegionIcon from "@/game-lol/get-region-icon.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import MatchupFilter from "@/game-lol/MatchupFilter.jsx";
import FilterBar from "@/shared/FilterBar.jsx";

const TEAMS = [
  {
    key: -1,
    t: {
      name: "lol:filters.probuilds.prosAndStreamers",
      fallback: "Pros & Streamers",
    },
  },
  {
    key: 0,
    t: {
      name: "lol:filters.probuilds.pros",
      fallback: "Pros",
    },
  },
  {
    key: 67,
    t: {
      name: "lol:filters.probuilds.streamers",
      fallback: "Streamers",
    },
  },
];

const FILTER_VISIBILITY = {
  default: {
    role: true,
    region: true,
    matchup: true,
    rank: false,
    queue: false,
    victoryOnly: false,
  },
  overview: {
    rank: true,
    queue: true,
  },
  probuilds: {
    // team: true,
    matchup: false,
    region: false,
    victoryOnly: true,
  },
  counters: {
    rank: true,
    queue: true,
  },
};

const RightView = styled(View)`
  margin-left: auto;
`;

const StyledFilterBar = styled(FilterBar)`
  background: var(--shade7);
  border-radius: var(--br, 5px);
  padding: var(--sp-3);
`;

function getFilterItemCount(filterVisibility) {
  let itemCount = 0;
  // role
  if (filterVisibility.role) itemCount++;
  // matchup
  if (filterVisibility.matchup) itemCount++;
  // tier
  if (filterVisibility.rank) itemCount++;
  // queue
  if (filterVisibility.queue) itemCount++;
  // region
  if (filterVisibility.region) itemCount++;
  // team
  if (filterVisibility.team) itemCount++;
  // victoryOnly
  if (filterVisibility.victoryOnly) itemCount++;

  return itemCount;
}

function ChampionFilter(props) {
  const {
    tab,
    role,
    tier,
    queue,
    region,
    team,
    victoryOnly,
    matchupChampion,
    setFilter,
  } = props;
  const { t } = useTranslation();

  const filterVisibility = {
    ...FILTER_VISIBILITY["default"],
    ...FILTER_VISIBILITY[tab],
  };
  const allRoles = Object.getOwnPropertySymbols(ROLE_SYMBOL_TO_STR).map(
    (key) => {
      const roleData = ROLE_SYMBOL_TO_STR[key];
      const RoleIcon = getRoleIcon(roleData.key);
      return {
        value: roleData.gql,
        text: t(roleData.t.name, roleData.t.fallback),
        icon: RoleIcon && <RoleIcon />,
      };
    }
  );

  const allQueues = Object.getOwnPropertySymbols(QUEUE_SYMBOL_TO_STR).map(
    (key) => {
      const queueData = QUEUE_SYMBOL_TO_STR[key];
      return {
        value: queueData.gql,
        text: t(queueData.t.name, queueData.t.fallback),
      };
    }
  );

  // remove 'all' role
  const roles = useMemo(() => {
    return allRoles.filter((r) => r.value !== "all");
  }, [allRoles]);

  const regions = REGION_LIST.filter((v) => v.key !== "id1").map((v) => {
    const RegionIcon = getRegionIcon(v.key);
    return {
      value: v.gql,
      text: t(v.t.name, v.t.fallback),
      icon: RegionIcon && <RegionIcon />,
    };
  });

  const tiers = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR).map((key) => {
    const tierData = RANK_SYMBOL_TO_STR[key];
    const TierIcon = getRankIcon(tierData.key);
    return {
      value: tierData.gql,
      text: t(tierData.t.name, tierData.t.fallback),
      icon: TierIcon && <TierIcon />,
    };
  });

  const teams = TEAMS.map((p) => ({
    value: p.key,
    text: t(p.t.name, p.t.fallback),
  }));

  const queues = useMemo(() => {
    return allQueues.slice();
  }, [allQueues]);

  const hiddenItems = getFilterItemCount(filterVisibility) - 1;

  return (
    <StyledFilterBar hiddenItems={hiddenItems}>
      {filterVisibility.role && (
        <Select
          selected={role}
          options={roles}
          onChange={(v) => setFilter(FILTER_SYMBOLS.role, v)}
        />
      )}

      {filterVisibility.matchup && (
        <MatchupFilter
          matchupChampion={matchupChampion}
          onChange={(v) => setFilter(FILTER_SYMBOLS.matchup, v)}
        />
      )}
      {filterVisibility.rank && (
        <Select
          selected={tier}
          options={tiers}
          onChange={(v) => setFilter(FILTER_SYMBOLS.tier, v)}
        />
      )}
      {filterVisibility.queue && (
        <Select
          selected={queue}
          options={queues}
          onChange={(v) => setFilter(FILTER_SYMBOLS.queue, v)}
        />
      )}
      {filterVisibility.region && (
        <Select
          selected={region}
          options={regions}
          onChange={(v) => setFilter(FILTER_SYMBOLS.region, v)}
        />
      )}
      {filterVisibility.team && (
        <Select
          selected={parseInt(team)}
          options={teams}
          onChange={(v) => setFilter(FILTER_SYMBOLS.team, v)}
        />
      )}
      {filterVisibility.victoryOnly && (
        <RightView>
          <ToggleSwitch
            enabled={victoryOnly}
            labelText={t("lol:victoryOnly", "Victory Only")}
            onChange={(v) => setFilter(FILTER_SYMBOLS.victoryOnly, v)}
          />
        </RightView>
      )}
    </StyledFilterBar>
  );
}

export default ChampionFilter;
