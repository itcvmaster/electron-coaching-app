import React from "react";
import { useTranslation } from "react-i18next";

import { Select } from "clutch";

import { APEX_SEASONS } from "@/game-apex/constants.mjs";

const SeasonFilter = ({ onChange, selected }) => {
  const { t } = useTranslation();
  const seasons = APEX_SEASONS.slice()
    .reverse()
    .map((s) => ({
      text:
        s.name === "all"
          ? t("common:lifetime", "Lifetime")
          : t("apex:season", "Season {{number}}", { number: s.name }),
      value: s.name === "all" ? "all" : s.id,
    }));
  return <Select onChange={onChange} selected={selected} options={seasons} />;
};

export default SeasonFilter;
