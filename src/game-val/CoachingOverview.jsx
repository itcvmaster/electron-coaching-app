import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { COACHING_IMAGES } from "@/game-val/constants.mjs";
import OverviewTile from "@/game-val/OverviewTile.jsx";
import {
  getAvgHeadshot,
  getMatchDataWithPerfStats,
  getSprayControl,
  safeDivide,
} from "@/game-val/utils.mjs";

const OverviewContainer = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
  height: 507px;
`;

const getAvgSprayControl = (allStats, weapId, type) => {
  if (allStats && allStats?.[weapId]?.[type]) {
    const stats = allStats?.[weapId]?.[type];
    return getSprayControl(stats);
  }
  return 0;
};

const getSkillStatusByValue = (current, last20) => {
  if (current && current >= last20) {
    return {
      i18nKey: "perfect",
      default: "Perfect",
    };
  }

  return {
    i18nKey: "need_to_be_improved",
    default: "Need to be improved",
  };
};

const getLast20Stats = (matchPerformanceStats) => {
  if (!matchPerformanceStats || matchPerformanceStats.length === 0) {
    return {
      crosshair: {
        crosshairDistance: 0,
        headLevel: 0,
        leftRight: 0,
      },
      spray: {
        spray: 0,
      },
      headshot: {
        headshot: 0,
      },
    };
  }

  const lastStats = matchPerformanceStats[0].lastN;
  const crosshair = {
    crosshairDistance:
      parseInt(
        safeDivide(lastStats?.distance, lastStats?.crosshairplacementCount)
      ) || 0,
    headLevel: parseInt(lastStats?.yAxis / (lastStats?.count || 1)),
    leftRight: parseInt(Math.abs(lastStats?.xAxis) / (lastStats?.count || 1)),
  };
  const spray = {
    spray: getSprayControl(lastStats) || 0,
  };
  const headshot = {
    headshot: safeDivide(
      lastStats?.headshots,
      lastStats?.bodyshots + lastStats?.legshots + lastStats?.missedshots
    ).toFixed(1),
  };

  return {
    crosshair,
    spray,
    headshot,
  };
};

const getColorByValue = (current, last20) => {
  if (!current) {
    return "#E44C4D";
  }

  if (current < last20 * 0.4) {
    return "#E44C4D";
  }
  return "#30D9D4";
};

const getTotalAvgSprayControl = (allStats) => {
  if (allStats) {
    const avgSprayControls = getAvgSprayControl(allStats, "all", "all");
    return avgSprayControls;
  }
  return 0;
};

export const calcAvgSprayControlForAllWeaps = (allStats) => {
  if (allStats) {
    return Object.entries(allStats).map(([weapId, weapStats]) => {
      return {
        ...weapStats["all"],
        weapId,
        avgSprayControl: (
          (weapStats["all"].missedshots * 100) /
          (weapStats["all"].headshots +
            weapStats["all"].bodyshots +
            weapStats["all"].legshots +
            weapStats["all"].missedshots)
        ).toFixed(1),
      };
    });
  }
  return [];
};

const parseCrosshairStats = (performanceStats, type) => {
  if (performanceStats && performanceStats?.[type]) {
    const stats = performanceStats?.[type];
    const crosshairDist = parseInt(100 - stats?.distance / (stats?.count || 1));
    const duelWonCrossDist =
      stats?.duelsWon?.count > 0
        ? parseInt(
            100 - stats?.duelsWon?.distance / stats?.duelsWon?.count || 1
          )
        : 0;
    const duelWonCrossLost =
      stats?.duelsLost?.count > 0
        ? parseInt(100 - stats?.duelsLost?.distance / stats?.duelsLost?.count)
        : 0;
    return {
      crosshairPlacement: stats?.distance,
      avgCrosshairDistance: crosshairDist,
      avgHeadLevelDistance:
        stats?.yAxis < 0
          ? -1 * (100 - Math.abs(parseInt(stats?.yAxis / (stats?.count || 1))))
          : 100 - Math.abs(parseInt(stats?.yAxis / (stats?.count || 1))),
      avgRightDistance: parseInt(
        100 -
          stats?.positiveXAxis?.distance / (stats?.positiveXAxis?.count || 1)
      ),
      avgLeftDistance: parseInt(
        100 -
          Math.abs(
            stats?.negativeXAxis?.distance / (stats?.negativeXAxis?.count || 1)
          )
      ),
      avgLeftRightDistance: parseInt(
        100 -
          (stats?.positiveXAxis?.distance / (stats?.positiveXAxis?.count || 1) +
            Math.abs(stats?.negativeXAxis?.distance) /
              (stats?.negativeXAxis?.count || 1)) /
            2
      ),
      duelsWon: duelWonCrossDist,
      duelsLost: duelWonCrossLost,
    };
  }
  return {
    crosshairPlacement: 0,
    avgCrosshairDistance: 0,
    avgHeadLevelDistance: 0,
    avgLeftDistance: 0,
    avgRightDistance: 0,
    avgLeftRightDistance: 0,
  };
};

const CoachingOverview = ({ profileId }) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);

  const hasBlitzPro = (roles) => {
    return (
      (Array.isArray(roles) ? roles : []).find(
        //For checking the role of the login user. in the future this section has to be replaced based on login module.
        (role) => role.code === "PRO_SUBSCRIBER"
      ) || false
    );
  };

  const profile = state.val?.profiles?.[profileId];

  const performanceStats =
    state.val?.coachingValue?.coachingData?.[profile?.id];
  const playerPerformanceStats = performanceStats?.performance;
  const matchPerformanceStats = performanceStats?.matches;
  const matchData = getMatchDataWithPerfStats(matchPerformanceStats, profileId);

  const userRoles = state.val?.profiles?.[profileId]?.roles;
  const isPro = hasBlitzPro(userRoles);

  const avgSprayControl = getTotalAvgSprayControl(
    playerPerformanceStats?.sprayControlStats
  );

  const crosshairOverviewData = playerPerformanceStats?.crosshairPlacementStats
    ? parseCrosshairStats(
        playerPerformanceStats?.crosshairPlacementStats,
        "all"
      )
    : null;
  const last20PerfStats = getLast20Stats(matchPerformanceStats);

  const totalAvgHeadshot = getAvgHeadshot(
    playerPerformanceStats?.headshotStats?.["all"]
  );

  const firstShotAccuracy = useMemo(() => {
    if (
      playerPerformanceStats?.firstShotHits &&
      playerPerformanceStats?.firstShots
    ) {
      return (
        (playerPerformanceStats?.firstShotHits * 100) /
        (playerPerformanceStats?.firstShots || 1)
      ).toFixed(1);
    }
    return null;
  }, [playerPerformanceStats]);

  const duelWinRate = useMemo(() => {
    if (
      playerPerformanceStats &&
      playerPerformanceStats?.headshotStats &&
      playerPerformanceStats?.headshotStats?.["all"]
    ) {
      const headshotStats = playerPerformanceStats?.headshotStats?.["all"];
      return (
        (headshotStats?.duelsWon?.count * 100) /
        (headshotStats?.duelsPlayed?.count || 1)
      ).toFixed(1);
    }
    return null;
  }, [playerPerformanceStats]);

  return (
    <OverviewContainer>
      <OverviewTile
        type="accuracy"
        idx="2"
        notes={t(
          "val:profile.coacingoverview.accuracy_note",
          "Shooting analyzed with a detailed hits distribution of your fired shots."
        )}
        bg={COACHING_IMAGES.AccuracyBg}
        video={COACHING_IMAGES.AccuracySkillVideo}
        title={t("val:accuracy", "Accuracy")}
        link={`/valorant/coaching/${profileId}/accuracy`}
        color={getColorByValue(
          totalAvgHeadshot,
          last20PerfStats?.headshot?.headshot
        )}
        value={totalAvgHeadshot !== null ? `${totalAvgHeadshot}%` : null}
        icon={COACHING_IMAGES.AccuracyImg}
        detailData={[
          {
            title: "Headshot",
            value: duelWinRate !== null ? `${duelWinRate}%` : "-",
            isBlitz: true,
          },
          {
            title: "First Shot Accuracy",
            value: firstShotAccuracy !== null ? `${firstShotAccuracy}%` : "-",
            isBlitz: isPro,
          },
          { title: "Time to Kill", value: "-", isBlitz: isPro },
        ]}
        matchData={playerPerformanceStats?.headshotStats ? matchData : []}
        matchValueField={"hs"}
        comingSoon
      />

      <OverviewTile
        type="crosshair-placement"
        idx="1"
        notes={t(
          "val:profile.coacingoverview.crosshairplacement_note",
          "How well you position your crosshair when you see an enemy."
        )}
        bg={COACHING_IMAGES.CrosshairPlacementBg}
        video={COACHING_IMAGES.CrosshairSkillVideo}
        title={t("val:crosshairPlacement", "Crosshair Placement")}
        link={`/valorant/coaching/${profileId}/crosshair`}
        color={getColorByValue(
          crosshairOverviewData?.avgCrosshairDistance,
          last20PerfStats?.crosshair?.crosshairDistance
        )}
        status={getSkillStatusByValue(
          crosshairOverviewData?.avgCrosshairDistance,
          last20PerfStats?.crosshair?.crosshairDistance
        )}
        value={
          crosshairOverviewData
            ? `${Math.abs(
                parseInt(crosshairOverviewData?.avgCrosshairDistance)
              )}%`
            : null
        }
        icon={COACHING_IMAGES.CrosshairImg}
        detailData={[
          {
            title: t(
              "val:profile.crosshairPerformance.analysis.avgCrosshairDistance",
              "Avg. Distance"
            ),
            value: crosshairOverviewData
              ? `${Math.abs(
                  parseInt(crosshairOverviewData?.avgCrosshairDistance)
                )}%`
              : "-",
            isBlitz: true,
          },
          {
            title: t(
              "val:profile.crosshairPerformance.analysis.avgHeadLevel",
              "Avg. Vertical Level"
            ),
            value: crosshairOverviewData
              ? `${Math.abs(
                  parseInt(crosshairOverviewData?.avgHeadLevelDistance)
                )}%`
              : "-",
            isBlitz: isPro,
          },
          {
            title: t(
              "val:profile.crosshairPerformance.analysis.avgLeftRight",
              "Avg. Horizontal Level"
            ),
            value: crosshairOverviewData
              ? `${
                  Math.abs(
                    parseInt(
                      crosshairOverviewData?.avgLeftDistance +
                        crosshairOverviewData?.avgRightDistance
                    )
                  ) / 2
                }%`
              : "-",
            isBlitz: isPro,
          },
        ]}
        matchData={crosshairOverviewData ? matchData : []}
        matchValueField={"crosshair"}
      />

      <OverviewTile
        type="spray-control"
        idx="0"
        notes={t(
          "val:profile.spray_control.note",
          "How well you offset gun recoil."
        )}
        bg={COACHING_IMAGES.SprayControlBg}
        video={COACHING_IMAGES.SpraySkillVideo}
        title={t("val:sprayControl", "Spray Control")}
        link={`/valorant/coaching/${profileId}/spray_control`}
        color={getColorByValue(avgSprayControl, last20PerfStats?.spray.spray)}
        value={
          playerPerformanceStats?.sprayControlStats
            ? `${avgSprayControl}%`
            : null
        }
        icon={COACHING_IMAGES.SprayControlImg}
        matchData={playerPerformanceStats?.sprayControlStats ? matchData : []}
        matchValueField={"sprayControl"}
        comingSoon
      />
    </OverviewContainer>
  );
};

export default CoachingOverview;
