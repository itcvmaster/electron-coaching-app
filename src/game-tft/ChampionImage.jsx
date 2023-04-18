import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import getTraitIcon from "@/game-tft/get-trait-icon.mjs";
import StaticTFT from "@/game-tft/static.mjs";
import HextechMatchGoldIcon from "@/inline-assets/hextech-match-gold.svg";

const ChampionImage = ({
  champKey,
  cost,
  size = 52,
  colorlessBorder,
  children,
  costPill,
  set,
  element,
  skinSetting = true,
  ...restProps
}) => {
  const { t } = useTranslation();

  if (!champKey) return null;

  const rarity = cost;
  const ElementTraitIcon = element && getTraitIcon(element);

  const champImg = skinSetting
    ? StaticTFT.getChampionImage(champKey, set)
    : StaticTFT.getChampionImage(champKey);

  return (
    <ChampImageFrameOuter {...restProps}>
      <ChampImageFrame size={size}>
        {champKey && (
          <ChampImage
            data-champkey={champKey}
            src={champImg}
            size={size}
            data-unit={champKey}
            loading="lazy"
            $brighten={skinSetting}
            alt={`${champKey} - Teamfight Tactics`}
          />
        )}
        {children}
      </ChampImageFrame>
      {rarity ? (
        <TierRing
          $colorlessBorder={colorlessBorder}
          color={StaticTFT.getRarityFromTier(rarity)}
          rarity={rarity}
          size={size}
        />
      ) : null}
      {element && set === "set2" && (
        <ElementIcon
          data-tip={t(`tft:traits.${element.toLowerCase()}`, `${element}`)}
          data-delay-show={500}
        >
          <ElementTraitIcon />
        </ElementIcon>
      )}
      {costPill && (
        <ChampCost color={StaticTFT.getRarityFromTier(rarity)}>
          <HextechMatchGoldIcon />
          {cost}
        </ChampCost>
      )}
    </ChampImageFrameOuter>
  );
};

const MemoChampionImage = memo(ChampionImage);
export default MemoChampionImage;

const ChampImageFrameOuter = styled("div")`
  position: relative;
`;
const ChampImageFrame = styled("div")`
  box-sizing: border-box;
  position: relative;
  ${({ size }) =>
    size
      ? `
    height: ${size}px;
    width: ${size}px;`
      : `
    height: var(--sp-13);
    width: 52px;
  `};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--br-sm);
  border: 2px solid var(--shade9);
  background: var(--shade9);
  z-index: 1;
`;
const ChampImage = styled("img")`
  display: block;
  background: var(--shade7);
  ${({ size }) =>
    size
      ? `
    height: ${size + size * 0.1}px;
    width: ${size + size * 0.1}px;
    min-height: ${size + size * 0.1}px;
    min-width: ${size + size * 0.1}px;`
      : `
    width: 60px;
    height: 60px;
    min-height: 60px;
    min-width: 60px;
  `};
  ${({ $brighten }) =>
    $brighten &&
    `
      filter: contrast(1.1) brightness(1.1);
    `}
  &:hover {
    filter: brightness(1.3);
  }
`;
const TierRing = styled("div")`
  position: absolute;
  top: -1px;
  left: -1px;
  ${({ size }) =>
    size
      ? `
    height: ${size + 2}px;
    width: ${size + 2}px;
  `
      : `
    width: 54px;
    height: 54px;
  `};
  ${({ $colorlessBorder }) => $colorlessBorder && `background: var(--shade5);`};
  border-radius: 4px;
  z-index: 0;

  ${({ rarity, color }) => rarity && `background: ${color};`}

  &.chosen {
    background: linear-gradient(
      132.18deg,
      #fcfdff 0%,
      rgba(234, 242, 255, 0.865225) 20.13%,
      rgba(169, 185, 212, 0.53) 60.43%,
      rgba(187, 201, 224, 0.47) 95.54%
    );
    filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.4));
  }
`;
const ChampCost = styled("span")`
  box-sizing: border-box;
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: 1;
  background: ${({ color }) => `${color}` || "var(--shade9)"};
  display: flex;
  height: var(--sp-4);
  width: var(--sp-6);
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--shade0);
  font-size: var(--sp-3);
  line-height: 1.5;
  border-radius: var(--br) 0 5px 0;
  text-shadow: 0 var(--sp-px) 0px rgba(0, 0, 0, 0.6);

  svg {
    margin: -2px 2px 0 0;
    height: 8px;
    width: 8px;
    filter: drop-shadow(0 var(--sp-px) rgba(0, 0, 0, 0.3));
    color: var(--shade0);
  }
`;

const ElementIcon = styled("div")`
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--shade7);
  padding: 2px;
  border-radius: 50%;
  z-index: 1;

  & > * {
    pointer-events: none;
  }
`;
