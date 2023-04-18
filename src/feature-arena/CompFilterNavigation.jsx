import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { SafeIcon } from "@/feature-arena/CompGeneral.jsx";
import { FilterOptions } from "@/feature-arena/m-constants.mjs";
import { useGameSymbol } from "@/util/game-route.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const FilterNavigation = () => {
  const gameSymbol = useGameSymbol();
  const {
    parameters: [tab],
  } = useRoute();
  const { t } = useTranslation();

  return (
    <Container>
      {FilterOptions.map(({ symbol, href, icon, name }, index) => (
        <SubtopNavItem
          $selected={gameSymbol === symbol}
          key={index}
          href={`${href}/arena/${tab}`}
        >
          <SafeIcon icon={icon} component={IconImg} />
          <span className="type-form--button">{t(...name)}</span>
        </SubtopNavItem>
      ))}
    </Container>
  );
};

export default FilterNavigation;

const Container = styled("div")`
  display: flex;
  align-items: center;
`;

const SubtopNavItem = styled("a")`
  height: var(--sp-10);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--sp-2) var(--sp-4);
  cursor: pointer;
  margin-right: var(--sp-2);
  border-radius: var(--sp-2);

  span {
    color: ${({ $selected }) =>
      $selected ? "var(--shade0)" : "var(--shade3)"};
    margin-left: var(--sp-2_5);
    white-space: nowrap;
  }
  background: ${({ $selected }) =>
    $selected ? "var(--shade6)" : "transparent"};
  box-shadow: ${({ $selected }) =>
    $selected ? "inset 0px 1px 0px rgba(227, 229, 234, 0.05)" : "none"};
`;

const IconImg = styled("img")`
  width: var(--sp-5);
  height: var(--sp-5);
`;
