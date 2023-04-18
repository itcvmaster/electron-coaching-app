import React from "react";
import { styled } from "goober";

import SpellImg from "@/game-lol/SpellImg.jsx";

const SummonerSpells = ({
  size = 2,
  gap = 0.5,
  spells = [],
  patch = 11.3,
  noTooltip = false,
}) => {
  return (
    <Container gap={gap}>
      {spells.map((spell) => (
        <SpellImg
          key={spell}
          spellId={spell}
          patch={patch}
          size={size}
          noTooltip={noTooltip}
          block
        />
      ))}
    </Container>
  );
};

export default SummonerSpells;

const Container = styled("div")`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap}rem;
`;
