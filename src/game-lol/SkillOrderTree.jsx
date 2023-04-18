import React from "react";
import { styled } from "goober";

import { mobile } from "clutch";

import AbilityImg from "@/game-lol/AbilityImg.jsx";
import LolColor from "@/game-lol/colors.mjs";
import { Caption, CaptionBold } from "@/game-lol/CommonComponents.jsx";
import {
  APHELIOS_ID,
  CHAMPION_LEVELS,
  SKILL_HOTKEYS,
} from "@/game-lol/constants.mjs";

const Container = styled("div")`
  ${mobile} {
    position: absolute;
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--sp-4);
    width: var(--sp-4);
    font-size: var(--sp-3);
    border-radius: var(--br-sm);

    &:not(:last-child) {
      margin-right: 0.25rem;
    }
  }
  .box--empty {
    background: var(--shade9);
  }
  .box--filled {
    background: var(--shade10);
  }
  .box--level {
    color: var(--shade2);
  }

  .box-skill--1 {
    color: ${LolColor.abilities[1]};
  }
  .box-skill--2 {
    color: ${LolColor.abilities[2]};
  }
  .box-skill--3 {
    color: ${LolColor.abilities[3]};
  }
  .box-skill--4 {
    color: ${LolColor.abilities[4]};
  }
`;
const Row = styled("div")`
  display: flex;
  flex-wrap: nowrap;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;

const ids = [1, 2, 3, 4];

// const ApheliosIcons = {
//   1: HextechStatAttackDamage,
//   2: HextechStatAttackSpeed,
//   3: HextechStatArmor,
// };

// const ApheliosPassiveIcon = ({ id }) => {
//   const Icon = ApheliosIcons[id];
//   if (Icon) {
//     return <Icon />;
//   } else {
//     return null;
//   }
// };

const SkillOrderTree = ({ skills, champion }) => {
  if (!champion || !skills) return null;
  const isAphelios = champion.id === APHELIOS_ID;
  const abilties = isAphelios
    ? Array.from({ length: 3 })
    : champion.spells.slice(1);

  // Sanity check
  if (!champion?.id || !champion?.name || !champion?.spells) return null;

  return (
    <Container>
      <Row>
        <AbilityImg champion={champion} className="box" />
        {CHAMPION_LEVELS.map((level) => (
          <div key={level} className="box box--level">
            <Caption>{level}</Caption>
          </div>
        ))}
      </Row>
      {abilties.map((_, abilityIndex) => (
        <Row key={abilityIndex}>
          {isAphelios ? (
            <></>
          ) : (
            // <div className="box">
            //   <ApheliosPassiveIcon id={ids[abilityIndex]} />
            // </div>
            <AbilityImg
              champion={champion}
              abilityIndex={ids[abilityIndex] - 1}
              className="box"
            />
          )}
          {skills.map((level, levelIndex) => (
            <Level
              key={levelIndex}
              abilityIndex={abilityIndex}
              isTaken={level === ids[abilityIndex]}
              hotkey={isAphelios ? level : SKILL_HOTKEYS[ids[abilityIndex] - 1]}
            />
          ))}
        </Row>
      ))}
    </Container>
  );
};

const Level = ({ abilityIndex, isTaken, hotkey }) => {
  if (!isTaken) {
    return <div className="box box--empty" />;
  }

  return (
    <div className={`box box--filled box-skill--${abilityIndex + 1}`}>
      <CaptionBold>{hotkey}</CaptionBold>
    </div>
  );
};

export default SkillOrderTree;
