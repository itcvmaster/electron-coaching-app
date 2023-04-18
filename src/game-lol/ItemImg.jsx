import React from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import LolColor from "@/game-lol/colors.mjs";
import { MYTHICS } from "@/game-lol/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { TooltipContent } from "@/game-lol/TooltipStyles.jsx";
import {
  getCurrentPatchForStaticData,
  getStaticData,
} from "@/game-lol/util.mjs";

const ItemFrame = styled("span")`
  display: block;
  position: relative;
  width: ${(props) => props.size}rem;
  height: ${(props) => props.size}rem;
  max-width: ${(props) => props.size}rem;
  max-height: ${(props) => props.size}rem;
  background: var(--shade10);
  background: ${(props) => (props.bgcolor ? props.bgColor : "var(--shade10);")};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 3)}px;
  margin: 0 var(--sp-0_5);

  .mythic-border {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid ${LolColor.ranks.challenger.fill};
    box-shadow: inset 0 0 0 ${(props) => (props.size > 30 ? "2px" : "1px")}
      var(--shade10);
    border-radius: ${(props) => props.borderradius}px;
  }
  .mythic-diamond {
    position: absolute;
    top: -2px;
    left: 50%;
    height: 6px;
    width: 6px;
    background: linear-gradient(195deg, #ffc52f 0%, #ffe792 50%, #d68000 100%);
    box-shadow: 0 0 0 2px var(--shade9);
    transform: translateX(-50%) rotate(45deg);
  }
  img {
    display: block;
    max-width: 100%;
    position: relative;
    border-radius: ${(props) => props.borderradius}px;
  }
`;

const ItemTooltip = ({ itemData, itemCost, image }) => (
  <TooltipContent>
    <div className="item-data">
      <div className="item-header">
        <div className="item-left">
          <img src={image} />
        </div>
        <div className="item-right">
          <div className="item-name">{itemData.name}</div>
          <div
            className="item-cost"
            dangerouslySetInnerHTML={{
              __html: itemCost,
            }}
          />
        </div>
      </div>

      <div
        className="item-description"
        dangerouslySetInnerHTML={{
          __html: itemData.description
            .replace(
              /<passive>Immolate:<\/passive>/g,
              "<immolate> Immolate :</immolate>"
            )
            .replace(/<br><br> {2}/, ""),
        }}
      />
    </div>
  </TooltipContent>
);

const ItemImage = ({
  style,
  itemId,
  borderRadius = 3,
  size = 1.75,
  patch,
  noTooltip = false,
  bgColor,
  ...restProps
}) => {
  const { t } = useTranslation();
  patch = patch || getCurrentPatchForStaticData();
  const itemsStaticData = getStaticData("items", patch);
  const isMythic = MYTHICS[itemId];
  const itemData =
    itemsStaticData[itemId] || itemsStaticData[isMythic?.originalId];

  if (!itemData) {
    return (
      <ItemFrame
        borderradius={borderRadius}
        size={size}
        bgcolor={bgColor}
        {...restProps}
      />
    );
  }

  const src = Static.getItemImage(itemData?.id);
  let tooltip = null;
  if (!noTooltip) {
    tooltip = ReactDOMServer.renderToStaticMarkup(
      <ItemTooltip
        itemData={itemData}
        itemCost={t(
          "lol:itemCost",
          "<span>Cost:</span> {{buyFor}} ({{sellFor}})",
          {
            buyFor: itemData.gold.total,
            sellFor: itemData.gold.sell,
          }
        )}
        image={src}
      />
    );
  }

  return (
    <ItemFrame
      style={style}
      borderradius={borderRadius}
      size={size}
      bgcolor={bgColor}
      data-tooltip={tooltip}
      {...restProps}
    >
      <img src={src} alt={itemData.name} loading="lazy" />
      {isMythic && (
        <>
          <div className="mythic-border" />
          <div className="mythic-diamond" />
        </>
      )}
    </ItemFrame>
  );
};

export default ItemImage;
