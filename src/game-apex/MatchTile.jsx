import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { getCaretColor } from "@/app/util.mjs";
import { GAME_MODES } from "@/game-apex/constants.mjs";
import useApexLast20 from "@/game-apex/useApexLast20.jsx";
import {
  calcWeaponsAccuracy,
  getLegendFromModelName,
  getMatchResultData,
  getPlayerStatsByMatch,
} from "@/game-apex/utils.mjs";
import CaretDown from "@/inline-assets/caret-down.svg";
import CaretUp from "@/inline-assets/caret-up.svg";
import {
  MatchInfoContainer,
  MatchInfoSummary,
  MatchStats,
  MatchTitle,
  RankPoints,
} from "@/shared/Profile.style.jsx";
import { ProfileMatch } from "@/shared/ProfileMatch.jsx";
import { TimeAgo } from "@/shared/Time.jsx";

function MatchTile({ match, liveGame, profileId }) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const {
    // matchId,
    gameStartedAt,
    season,
    mode,
  } = match;
  const myPlayer = getPlayerStatsByMatch(match, profileId);
  const {
    kills,
    assists,
    damagedealt,
    survivaltime,
    modelName,
    champion_id,
    ranked_points,
    headshots,
    hits,
    shots,
    weapons,
  } = myPlayer || {};

  const state = useSnapshot(readState);
  const legends = state.apex?.meta?.legends;
  const apexWeapons = null;
  const matchImgSrc =
    legends?.[
      liveGame ? getLegendFromModelName(modelName)?.apexId : champion_id
    ]?.imageUrl;
  const matchHs = hits ? headshots / hits : null;

  const accuracy = useMemo(() => {
    return calcWeaponsAccuracy(weapons, apexWeapons);
  }, [apexWeapons, weapons]);

  const { last20Stats } = useApexLast20({
    variables: {
      profileId: profileId,
      season,
      mode,
    },
    skip: !profileId,
  });

  const last20Hs = last20Stats?.headshots / (last20Stats?.hits || 1);

  let Arrow;
  if (matchHs >= last20Hs) {
    Arrow = CaretUp;
  } else {
    Arrow = CaretDown;
  }

  const { dmgPerMin } = useMemo(() => {
    if (!survivaltime) return {};
    const mins = survivaltime / 60;
    return {
      dmgPerMin: damagedealt / mins,
    };
  }, [damagedealt, survivaltime]);

  const modeObj = GAME_MODES[mode];

  const { colorClass, label, win, grade } = useMemo(() => {
    if (!match) return {};
    const { colorClass, label, win, grade } = getMatchResultData(
      t,
      modeObj,
      myPlayer,
      liveGame
    );

    return {
      colorClass,
      label,
      win,
      grade,
    };
  }, [match, t, modeObj, myPlayer, liveGame]);

  const rp = ranked_points;
  const rpSign = rp > 0 ? "+" : "";
  const rpColor =
    rp > 0 ? "var(--turq)" : rp === 0 ? "var(--shade2)" : "var(--red)";

  return (
    <ProfileMatch image={matchImgSrc}>
      <MatchInfoContainer>
        <div className="match-title">
          <MatchTitle className={`${colorClass} type-article-headline`}>
            {label}
          </MatchTitle>
          <RankPoints className="type-article-headline" color={rpColor}>
            {typeof rp === "number"
              ? `${rpSign}${t("apex:stat.rankedPoint", "{{points}} RP", {
                  points: rp,
                })}`
              : null}
          </RankPoints>
          <MatchInfoSummary>
            {win && (
              <div
                className="type-caption--bold"
                style={{ color: "var(--pro-solid)" }}
              >
                {grade}
              </div>
            )}
            {win && !!modeObj && <div className="gap-dot" />}
            {modeObj ? (
              <div className="type-caption match-sub-stat">
                {t(modeObj.t, modeObj.label)}
              </div>
            ) : null}
          </MatchInfoSummary>
        </div>
        <MatchStats>
          <div className="match-stat">
            {typeof kills === "number" ? (
              <>
                <div
                  className="type-subtitle2 match-stat"
                  style={{
                    color: "var(--yellow)",
                  }}
                >
                  {t("common:stats.killsCount", "{{count, number}} Kills", {
                    count: Math.round(kills),
                  })}
                </div>
                {typeof assists === "number" ? (
                  <div className="type-caption match-sub-stat">
                    {t(
                      "common:stats.assistsCount",
                      "{{count, number}} Assists",
                      {
                        count: assists,
                      }
                    )}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="match-kda">
            {typeof damagedealt === "number" ? (
              <>
                <div className="type-subtitle2 match-stat">
                  {t(
                    "apex:stats.damageNumber",
                    "{{damagedealt, number}} Damage",
                    {
                      damagedealt,
                    }
                  )}
                </div>
                {typeof dmgPerMin === "number" ? (
                  <div className="type-caption match-sub-stat">
                    {t("common:stats.dmgPerMinValue", "{{dmg}} Dmg/min", {
                      dmg: dmgPerMin.toLocaleString(language, {
                        maximumFractionDigits: 2,
                      }),
                    })}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="match-stats">
            {typeof hits === "number" ? (
              <>
                <div className="type-subtitle2 match-kda">
                  {hits ? (
                    <>
                      {t("apex:stats.hs", "{{hs, percent}} HS", {
                        hs: matchHs,
                      })}
                      {Arrow && (
                        <Arrow
                          style={{
                            display: "inline",
                            color: getCaretColor(matchHs - last20Hs),
                          }}
                        />
                      )}
                    </>
                  ) : (
                    t("apex:noShotsHit", "No Shots Hit")
                  )}
                </div>

                <div className="type-caption match-sub-stat">
                  {shots
                    ? t(
                        "common:stats.accuracy",
                        "{{accuracy, percent}} Accuracy",
                        {
                          accuracy,
                        }
                      )
                    : t("apex:noShotsFired", "No Shots Fired")}
                </div>
              </>
            ) : (
              <div className="type-subtitle2 match-kda"></div>
            )}
          </div>
          {/* <div className="match-stats"></div> */}
          <div>
            <div className="match-description">
              <p className="type-subtitle2 match-stat">&nbsp;</p>
              <p className="type-caption time-ago">
                <TimeAgo date={gameStartedAt * 1000} />
              </p>
            </div>
          </div>
        </MatchStats>
      </MatchInfoContainer>
    </ProfileMatch>
  );
}

export default React.memo(MatchTile);
