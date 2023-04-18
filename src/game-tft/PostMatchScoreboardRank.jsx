import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption } from "@/game-lol/CommonComponents.jsx";
import getHextechRankIcon from "@/game-lol/get-rank-icon.mjs";
import { convertRankFromRomanToNumber, tierToAbbr } from "@/game-lol/util.mjs";
import {
  HYPER_ROLL_RANKS,
  QUEUE_SYMBOLS,
  QUEUE_SYMBOLS_TO_QUEUE_NAMES,
} from "@/game-tft/constants.mjs";
import StaticTFT from "@/game-tft/static.mjs";

const PostMatchScoreboardRank = ({ leagues, inline, showLP, queueType }) => {
  const { t } = useTranslation();
  const league = leagues && leagues[0];
  const lp = league?.leaguePoints;

  const isHyperRoll =
    queueType === QUEUE_SYMBOLS_TO_QUEUE_NAMES[QUEUE_SYMBOLS.rankedTftTurbo];

  if (!league) return null;

  if (isHyperRoll) {
    const rank = HYPER_ROLL_RANKS[league?.ratedTier];
    return (
      <RankedInfo>
        {typeof rank.key === "string" ? (
          <RankIcon src={StaticTFT.getHyperRollRankImage(rank.key)} />
        ) : null}
        <RankedText inline={inline}>
          {t(`tft:hyperRollRanks.${rank?.key}`, rank?.display)}
          <span>{league?.ratedRating}</span>
        </RankedText>
      </RankedInfo>
    );
  }
  const RankedIcon = getHextechRankIcon(league?.tier?.toLowerCase());
  return (
    <RankedInfo>
      <RankedIcon />
      <RankedText inline={inline}>
        {tierToAbbr(league)}
        {convertRankFromRomanToNumber(league.rank)}
        {showLP && (
          <span>
            {t("lol:leaguePoints", "{{points}} LP", {
              points: lp >= 0 ? lp : 0,
            })}
          </span>
        )}
      </RankedText>
    </RankedInfo>
  );
};

export default PostMatchScoreboardRank;

const RankedInfo = styled("div")`
  display: flex;
  align-items: center;

  svg {
    height: var(--sp-5);
    width: var(--sp-5);
    margin: 0 4px 0 -2px;
  }
`;
const RankedText = styled(Caption)`
  ${({ inline }) =>
    inline &&
    `
      display: flex;
    `}

  span {
    color: var(--shade3);
    margin-left: var(--sp-2);
  }
`;

const RankIcon = styled("img")`
  height: var(--sp-5);
  width: var(--sp-5);
  margin: 0 4px 0 -2px;
`;
