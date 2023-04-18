import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Select } from "clutch";

import {
  FILTER_SYMBOLS,
  QUEUE_SYMBOL_TO_STR,
  QUEUE_SYMBOLS,
  RANK_SYMBOL_TO_STR,
  REGION_LIST,
  ROLE_SYMBOL_TO_STR,
} from "@/game-lol/constants.mjs";
import getRankIcon from "@/game-lol/get-rank-icon.mjs";
import getRegionIcon from "@/game-lol/get-region-icon.mjs";
import getRoleIcon from "@/game-lol/get-role-icon.mjs";
import { getIsARAM, getIsRankedQueue } from "@/game-lol/util.mjs";
import FilterBar from "@/shared/FilterBar.jsx";
import SearchInput from "@/shared/SearchInput.jsx";

function getFilterItemCount(props) {
  let itemCount = 0;
  // search input;
  itemCount++;
  // role
  if (!getIsARAM(props.queue)) itemCount++;
  // duo role
  if (props.isSynergiesFilter) itemCount++;
  // tier
  if (getIsRankedQueue(props.queue)) itemCount++;
  // queue
  if (!props.isSynergiesFilter) itemCount++;
  // region
  itemCount++;
  return itemCount;
}

const StyledFilterBar = styled(FilterBar)`
  margin-bottom: var(--sp-4);
`;

function ChampionsFilter(props) {
  const {
    isSynergiesFilter,
    searchText,
    role,
    duoRole,
    tier,
    queue,
    region,
    patch,
    setFilter,
  } = props;
  const { t } = useTranslation();

  const allRoles = Object.getOwnPropertySymbols(ROLE_SYMBOL_TO_STR).map(
    (key) => {
      const roleData = ROLE_SYMBOL_TO_STR[key];
      const Icon = getRoleIcon(roleData.key);

      return {
        value: roleData.gql,
        text: t(roleData.t.name, roleData.t.fallback),
        icon: Icon && <Icon />,
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

  const roles = useMemo(() => {
    return isSynergiesFilter ? allRoles.filter((r) => r.value) : allRoles;
  }, [isSynergiesFilter, allRoles]);

  const regions = REGION_LIST.filter((v) => v.key !== "id1").map((r) => {
    const Icon = getRegionIcon(r.key);

    return {
      value: r.gql,
      text: t(r.t.name, r.t.fallback),
      icon: Icon && <Icon />,
    };
  });

  const tiers = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR).map((key) => {
    const tierData = RANK_SYMBOL_TO_STR[key];
    const Icon = getRankIcon(tierData.key);

    return {
      value: tierData.gql,
      text: t(tierData.t.name, tierData.t.fallback),
      icon: Icon && <Icon />,
    };
  });

  const queues = useMemo(() => {
    return isSynergiesFilter
      ? allQueues.filter(
          (r) =>
            r.value === QUEUE_SYMBOL_TO_STR[QUEUE_SYMBOLS.rankedSoloDuo].key
        )
      : allQueues;
  }, [isSynergiesFilter, allQueues]);

  const hiddenItems = getFilterItemCount(props) - 1;

  return (
    <StyledFilterBar hiddenItems={hiddenItems}>
      <SearchInput
        text={searchText || ""}
        placeholder={t("lol:searchChampions", "Search Champions")}
        onChange={(v) => setFilter(FILTER_SYMBOLS.searchText, v)}
      />
      {!getIsARAM(queue) && (
        <Select
          selected={role}
          options={roles}
          onChange={(v) => setFilter(FILTER_SYMBOLS.role, v)}
        />
      )}
      {isSynergiesFilter && (
        <Select
          selected={duoRole}
          options={roles}
          onChange={(v) => setFilter(FILTER_SYMBOLS.duoRole, v)}
        />
      )}
      {getIsRankedQueue(queue) && (
        <Select
          selected={tier}
          options={tiers}
          onChange={(v) => setFilter(FILTER_SYMBOLS.tier, v)}
        />
      )}
      {!isSynergiesFilter && (
        <Select
          selected={queue}
          options={queues}
          onChange={(v) => setFilter(FILTER_SYMBOLS.queue, v)}
        />
      )}
      <Select
        selected={region}
        options={regions}
        onChange={(v) => setFilter(FILTER_SYMBOLS.region, v)}
      />
      {patch && (
        <h3 className="type-article-headline">
          {t("lol:patchVersion", "Patch {{version}}", {
            version: patch,
          })}
        </h3>
      )}
    </StyledFilterBar>
  );
}

export default ChampionsFilter;
