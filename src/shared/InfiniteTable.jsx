import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import IntersectionList from "@/shared/InfiniteList.jsx";

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

const HeaderRenderer = ({
  dataKey,
  sortable,
  sortBy,
  sortDirection,
  label,
}) => {
  const { t } = useTranslation();
  const isActive = sortable && dataKey === sortBy;
  const labelText = Array.isArray(label) ? t(...label) : label;
  return (
    <HeaderWrapper>
      <HeaderLabel active={isActive ? 1 : 0}>{labelText}</HeaderLabel>
      {isActive && (
        <SortIconWrapper>
          {sortDirection === SORT_ASC ? <CaretUp /> : <CaretDown />}
        </SortIconWrapper>
      )}
    </HeaderWrapper>
  );
};

const HeaderContainer = styled("div")`
  display: flex;
  height: ${(props) => props.height}px;
  position: sticky;
  top: 0;
`;
const BodyContainer = styled("div")``;
const Header = styled("div")`
  width: ${(props) =>
    typeof props.width === "number" ? `${props.width}%` : props.width};
`;
const Row = styled("div")`
  display: flex;
  height: ${(props) => props.height}px;
`;
const Column = styled("div")`
  width: ${(props) =>
    typeof props.width === "number" ? `${props.width}%` : props.width};
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

const CommonColumnCss = () => css`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: var(--shade1);
  font-size: var(--sp-3_5);

  img {
    width: var(--sp-9);
    height: var(--sp-9);
    margin-right: var(--sp-6);
    border-radius: 50%;
  }
`;

const CommonRowCss = () => css`
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

export const SORT_ASC = "ASC";
export const SORT_DESC = "DESC";

const InfiniteTable = (props) => {
  const {
    sortBy,
    sortDirection,
    sort,
    cols,
    headerRenderer = HeaderRenderer,
    colRenderer,
    rowCount,
    rowGetter,
    headerClassName,
    rowClassName,
    rowHeight = 48,
    headerHeight = 30,
    emptyRenderer,
  } = props;

  const rowRenderer = useCallback(
    (rowIndex, key) => {
      const rowData = rowGetter({ index: rowIndex });
      if (!rowData) return null;
      return (
        <Row
          key={key}
          className={rowClassName || CommonRowCss()}
          height={rowHeight}
        >
          {cols.map((col) => (
            <Column
              key={col.dataKey}
              className={col.className || CommonColumnCss()}
              width={col.width}
            >
              {colRenderer({
                dataKey: col.dataKey,
                rowData,
                rowIndex,
              })}
            </Column>
          ))}
        </Row>
      );
    },
    [rowGetter, colRenderer, cols, rowClassName, rowHeight]
  );

  const headerClick = useCallback(
    (col) => {
      if (col.sortable && sort) {
        sort({
          sortBy: col.dataKey,
          sortDirection: sortDirection === SORT_ASC ? SORT_DESC : SORT_ASC,
        });
      }
    },
    [sort, sortDirection]
  );

  return (
    <div className="infinite-table">
      <HeaderContainer height={headerHeight}>
        {cols.map((col) => (
          <Header
            key={col.dataKey}
            className={headerClassName || CssTableHeader()}
            width={col.width}
            onClick={() => headerClick(col)}
          >
            {headerRenderer &&
              headerRenderer({ ...col, sortBy, sortDirection })}
          </Header>
        ))}
      </HeaderContainer>
      <BodyContainer>
        {rowCount > 0 && (
          <IntersectionList itemCount={rowCount} renderItem={rowRenderer} />
        )}
        {rowCount === 0 && emptyRenderer && emptyRenderer()}
      </BodyContainer>
    </div>
  );
};

export default InfiniteTable;
