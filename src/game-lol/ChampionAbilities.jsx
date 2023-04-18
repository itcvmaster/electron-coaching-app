import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import AbilityImg from "@/game-lol/AbilityImg.jsx";
import { SKILL_HOTKEYS } from "@/game-lol/constants.mjs";

const ChampionAbility = styled("div")`
  margin-right: var(--sp-1);
  position: relative;
`;

const AbilityKey = styled("div")`
  background: var(--shade10);
  border-radius: 4px 0 4px 0;
  bottom: 0;
  height: var(--sp-4);
  font-size: 0.875rem;
  line-height: 19px;
  position: absolute;
  right: 0;
  text-align: center;
  width: var(--sp-4);
  pointer-events: none;
`;

const ChampionAbilities = ({ champion }) => {
  const { t } = useTranslation();
  if (!champion) return null;
  return (
    <div className="flex gap-sp-1">
      <ChampionAbility>
        <AbilityImg champion={champion} data-place={"bottom"} />
        <AbilityKey>{t("lol:championAbility.keyP", "P")}</AbilityKey>
      </ChampionAbility>
      {(champion?.spells || []).slice(1, 5).map((_, abilityIndex) => (
        <ChampionAbility key={abilityIndex}>
          <AbilityImg
            champion={champion}
            abilityIndex={abilityIndex}
            data-place={"bottom"}
          />
          <AbilityKey>{SKILL_HOTKEYS[abilityIndex]}</AbilityKey>
        </ChampionAbility>
      ))}
    </div>
  );
};

export default ChampionAbilities;
