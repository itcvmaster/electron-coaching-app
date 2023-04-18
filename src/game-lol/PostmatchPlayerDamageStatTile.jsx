import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import {
  MAX_GAME_TIME_IN_MINUTES,
  RANK_SYMBOL_TO_STR,
  STAT_TILE_TYPES,
} from "@/game-lol/constants.mjs";
import PlayerEmptyStatTile from "@/game-lol/PlayerEmptyStatTile.jsx";
import PlayerStatTile from "@/game-lol/PlayerStatsTile.jsx";
import { getDamageStats } from "@/game-lol/util.mjs";
import HextechStatMelee from "@/inline-assets/hextech-stats-melee.svg";
import orderArrayBy from "@/util/order-array-by.mjs";

const PlayerDamageStatTile = (props) => {
  const {
    currParticipant,
    rankStats,
    rankStatsByRole,
    match,
    summonerRank: currRank,
    myChampion,
    rankStr,
    isWinner,
    isLoading,
    isARAM,
    delay,
    account,
  } = props;

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const ranks = orderArrayBy(account.latestRanks, "insertedAt", "desc");
  const summonerRank =
    ranks[0] && ranks[0].tier
      ? RANK_SYMBOL_TO_STR[ranks[0].tier]?.capped
      : currRank;
  const tips = useMemo(() => {
    return {
      "S+": {
        tag: t("lol:postmatch.dmgTagS+", "Supreme DMG KING!"),
        win: t(
          "lol:postmatch.dmgWinS+",
          "You played a massive role in carrying your team."
        ),
        lose: t("lol:postmatch.dmgLoseS+", "INSANE DMG!"),
      },
      S: {
        tag: t("lol:postmatch.dmgTagS", "DMG King!"),
        win: t("lol:postmatch.dmgWinS", "You carried the game."),
        lose: t("lol:postmatch.dmgLoseS+", "INSANE DMG!"),
      },
      A: {
        tag: t("lol:postmatch.dmgTagA", "BEAST!"),
        win: (
          <Trans i18nKey="lol:postmatch.dmgWinA">
            Your high <span>damage</span> allowed you to carry your team!
          </Trans>
        ),
        lose: t(
          "lol:postmatch.dmgLoseA",
          "DMG BEAST! Getting an A is really hard when losing. Be consistent and you’ll win more."
        ),
      },
      B: {
        tag: t("lol:postmatch.dmgTagB", "Good job!"),
        win: t("lol:postmatch.dmgWinB", "Keep this up."),
        lose: t(
          "lol:postmatch.dmgLoseB",
          "Well played, you did what you could and played above average. Try to do more damage to carry even harder."
        ),
      },
      C: {
        win: t(
          "lol:postmatch.dmgWinC",
          "Good Effort! Look out for opportunities to deal more damage to draw pressure on the map."
        ),
        lose: t(
          "lol:postmatch.dmgLoseC",
          "Look for opportunities to deal more damage to carry."
        ),
      },
      D: {
        win: t(
          "lol:postmatch.dmgWinD",
          "Congrats on the win! You’ll win more consistently if you improve your damage dealt."
        ),
        lose: t(
          "lol:postmatch.dmgLoseD",
          "Focus on consistently putting out more damage in trades and teamfights."
        ),
      },
    };
  }, [t]);

  const damageStats = useMemo(() => {
    if (
      !match?.gameDuration ||
      !rankStats.length ||
      !currParticipant ||
      !summonerRank
    )
      return;

    const { gameDuration } = match;
    const minutes =
      gameDuration / (MAX_GAME_TIME_IN_MINUTES > gameDuration ? 60 : 60000);

    const { totalDamageDealtToChampions } = currParticipant;

    return getDamageStats({
      rankStats,
      rankStatsByRole,
      stat: {
        gameDuration,
        dmgPerMin: totalDamageDealtToChampions / minutes,
      },
      rankFilter: summonerRank,
      language,
    });
  }, [
    match,
    summonerRank,
    rankStats,
    rankStatsByRole,
    currParticipant,
    language,
  ]);

  const { allScores, maxRankValue } = useMemo(() => {
    if (!damageStats?.allScores) return {};
    return {
      allScores: damageStats.allScores.reverse(),
      maxRankValue: Math.max(...damageStats.allScores.map((s) => s.value)),
    };
  }, [damageStats]);

  if (!damageStats) {
    return <PlayerEmptyStatTile isLoading={isLoading} />;
  }

  const isPositive = damageStats.myStatPerMin >= damageStats.rankDmgPerMin;
  const tipGrade =
    damageStats?.myScore?.grade === "S+"
      ? damageStats?.myScore?.grade
      : damageStats?.myScore?.grade?.[0];

  return (
    <PlayerStatTile
      key={STAT_TILE_TYPES.damage}
      currParticipant={currParticipant}
      summonerRank={summonerRank}
      myChampion={myChampion}
      isWinner={isWinner}
      isPositive={isPositive}
      showSetCSGoal={false}
      percentDiff={damageStats.myScore.percentile * 100}
      tips={tips}
      tipGrade={tipGrade}
      allScores={allScores}
      scoreTrendLabel={t("lol:stat.dmgPerMin", "Dmg/Min.")}
      MyPlacementRankIcon={
        <span
          className="rank-icon"
          css={`
            span.rank-icon {
              line-height: 72px;
              letter-spacing: 3px;
            }
          `}
        >
          {damageStats?.myScore?.grade}
        </span>
      }
      rankStr={rankStr}
      yourRank={null}
      maxRankValue={maxRankValue}
      description={
        <Trans i18nKey="lol:postmatch.dmgTip">
          Players that consistently deal high <span>damage</span> win more.
          Blitz will help you track and improve your <span>damage</span>.
        </Trans>
      }
      stats={damageStats}
      isARAM={isARAM}
      isExtTile={true}
      gradient={[
        {
          stop: 0,
          color: damageStats.myScore.fillColor,
        },
        {
          stop: 1,
          color: damageStats.myScore.fillColor,
        },
      ]}
      delay={delay}
      tiletype={STAT_TILE_TYPES.damage}
      title={t("common:combat", "Combat")}
      TitleIcon={HextechStatMelee}
    />
  );
};

export default PlayerDamageStatTile;
