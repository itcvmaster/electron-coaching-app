import React, { useState } from "react";

import {
  DescriptionText,
  HeaderContainer,
  HeadText,
  ItemContainer,
  Section,
} from "@/shared/MatchHistoryHeader.style.jsx";

/*
(required):
@children: stats columns left of the icon list
@iconList: <array> of objects containing 
    {
      key,
      iconUrl,
      statColor,
      stat,
      iconTooltip, (optional)
    }
@iconCount: number of icons, used to fill in icons in case of low or lacking match history
@padding: padding around header

*/
const IconTile = ({ character, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <ItemContainer
      className={character?.key ? `character-${character.key}` : "empty"}
      onMouseOver={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
    >
      {showTooltip && tooltip ? tooltip : null}
      <div className="item-icon-wrapper">
        {character?.key && character?.iconUrl && (
          <img className="item-icon" src={character.iconUrl} />
        )}
      </div>
      <div
        className="type-caption--bold"
        style={{
          color: character?.statColor ?? "var(--shade3)",
        }}
      >
        {character?.stat || "-"}
      </div>
    </ItemContainer>
  );
};
export default function MatchHistoryHeader({
  statColumns,
  IconList,
  padding,
  iconCount = 3,
}) {
  return (
    <HeaderContainer padding={padding ? padding : "0"}>
      {statColumns.map((column, i) => {
        return (
          <Section key={`stat-column-${i}`} column={"true"}>
            <HeadText
              className="type-caption--bold"
              color={column?.statColor ? column?.statColor : "var(--shade0)"}
            >
              {column.stat}
            </HeadText>
            <DescriptionText className="type-caption">
              {column.description}
            </DescriptionText>
          </Section>
        );
      })}

      <Section flex={2}>
        {IconList.concat(Array(iconCount).fill())
          .slice(0, iconCount)
          .map((character, i) => (
            <IconTile
              key={character?.key || i}
              character={character}
              tooltip={character?.iconTooltip}
            />
          ))}
      </Section>
    </HeaderContainer>
  );
}
