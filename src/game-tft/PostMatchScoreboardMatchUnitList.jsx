// This is used to represent a group of units when presented from a match (mathtile, postmatch, etc.)
import React, { memo } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { mobile } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { Body1, Caption } from "@/game-lol/CommonComponents.jsx";
import ChampionImage from "@/game-tft/ChampionImage.jsx";
import { Star } from "@/game-tft/CommonComponents.jsx";
import { MATCHTILE_ITEM_BLACKLIST } from "@/game-tft/constants.mjs";
import StaticTFT from "@/game-tft/static.mjs";
import UnitAvatarTier from "@/game-tft/UnitAvatarTier.jsx";
import SelectIcon from "@/inline-assets/tft-select.svg";
import orderBy from "@/util/order-array-by.mjs";

const MatchUnitList = ({ units, unitSize, set, ...props }) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);

  const champions = state.tft.champions;
  const items = state.tft.items;
  const itemsBySet = items[set] || {};

  const unitsLength = units.length;
  const neededEmptyPieces = unitsLength < 9 ? 9 - unitsLength : 0;

  return (
    <ChampionsList {...props}>
      {orderBy(units, "rarity", "asc").map((unit, i) => {
        const { character_id, name, tier, items, chosen } = unit;
        const unitString = character_id
          ? character_id.replace(/(TFT[0-9]_)/i, "")
          : name;
        const unitName = StaticTFT.getChampName(unitString);
        const unitElement = StaticTFT.getChampElement(unitString);

        const champion = champions[unitName] || {
          key: unitName,
          name: unitName,
        };

        const chosenName = chosen?.split("_").pop();

        const pieceTooltip = ReactDOMServer.renderToStaticMarkup(
          <>
            <ToolTipName>
              <Body1>{champion.name}</Body1>
              <UnitAvatarTier tier={tier} />
            </ToolTipName>

            {items.map((item, i) => {
              const unitItem = Object.values(itemsBySet).find(
                (setItem) => setItem.id === item
              );
              if (unitItem) {
                return (
                  <ToolTipItem key={`${item}_${i}`}>
                    <img
                      src={StaticTFT.getItemImage(unitItem.key, set)}
                      alt={unitItem.key}
                    />
                    <Caption>{unitItem.name}</Caption>
                  </ToolTipItem>
                );
              }
              return (
                <ToolTipItem key={`unknownItem_${i}`}>
                  <img src="" alt={`unknownItem_${i}`} />
                  <Caption>
                    {t("tft:common.unknownItem", "Unknown Item")}
                  </Caption>
                </ToolTipItem>
              );
            })}
          </>
        );
        return (
          <MatchUnit
            key={`${unitName}_${i}`}
            unitName={unitName}
            unitSize={unitSize}
            items={items}
            unitElement={unitElement}
            tooltip={pieceTooltip}
            tier={tier}
            set={set}
            chosen={chosenName}
          />
        );
      })}
      {[...Array(neededEmptyPieces)].map((a, key) => (
        <Champion key={key}>
          <ChampionEmpty size={unitSize} />
        </Champion>
      ))}
    </ChampionsList>
  );
};

export default memo(MatchUnitList);

const MatchUnit = ({
  unitSize = 32,
  tooltip,
  tier,
  set,
  unitName = "",
  items = [],
  chosen,
}) => {
  const state = useSnapshot(readState);
  const championsStaticData = state.tft.champions;
  const itemsStaticData = state.tft.items;
  const skinSetting =
    state?.tft_settings?.tftOverlaySettings?.isTFTSkinsEnabled;

  const champion = championsStaticData[unitName] ||
    Object.values(championsStaticData).find((i) => i.name === unitName) || {
      key: unitName,
      name: unitName,
    };
  const setItems = itemsStaticData[set];

  return (
    <Champion style={{ width: unitSize }} data-tip={tooltip}>
      <ChampionLevelApi>
        <UnitAvatarTier tier={tier} />
      </ChampionLevelApi>
      {chosen && <SelectStyledIcon />}
      <ChampionImage
        colorlessBorder
        champKey={champion.key}
        cost={champion[set]?.cost}
        size={unitSize}
        set={set}
        skinSetting={skinSetting}
        chosen={chosen}
      />
      {setItems && (
        <PieceItems>
          {items.map((item, i) => {
            // Don't render dummy items
            if (MATCHTILE_ITEM_BLACKLIST.includes(item)) return null;

            const unitItem = Object.values(setItems).find(
              (setItem) => setItem.id === item
            );

            if (unitItem) {
              return (
                <img
                  src={StaticTFT.getItemImage(unitItem.key, set)}
                  key={`${item}_${i}`}
                  alt={unitItem.key}
                />
              );
            }
            return <img src="" key={`${item}_${i}`} alt={item} />;
          })}
        </PieceItems>
      )}
    </Champion>
  );
};

const ChampionsList = styled("div")`
  display: flex;
  justify-content: flex-end;

  ${mobile} {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;
const Champion = styled("div")`
  position: relative;
  margin-right: var(--sp-1_5);
  margin-top: var(--sp-3);

  & > * {
    pointer-events: none;
  }

  &:last-of-type {
    margin-right: 0;
  }

  .chosenIcon {
    position: absolute;
    z-index: 2;
    right: -2px;
    top: -5px;
    width: 0.825rem;
  }
`;

const ChampionEmpty = styled("div")`
  box-sizing: border-box;
  border-radius: var(--br-sm);
  border: var(--sp-px) solid var(--shade7);
  background: var(--shade8);
  box-shadow: inset 0 0 0 var(--sp-px) var(--shade9);
  ${({ size }) =>
    size &&
    `height: ${size}px;
    width: ${size}px;
  `};
`;

const ChampionLevelApi = styled("div")`
  position: absolute;
  top: calc(var(--sp-4) * -1);
  left: 50%;
  display: flex;
  justify-content: center;
  transform: translateX(-50%);
  z-index: 2;
`;

const PieceItems = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: var(--sp-0_5);

  img {
    height: auto;
    align-self: center;
    &:first-of-type {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-of-type {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    width: 12px;
    border: 1px solid var(--shade5);
  }
`;
const ToolTipName = styled("div")`
  display: flex;
  align-items: center;

  ${Body1} {
    margin-right: var(--sp-1);
  }

  ${Star} {
    height: var(--sp-4);
    width: var(--sp-4);
  }
`;
const ToolTipItem = styled("div")`
  display: flex;
  align-items: center;

  ${Caption} {
    color: var(--shade2);
  }

  img {
    width: var(--sp-6);
    height: auto;
    margin-right: var(--sp-2);
    margin-bottom: var(--sp-1);
    border-radius: var(--br);
  }
`;

const SelectStyledIcon = styled(SelectIcon)`
  position: absolute;
  z-index: 2;
  right: -2px;
  top: -5px;
  width: 0.825rem;
`;
