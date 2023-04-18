import React from "react";
import { styled } from "goober";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import LolColor from "@/game-lol/colors.mjs";
import { getTierIcon } from "@/game-lol/get-tier-icon.mjs";
import Close from "@/inline-assets/close.svg";

const ChampionImageContainer = styled("div")`
  background: var(--shade10);
  border-radius: 50%;
  position: relative;
  border: 2px solid ${(props) => props.bordercolor};

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px var(--shade10);
  }

  .champion-remove-icon {
    height: var(--sp-8);
    width: var(--sp-8);
    color: var(--shade0);
    left: var(--sp-6);
    position: absolute;
    transition: var(--transition);
    transform: scale(0);
    top: var(--sp-6);
  }

  &:hover {
    cursor: pointer;

    .champion-img {
      opacity: 0.4;
    }

    .champion-remove-icon {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ChampionTier = styled("div")`
  position: absolute;
  bottom: calc(var(--sp-4) * -1);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  svg {
    display: block;
    width: 32px;
    height: 32px;
  }
`;

const ChampionHeaderImage = ({
  champion,
  tier,
  isMatchupChampion,
  isDrawer,
}) => {
  const TierIcon = getTierIcon(tier?.tier_rank);
  const tierColor = LolColor.tier[tier?.tier_rank];

  return (
    <ChampionImageContainer bordercolor={tierColor}>
      <ChampionImg
        size={isDrawer ? 60 : 80}
        championId={champion?.id}
        disabled={isMatchupChampion}
      />
      {tier && !isMatchupChampion && (
        <ChampionTier>
          <TierIcon />
        </ChampionTier>
      )}
      {isMatchupChampion ? (
        <>
          {tier && (
            <ChampionTier>
              <TierIcon />
            </ChampionTier>
          )}
          <Close className="champion-remove-icon" />
        </>
      ) : null}
    </ChampionImageContainer>
  );
};

export default ChampionHeaderImage;
