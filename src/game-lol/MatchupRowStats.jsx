import React from "react";
import { styled } from "goober";

import { Body2, Caption } from "@/game-lol/CommonComponents.jsx";
import ChevronLeft from "@/inline-assets/chevron-left.svg";
import ChevronRight from "@/inline-assets/chevron-right.svg";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const Row = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  height: var(--sp-9);

  &:nth-child(even) {
    background: var(--shade8);
  }

  .arrow {
    visibility: hidden;
  }
  .left-arrow {
    fill: var(--blue);
  }
  .right-arrow {
    fill: var(--red);
  }

  .label {
    color: var(--shade1);
    flex-grow: 1;
    max-width: 22ch;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat {
    color: var(--shade1);
    flex: 1;
  }

  &.higher--first {
    .left-arrow {
      visibility: visible;
    }
    .left-stat {
      color: var(--blue);
    }
  }

  &.higher--second {
    .right-arrow {
      visibility: visible;
    }
    .right-stat {
      color: var(--red);
    }
  }
`;

const MatchupRowStats = ({ statsLabel, stats, ...restProps }) => {
  // stats[0]: first value
  // stats[1]: second value
  // stats[2]: precision value
  const [firstValue, secondValue, precision, unit] = stats;
  const higherStat = firstValue > secondValue ? "first" : "second";
  const localeOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision || 0,
  };

  return (
    <Row {...restProps} className={`higher--${higherStat}`}>
      <Caption className="stat left-stat">
        {getLocaleString(firstValue, localeOptions)}
        {unit || ""}
      </Caption>
      <ChevronLeft className="arrow left-arrow" />
      <Body2 className="label">{statsLabel}</Body2>
      <ChevronRight className="arrow right-arrow" />
      <Caption className="stat right-stat">
        {getLocaleString(secondValue, localeOptions)}
        {unit || ""}
      </Caption>
    </Row>
  );
};

export default MatchupRowStats;
