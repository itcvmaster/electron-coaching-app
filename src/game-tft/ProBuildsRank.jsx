import React, { memo } from "react";
import { css } from "goober";

import { Caption } from "@/game-lol/CommonComponents.jsx";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import { convertRankFromRomanToNumber, tierToAbbr } from "@/game-lol/util.mjs";

function Rank({ league }) {
  const TierIcon = getHextechRankIcon(league?.tier?.toLowerCase());
  return (
    <>
      <TierIcon
        className={css`
          width: var(--sp-4);
          height: var(--sp-4);
          margin-left: var(--sp-2);
        `}
      />
      <Caption
        className={css`
          color: var(--shade2);
          margin-left: var(--sp-1_5);
        `}
      >
        {tierToAbbr(league)}
        {convertRankFromRomanToNumber(league.rank)}
      </Caption>
    </>
  );
}

export default memo(Rank);
