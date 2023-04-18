import React from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import ChampionImage from "@/game-tft/ChampionImage.jsx";
import { MatchChampion } from "@/game-tft/CommonComponents.jsx";
import { MATCHTILE_ITEM_BLACKLIST } from "@/game-tft/constants.mjs";
import StaticTFT from "@/game-tft/static.mjs";
import UnitAvatarTier from "@/game-tft/UnitAvatarTier.jsx";
import SelectIcon from "@/inline-assets/tft-select.svg";

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
  const skinSetting = state.tft_settings?.tftOverlaySettings?.isTFTSkinsEnabled;

  const champion = championsStaticData[unitName] ||
    Object.values(championsStaticData).find((i) => i.name === unitName) || {
      key: unitName,
      name: unitName,
    };
  const setItems = itemsStaticData[set];

  return (
    <MatchChampion style={{ width: unitSize }} data-tip={tooltip}>
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
      {items.length && setItems ? (
        <PieceItems>
          {items.map((item, i) => {
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
      ) : null}
    </MatchChampion>
  );
};

export default MatchUnit;

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
const SelectStyledIcon = styled(SelectIcon)`
  position: absolute;
  z-index: 2;
  right: -2px;
  top: -5px;
  width: 0.825rem;
`;
