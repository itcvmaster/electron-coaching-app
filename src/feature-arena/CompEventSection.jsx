import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import CompEmptySection from "@/feature-arena/CompEmptySection.jsx";
import CompEventRow from "@/feature-arena/CompEventRow.jsx";
import { ArrowIcons } from "@/feature-arena/m-assets.mjs";

const SectionHeader = ({ columns, selected, direction, onClick }) => (
  <HeaderContainer>
    {columns.map((column, index) => (
      <ColumnContainer
        key={index}
        onClick={() => onClick(column)}
        id={column.key}
      >
        <Text
          className={
            "type-caption" + (selected === column.key ? " selected" : "")
          }
        >
          {column.title}
        </Text>
        {selected === column.key ? (
          direction > 0 ? (
            <ArrowIcons.DOWN />
          ) : (
            <ArrowIcons.UP />
          )
        ) : null}
      </ColumnContainer>
    ))}
  </HeaderContainer>
);

const Pagination = ({ count, currentPage, onChange }) =>
  count > 1 ? (
    <PaginationContainer>
      <ArrowButton onClick={() => onChange(Math.max(0, currentPage - 1))}>
        <ArrowIcons.LEFT width={30} />
      </ArrowButton>
      {Array(count)
        .fill(0)
        .map((_dot, index) => (
          <Dot
            key={index}
            $selected={index === currentPage}
            onClick={() => onChange(index)}
          />
        ))}
      <ArrowButton
        onClick={() => onChange(Math.min(currentPage + 1, count - 1))}
      >
        <ArrowIcons.RIGHT width={30} />
      </ArrowButton>
    </PaginationContainer>
  ) : null;

const CompEventSection = ({ title, events, countPerPage = 6, isPast }) => {
  const [sortKey, setSortKey] = useState("startAt");
  const [sortDir, setSortDir] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();

  const columns = [
    { key: "none", title: t("arena:header.eventName", "Game & Event Name") },
    { key: "startAt", title: t("arena:header.starts", "Starts") },
    { key: "endAt", title: t("arena:header.ends", "Ends") },
    {
      key: "participantCount",
      title: t("arena:header.registered", "Registered"),
    },
    { key: "totalPrizePool", title: t("arena:header.prizePool", "Prize Pool") },
    { key: "entryFee", title: t("arena:header.entryFee", "Entry Fee") },
  ];

  const comp = (eventA, eventB) => {
    if (typeof eventA[sortKey] === "number") {
      return (eventA[sortKey] - eventB[sortKey]) * sortDir;
    }
    return (
      ((eventA[sortKey]?.value || 0) - (eventB[sortKey]?.value || 0)) * sortDir
    );
  };

  const onSelectColumn = (column) => {
    if (column.key === "none") return;

    if (column.key === sortKey) {
      setSortDir(-sortDir);
    } else {
      setSortKey(column.key);
      setSortDir(1);
    }
  };

  const inCurrentPage = (index) => {
    return (
      currentPage * countPerPage <= index &&
      index < (currentPage + 1) * countPerPage
    );
  };

  return (
    <SectionContainer>
      <SubTitle className="type-subtitle1">{title}</SubTitle>
      <Separator />
      {events.length > 0 || !isPast ? (
        <>
          <SectionHeader
            columns={columns}
            selected={sortKey}
            direction={sortDir}
            onClick={onSelectColumn}
          />
          {events
            .sort(comp)
            .map((event, index) =>
              inCurrentPage(index) ? (
                <CompEventRow key={index} event={event} />
              ) : null
            )}
          <Pagination
            count={Math.ceil(events.length / countPerPage)}
            currentPage={currentPage}
            onChange={setCurrentPage}
          />
        </>
      ) : (
        <CompEmptySection type="NoPastEvents" />
      )}
    </SectionContainer>
  );
};

export default CompEventSection;

const SectionContainer = styled("div")`
  margin-top: var(--sp-7_5);
`;

const Separator = styled("div")`
  width: 100%;
  height: 1px;
  background-color: var(--shade6);
  margin-top: var(--sp-4);
`;

const HeaderContainer = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: var(--sp-11);
`;

const ColumnContainer = styled("div")`
  display: flex;
  padding-left: var(--sp-2);
  align-items: center;
  cursor: pointer;
  width: var(--sp-24);

  &#entryFee {
    justify-content: center;
  }

  &#none {
    flex: 1;
  }
`;

const PaginationContainer = styled("div")`
  height: var(--sp-21);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowButton = styled("div")`
  width: var(--sp-7_5);
  height: var(--sp-7_5);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 0 var(--sp-5);
`;

const Dot = styled("div")`
  width: var(--sp-2);
  height: var(--sp-2);
  border-radius: var(--sp-1);
  background-color: ${({ $selected }) =>
    $selected ? "#49B4FF" : "var(--shade3)"};
  margin: var(--sp-1);
  cursor: pointer;
`;

const SubTitle = styled("div")`
  color: var(--shade0);
  font-size: var(--sp-5);
`;

const Text = styled("div")`
  color: var(--shade1);
  &.selected {
    color: var(--shade0);
    font-weight: bold;
  }
`;
