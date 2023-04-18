import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { AGENT_ABILITY_CASTS } from "@/game-val/constants.mjs";
import {
  calcHeadshotPercent,
  getWeaponHeadshotColor,
  getWeaponImage,
} from "@/game-val/utils.mjs";
import WeaponHitItem from "@/shared/WeaponHitItem.jsx";
import { calcRate } from "@/util/helpers.mjs";
import orderBy from "@/util/order-array-by.mjs";

const CardContainer = styled("div")`
  position: relative;
  background: var(--shade7);
  border-radius: var(--br);

  @media screen and (max-width: 1000px) {
    margin-bottom: var(--sp-3);
  }
`;

const ListWrapper = styled("div")`
  border-radius: var(--br);
  padding: 0 0 var(--sp-2_5) 0;
`;

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: var(--sp-11);
  border-radius: var(--br);
  padding-right: ${(props) =>
    props.$isHeader ? "var(--sp-3)" : "var(--sp-4)"};
  --dash-opacity: ${(props) => (props.$isDeathmatch ? 0.15 : null)};

  &:nth-child(even) {
    background: var(--shade8);
  }

  .title-shade1 {
    color: var(--shade1);
    text-transform: capitalize;
  }

  .weapon-name {
    display: flex;
    color: var(--shade0);
    align-items: center;
    text-transform: capitalize;
  }

  .col-rank {
    flex: 1.2 1 0%;
    display: block;
  }
  .weapon-title {
    justify-content: center;
  }
  .col-weapon {
    flex: 3 1 0%;
    display: flex;
    align-items: center;
  }
  .col-kills {
    color: var(--shade1);
    flex: 1 1 0%;
  }
  .col-kill-range {
    flex: 1.4 1 0%;
    color: var(--shade1);
    opacity: var(--dash-opacity);
  }
  .col-hs {
    flex: 1 1 0%;
    color: ${(props) => props.$hscolor};
    opacity: var(--dash-opacity);
  }
  .col-dmg {
    flex: 1.4 1 0%;
    color: var(--shade1);
    opacity: var(--dash-opacity);
  }
  .col-hits {
    flex: 1 1 0%;
    display: contents;
  }
`;

const WeaponImage = styled("img")`
  width: var(--sp-18);
  margin-right: var(--sp-6);
