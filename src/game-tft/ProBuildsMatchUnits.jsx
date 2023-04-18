import React, { memo } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { Body1, Caption } from "@/game-lol/CommonComponents.jsx";
import {
  ProBuildsChampion,
  ProBuildsChampionEmpty,
  ProBuildsChampionsList,
  ProBuildsToolTipItem,
  ProBuildsToolTipName,
} from "@/game-tft/CommonComponents.jsx";
import MatchUnit from "@/game-tft/MatchUnit.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import Traits from "@/game-tft/Traits.jsx";
import UnitAvatarTier from "@/game-tft/UnitAvatarTier.jsx";
import orderBy from "@/util/order-array-by.mjs";

const MatchUnitList = ({
  viewMode,
  traits = [],
  units = [],
  unitSize = 30,
  set,
}) => {
  const state = useSnapshot(readState);
  const { t } = useTranslation();

  const championsStaticData = state.tft.champions;
  const itemsStaticData = state.tft.items;
  const setItems = itemsStaticData[set];

  const unitsLength = units.length;
  const neededEmptyPieces = unitsLength > 9 ? 0 : 9 - unitsLength;

  return (
    <>
      {viewMode !== "tablet" && viewMode !== "mobile" && (
        <Traits traits={traits} set={set} />
      )}
      <ProBuildsChampionsList>
        {orderBy(units, "rarity", "asc").map((unit, i) => {
          const { character_id, name, tier, items, chosen } = unit;
          const flatItems = Array.isArray(items) ? items.flat(Infinity) : [];
          const unitString = character_id
            ? character_id.replace(/(TFT[0-9]_)/, "")
            : name;
          const unitName = StaticTFT.getChampName(unitString);
          const unitElement = StaticTFT.getChampElement(unitString);

          const champion = championsStaticData[unitName] || {
            key: unitName,
            name: unitName,
          };
          const chosenName = chosen?.split("_").pop();
          const pieceTooltip = ReactDOMServer.renderToStaticMarkup(
            <>
              <ProBuildsToolTipName>
                <Body1>{champion.name}</Body1>
                <UnitAvatarTier tier={tier} />
              </ProBuildsToolTipName>
              {flatItems.map((item, i) => {
                const unitItem =
                  setItems &&
                  Object.values(setItems).find(
                    (setItem) => setItem.id === item
                  );

                if (unitItem) {
                  return (
                    <ProBuildsToolTipItem key={`${item}_${i}`}>
                      <img
                        src={StaticTFT.getItemImage(unitItem.key, set)}
                        alt={unitItem.key}
                      />
                      <Caption>{unitItem.name}</Caption>
                    </ProBuildsToolTipItem>
                  );
                }
                return (
                  <ProBuildsToolTipItem key={`unknownItem_${i}`}>
                    <img
                      src=""
                      alt={t("tft:common.unknownItem", "Unknown Item")}
                    />
                    <Caption>
                      {t("tft:common.unknownItem", "Unknown Item")}
                    </Caption>
                  </ProBuildsToolTipItem>
                );
              })}
            </>
          );
          return (
            <MatchUnit
              key={`${unitName}_${i}`}
              unitName={unitName}
              unitSize={unitSize}
              items={flatItems}
              unitElement={unitElement}
              tooltip={pieceTooltip}
              tier={tier}
              set={set}
              chosen={chosenName}
            />
          );
        })}
        {new Array(neededEmptyPieces).fill(undefined).map((_, key) => (
          <ProBuildsChampion key={key}>
            <ProBuildsChampionEmpty size={unitSize} />
          </ProBuildsChampion>
        ))}
      </ProBuildsChampionsList>
    </>
  );
};

export default memo(MatchUnitList);
