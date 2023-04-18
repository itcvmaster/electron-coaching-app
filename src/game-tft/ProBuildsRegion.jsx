import React, { memo } from "react";
import { css } from "goober";

import { Caption } from "@/game-lol/CommonComponents.jsx";
import { SERVICES_TO_REGIONS } from "@/game-lol/constants.mjs";
import getRegionIcon from "@/game-lol/get-region-icon.mjs";

function Region({ region }) {
  const RegionIcon = getRegionIcon(SERVICES_TO_REGIONS[region]);
  return (
    <>
      <RegionIcon
        className={css`
          width: var(--sp-4);
          height: var(--sp-4);
        `}
      />
      <Caption
        className={css`
          color: var(--shade2);
          margin-left: var(--sp-1_5);
        `}
      >
        {SERVICES_TO_REGIONS[region]}
      </Caption>
    </>
  );
}

export default memo(Region);
