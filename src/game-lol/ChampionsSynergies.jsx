import React from "react";

import useTransientLoader from "@/game-lol/use-transient-loader.mjs";
import useChampionsFilter from "@/game-lol/useChampionsFilter.jsx";
import useChampionsSynergies from "@/game-lol/useChampionsSynergies.jsx";
import useChampionsTable from "@/game-lol/useChampionsTable.jsx";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import {
  FlexContainer,
  LoadingContainer,
  TabContainer,
} from "@/shared/InfiniteTable.style.jsx";

function ChampionsSynergies() {
  // Note: filterParams and searchParams is different sometimes. Don't use wrongly.
  // filterParams has the same values with url search params of route.
  // but the searchParams is current url search params once loaded, and previous url search params while loading.
  //     and if url search params is empty, then same with filterParams.
  const { FilterBar, ...filterParams } = useChampionsFilter({
    isSynergiesFilter: true,
  });
  const { isLoaded, searchParams } = useTransientLoader(filterParams, true);
  const { data, cols, colRenderer, options } = useChampionsSynergies({
    filterParams,
    searchParams,
  });
  const { TableView } = useChampionsTable({
    tableData: data,
    cols,
    colRenderer,
    isLoaded,
    options,
  });

  return (
    <TabContainer>
      {FilterBar}
      <FlexContainer opacity={isLoaded ? 1 : 0.5}>{TableView}</FlexContainer>
      {!isLoaded && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}
    </TabContainer>
  );
}

export default ChampionsSynergies;
