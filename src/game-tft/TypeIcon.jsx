import React from "react";
import { css, styled } from "goober";

import TftColor from "@/game-tft/colors.mjs";
import normalizeKey from "@/game-tft/get-normalize-key.mjs";
import getTraitIcon from "@/game-tft/get-trait-icon.mjs";
import PrismaticHexIcon from "@/game-tft/PrismaticHexIcon.jsx";
import BronzeHexIcon from "@/inline-assets/tft-hex-bronze.svg";
import GoldHexIcon from "@/inline-assets/tft-hex-gold.svg";
import SilverHexIcon from "@/inline-assets/tft-hex-silver.svg";
import TypeHex from "@/inline-assets/type-hex.svg";

export default function TypeIconComponent({
  name = "",
  size,
  traitMetColor,
  ...rest
}) {
  const TraitIcon = TraitIconStyled(getTraitIcon(name));
  const hexagons = {
    prismatic: PrismaticHexIcon,
    gold: GoldHexIcon,
    silver: SilverHexIcon,
    bronze: BronzeHexIcon,
  };
  const HexIcon = hexagons[traitMetColor] || BronzeHexIcon;
  return (
    <TypeIconFrame name={name} size={size} {...rest}>
      {traitMetColor ? (
        <>
          <TraitIcon type="darker" />
          <HexIcon />
        </>
      ) : (
        <>
          <TraitIcon type={/variable/i.test(name) ? "dark" : "default"} />
          <TypeHex
            className={css`
              fill: ${TftColor.traits[normalizeKey(name)]};
            `}
          />
        </>
      )}
    </TypeIconFrame>
  );
}

const TypeIconFrame = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ size }) => (size ? `${size}px` : `28px`)};
  width: ${({ size }) => (size ? `${size}px` : `28px`)};

  svg,
  img {
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  svg:first-child,
  img:first-child {
    height: 80%;
    width: 80%;
  }

  svg:last-child,
  img:last-child {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

const TraitIconStyled = (Icon) => styled(Icon)`
  position: relative;
  display: block;
  fill: ${({ type }) =>
    ({ darker: "var(--shade10)", dark: "var(--shade9)" }[type] ||
    "var(--white)")};
  z-index: 1;
`;
