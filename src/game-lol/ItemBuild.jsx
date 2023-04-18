import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import LolColor from "@/game-lol/colors.mjs";
import { CaptionBold } from "@/game-lol/CommonComponents.jsx";
import { MYTHICS, POTIONS, STARTERS, TRINKETS } from "@/game-lol/constants.mjs";
import ItemImg from "@/game-lol/ItemImg.jsx";
import { getStaticData } from "@/game-lol/util.mjs";
import getOrdinal from "@/util/get-ordinal.mjs";

const BuildOrder = ({ size = 52, starting = [], items = [], patch }) => {
  const { t } = useTranslation();

  const itemsStaticData = getStaticData("items");
  let isStartingCombo = false;
  const buildComponents = [];

  if (!itemsStaticData) return null;

  const buildList = items ? items.map((item) => itemsStaticData[item]) : [];
  buildList.forEach((item) => {
    const itemComponents = itemsStaticData[item?.id]?.from || [];
    buildComponents.push(...itemComponents);
  });

  const itemBuildItems = items
    ? items.map((item) => itemsStaticData[item])
    : [];

  // The builds Mythic item (limited to 1)
  const buildMythic = buildList.find((item) => MYTHICS[item?.id]);
  const fromArray = itemsStaticData[buildMythic?.id]?.from;
  const mythicComponent = fromArray ? fromArray[0] : null;

  // Set starting item logic: Not a potion or trinket
  // For ARAM where boots + component is the starter,
  // show the component first... cont.
  let starterItem = starting.filter(
    (item) => !POTIONS[item] && !TRINKETS[item]
  );
  starterItem.forEach((item, i) => {
    if (STARTERS[item]) starterItem = item;
    if (i === 0 && Number(item) === 1001 && starterItem.length >= 2) {
      isStartingCombo = true;
      starterItem = starterItem[1];
    }
  });

  if (
    (Array.isArray(starterItem) && !starterItem.length) ||
    (!buildComponents.includes(starterItem.toString()) &&
      !STARTERS[starterItem])
  ) {
    // If there is no starting items, or the entire build
    // doesnt include the component (in the case of aram)
    // use the builds Mythic component
    starterItem = mythicComponent;
  } else if (Array.isArray(starterItem)) {
    starterItem = starterItem[0];
  }

  let potion = starting.find((item) => POTIONS[item]);
  let trinket = starting.find((item) => TRINKETS[item]);

  // Aram continued: then show the boots 2nd
  if (isStartingCombo && potion) {
    potion = 1001;
    trinket = null;
  }

  return (
    <Container cols={7}>
      {starterItem && (
        <Item key={starterItem}>
          <Img
            itemId={starterItem}
            patch={patch}
            size={size}
            borderRadius={5}
            className="lg"
          />
          <List cols={starting.length} sublist="true">
            {potion && (
              <Img
                itemId={potion}
                patch={patch}
                size={size}
                borderRadius={5}
                className="sm"
              />
            )}
            {trinket && (
              <Img
                itemId={trinket}
                patch={patch}
                size={size}
                borderRadius={5}
                className="sm"
              />
            )}
          </List>
          <CaptionBold className="tag">
            {t("lol:championData.starting", "Starting")}
          </CaptionBold>
        </Item>
      )}
      {itemBuildItems.map((item, i) => {
        if (!item) return null;
        const isMythic = MYTHICS[item.id];

        return (
          <Item key={`${item.id}_${i}`}>
            <Img
              itemId={item.id}
              patch={patch}
              size={size}
              borderRadius={5}
              className="lg"
            />
            {item.from ? (
              <List cols={item.from.length} sublist="true">
                {item.from.map((subItem, i) => (
                  <Img
                    key={`${subItem}_${i}`}
                    itemId={subItem}
                    patch={patch}
                    size={size}
                    borderRadius={5}
                    className="sm"
                  />
                ))}
              </List>
            ) : (
              <List cols={1} sublist="true">
                <Img size={size} borderRadius={5} className="sm" />
              </List>
            )}
            <div
              className={`tag item-${getOrdinal(i + 1)} ${
                isMythic && "mythic"
              }`}
            >
              <CaptionBold>{getOrdinal(i + 1)}</CaptionBold>
            </div>
          </Item>
        );
      })}
    </Container>
  );
};

export default BuildOrder;

const List = styled("div")`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  row-gap: var(--sp-3);
  justify-content: ${(props) =>
    props.sublist === "true" ? "center" : "initial"};
  margin: 0 -0.25rem;
`;

const Container = styled(List)`
  padding-top: 0.25rem;
`;

const Item = styled("div")`
  position: relative;
  background: var(--shade9);
  padding: 0.25rem;
  margin: 0 0.25rem;
  border-radius: var(--br);

  .tag {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -25%);
    background: var(--shade9);
    padding: 0 0.375rem;
    margin: 0;
    border-radius: var(--br-sm);
    color: var(--shade1);

    &.item-1st,
    &.item-2nd,
    &.item-3rd {
      color: var(--shade0);
    }

    &.mythic {
      color: ${LolColor.ranks.challenger.fill};

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: var(--br-sm);
        background: ${LolColor.ranks.challenger.fill};
        opacity: 0.1;
      }
    }
  }
`;

const Img = styled(ItemImg)`
  display: block;
  max-width: 100%;
  height: auto;
  background: var(--shade10);

  &.lg {
    width: var(--sp-13);
    width: ${(props) => props.size}px;
    height: var(--sp-13);
    height: ${(props) => props.size}px;
    max-width: var(--sp-13);
    max-width: ${(props) => props.size}px;
    max-height: var(--sp-13);
    max-height: ${(props) => props.size}px;
    margin: 0 auto 0.25rem;
  }
  &.sm {
    width: var(--sp-6);
    width: ${(props) => Math.round(props.size / 2)}px;
    height: var(--sp-6);
    height: ${(props) => Math.round(props.size / 2)}px;
    max-width: var(--sp-6);
    max-height: ${(props) => Math.round(props.size / 2)}px;
    margin: 0 0.175rem;
    opacity: 0.6;
    filter: saturate(0.8);

    &:hover {
      opacity: 1;
      filter: saturate(1);
    }
  }
`;
