import React from "react";
import { styled } from "goober";

import { appURLs } from "@/app/constants.mjs";
import { Star } from "@/game-tft/CommonComponents.jsx";
import { starTiers } from "@/game-tft/constants.mjs";

function UnitTier({ tier }) {
  return new Array(tier)
    .fill(Star)
    .map((Star, idx) => (
      <Star
        key={idx}
        src={`${appURLs.CDN_PLAIN}/blitz/ui/images/icons/TFT-Star${starTiers[tier]}.svg`}
      />
    ));
}

export default function UnitAvatarTier({ tier, isAvatar }) {
  return new RegExp(/[2-4]/).test(tier) ? (
    isAvatar ? (
      <Position>
        <UnitTier tier={tier} />
      </Position>
    ) : (
      <UnitTier tier={tier} />
    )
  ) : null;
}

const Position = styled("div")`
  position: absolute;
  display: flex;
  bottom: -8px;
  width: 100%;
  justify-content: center;

  > svg {
    width: 14px;
    height: 14px;
    margin: 0 -1px;
  }
`;
