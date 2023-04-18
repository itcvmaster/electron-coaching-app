import React from "react";
import ReactDOMServer from "react-dom/server";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import getItemComponents from "@/game-tft/get-item-components.mjs";
import StaticTFT from "@/game-tft/static.mjs";

const ItemTooltip = ({ children, item, style, className }) => {
  const state = useSnapshot(readState);
  const localizedItems = state.tft.localizedItems.data || {};
  const itemStatic = state.tft.items.data || {};
  const set = state.tft.selectedSet;

  if (!item || !set || !itemStatic || !localizedItems) return children;

  const name = localizedItems[item]?.name || itemStatic?.[set]?.[item]?.name;
  const description =
    localizedItems[item]?.description || itemStatic?.[set]?.[item]?.bonus;
  const components = getItemComponents(item, itemStatic, set);

  const htmlTooltip = ReactDOMServer.renderToStaticMarkup(
    <TooltipContainer>
      <div
        className={css`
          opacity: 1;
        `}
      >
        <img src={StaticTFT.getItemImage(item, set)} alt={name} />
        <div>
          <div>
            <span>{name}</span>
          </div>
          <div>
            {components && components[0] && components[1] && (
              <>
                <img
                  src={StaticTFT.getItemImage(components[0])}
                  alt={components[0]}
                />
                {/* eslint-disable-next-line */}
                <span>+</span>
                <img
                  src={StaticTFT.getItemImage(components[1])}
                  alt={components[1]}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div>{description}</div>
    </TooltipContainer>
  );

  return (
    <div
      data-tip={htmlTooltip}
      data-place={"bottom"}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

export default ItemTooltip;

const TooltipContainer = styled("div")`
  width: 210px;
  height: fit-content;
  font-size: var(--sp-3) !important;
  color: var(--shade1);
  background: var(--shade10);
  border-radius: var(--br);
  position: absolute;
  left: -76px;
  top: -2px;
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25));
  padding: var(--sp-4);

  .item-tooltip {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--white);
    font-size: var(--sp-3);
    font-weight: 700;
    opacity: 0;
    border-radius: var(--br);
  }

  .complete-item {
    width: 48px;
    height: 48px;
  }

  .item-tooltip .right-section {
    margin-left: var(--sp-3);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .item-tooltip img {
    border: 2px solid var(--shade7);
    border-radius: var(--br-sm);
  }

  .components {
    display: flex;
    font-weight: lighter;
    align-items: center;
    margin-top: var(--sp-1_5);
  }

  .component {
    width: var(--sp-6);
    height: var(--sp-6);
  }
  .components span {
    margin-left: var(--sp-2);
    margin-right: var(--sp-2);
    font-size: var(--sp-4);
  }

  hr {
    border: none;
    border-bottom: 1px solid var(--shade6);
    margin-top: var(--sp-4);
    margin-bottom: var(--sp-2);
  }

  .item-tooltip-description {
    font-size: var(--sp-3);
    line-height: var(--sp-4_5);
    color: var(--shade1);
  }
`;
