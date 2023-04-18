import React, { memo } from "react";
import { css, styled } from "goober";

import { FLEX_SIZES } from "@/game-tft/constants.mjs";
import PostMatchScoreboardMatchTraitList from "@/game-tft/PostMatchScoreboardMatchTraitList.jsx";
import TraitsBuildDetails from "@/game-tft/TraitsBuildDetails.jsx";

function TraitsComponent({
  traits,
  set,
  isOutOfDate,
  onlyTraitsList,
  onlyBuildDetails,
}) {
  if (isOutOfDate) return null;
  return (
    <Traits>
      {onlyBuildDetails || (
        <div
          className={css`
            display: flex;
          `}
        >
          <PostMatchScoreboardMatchTraitList
            traits={traits}
            set={set}
            max={4}
            size={24}
          />
        </div>
      )}
      {onlyTraitsList || <TraitsBuildDetails traits={traits} set={set} />}
    </Traits>
  );
}

export default memo(TraitsComponent);

const Traits = styled("div")`
  display: flex;
  align-items: center;
  flex: ${FLEX_SIZES.TRAITS};
  flex-direction: column;
  justify-content: center;
`;
