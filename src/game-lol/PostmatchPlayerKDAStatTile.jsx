import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { STAT_TILE_TYPES } from "@/game-lol/constants.mjs";
import PlayerEmptyStatTile from "@/game-lol/PlayerEmptyStatTile.jsx";
import PlayerStatTile from "@/game-lol/PlayerStatsTile.jsx";
import { getKDAStats } from "@/game-lol/util.mjs";
import HextechStatMelee from "@/inline-assets/hextech-stats-melee.svg";
import orderArrayBy from "@/util/order-array-by.mjs";

const PlayerKDAStatTile = (props) => {
  const {
    currParticipant,
    rankStats,
    rankStatsByRole,
    match,
    RankIcon,
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
  const summonerRank = ranks[0] && ranks[0].tier ? ranks[0].tier : "IRON";

  const tips = useMemo(() => {
    return {
      "S+": {
        tag: t("lol:postmatch.kdaTagS+", "AMAZING KDA!"),
        win: t(
          "lol:postmatch.kdaWinS+",
          "You were a major factor in your team’s win!"
        ),
        lose: t("lol:postmatch.kdaLoseS+", "AMAZING KDA! You got unlucky!"),
      },
      S: {
        tag: t("lol:postmatch.kdaTagS", "KDA champ!"),
        win: t("lol:postmatch.kdaWinS", "You carried the game."),
        lose: t(
          "lol:postmatch.kdaLoseS",
          "Unlucky! Your KDA was off the charts."
        ),
      },
      A: {
        tag: t("lol:postmatch.kdaTagA", "Nice KDA!"),
        win: t(
          "lol:postmatch.kdaWinA",
          "Keep winning team fights and engages."
        ),
        lose: t(
          "lol:postmatch.kdaLoseA",
          "Solid KDA. Keep your KDA up and focus on using your gold advantage."
        ),
      },
      B: {
        tag: t("lol:postmatch.kdaTagB", "Well played!"),
        win: t(
          "lol:postmatch.kdaWinB",
          "You contributed well, but there's room to improve on your combat."
        ),
        lose: t(
          "lol:postmatch.kdaLoseB",
          "Good effort. Earning higher KDA means you live longer and get more kills."
        ),
      },
      C: {
        win: t(
          "lol:postmatch.kdaWinC",
          "Good game! Remember to stay alive when you team fight!"
        ),
        lose: t(
          "lol:postmatch.kdaLoseC",
          "Look for opportunities to deal more damage to carry."
        ),
      },
      D: {
        win: t(
          "lol:postmatch.kdaWinD",
          "Congrats on the win! You’ll win more consistently if you improve your KDA."
        ),
        lose: t(
          "lol:postmatch.kdaLoseD",
          "Focus on dying one less time per match. It’ll have a big impact on your win rate!"
        ),
      },
    };
  }, [t]);

  const KDAStats = useMemo(() => {
    if (
      !match?.gameDuration ||
      !rankStats.length ||
      !currParticipant ||
      !summonerRank
    )
      return;

    const { kills, assists, deaths } = currParticipant;
    const myStatPerMin = (kills + assists) / (deaths || 1);

    if (Number.isNaN(myStatPerMin)) return;

    return getKDAStats({
      rankStats,
      rankStatsByRole,
      isARAM,
      stat: {
        gameDuration: match?.gameDuration,
        kdaPerMin: myStatPerMin,
      },
      rankFilter: summonerRank,
      language,
    });
  }, [
    match,
    rankStats,
    rankStatsByRole,
    currParticipant,
    summonerRank,
    isARAM,
    language,
  ]);

  const { allScores, maxRankValue } = useMemo(() => {
    if (!KDAStats?.allScores) return {};
    return {
      allScores: KDAStats.allScores.reverse(),
      maxRankValue: Math.max(...KDAStats.allScores.map((s) => s.value)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [KDAStats?.allScores, summonerRank]);

  if (!KDAStats) {
    return <PlayerEmptyStatTile isLoading={isLoading} />;
  }

  const isPositive = KDAStats.myStatPerMin >= KDAStats.rankKDAPerMin;
  const tipGrade =
    KDAStats?.myScore?.grade === "S+"
      ? KDAStats?.myScore?.grade
      : KDAStats?.myScore?.grade?.[0];

  return (
    <PlayerStatTile
      key={STAT_TILE_TYPES.kda}
      currParticipant={currParticipant}
      summonerRank={summonerRank}
      myChampion={myChampion}
      isWinner={isWinner}
      isPositive={isPositive}
      showSetCSGoal={false}
      percentDiff={KDAStats.myScore.percentile * 100}
      tips={tips}
      tipGrade={tipGrade}
      allScores={allScores}
      scoreTrendLabel={t("common:stats.kda", "KDA")}
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
          {KDAStats?.myScore?.grade}
        </span>
      }
      RankIcon={() => <RankIcon className="rank-icon" />}
      rankStr={rankStr}
      yourRank={null}
      maxRankValue={maxRankValue}
      description={
        <Trans i18nKey="lol:postmatch.KDATip">
          <span>KDA</span> measures how well you perform in teamfights. Lower
          your <span>deaths</span>.
        </Trans>
      }
      stats={KDAStats}
      isARAM={isARAM}
      isExtTile={true}
      gradient={[
        {
          stop: 0,
          color: KDAStats.myScore.fillColor,
        },
        {
          stop: 1,
          color: KDAStats.myScore.fillColor,
        },
      ]}
      delay={delay}
      tiletype={STAT_TILE_TYPES.kda}
      title={t("common:combat", "Combat")}
      TitleIcon={HextechStatMelee}
    />
  );
};

export default PlayerKDAStatTile;
