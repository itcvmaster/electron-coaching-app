import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import {
  calcHeadshotPercent,
  calcRate,
  getWeaponHeadshotColor,
  getWeaponImage,
} from "@/game-val/utils.mjs";
import { Section } from "@/shared/MatchHistoryHeader.style.jsx";
import ProfileShowMore from "@/shared/ProfileShowMore.jsx";

const RowContainer = styled("div")`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: var(--br);
  background-color: #181a20;
  margin: var(--sp-3) 0;
  width: 100%;

  &:first-of-type {
    margin-top: 0;
  }

  .headshot-percent {
    color: var(--shade2);
  }

  .weapon-name {
    text-transform: capitalize;
  }
`;

const WeaponInfo = styled("div")`
  display: flex;
  flex: ${(props) => (props.flex ? props.flex : 1)};
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  display: block;
  margin-left: auto;
  text-align: right;
`;
const WeaponStatsLoader = () => "";
const DEFAULT_SHOWN = 5;

const WeaponStats = ({ allWeapons, last20 }) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const getIds = (weapons) => {
    const ids = {};
    for (const weapon of weapons) {
      if (weapon.name !== "headhunter") ids[weapon.id] = weapon.name;
    }
    return ids;
  };
  const WEAPON_IDs = allWeapons ? getIds(allWeapons) : null;

  const last20HeadshotPercent = last20
    ? calcHeadshotPercent(last20?.damageStats)
    : null;
  const getWeaponKD = (id) => {
    const stats = last20?.weaponKDStats?.[id.replace("_alt", "")];
    return stats;
  };

  const getWeaponHeadShotPercent = (id) => {
    const weaponDamageStats =
      last20?.weaponDamageStats?.[id.replace("_alt", "")];
    if (weaponDamageStats) return calcHeadshotPercent(weaponDamageStats);
  };

  const WeaponRow = (weapon, i) => {
    const getWeaponName = (id) => {
      const foundWeapon = allWeapons.find(
        (weapon) => weapon.id === id.replace("_alt", "")
      );
      return foundWeapon?.name;
    };
    const weaponId = weapon[0];
    const weaponName = getWeaponName(weaponId);
    const weapon_image = WEAPON_IDs
      ? getWeaponImage(weaponId, WEAPON_IDs)
      : null;

    const killDeathStats = getWeaponKD(weaponId);
    const kills = killDeathStats?.kills;
    const deaths = killDeathStats?.deaths;
    const kd = calcRate(kills, deaths, 1);
    const headshotPercent = last20 ? getWeaponHeadShotPercent(weaponId) : null;
    const WeaponImage = styled("img")`
      width: var(--sp-22);
    `;

    return (
      weapon_image && (
        <RowContainer key={i}>
          <Section>{<WeaponImage src={weapon_image}></WeaponImage>}</Section>
          <Section column={"true"} flex={2}>
            <p className="type-caption weapon-name">
              {t("val:weaponName", "{{weaponName}}", {
                weaponName: weaponName,
              })}
            </p>
          </Section>
          <WeaponInfo column={"true"} flex={2}>
            <p className="type-caption">
              {t("val:kd", "{{kd}} KD", { kd: kd })}
            </p>
            <p
              style={{
                color: getWeaponHeadshotColor(
                  headshotPercent,
                  last20HeadshotPercent
                ),
              }}
              className="type-caption headshot-percent"
            >
              {t("val:hsPercent", "{{hsPercent}}% HS", {
                hsPercent: headshotPercent,
              })}
            </p>
          </WeaponInfo>
        </RowContainer>
      )
    );
  };

  const setShowMore = useCallback(() => {
    setShowAll(!showAll);
  }, [showAll]);

  let renderedList = last20?.weaponStats
    ? Object.entries(last20?.weaponStats)
    : null;

  if (!showAll) {
    renderedList = renderedList?.slice(0, DEFAULT_SHOWN);
  }
  return (
    <>
      {!renderedList ? (
        <>
          {[...Array(5)].map((e, i) => (
            <WeaponStatsLoader key={i} />
          ))}
        </>
      ) : (
        <>
          {renderedList.map(WeaponRow)}
          <ProfileShowMore showAll={showAll} setShowMore={setShowMore} />
        </>
      )}
    </>
  );
};

export default WeaponStats;
