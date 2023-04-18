import React, { memo, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { kdaColorStyle } from "@/app/util.mjs";
import {
  calcKP,
  calcTotalDamage,
  calcTotalKills,
} from "@/game-lol/calc-match-stats.mjs";
import {
  GAME_LOL_RANK_COLORS,
  MAX_GAME_TIME_IN_MINUTES,
  QUEUE_SYMBOLS,
  RANK_SYMBOL_TO_STR,
  RANK_SYMBOLS,
  ROLE_SYMBOLS,
} from "@/game-lol/constants.mjs";
import getRankIcon from "@/game-lol/get-rank-icon.mjs";
import { TagTooltipDescription } from "@/game-lol/MatchScoreDescription.jsx";
import SymbolQueue from "@/game-lol/symbol-queue.mjs";
import { translateQueueType } from "@/game-lol/translate-queue-type.mjs";
import { translateRoles } from "@/game-lol/translate-roles.mjs";
import {
  getChampionDivStatsId,
  getCSStats,
  getDamageStats,
  getKDAStats,
  getOneRankAbove,
  getSuppStats,
  getVisionScoreStats,
  mapRoleToSymbol,
} from "@/game-lol/util.mjs";
import { MatchError } from "@/shared/Match.jsx";
import {
  MatchInfoContainer,
  MatchInfoSummary,
  MatchStats,
  MatchTitle,
  RankPoints,
} from "@/shared/Profile.style.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import getOrdinal from "@/util/get-ordinal.mjs";
import { calcKDA } from "@/util/helpers.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

const queueName = css`
  // width: 80px; /* Semi artitraty number so queue name isnt super long and break layout */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  text-align: end;
`;
const GameTime = css`
  text-align: end;
`;

// Match placement ranking tag
const TagFrame = styled("div")`
  position: relative;
  display: inline-block;
  padding-left: --padding;
  padding-right: --padding;
  border-radius: 2px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-color, var(--tag-color, var(--shade3)));
    border-radius: var(--br-sm);
    opacity: 0.15;
  }

  .tag-text {
    position: relative;
    color: var(--tag-color, var(--shade3));
  }
`;

const MatchStatsIcon = styled("div")`
  display: flex;
  margin-right: var(--sp-2);
  width: var(--sp-5);
  height: var(--sp-6);
  justify-content: center;
  svg {
    height: auto;
  }
  .rank-label {
    line-height: var(--sp-6);
    color: ${({ color }) => (color ? color : "var(--shade6)")};
  }
`;

const CaptionBold = styled("p")`
  font-weight: 500;
  font-size: var(--sp-3);
  line-height: var(--sp-5);
  letter-spacing: -0.009em;
`;

const Tag = ({
  text,
  tagColor,
  isMVP = false,
  tiltFree = false,
  tooltip,
  bgColor,
  padding = "6px",
}) => {
  if (!tiltFree || (tiltFree && isMVP)) {
    return (
      <TagFrame
        style={{
          "--tag-color": tagColor,
          "--bg-color": bgColor,
          "--padding": padding,
        }}
      >
        <CaptionBold className="tag-text" data-tip={tooltip}>
          {text}
        </CaptionBold>
      </TagFrame>
    );
  }
  return null;
};

// // Match stats (right side) of the match tile.
// // Each Blitz game needs their own unique stats component
// // because they are all different.
// // Left side (border, img, icon) are shared from <ProfileMatch />
// // https://gyazo.com/57d5c53dc4bfe66cbf12a44019387235
const Stats = memo(
  ({
    stats,
    stats: { ownData, gameCreation, gameDuration },
    isRemake,
    queue,
    win,
    isMVP,
    isARAM,
    userRanking,
    userPoints,
    role,
    RoleIcon,
    roleName,
    deltaLp,
  }) => {
    const { t } = useTranslation();
    const state = useSnapshot(readState);
    const queueType = translateQueueType(t, queue);
    const tiltFree = false;
    let summonerRankTier = 0;
    if (!summonerRankTier) summonerRankTier = RANK_SYMBOLS.silver;
    const summonerRank = RANK_SYMBOL_TO_STR[summonerRankTier].key;
    const oneRankAbove = getOneRankAbove(summonerRankTier);
    const durationAsMinutes =
      (MAX_GAME_TIME_IN_MINUTES > gameDuration
        ? gameDuration / 60
        : gameDuration / 60000) || 1;

    const userStats = ownData;
    // Calculate a bunch of league stats stuff
    const teammates = stats.participants.filter(
      (p) => p.teamId === ownData.teamId
    );

    const totalKills = calcTotalKills(teammates);
    const totalDmg = calcTotalDamage(teammates);
    const kda = calcKDA(
      userStats?.kills,
      userStats?.deaths,
      userStats?.assists,
      2
    );
    const killParticiaption = calcKP(userStats, totalKills);
    const visionPerMin = userStats.visionScore / durationAsMinutes;
    const csTotal =
      userStats.totalMinionsKilled + userStats.neutralMinionsKilled;
    const csPerMin = parseFloat(csTotal / durationAsMinutes);
    const dmgPerMin = Number.parseInt(
      userStats.totalDamageDealtToChampions / durationAsMinutes
    );
    const dmgPercent = parseFloat(
      (userStats.totalDamageDealtToChampions / (totalDmg || 1)) * 100
    );
    const ccScore = userStats.timeCCingOthers;
    const goldEarned = userStats.goldEarned;
    const goldPerMin = (goldEarned || 0) / durationAsMinutes;

    const matchTileCC = useMemo(() => {
      return ccScore.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [ccScore]);
    const matchTileVision = useMemo(() => {
      return visionPerMin.toLocaleString(getLocale(), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }, [visionPerMin]);
    const matchTilePercKp = useMemo(() => {
      return killParticiaption.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [killParticiaption]);
    const matchTileKda = useMemo(() => {
      return kda.toLocaleString(getLocale(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
    }, [kda]);
    const matchTileCsPerMin = useMemo(() => {
      return csPerMin.toLocaleString(getLocale(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }, [csPerMin]);
    const matchTileDmgPerMin = useMemo(() => {
      return dmgPerMin.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [dmgPerMin]);
    const matchTilePercDmg = useMemo(() => {
      return dmgPercent.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [dmgPercent]);
    const matchTileGoldPerMin = useMemo(() => {
      return goldPerMin.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [goldPerMin]);

    // Color of the match tile
    const titleColor = isRemake
      ? "title_remake"
      : isMVP
      ? "title_mvp"
      : win
      ? "title_won"
      : "title_lost";

    const lp = deltaLp;
    const lpSign = lp > 0 ? "+" : "";
    const lpColor = lp > 0 ? "#24E8CC" : lp === 0 ? "var(--shade2)" : "#FF5859";

    const showRankTag =
      tiltFree && userRanking === 1
        ? true
        : !!(tiltFree === false && userRanking);

    const tagText = isMVP ? "MVP" : getOrdinal(userRanking);
    const bgColor = "transparent";
    const tagColor = isMVP ? "var(--yellow)" : "var(--shade2)";

    const isSupport = mapRoleToSymbol(role) === ROLE_SYMBOLS.support;

    const timeDisplay = gameCreation;
    const tagTooltipHTML = ReactDOMServer.renderToStaticMarkup(
      <TagTooltipDescription
        points={userPoints}
        isSupport={isSupport}
        isWinner={win}
      />
    );

    const { championId } = ownData || {};

    const divStatsId = getChampionDivStatsId({
      championId,
      role: roleName === "Bot" ? "ADC" : roleName,
      queue: isARAM ? "HOWLING_ABYSS_ARAM" : "RANKED_SOLO_5X5",
    });
    const divStats = state.lol.championDivStats[divStatsId];
    const statsError = userStats instanceof Error ? userStats : null;
    const divStatsError = divStats instanceof Error ? divStats : null;
    const data = divStats?.divisionStats;
    const rankStats = useMemo(() => {
      if (data && Array.isArray(data) && data.length > 0) {
        const clone = data.slice();
        // Force a linear trend for stats shown by rank, sometimes higher ranks have lower numbers than lower ranks which we do not want.
        [
          { stat: "creepScoreByMinute" },
          { stat: "visionScorePerMinute" },
          { stat: "supportItemQuestCompletionTime", lowerIsBetter: true },
        ].forEach(({ stat, lowerIsBetter }) => {
          if (clone[0][stat])
            for (const [key, value] of Object.entries(clone[0][stat])) {
              const mean = value?.mean;
              let currValue = mean;
              let i = 1;
              while (i < clone.length) {
                const rankMean = clone?.[i]?.[stat]?.[key]?.mean;
                if (!currValue && !rankMean) {
                  // Do nothing?
                } else if (!currValue && rankMean) {
                  currValue = lowerIsBetter
                    ? rankMean + rankMean * 0.05 * (i + 1)
                    : rankMean - rankMean * 0.05 * (i + 1);
                  i = 0;
                  continue;
                } else if (
                  (rankMean &&
                    (lowerIsBetter
                      ? rankMean > currValue
                      : rankMean < currValue)) ||
                  !rankMean
                ) {
                  clone[i][stat] = clone[i][stat] || {};
                  clone[i][stat][key] = clone[i][stat][key] || {};
                  clone[i][stat][key].mean = lowerIsBetter
                    ? (currValue -= currValue * 0.05)
                    : (currValue += currValue * 0.05);
                } else {
                  currValue = rankMean;
                }
                i++;
              }
            }
        });
        return clone;
      }
      return [];
    }, [data]);
    // const rankStats = 0;
    const matchStats = useMemo(() => {
      if (
        !rankStats ||
        // !rankStatsByRole ||
        // !rankStatsByRole.length ||
        !summonerRank ||
        !durationAsMinutes
      ) {
        return null;
      }
      const variables = {
        rankStats: rankStats,
        oneRankAbove,
        stat: {
          gameDuration,
          csPerMin: csPerMin,
          visionScorePerMin: userStats.visionScore,
          dmgPerMin: dmgPerMin,
          kdaPerMin: kda,
        },
        isARAM,
        rankFilter: summonerRank.toUpperCase(),
      };

      const csStats = getCSStats(variables);
      const visionStats = getVisionScoreStats(variables);
      const dmgStats = getDamageStats(variables);
      const kdaStats = getKDAStats(variables);
      const suppStats = getSuppStats(variables);

      const matchcStats = {
        csStats: csStats,
        visionStats: visionStats,
        dmgStats: dmgStats,
        kdaStats: kdaStats,
        suppStats: suppStats,
      };
      return matchcStats;
    }, [
      rankStats,
      summonerRank,
      durationAsMinutes,
      oneRankAbove,
      gameDuration,
      csPerMin,
      userStats.visionScore,
      dmgPerMin,
      kda,
      isARAM,
    ]);

    const { VisionScoreRankIcon, visionScorePlacement } = useMemo(() => {
      const visionStats = matchStats?.visionStats;
      if (!visionStats) return {};

      const you = {
        key: "you",
        value: visionStats.myStatPerMin,
        text: visionStats.myStatPerMin,
        fillColor:
          GAME_LOL_RANK_COLORS[RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key].fill,
      };
      let oneRankBelowIndex;
      let oneRankAboveIndex;
      let passedOneRankAbove;

      let oldRankVision = -1;

      const scores = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)
        .reverse()
        .filter((s) => s !== RANK_SYMBOLS.platinumPlus)
        .reduce((arr, key, i) => {
          const val = RANK_SYMBOL_TO_STR[key];
          const rankStat = rankStats.find(
            (s) => RANK_SYMBOL_TO_STR[s.tier]?.capped === val.capped
          );
          const { visionScorePerMinute } = rankStat || {};

          let vision = 0;
          if (
            visionStats?.key &&
            visionScorePerMinute?.[visionStats?.key]?.mean &&
            visionStats?.minutes
          ) {
            vision =
              visionScorePerMinute[visionStats.key]?.mean * visionStats.minutes;
          }

          if (oldRankVision >= vision) {
            vision = oldRankVision + 0.5;
          }

          oldRankVision = vision;

          if (
            vision > visionStats.myStatPerMin &&
            oneRankBelowIndex === undefined
          ) {
            oneRankBelowIndex = Math.max(0, i - 1);
            oneRankAboveIndex = i + 1;
            if (!passedOneRankAbove) {
              if (arr[i + 1]) arr[i + 1].showAbv = true;
            }
            arr.push(you);
          }

          if (oneRankAbove === val.capped) passedOneRankAbove = true;
          const RankIcon = getRankIcon(val.t.fallback.toLowerCase());

          arr.push({
            img: RankIcon,
            text: vision.toFixed(1),
            value: vision,
            key: val.key,
            fillColor: GAME_LOL_RANK_COLORS[val.key].fill,
          });

          return arr;
        }, []);

      if (scores.length < 2) return {};

      if (!oneRankAboveIndex) {
        scores.push(you);
        oneRankBelowIndex = scores.length - 2;
        oneRankAboveIndex = scores.length - 1;
      }

      const myPlacement = scores[oneRankBelowIndex];
      myPlacement.key =
        myPlacement.key !== "you"
          ? myPlacement.key
          : RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key;
      const MyPlacementRankIcon = getRankIcon(myPlacement.key);

      return {
        VisionScoreRankIcon: MyPlacementRankIcon && <MyPlacementRankIcon />,
        visionScorePlacement: myPlacement,
      };
    }, [matchStats, rankStats, oneRankAbove]);

    const { CSRankIcon, csPlacement } = useMemo(() => {
      const csStats = matchStats?.csStats;
      if (!csStats) return {};

      const you = {
        key: "you",
        value: csStats.myStatPerMin,
        text: csStats.myStatPerMin.toFixed(1),
        fillColor:
          GAME_LOL_RANK_COLORS[RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key].fill,
      };

      let oneRankBelowIndex;
      let oneRankAboveIndex;
      let passedOneRankAbove;

      let oldRankCS = -1;
      const scores = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)
        .reverse()
        .filter((s) => s !== RANK_SYMBOLS.platinumPlus)
        .reduce((arr, key, i) => {
          const val = RANK_SYMBOL_TO_STR[key];
          const rankStat = rankStats.find(
            (s) =>
              RANK_SYMBOL_TO_STR[s.tier]?.capped.toLowerCase() ===
              val.t.fallback.toLowerCase()
          );
          const { creepScoreByMinute } = rankStat || {};

          let cs = 0;
          if (csStats?.maxMin && creepScoreByMinute?.[csStats?.maxMin]?.mean) {
            cs = creepScoreByMinute[csStats.maxMin]?.mean / csStats.maxMin;
          }

          if (oldRankCS > cs) {
            cs = oldRankCS + 0.5;
          }

          oldRankCS = cs;

          if (cs > csStats.myStatPerMin && oneRankBelowIndex === undefined) {
            oneRankBelowIndex = Math.max(0, i - 1);
            oneRankAboveIndex = i + 1;
            if (!passedOneRankAbove) {
              if (arr[i + 1]) arr[i + 1].showAbv = true;
            }
            arr.push(you);
          }
          if (oneRankAbove === val.capped) passedOneRankAbove = true;

          const RankIcon = getRankIcon(val.t.fallback.toLowerCase());

          arr.push({
            img: <RankIcon />,
            text: cs.toFixed(1),
            value: cs,
            key: val.key,
            fillColor: GAME_LOL_RANK_COLORS[val.key].fill,
          });

          return arr;
        }, []);
      if (scores.length < 2) return {};

      if (!oneRankAboveIndex) {
        scores.push(you);
        oneRankBelowIndex = scores.length - 2;
        oneRankAboveIndex = scores.length - 1;
      }

      const myPlacement = scores[oneRankBelowIndex];
      myPlacement.key =
        myPlacement.key !== "you"
          ? myPlacement.key
          : RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key;

      const MyPlacementRankIcon = getRankIcon(myPlacement.key);

      return {
        CSRankIcon: <MyPlacementRankIcon />,
        csPlacement: myPlacement,
      };
    }, [matchStats, rankStats, oneRankAbove]);

    const { SuppRankIcon } = useMemo(() => {
      const suppStats = matchStats?.suppStats;
      if (!suppStats) return {};

      const you = {
        key: "you",
        value: suppStats.myStatPerMin,
        text: suppStats.myStatPerMinLabel,
        fillColor:
          GAME_LOL_RANK_COLORS[RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key].fill,
      };

      let oneRankBelowIndex;
      let oneRankAboveIndex;
      let passedOneRankAbove;

      let oldRankSupp = -1;
      const scores = Object.getOwnPropertySymbols(RANK_SYMBOL_TO_STR)
        .reverse()
        .filter((s) => s !== RANK_SYMBOLS.platinumPlus)
        .reduce((arr, key, i) => {
          const val = RANK_SYMBOL_TO_STR[key];
          const rankStat = rankStats.find(
            (s) =>
              RANK_SYMBOL_TO_STR[s.tier]?.capped.toLowerCase() ===
              val.t.fallback.toLowerCase()
          );
          const { supportItemQuestCompletionTime } = rankStat || {};

          let suppScore = 0;
          if (
            suppStats?.itemId &&
            supportItemQuestCompletionTime?.[`item_${suppStats.itemId1}`]?.mean
          ) {
            suppScore =
              supportItemQuestCompletionTime?.[`item_${suppStats.itemId1}`]
                ?.mean;
          }

          if (oldRankSupp > suppScore) {
            suppScore = oldRankSupp + 0.5;
          }

          oldRankSupp = suppScore;

          if (
            suppScore > suppStats.myStatPerMin &&
            oneRankBelowIndex === undefined
          ) {
            oneRankBelowIndex = Math.max(0, i - 1);
            oneRankAboveIndex = i + 1;
            if (!passedOneRankAbove) {
              if (arr[i + 1]) arr[i + 1].showAbv = true;
            }
            arr.push(you);
          }
          if (oneRankAbove === val.capped) passedOneRankAbove = true;

          const RankIcon = getRankIcon(val.t.fallback.toLowerCase());

          arr.push({
            img: <RankIcon />,
            text: suppScore.toFixed(1),
            value: suppScore,
            key: val.key,
            fillColor: GAME_LOL_RANK_COLORS[val.key].fill,
          });

          return arr;
        }, []);
      if (scores.length < 2) return {};

      if (!oneRankAboveIndex) {
        scores.push(you);
        oneRankBelowIndex = scores.length - 2;
        oneRankAboveIndex = scores.length - 1;
      }

      const myPlacement = scores[oneRankBelowIndex];
      myPlacement.key =
        myPlacement.key !== "you"
          ? myPlacement.key
          : RANK_SYMBOL_TO_STR[RANK_SYMBOLS.iron].key;

      const MyPlacementRankIcon = getRankIcon(myPlacement.key);

      return {
        SuppRankIcon: <MyPlacementRankIcon />,
        SuppPlacement: myPlacement,
      };
    }, [matchStats, rankStats, oneRankAbove]);

    const { dmgPlacement } = useMemo(() => {
      const dmgStats = matchStats?.dmgStats;
      if (!dmgStats) return {};

      return {
        dmgPlacement: dmgStats.myScore,
      };
    }, [matchStats]);
    const { kdaPlacement } = useMemo(() => {
      const kdaStats = matchStats?.kdaStats;
      if (!kdaStats) return {};

      return {
        kdaPlacement: kdaStats.myScore,
      };
    }, [matchStats]);

    const killScore = useMemo(() => {
      return userStats.kills.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [userStats.kills]);

    const deathScore = useMemo(() => {
      return userStats.deaths.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [userStats.deaths]);

    const assistScore = useMemo(() => {
      return userStats.assists.toLocaleString(getLocale(), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }, [userStats.assists]);

    if (statsError) {
      return <MatchError />;
    }
    return (
      <MatchInfoContainer>
        {/* Result and Tag */}
        <div className="match-title">
          <MatchTitle className={`${titleColor} type-article-headline`}>
            {isRemake
              ? `${t("lol:results.remake", "Remake")}`
              : win
              ? `${t("lol:results.victory", "Victory")}`
              : `${t("lol:results.defeat", "Defeat")}`}
          </MatchTitle>
          <RankPoints color={lpColor}>
            {[QUEUE_SYMBOLS.rankedSoloDuo, QUEUE_SYMBOLS.rankedFlex].includes(
              SymbolQueue(queue)
            ) &&
            typeof lp === "number" &&
            lp !== 0
              ? `${lpSign}${t("lol:leaguePoints", "{{points}} LP", {
                  points: lp,
                })}`
              : null}
          </RankPoints>
          <MatchInfoSummary>
            {showRankTag ? (
              <Tag
                text={tagText}
                tagColor={tagColor}
                bgColor={bgColor}
                isMVP={isMVP}
                tiltFree={tiltFree}
                tooltip={tagTooltipHTML}
                padding="0"
              />
            ) : (
              <p className="type-caption match-sub-stat">&nbsp;</p>
            )}
            {showRankTag ? <div className="gap-dot" /> : null}
            {isARAM ? (
              <RoleIcon width={18} height={18} className={"role-icon"} />
            ) : (
              <RoleIcon className="role-icon" />
            )}
            {roleName ? (
              <p className="type-caption match-sub-stat role-name">
                {translateRoles(t, roleName)}
              </p>
            ) : null}
            {queueType ? <div className="gap-dot" /> : null}
            <p className="type-caption match-sub-stat" css={queueName}>
              {queueType}
            </p>
            {timeDisplay ? <div className="gap-dot" /> : null}
            <p className="type-caption match-sub-stat" css={GameTime}>
              <TimeAgo date={timeDisplay} />
            </p>
          </MatchInfoSummary>
        </div>
        <MatchStats>
          {/* KDA */}
          <div className="match-kda">
            <p
              className="type-subtitle2 match-stat"
              style={{ color: kdaColorStyle(kda) }}
              // style={{ color: "red" }}
            >
              {t("lol:matchTile.kda", "{{kda}} KDA", {
                kda: matchTileKda,
              })}
            </p>
            <p className="type-caption match-sub-stat">
              {t("lol:displayKDA", "{{kills}} / {{deaths}} / {{assists}}", {
                kills: killScore,
                deaths: deathScore,
                assists: assistScore,
              })}
            </p>
          </div>
          {/* Vision & KP (Vision will change to LP diff when available) */}
          <div className="match-vision">
            {isARAM ? (
              <MatchStatsIcon
                color={!divStatsError ? dmgPlacement?.fillColor : "white"}
              >
                <span className="type-subtitle1 rank-label">
                  {!divStatsError ? kdaPlacement?.grade : "?"}
                </span>
              </MatchStatsIcon>
            ) : (
              <MatchStatsIcon color={visionScorePlacement?.fillColor}>
                {VisionScoreRankIcon ? VisionScoreRankIcon : null}
              </MatchStatsIcon>
            )}
            <div className="match-description">
              <p
                className="type-subtitle2 match-stat"
                data-tip={
                  isARAM
                    ? t("lol:stats.ccScore", "Crowd Control Score")
                    : t("lol:stats.visionScoreMin", "Vision Score Per Minute")
                }
                data-delay-show="500"
              >
                {isARAM // If aram, show CC score instead of vision score
                  ? t("lol:matchTile.ccScore", "{{ccScore}} CC", {
                      ccScore: matchTileCC,
                    })
                  : t(
                      "lol:matchTile.visionPerMin",
                      "{{visionPerMin}} Vis/Min.",
                      {
                        visionPerMin: matchTileVision,
                      }
                    )}
              </p>
              <p className="type-caption match-sub-stat">
                {t("lol:matchTile.percKp", "{{kp}}% KP", {
                  kp: matchTilePercKp,
                })}
              </p>
            </div>
          </div>
          {/* CS */}
          {isSupport ? (
            <div className="match-cs">
              <MatchStatsIcon color={csPlacement?.fillColor}>
                {SuppRankIcon ? SuppRankIcon : null}
              </MatchStatsIcon>
              <div className="match-description">
                <p className="type-subtitle2 match-stat">
                  {t("lol:matchTile.goldPerMin", "{{gold}} Gold/Min.", {
                    gold: matchTileGoldPerMin,
                  })}
                </p>
                <p className="type-caption match-sub-stat">
                  {t("lol:matchTile.gold", "{{gold}} Gold", {
                    gold: goldEarned,
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="match-cs">
              <MatchStatsIcon color={csPlacement?.fillColor}>
                {CSRankIcon ? CSRankIcon : null}
              </MatchStatsIcon>
              <div className="match-description">
                <p className="type-subtitle2 match-stat">
                  {t("lol:matchTile.csPerMin", "{{cs}} CS/Min.", {
                    cs: matchTileCsPerMin,
                  })}
                </p>
                <p className="type-caption match-sub-stat">
                  {t("lol:matchTile.cs", "{{cs}} CS", {
                    cs: csTotal,
                  })}
                </p>
              </div>
            </div>
          )}
          {/* DMG */}
          <div className="match-dmg">
            <MatchStatsIcon
              color={!divStatsError ? dmgPlacement?.fillColor : "white"}
            >
              <span className="type-subtitle1 rank-label">
                {!divStatsError ? dmgPlacement?.grade : "?"}
              </span>
            </MatchStatsIcon>
            <div className="match-description">
              <p className="type-subtitle2 match-stat">
                {t("lol:matchTile.dmgPerMinute", "{{dmg}} DMG/Min.", {
                  dmg: matchTileDmgPerMin,
                })}
              </p>
              <p className="type-caption match-sub-stat">
                {t("lol:matchTile.percDmg", "{{dmg}}% of team", {
                  dmg: matchTilePercDmg,
                })}
              </p>
            </div>
          </div>
        </MatchStats>
      </MatchInfoContainer>
    );
  }
);

Stats.displayName = "Stats";

export default Stats;
