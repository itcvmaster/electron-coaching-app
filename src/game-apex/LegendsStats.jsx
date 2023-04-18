import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import useApexLegends from "@/game-apex/useApexLegends.jsx";
// import ApexEmptyWeaponStats from "client/apex/profile/ApexEmptyWeaponStats";
import ProfileShowMore from "@/shared/ProfileShowMore.jsx";
import {
  Row,
  RowContainer,
  StatLeft,
  StatRight,
} from "@/shared/ProfileStats.style.jsx";

const DEFAULT_SHOWN = 4;

const ApexLegendStat = ({ season, mode, profileId }) => {
  const { t } = useTranslation();
  const { legends: myLegends } = useApexLegends({
    season,
    mode,
    profileId,
  });
  const state = useSnapshot(readState);
  const legends = state.apex.meta?.legends;

  const [showAll, setShowAll] = useState(false);

  const setShowMore = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll]);

  const LegendRow = (stat) => {
    const {
      champion_id,
      kills,
      games_played: matches,
      placements_win: wins,
    } = stat;
    const legendInfo = legends?.[champion_id];
    const legendImgUrl = legendInfo?.imageUrl;
    const legendName = legendInfo?.name || "-";

    return (
      <RowContainer>
        <Row key={champion_id}>
          <img className="legend-icon" src={legendImgUrl} />
          <StatLeft>
            <p className="type-subtitle2 name">{legendName}</p>
            <p className="type-caption sub-stat">
              {t("common:stats.matchesCount", "{{count, number}} Matches", {
                count: matches,
              })}
            </p>
          </StatLeft>
          <StatRight>
            <span className="type-subtitle2">
              {t("common:stats.winsCount", "{{count, number}} Wins", {
                count: wins,
              })}
            </span>
            <p className="type-caption sub-stat">
              {t("common:stats.killsCount", "{{count, number}} Kills", {
                count: kills,
              })}
            </p>
          </StatRight>
        </Row>
      </RowContainer>
    );
  };

  return (
    <>
      {!myLegends ? (
        <>
          {[...Array(5)].map(() => (
            <></>
          ))}
        </>
      ) : (
        <>
          {(showAll ? myLegends : myLegends.slice(0, DEFAULT_SHOWN)).map(
            LegendRow
          )}
          {myLegends.length > DEFAULT_SHOWN ? (
            <ProfileShowMore showAll={showAll} setShowMore={setShowMore} />
          ) : null}
        </>
      )}
    </>
  );
};

export default React.memo(ApexLegendStat);
