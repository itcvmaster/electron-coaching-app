import React from "react";
import { useTranslation } from "react-i18next";

import { Select } from "clutch";

import { GAME_MODES } from "@/game-apex/constants.mjs";

const ModeFilter = ({ onChange, selected }) => {
  const { t } = useTranslation();
  return (
    <Select
      onChange={onChange}
      selected={selected}
      options={Object.keys(GAME_MODES)
        .filter((m) => !GAME_MODES[m].hidden)
        .map((mode) => {
          const modeObj = GAME_MODES[mode];
          return { value: mode, text: t(modeObj.t, modeObj.label) };
        })}
    />
  );
};

export default ModeFilter;
