import React from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { Card } from "clutch";

import { View } from "@/game-lol/CommonComponents.jsx";
import ItemImg from "@/game-lol/ItemImg.jsx";
import RuneImg from "@/game-lol/RuneImg.jsx";
import SpellImg from "@/game-lol/SpellImg.jsx";
import { getStaticData } from "@/game-lol/util.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import { getLocaleString } from "@/util/i18n-helper.mjs";
import { useIsLoaded } from "@/util/router-hooks.mjs";

const CssRuneImg = css`
  border-radius: 5px;
  height: 36px;
  width: 36px;
  margin-right: var(--sp-2);
`;
const RowContainer = styled("div")`
  display: flex;
  align-items: center;
  border-bottom: var(--sp-px) solid var(--shade6);
  color: var(--shade1);
  font-size: 0.875rem;
  padding: 12px 0;

  &:last-of-type {
    border-bottom: none;
  }
`;

const WinRateText = styled("div")`
  color: #49b4ff;
  margin-right: 40px;
  width: 62px;
`;

const PickRateText = styled("div")`
  width: 62px;
`;

const EmptyContainer = styled("div")`
  font-size: var(--sp-4);
  text-align: center;
  line-height: var(--sp-6);
  color: var(--shade3);
`;

const LoadingContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: var(--sp-22);

  svg {
    width: 7rem;
    height: 7rem;
  }
`;
const ContentLoader = () => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
    </LoadingContainer>
  );
};

const rateOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
};

const EmptyContent = ({ type }) => {
  const { t } = useTranslation();
  let translation;
  switch (type) {
    case "RUNE":
      translation = t(
        "lol:notFound.runes",
        "No runes found for this champion."
      );
      break;
    case "SKILL":
      translation = t(
        "lol:notFound.spells",
        "No summoner spells found for this champion."
      );
      break;
    case "ITEM":
    default:
      translation = t(
        "lol:notFound.items",
        "No items found for this champion."
      );
      break;
  }
  return <EmptyContainer>{translation}</EmptyContainer>;
};
const RuneEntry = ({ item }) => {
  const perks = getStaticData("runes");
  const parsedId = Number.parseInt(item.id);
  const runeData = {};

  for (const xTree of perks) {
    for (const xSlot of xTree.slots) {
      for (const xRune of xSlot.runes) {
        if (xRune.id === parsedId) {
          runeData.rune = xRune;
          runeData.tree = xTree;
          break;
        }
      }
      if (runeData.rune) break;
    }
    if (runeData.rune) break;
  }
  if (!runeData.rune || !runeData.tree) return null;
  return (
    <RowContainer>
      <View style={{ alignItems: "center" }}>
        <RuneImg
          className={CssRuneImg}
          activeRunes={[parsedId]}
          treeKey={runeData.tree.key.toLowerCase()}
          currRune={{
            id: parsedId,
            name: runeData.rune.name,
          }}
        />
        <p className="type-body2">{runeData.rune.name}</p>
      </View>
      <View style={{ marginLeft: "auto", textAlign: "center" }}>
        <WinRateText>{getLocaleString(item.winrate, rateOptions)}%</WinRateText>
        <PickRateText>
          {getLocaleString(item.pickrate, rateOptions)}%
        </PickRateText>
      </View>
    </RowContainer>
  );
};

const ProBuildMostChosen = (props) => {
  const { cardHeaderTitle, items, itemsType } = props;

  const { t } = useTranslation();
  const loading = !useIsLoaded();

  let itemsList;
  if (items) {
    switch (itemsType) {
      case "ITEM":
        itemsList = items.map((key) => {
          if (key.id === 0 || !key.data) return null;
          return (
            <RowContainer key={key.id}>
              <View style={{ alignItems: "center" }}>
                <ItemImg borderRadius={5} size={2.25} itemId={key.id} />
                <div style={{ marginRight: "var(--sp-2)" }} />
                <p className="type-body2">{key?.data?.name}</p>
              </View>
              <View style={{ marginLeft: "auto", textAlign: "center" }}>
                <WinRateText>
                  {getLocaleString(key.winrate, rateOptions)}%
                </WinRateText>
                <PickRateText>
                  {getLocaleString(key.pickrate, rateOptions)}%
                </PickRateText>
              </View>
            </RowContainer>
          );
        });
        break;
      case "SKILL":
        itemsList =
          items &&
          items.map((key, index) => {
            return (
              <RowContainer key={index}>
                <View style={{ alignItems: "center" }}>
                  <SpellImg
                    style={{
                      borderRadius: 4,
                      height: 36,
                      width: 36,
                    }}
                    spellId={Number.parseInt(key.spells[0])}
                  />
                  <div style={{ marginRight: "var(--sp-2)" }} />
                  <SpellImg
                    style={{
                      borderRadius: 4,
                      height: 36,
                      width: 36,
                    }}
                    spellId={Number.parseInt(key.spells[1])}
                  />
                </View>
                <View style={{ marginLeft: "auto", textAlign: "center" }}>
                  <WinRateText>
                    {getLocaleString(key.winrate, rateOptions)}%
                  </WinRateText>
                  <PickRateText>
                    {getLocaleString(key.pickrate, rateOptions)}%
                  </PickRateText>
                </View>
              </RowContainer>
            );
          });
        break;
      case "RUNE":
        itemsList =
          items &&
          items.map((key, index) => {
            return <RuneEntry item={key} key={index} />;
          });
        break;
      default:
        break;
    }
  }

  return (
    <Card
      title={cardHeaderTitle}
      headerControls={
        <div className="flex gap-sp-6">
          <p className="type-body2">{t("lol:winRate", "Win Rate")}</p>
          <p className="type-body2">{t("lol:pickRate", "Pick Rate")}</p>
        </div>
      }
    >
      <div className="flex column">
        {loading ? (
          <ContentLoader />
        ) : (
          itemsList || <EmptyContent type={itemsType} />
        )}
      </div>
    </Card>
  );
};

export default ProBuildMostChosen;
