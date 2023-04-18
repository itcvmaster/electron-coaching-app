import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import getNestedData from "@/game-lol/get-nested-data.mjs";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import InfiniteTable, { SORT_ASC, SORT_DESC } from "@/shared/InfiniteTable.jsx";

const ErrorWrapper = styled("div")`
  height: 28rem;
`;

const HeaderWrapper = styled("div")`
  position: relative;
  display: flex;
  text-align: center;
  align-items: center;
`;
const HeaderLabel = styled("p")`
  font-size: var(--sp-3);
  font-weight: ${(props) => (props.active ? 700 : 500)};
  color: ${(props) => (props.active ? "var(--shade0)" : "var(--shade1)")};
`;
const SortIconWrapper = styled("div")`
  position: absolute;
  right: -18px;
  color: var(--shade0);
  text-align: center;
  display: flex;
  font-size: var(--sp-4);

  svg {
    width: 1em;
    height: 1em;
    stroke-width: 0;
    fill: currentcolor;
    color: currentcolor;
  }
`;

const CssTableRow = () => css`
  display: flex;
  align-items: center;
  text-align: center;

  &:nth-child(2n + 1) {
    background-color: var(--shade8);
  }
  &:hover {
    background-color: var(--shade6);
  }
`;
const CssTableHeader = () => css`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: var(--sp-3);
  letter-spacing: -0.009em;
  color: var(--shade1);
  background: var(--shade7);
`;

// Sort utility function
// We need sort function for champions sort
// For tier sort, The smaller the tier is, The higher the position
// For the above purpose, the reverseOrder is used for.
const sort = (arr, sortBy, sortDirection, reverseOrder) => {
  if (!arr) return [];
  // process nested key
  const sorted = arr.sort((a, b) => {
    let v1 = getNestedData(a, sortBy) || 99999;
    let v2 = getNestedData(b, sortBy) || 99999;
    if (reverseOrder) {
      const temp = v1;
      v1 = v2;
      v2 = temp;
    }

    // Assuems v1 and v2 have same type.
    switch (typeof v1) {
      case "number":
        return v1 - v2;
      case "string":
        return v1.localeCompare(v2);
      case "symbol":
        return v1.toString().localeCompare(v2?.toString());
      default: // null, object, ...
        return 0;
    }
  });
  if (reverseOrder) {
    return sortDirection === SORT_DESC ? sorted.reverse() : sorted;
  }

  return sortDirection === SORT_ASC ? sorted.reverse() : sorted;
};

const defaultOptions = {
  headerHeight: 30,
  rowHeight: 48,
};
const useChampionsTable = ({
  tableData,
  cols,
  colRenderer,
  isLoaded,
  options,
}) => {
  const { t } = useTranslation();
  const rowHeight = options?.rowHeight || defaultOptions.rowHeight;
  const headerHeight = options?.headerHeight || defaultOptions.headerHeight;
  const [sortParams, setSortParams] = useState({
    sortBy: options.sortBy,
    sortDirection: options.sortDirection || SORT_DESC,
  });

  const sortedData = useMemo(() => {
    // if sortBy is tier then we need to reverse.
    return sort(
      [...tableData],
      sortParams.sortBy,
      sortParams.sortDirection,
      sortParams.sortBy === "tierListTier.tierRank"
    );
  }, [tableData, sortParams.sortBy, sortParams.sortDirection]);

  // for ssr styling, we are using functional css.
  // so this should be called here.
  const styledCols = useMemo(
    () =>
      cols?.map((c) => ({
        ...c,
        className:
          c.className && typeof c.className === "function"
            ? c.className()
            : c.className,
      })),
    [cols]
  );
  const styledCss = useMemo(
    () => ({
      header: CssTableHeader(),
      row: CssTableRow(),
    }),
    []
  );

  const headerRenderer = useCallback(
    ({ dataKey, sortable, sortBy, sortDirection, label }) => {
      const isActive = sortable && dataKey === sortBy;
      return (
        <HeaderWrapper>
          <HeaderLabel active={isActive ? 1 : 0}>{label}</HeaderLabel>
          {isActive && (
            <SortIconWrapper>
              {sortDirection === SORT_DESC ? <CaretUp /> : <CaretDown />}
            </SortIconWrapper>
          )}
        </HeaderWrapper>
      );
    },
    []
  );
  const emptyRenderer = useCallback(() => {
    if (!isLoaded) return null;
    const emptyMessage = t(
      "lol:notFound.championData",
      "No champion data found."
    );
    return (
      <ErrorWrapper>
        <ErrorComponent description={emptyMessage} />
      </ErrorWrapper>
    );
  }, [t, isLoaded]);

  const View = useMemo(
    () => (
      <InfiniteTable
        data={sortedData}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        sortBy={sortParams.sortBy}
        sortDirection={sortParams.sortDirection}
        sort={setSortParams}
        rowCount={sortedData.length}
        rowGetter={({ index }) => sortedData[index]}
        headerClassName={styledCss.header}
        rowClassName={styledCss.row}
        colRenderer={colRenderer}
        headerRenderer={headerRenderer}
        emptyRenderer={emptyRenderer}
        cols={styledCols}
      />
    ),
    [
      sortedData,
      sortParams,
      colRenderer,
      headerRenderer,
      emptyRenderer,
      styledCols,
      styledCss,
      headerHeight,
      rowHeight,
    ]
  );

  return {
    TableView: View,
  };
};

export default useChampionsTable;
