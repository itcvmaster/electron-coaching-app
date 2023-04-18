import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import ChampionAbilities from "@/game-lol/ChampionAbilities.jsx";

const AbilitiesContainer = styled("div")`
  display: block;
  margin: var(--sp-4) 0em;
`;

const AbilitiesTitle = styled("div")`
  font-size: var(--sp-3);
  margin-bottom: 2px;
`;

const Abilities = ({ champion }) => {
  const { t } = useTranslation();

  if (!champion?.name) return;

  return (
    <AbilitiesContainer>
      <AbilitiesTitle>
        {t("lol:championsAbilties", `{{champion}}'s Abilities`, {
          champion: champion && champion.name,
        })}
      </AbilitiesTitle>
      <ChampionAbilities champion={champion} />
    </AbilitiesContainer>
  );
};

export default memo(Abilities);
