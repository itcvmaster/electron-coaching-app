import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import useApexWeapons from "@/game-apex/useApexWeapons.jsx";
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
  const { weapons: myWeapons } = useApexWeapons({
    season,
    mode,
    profileId,
  });
  const state = useSnapshot(readState);
  const weapons = state.apex.meta?.weapons;

  const [showAll, setShowAll] = useState(false);

  const setShowMore = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll]);

  const LegendRow = (stat) => {
    const { weaponId, kills, headshotPercentage, accuracy } = stat;
    const weaponInfo = weapons?.[weaponId];
    const weaponImgUrl = weaponInfo?.imageUrl;
    const weaponName = weaponInfo?.name || "-";

    return (
      <RowContainer>
        <Row key={weaponId}>
          <img className="weapon-icon" src={weaponImgUrl} />
          <StatLeft>
            <p className="type-subtitle2 name">{weaponName}</p>
            <p className="type-caption sub-stat">
              {t("apex:stats.hs", "{{headshotPercentage, percent}} HS", {
                headshotPercentage,
              })}
            </p>
          </StatLeft>
          <StatRight>
            <span className="type-subtitle2">
              {t("common:stats.killsCount", "{{count, number}} Kills", {
                count: kills,
              })}
            </span>
            <p className="type-caption sub-stat">
              {t("apex:stats.accuracy", "{{accuracy, percent}} Accuracy", {
                accuracy,
              })}
            </p>
          </StatRight>
        </Row>
      </RowContainer>
    );
  };

  return (
    <>
      {!myWeapons ? (
        <>
          {[...Array(5)].map(() => (
            <></>
          ))}
        </>
      ) : (
        <>
          {(showAll ? myWeapons : myWeapons.slice(0, DEFAULT_SHOWN)).map(
            LegendRow
          )}
          {myWeapons.length > DEFAULT_SHOWN ? (
            <ProfileShowMore showAll={showAll} setShowMore={setShowMore} />
          ) : null}
        </>
      )}
    </>
  );
};

export default React.memo(ApexLegendStat);
