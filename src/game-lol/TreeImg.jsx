import React, { useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import { styled } from "goober";

import LolColor from "@/game-lol/colors.mjs";
import { TooltipContent } from "@/game-lol/TooltipStyles.jsx";
import { getRuneImage } from "@/game-lol/util.mjs";

const TreeImage = styled("picture")`
  display: block;
  width: ${(props) => (props.size ? `${props.size}rem` : "var(--sp-8)")};
  height: ${(props) => (props.size ? `${props.size}rem` : "var(--sp-8)")};
  border-radius: 50%;
  cursor: ${(props) => props.clickable && "pointer"};

  > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  ${({ tree, noborder }) =>
    tree &&
    !noborder &&
    `
      border: var(--sp-px) solid ${LolColor.runes[tree]};
      padding: 4px;
    `};

  ${({ isactive }) =>
    isactive !== "true" &&
    `
      opacity: 0.3;
      filter: saturate(0);
      border-color: transparent;
      transition: var(--transition);

      &:hover {
        opacity: 0.9;
        filter: saturate(1) drop-shadow(0 9px 10px rgba(0, 0, 0, 0.5));
        border-color: ${(props) => props?.tree && LolColor.runes[props?.tree]};
        transform: translateY(-3px);
      }
    `}
`;

const TreeTooltip = ({ name }) => (
  <TooltipContent>
    <div className="rune-data">
      <div className="rune-treedata">
        <div className="rune-treename">{name}</div>
      </div>
    </div>
  </TooltipContent>
);

const TreeImg = ({
  tree,
  isActive,
  runeTree,
  onClick,
  // selectedShards,
  // perks,
  size = 1.5,
  noBorder,
  noTooltip,
  ...restProps
}) => {
  const clickable = !!onClick;

  const handleTreeImgClick = useCallback(() => {
    if (onClick) onClick();
    if (runeTree) {
      // e.stopPropagation();
      // e.preventDefault();
      // dispatch(
      //   updateModal(
      //     <ChampionRuneModalPage
      //       selectedShards={selectedShards}
      //       runeTree={runeTree}
      //       perks={perks}
      //     />
      //   )
      // );
    }
  }, [onClick, runeTree]);

  if (!tree || !tree.key) return null;

  const key = tree.key.toLowerCase();

  const src_png = getRuneImage("png", key);
  const src_webp = getRuneImage("webp", key);

  let treeTooltipHtml = null;
  if (!noTooltip) {
    treeTooltipHtml = ReactDOMServer.renderToStaticMarkup(
      <TreeTooltip name={tree.name} />
    );
  }

  return (
    <TreeImage
      onClick={handleTreeImgClick}
      clickable={clickable.toString()}
      runes={runeTree}
      data-tooltip={treeTooltipHtml}
      isactive={isActive.toString()}
      tree={key}
      size={size}
      noborder={noBorder && noBorder.toString()}
      {...restProps}
    >
      <source srcSet={src_webp} type="image/webp" />
      <source srcSet={src_png} type="image/png" />
      <img src={src_png} alt={tree.name} />
    </TreeImage>
  );
};

export default TreeImg;
