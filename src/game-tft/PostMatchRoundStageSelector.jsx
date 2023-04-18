import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { Select } from "clutch";

import { LoLWinStreakBadge } from "@/game-lol/WinStreakBadges.jsx";
import { setPostMatchRoundStage } from "@/game-tft/actions.mjs";
import getStageFromRound from "@/game-tft/get-stage-from-round.mjs";
import {
  useRBDRound,
  useRBDRounds,
  useRBDStage,
} from "@/game-tft/PostMatchRound.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import HextechMatchGold from "@/inline-assets/hextech-match-gold.svg";
import StarIcon from "@/inline-assets/star.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import { MatchLoading } from "@/shared/Match.jsx";

function PostMatchStageSelector() {
  const { t } = useTranslation();
  const stage = useRBDStage();
  const rounds = useRBDRounds();
  const currentMatch = useMatch();
  const { roundTransformed } = useRBDRound();
  const stages = useMemo(() => {
    let result = new Set();
    rounds.forEach((r) => result.add(getStageFromRound(r.round)));
    result = Array.from(result).map((stage) => {
      const text = t("tft:common.stageValue", "Stage {{x}}", { x: stage });
      return {
        value: String(stage),
        text,
      };
    });
    return result;
  }, [rounds, t]);
  if (!currentMatch) return <MatchLoading />;
  if (currentMatch instanceof Error) return <ErrorComponent />;
  return (
    <Container>
      <Column>
        <Select
          selected={String(stage)}
          options={stages}
          onChange={(value) =>
            setPostMatchRoundStage(currentMatch.data.matchid, value)
          }
        />
        <StarIcon
          className={css`
            color: var(--shade3);
          `}
        />
        <ScoreEnemy>
          {roundTransformed.round} <span>{t("common:vs", "vs")}</span>{" "}
          {roundTransformed.enemyName}
        </ScoreEnemy>
      </Column>
      <Column
        className={css`
          margin-right: 8px;
        `}
      >
        <div>
          {t("tft:levelValue", "Level {{level}}", {
            level: roundTransformed.level,
          })}
        </div>
        <Stats>
          <LoLWinStreakBadge />
          <span>{roundTransformed.winStreak}</span>
        </Stats>
        <Stats>
          <HextechMatchGold />
          <span>{roundTransformed.gold}</span>
        </Stats>
      </Column>
    </Container>
  );
}

export default PostMatchStageSelector;

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 15px;
  color: var(--shade0);
  font-weight: bold;
`;

const ScoreEnemy = styled("p")`
  color: var(--shade1);
  span {
    color: var(--shade3);
  }
`;

const Stats = styled("div")`
  color: var(--shade0);
  display: flex;
  align-items: center;
  gap: 8px;
  & > svg {
    color: var(--yellow);
    fill: var(--yellow);
    font-size: 16px;
  }
`;

const Column = styled("div")`
  display: flex;
  align-items: center;
  gap: 16px;
`;
