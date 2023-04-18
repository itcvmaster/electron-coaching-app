import React from "react";
import { styled } from "goober";

import ChevronLeft from "@/inline-assets/chevron-left.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";

const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }
`;
const ListWrapper = styled("div")`
  border-radius: var(--br);
  padding: ${(props) => props.$padding};
`;

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: var(--sp-11);
  padding: 0 var(--sp-14);
  border-radius: var(--br);
  margin: var(--sp-px) 0;
  &:nth-child(even) {
    background: var(--shade8);
  }

  .col-arrow.left {
    flex: 0.75 1 0%;
  }

  .col-title {
    color: var(--shade1);
    flex: 3 1 0%;
  }

  .col-arrow.right {
    display: flex;
    place-content: flex-end;
    flex: 0.75 1 0%;
  }

  .left {
    flex: 2 1 0%;
    color: ${(props) => (props.$colorLeft ? "var(--turq)" : "var(--shade2)")};
  }

  .right {
    flex: 2 1 0%;
    color: ${(props) => (props.$colorRight ? "#E44C4D" : "var(--shade2)")};
  }

  .panel-title {
    color: var(--shade1);
    font-weight: 700;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .row-name {
    text-transform: capitalize;
  }
`;

const SectionHeader = ({ leftText, centerText, rightText }) => {
  return (
    <RowContainer>
      <div className="left">
        <p className="panel-title">{leftText}</p>
      </div>
      <div className="col-arrow left"></div>
      <div className="col-title">
        <p className="panel-title">{centerText}</p>
      </div>
      <div className="col-arrow right"></div>
      <div className="right">
        <p className="panel-title">{rightText}</p>
      </div>
    </RowContainer>
  );
};

const compareStats = (dataPoint, recentAvg) => {
  if (dataPoint === recentAvg) return null;
  return dataPoint > recentAvg;
};

const StatsRow = ({ dataPoint, recentAvg, didBetter, title }) => {
  const isBetter = didBetter
    ? didBetter(dataPoint, recentAvg)
    : compareStats(dataPoint, recentAvg);
  const insignificantDiff = isBetter === null;

  let leftClassName = isBetter ? "type-body2-form--active" : "type-body2";
  let rightClassName = isBetter ? "type-body2" : "type-body2-form--active";

  if (insignificantDiff) {
    leftClassName = "type-body2";
    rightClassName = "type-body2";
  }

  return (
    <RowContainer
      $colorLeft={!insignificantDiff && isBetter}
      $colorRight={!insignificantDiff && !isBetter}
    >
      <div className={`${leftClassName} left`}>
        <p>{dataPoint}</p>
      </div>
      <div className="col-arrow left">
        {!insignificantDiff && isBetter && <ChevronLeft />}
      </div>
      <div className="col-title">
        <p className="type-caption row-name">{title}</p>
      </div>
      <div className="col-arrow right">
        {!insignificantDiff && !isBetter && <ChevronRight />}
      </div>
      <div className={`${rightClassName} right`}>
        <p>{recentAvg}</p>{" "}
      </div>
    </RowContainer>
  );
};

const StatsBreakdown = ({ rowData, sections }) => {
  if (rowData.length !== sections?.length)
    throw new Error(`row data is missing header info or vise versa`);

  return (
    <CardContainer>
      {sections.map((sectionInfo, sectionNumer) => {
        return (
          <ListWrapper
            $padding={sectionNumer === 0 ? "0 0 var(--sp-2_5) 0" : ""}
            key={`statsbreakdown-section-${sectionNumer}`}
          >
            <SectionHeader
              leftText={sectionInfo.leftTitleText}
              centerText={sectionInfo.centerTitleText}
              rightText={sectionInfo.rightTitleText}
            />
            {rowData[sectionNumer].map((row, rowNumber) => {
              return (
                <StatsRow
                  title={row.title}
                  dataPoint={row.dataPoint}
                  recentAvg={row.recentAvg}
                  didBetter={row?.didBetter}
                  key={`statsbreakdown-section-${sectionNumer}-row-${rowNumber}`}
                />
              );
            })}
          </ListWrapper>
        );
      })}
    </CardContainer>
  );
};

export default StatsBreakdown;
