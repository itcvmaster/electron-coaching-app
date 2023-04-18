import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { Button, ButtonGroup, Card, Select } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { ScoreText } from "@/game-val/CommonComponent.jsx";
import { RANK_IMGS, VAL_REGIONS } from "@/game-val/constants.mjs";
import {
  getLeaderboardData,
  getParams,
  updateParams,
} from "@/game-val/leaderboard-utils.mjs";
import {
  getActData,
  getActOptions,
  getValorantRankImage,
} from "@/game-val/utils.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import BlitzTrophy from "@/inline-assets/trophy.svg";
import ContentContainer from "@/shared/ContentContainer.jsx";
import FilterBar from "@/shared/FilterBar.jsx";
import InfiniteTable from "@/shared/InfiniteTable.jsx";
import {
  FlexContainer,
  LoadingContainer,
  TabContainer,
} from "@/shared/InfiniteTable.style.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SearchInput from "@/shared/SearchInput.jsx";
import { useIsLoaded, useRoute } from "@/util/router-hooks.mjs";

const StyledFilterBar = styled(FilterBar)`
  margin-bottom: var(--sp-4);
`;

const PlayerCol = styled("a")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-start;
  flex-grow: 1;
  padding-left: var(--sp-3);

  img {
    width: var(--sp-7);
    height: var(--sp-7);
    margin-right: var(--sp-3);
  }
`;

const COLS = [
  {
    label: ["val:rank", "Rank"],
    dataKey: "leaderboardRank",
    width: 10,
    sortable: true,
  },
  {
    label: ["common:player", "Player"],
    dataKey: "player",
    width: 60,
    sortable: false,
  },
  {
    label: ["val:leaderboard:rr", "RR"],
    dataKey: "rankedRating",
    width: 20,
    sortable: true,
  },
  {
    label: ["val:stats.wins", "Games Won"],
    dataKey: "numberOfWins",
    width: 10,
    sortable: true,
  },
];

function TableView() {
  const { searchParams, currentPath } = useRoute();

  const {
    val: { leaderboard = {} },
  } = useSnapshot(readState);

  const data = getLeaderboardData(leaderboard, searchParams);

  const colRenderer = useCallback(({ dataKey, rowData }) => {
    const { leaderboardRank, gameName, nametag, rankedRating } = rowData;
    const cellData = rowData[dataKey];
    switch (dataKey) {
      case "player":
        return (
          <PlayerCol href={`/valorant/profile/${nametag}`}>
            <img
              src={getValorantRankImage({
                tier: leaderboardRank > 500 ? "immortal" : "radiant",
                rank: leaderboardRank > 500 ? 23 : 24,
                size: "sm",
              })}
            />
            <span className="type-body2-form--active" data-tip={nametag}>
              {gameName}
            </span>
          </PlayerCol>
        );
      case "rankedRating":
        return (
          <ScoreText className={"type-body2"} $score={rankedRating}>
            {rankedRating}
          </ScoreText>
        );
      default:
        return <span className="type-body2">{cellData?.toLocaleString()}</span>;
    }
  }, []);

  const { sortBy, sortOrder } = getParams(searchParams);

  const sort = useCallback(
    ({ sortBy, sortDirection: sortOrder }) => {
      updateParams({ sortBy, sortOrder, searchParams, currentPath });
    },
    [searchParams, currentPath]
  );

  return (
    <InfiniteTable
      colRenderer={colRenderer}
      cols={COLS}
      data={data}
      rowCount={data.length}
      rowGetter={({ index }) => data[index]}
      sort={sort}
      sortBy={sortBy}
      sortDirection={sortOrder?.toUpperCase()}
    />
  );
}

const Filters = () => {
  const { searchParams, currentPath } = useRoute();
  const { t } = useTranslation();

  const {
    val: { constants },
  } = useSnapshot(readState);

  const actData = getActData(constants);
  const actOptions = getActOptions(actData);
  const defaultAct = actOptions && actOptions[0]?.value;

  const { actId, rank, region, search } = getParams(searchParams);

  const updateFilters = useCallback(
    (key, val) => {
      updateParams({ [key]: val, searchParams, currentPath });
    },
    [searchParams, currentPath]
  );

  const ranks = useMemo(
    () => [
      {
        key: "radiant",
        label: t("val:ranks.radiant", "Radiant"),
      },
      {
        key: "immortal",
        label: t("val:ranks.immortal", "Immortal"),
      },
    ],
    [t]
  );

  return (
    <StyledFilterBar>
      <SearchInput
        text={search}
        placeholder={t("common:searchPlayers", "Search Players")}
        onChange={(v) => updateFilters("search", v)}
      />
      <ButtonGroup>
        {ranks.map(({ key, label }) => (
          <Button
            key={key}
            className={rank === key ? "active" : ""}
            onClick={() => {
              updateFilters("rank", key);
            }}
            iconLeft={<img src={RANK_IMGS[key].small} />}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      {defaultAct ? (
        <Select
          selected={actId || defaultAct}
          options={actOptions}
          onChange={(v) => updateFilters("actId", v)}
        />
      ) : null}
      <Select
        selected={region}
        options={VAL_REGIONS}
        onChange={(v) => updateFilters("region", v)}
      />
    </StyledFilterBar>
  );
};

export default function Leaderboard() {
  const { t } = useTranslation();
  const isLoaded = useIsLoaded();

  return (
    <>
      <PageHeader
        title={t("common:leaderboard", "Leaderboard")}
        icon={<BlitzTrophy />}
      />
      <ContentContainer>
        <Card>
          <TabContainer>
            <Filters />
            <FlexContainer opacity={isLoaded ? 1 : 0.5}>
              <TableView isLoaded={isLoaded} />
            </FlexContainer>
            {!isLoaded && (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            )}
          </TabContainer>
        </Card>
      </ContentContainer>
    </>
  );
}

export function meta() {
  return {
    title: [
      "val:helmet.leaderboard.title",
      "Valorant Leaderboards - BLITZ VALORANT",
    ],
    description: [
      "val:helmet.leaderboard.description",
      "Riot Games new shooter, Valorant. Blitz has Leaderboards, All stats for Agents, Maps and Weapon for you.",
    ],
  };
}
