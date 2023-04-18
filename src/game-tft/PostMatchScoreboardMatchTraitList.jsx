import React, { memo } from "react";

import fixTraitNames from "@/game-tft/get-trait-names.mjs";
import getTraits from "@/game-tft/get-traits.mjs";
import TraitCounter from "@/game-tft/TraitCounter.jsx";

const MatchTraitList = ({ traits, set, max = 10, size = 20 }) => {
  const sortedTraits = getTraits(traits, max);

  return (
    <>
      {sortedTraits.map((trait, idx) => {
        const traitName = fixTraitNames(trait.name, set);
        return (
          <TraitCounter
            key={idx}
            set={set}
            traitName={traitName}
            iconSize={size}
            count={trait.num_units}
            traitStyle={trait.style}
            depthColors
            noNumber
          />
        );
      })}
    </>
  );
};

export default memo(MatchTraitList);
