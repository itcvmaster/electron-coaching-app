import React from "react";
import { styled } from "goober";

import { mobile } from "clutch";

import LolColor from "@/game-lol/colors.mjs";
import { Body2FormActive } from "@/game-lol/CommonComponents.jsx";
import { SKILL_HOTKEYS } from "@/game-lol/constants.mjs";
import { determineSkillOrder } from "@/game-lol/util.mjs";
import ChevronRight from "@/inline-assets/chevron-right.svg";

const Title = styled("p")`
  margin-bottom: var(--sp-1);
`;
const SpellList = styled("div")`
  display: flex;
  align-items: center;

  svg {
    stroke: var(--shade3);
    margin: 0 0.25rem;
  }
`;
const SpellBox = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sp-8);
  width: var(--sp-8);
  background: var(--shade10);
  border-radius: var(--br-sm);

  &.box-skill--1 {
    color: ${LolColor.abilities[1]};
  }
  &.box-skill--2 {
    color: ${LolColor.abilities[2]};
  }
  &.box-skill--3 {
    color: ${LolColor.abilities[3]};
  }
  &.box-skill--4 {
    color: ${LolColor.abilities[4]};
  }

  ${mobile} {
    height: var(--sp-7);
    width: var(--sp-7);
  }
`;

const SkillOrder = ({ order, title }) => {
  const skills = determineSkillOrder(order);

  return (
    <div>
      {title && <Title className="type-body2">{title}</Title>}
      <SpellList>
        {skills.map((spell, i) => (
          <React.Fragment key={spell}>
            <SpellBox className={`box-skill--${spell}`}>
              <Body2FormActive spell={spell}>
                {SKILL_HOTKEYS[spell - 1]}
              </Body2FormActive>
            </SpellBox>
            {i !== skills.length - 1 && <ChevronRight />}
          </React.Fragment>
        ))}
      </SpellList>
    </div>
  );
};

export default SkillOrder;