`;
const getIds = (weapons) => {
  const ids = {};
  for (const weapon of weapons) {
    ids[weapon.id] = weapon.name;
  }
  return ids;
};

export default function WeaponStatsTable({
  weaponConstants,
  weaponStats,
  weaponRangeStats,
  weaponKDStats,
  matchStats,
  recentStats,
  isDeathmatch,
  agentName,
}) {
  const { t } = useTranslation();

  const WEAPON_IDs = weaponConstants ? getIds(weaponConstants) : null;

  const getWeaponName = (id) => {
    const foundWeapon = weaponConstants.find(
      (weapon) => weapon.id === id.replace("_alt", "")
    );
    return foundWeapon?.name;
  };

  const weaponRowStats = Object.entries(
    isDeathmatch ? weaponKDStats : weaponStats
  ).map(([weaponId, weaponObj]) => {
    if (!weaponObj) return null;
    const abilities = Object.values(
      AGENT_ABILITY_CASTS[agentName.toLowerCase()]
    );
    const weaponName = getWeaponName(weaponId);
    if (
      abilities.find((ability) => ability === weaponName?.replaceAll(" ", ""))
    )
      return null;

    const range = weaponRangeStats[weaponId];
    const kdObj = weaponKDStats[weaponId];
    const avgRange = calcRate(range?.totalRange, range?.kills, 1);
    const avgRangePerRound = Math.round(
      calcRate(avgRange, matchStats.roundsPlayed)
    );
    const avgDamage = Math.round(
      calcRate(weaponObj?.damage, weaponObj.roundsUsed || 1, 1)
    );

    const hsPercent = calcHeadshotPercent(weaponObj);

    const altKills = Math.round(weaponObj?.altFireKills);
    return {
      id: weaponId,
      name: weaponName,
      kills: kdObj?.kills,
      deaths: weaponObj?.deaths,
      altFireKills: altKills,
      avgKillRange: avgRangePerRound,
      hsPercent: Math.round(hsPercent),
      avgDmg: avgDamage,
      damageStats: weaponObj,
    };
  });

  const sortedWeaponRows = orderBy(
    weaponRowStats.filter((weapon) => weapon),
    "kills",
    "desc"
  );

  const recentHsPercent = calcHeadshotPercent(recentStats.damageStats);

  const StatsRow = ({
    rank,
    weaponId,
    name,
    kills,
    avgKillRange,
    hsPercent,
    avgDmg,
    damageStats,
    isDeathmatch,
  }) => {
    const weapon_image = WEAPON_IDs
      ? getWeaponImage(weaponId, WEAPON_IDs)
      : null;

    const hsColor = getWeaponHeadshotColor(hsPercent, recentHsPercent);
    const { headshots = 0, bodyshots = 0, legshots = 0 } = damageStats;
    if (!weapon_image) return null;
    return (
      <RowContainer
        $isDeathmatch={isDeathmatch}
        $hscolor={isDeathmatch ? "var(--shade1)" : hsColor}
      >
        <div className="col-rank">
          <p className="type-body2">{rank}</p>
        </div>
        <div className="col-weapon">
          <div className="weapon-name">
            {<WeaponImage src={weapon_image}></WeaponImage>}
            <p className="type-body2">{name}</p>
          </div>
        </div>
        <div className="col-kills">
          <p className="type-body2">{kills}</p>
        </div>
        <div className="col-kill-range">
          {isDeathmatch ? (
            "-"
          ) : (
            <p className="type-body2">
              {t("common:avg.kill.range", "{{avgKillRange}}m", {
                avgKillRange,
              })}
            </p>
          )}
        </div>
        <div className="col-hs">
          {isDeathmatch ? (
            "-"
          ) : (
            <p className="type-body2">
              {t("val:hsPercent", "{{hsPercent}}%", { hsPercent })}
            </p>
          )}
        </div>
        <div className="col-dmg">
          <p className="type-body2">
            {isDeathmatch
              ? "-"
              : t("common:avg.damage", "{{avgDmg}}", { avgDmg })}
          </p>
        </div>
        <div className="col-hits">
          <WeaponHitItem
            headshots={headshots}
            bodyshots={bodyshots}
            legshots={legshots}
            hasLegshots
          />
        </div>
      </RowContainer>
    );
  };

  return (
    <CardContainer>
      <ListWrapper>
        <RowContainer $isHeader>
          <div className="col-rank">
            <p className="type-caption title-shade1">{t("val:rank", "rank")}</p>
          </div>
          <div className="col-weapon weapon-title">
            <p className="type-caption title-shade1">
              {t("val:weapon", "weapon")}
            </p>
          </div>
          <div className="col-kills">
            <p className="type-caption title-shade1">
              {t("val:kills", "kills")}
            </p>
          </div>
          <div className="col-kill-range">
            <p className="type-caption title-shade1">
              {t("val:avgKillRange", "Avg. Kill Range")}
            </p>
          </div>
          <div className="col-hs">
            <p className="type-caption title-shade1">
              {t("val:hsPercent", "HS%")}
            </p>
          </div>
          <div className="col-dmg">
            <p className="type-caption title-shade1">
              {t("val:avgDmg", "Avg. Dmg")}
            </p>
          </div>
          <div className="col-hits">
            <p className="type-caption title-shade1">{t("val:hits", "Hits")}</p>
          </div>
        </RowContainer>

        {sortedWeaponRows.map((weapon, ind) => {
          return (
            <StatsRow
              rank={ind + 1}
              weaponId={weapon.id}
              name={weapon.name}
              kills={weapon.kills}
              altFireKills={weapon.altFireKills}
              avgKillRange={weapon.avgKillRange}
              hsPercent={weapon.hsPercent}
              avgDmg={weapon.avgDmg}
              key={weapon.id}
              damageStats={weapon.damageStats}
              isDeathmatch={isDeathmatch}
            />
          );
        })}
      </ListWrapper>
    </CardContainer>
  );
}
