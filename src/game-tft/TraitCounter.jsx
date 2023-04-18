import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { colorFromCount } from "@/game-tft/get-color-from-count.mjs";
import styleToColor from "@/game-tft/get-style-to-color.mjs";
import TypeIcon from "@/game-tft/TypeIcon.jsx";

const TraitBox = styled("div")`
  display: flex;
  align-items: center;
  margin-right: ${({ $noNumber }) =>
    !$noNumber &&
    `
      var(--sp-4)
    `};
  ${({ vertical }) =>
    vertical &&
    `
      flex-direction: column;
      margin-right: 4px;
    `};

  > * {
    pointer-events: none;
  }

  &:last-of-type {
    margin-right: 0;
  }
`;
const TraitIcon = styled(TypeIcon)`
  ${({ vertical }) =>
    vertical &&
    `
      margin: 0 0 4px;
    `};
`;
const TraitCount = styled("div")`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ size }) =>
    size
      ? `
          height: ${size * 0.75}px;
          width: ${size * 0.75}px;
          font-size: ${size * 0.5}px;
        `
      : `
          height: 15px;
          width: 15px;
          font-size: var(--sp-2_5);
        `};
  font-weight: 700;
  color: var(--shade0);
  background: var(--shade5);
  border-radius: var(--br-sm);

  ${({ vertical }) =>
    vertical &&
    `
      margin-left: -2px;
    `};
`;

const TraitCounter = ({
  traitName,
  traitKey = traitName,
  set,
  iconSize,
  count,
  vertical,
  depthColors,
  noNumber,
  traitStyle,
  ...restProps
}) => {
  const { t } = useTranslation();
  const state = useSnapshot(readState);

  const staticDataClasses = state.tft.classes;
  const staticDataOrigins = state.tft.origins;
  const setClasses = staticDataClasses[set];
  const setOrigins = staticDataOrigins[set];

  const key = traitKey?.toLowerCase().replace(/[\s-]+/g, "");
  if (!key) return null;
  const trait = setClasses[key] || setOrigins[key];
  if (!trait) return null;

  return (
    <TraitBox
      data-tip={`${t(`tft:traits.${traitKey?.toLowerCase()}`, `${traitName}`)}`}
      {...restProps}
      vertical={vertical}
      $noNumber={noNumber}
    >
      {depthColors ? (
        <TraitIcon
          name={traitKey}
          size={iconSize}
          vertical={vertical}
          traitMetColor={
            traitStyle
              ? styleToColor(traitStyle)
              : colorFromCount(key, count, setClasses) ||
                colorFromCount(key, count, setOrigins)
          }
        />
      ) : (
        <TraitIcon
          set={set}
          name={traitKey}
          size={iconSize}
          vertical={vertical}
        />
      )}

      {!noNumber && (
        <TraitCount size={iconSize} vertical={vertical}>
          {count}
        </TraitCount>
      )}
    </TraitBox>
  );
};

export default TraitCounter;
