import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Caption } from "@/game-lol/CommonComponents.jsx";
import Items, { ItemOrder } from "@/game-lol/Items.jsx";
import { getWinRateColor } from "@/game-lol/util.mjs";
import { calcRate } from "@/util/helpers.mjs";
import { getLocaleString } from "@/util/i18n-helper.mjs";

const percentOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "percent",
};

const Header = styled("div")`
  display: flex;
  align-items: baseline;
  margin-bottom: var(--sp-1);

  .subtitle {
    color: var(--shade2);
    padding-left: var(--sp-4);
  }
`;

const ColorText = styled("span")`
  color: ${(props) => props.color};
`;

const ItemContainer = ({
  itemTitle,
  items,
  wins,
  games,
  itemStyle,
  itemContainerStyle,
  renderSeparator,
  hideWinRate,
  size,
  patch,
  hideTitle,
  itemOrder,
}) => {
  const { t } = useTranslation();
  const winRate = calcRate(wins, games);
  let rate;

  if (wins && games > 0) {
    rate = (
      <span>
        <ColorText color={getWinRateColor(winRate * 100)}>
          {getLocaleString(winRate, percentOptions)}%{" "}
        </ColorText>
        <span>{t("lol:winRate", "Win Rate")} </span>
        <span>({t("lol:countGame", "{{count}} Game", { count: games })})</span>
      </span>
    );
  }

  return (
    <div>
      {!hideTitle && (
        <Header>
          <p className="type-body2">{itemTitle}</p>
          <Caption className="subtitle">{!hideWinRate ? rate : null}</Caption>
        </Header>
      )}
      {itemOrder ? (
        <ItemOrder
          items={items}
          itemStyle={itemStyle}
          renderSeparator={renderSeparator}
          size={size}
          patch={patch}
        />
      ) : (
        <Items
          items={items}
          itemStyle={itemStyle}
          itemContainerStyle={itemContainerStyle}
          renderSeparator={renderSeparator}
          size={size}
          hideEmpty
          patch={patch}
        />
      )}
    </div>
  );
};

export default ItemContainer;
