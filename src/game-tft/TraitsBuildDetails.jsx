import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { TraitsText } from "@/game-tft/CommonComponents.jsx";
import fixTraitNames from "@/game-tft/get-trait-names.mjs";
import { translateTraits } from "@/game-tft/use-traits.mjs";
import countBy from "@/util/count-by.mjs";

function TraitsBuildDetails({ traits, set, max = 3 }) {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const staticDataClasses = state.tft.classes;
  const staticDataOrigins = state.tft.origins;
  const setClasses = staticDataClasses[set] || {};
  const setOrigins = staticDataOrigins[set] || {};

  if (typeof traits[0]?.name === "string") {
    const arr = [];
    for (let i = 0; i < traits.length; i += 1) {
      if (i >= max) break;
      const trait = traits[i];
      if (!trait) continue;
      const traitName = fixTraitNames((trait.name.match(/_(.*?)$/) || [])[1]);
      if (typeof traitName !== "string") continue;
      const key = traitName.toLowerCase().replace(/[\s-]+/g, "");
      const selectedTrait = setClasses[key] || setOrigins[key];
      if (selectedTrait) {
        arr.push(<span>{translateTraits(t, selectedTrait.name)}</span>);
      }
    }
    if (arr.length)
      return (
        <TraitsText>
          {arr.map((i, idx) => {
            return (
              <React.Fragment key={idx}>
                {i}
                {idx !== arr.length - 1 ? " / " : ""}
              </React.Fragment>
            );
          })}
        </TraitsText>
      );
  }
  if (typeof traits[0] === "string") {
    const sortedTraits = Object.entries(countBy(traits))
      .sort((l, r) => r[1] - l[1])
      .map(([key, count], i) => {
        const lKey = fixTraitNames(key.toLowerCase());
        const trait = setClasses[lKey] || setOrigins[lKey];
        if (!trait) return null;
        if (count >= trait.bonuses[0].needed && i < max) {
          return trait;
        }
        return null;
      });
    if (sortedTraits.length)
      return <TraitsBuildDetails traits={sortedTraits} set={set} />;
  }
  return null;
}

export default memo(TraitsBuildDetails);
