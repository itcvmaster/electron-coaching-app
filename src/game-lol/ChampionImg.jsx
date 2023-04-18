import React from "react";
import { css, styled } from "goober";

import Static from "@/game-lol/static.mjs";
import {
  getCurrentPatchForStaticData,
  getStaticChampionById,
  getStaticChampionByKey,
} from "@/game-lol/util.mjs";

const containerCSS = (props) => css`
  width: ${props.size}px;
  height: ${props.size}px;
  max-width: ${props.size}px;
  max-height: ${props.size}px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: ${props.round ? "50%" : "var(--br-sm)"};
  background: var(--shade9);
  transform: translate3d(0, 0, 0);
`;
const ChampImage = styled("img")`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1.15);
`;

const ChampionImg = ({
  championKey,
  championId,
  size = 32,
  className,
  style,
  round = true,
}) => {
  const patch = getCurrentPatchForStaticData();
  const champion = championId
    ? getStaticChampionById(championId, patch)
    : getStaticChampionByKey(championKey, patch);

  const classNames = !className
    ? containerCSS({ size, round })
    : `${containerCSS({ size, round })} ${className}`;

  return (
    <div className={classNames} style={style}>
      <ChampImage
        src={Static.getChampionImage(champion?.key)}
        alt={champion?.name}
        width={size}
        height={size}
        loading="lazy"
      />
    </div>
  );
};

export function SearchChampionImg({
  size,
  championName,
  championAvatar,
  round,
}) {
  return (
    <div className={containerCSS({ size, round })}>
      <ChampImage src={championAvatar} alt={championName} />
    </div>
  );
}
export default ChampionImg;
