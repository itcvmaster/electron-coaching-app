// EXEMPT
import React from "react";

import { Tag } from "clutch";

import {
  GAME_SHORT_NAMES,
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_TFT,
} from "@/app/constants.mjs";
import {
  NameContainer,
  ProfileIcon,
  ProfileIconContainer,
  ProfileStatus,
  TagContainer,
} from "@/app/NavProfileItem.style.jsx";
import { getGameProfileImg } from "@/app/util.mjs";
import { SERVICES_TO_REGIONS } from "@/game-lol/constants.mjs";

const NavProfileItem = ({ profile, isCurrentLoggedIn }) => {
  const { symbol, derivedId, profileIconId } = profile;
  let region, name;

  // TODO: this type of logic needs to be banned! Really bad logic here!
  // If <game> else ...
  // WHY?? MAKING (WRONG) ASSUMPTIONS ABOUT EVERY OTHER GAME
  const isLoLorTFT = symbol === GAME_SYMBOL_LOL || symbol === GAME_SYMBOL_TFT;

  if (isLoLorTFT) {
    [region, name] = derivedId.split(":");
  } else {
    name = derivedId;
  }

  const profileLink = isLoLorTFT
    ? `/${GAME_SHORT_NAMES[symbol]}/profile/${region}/${name}`
    : `/${GAME_SHORT_NAMES[symbol]}/profile/${name}`;

  return (
    <a href={`${profileLink}`} className={`nav-item`}>
      <ProfileIconContainer>
        <ProfileIcon
          src={getGameProfileImg(symbol, profileIconId)}
          alt={name}
        />
        <ProfileStatus className={`${isCurrentLoggedIn ? "online" : ""}`} />
      </ProfileIconContainer>
      <NameContainer className={`nav-item--title`}>
        {name}
        {isLoLorTFT && (
          <TagContainer>
            <Tag
              text={SERVICES_TO_REGIONS[region]}
              size="xs"
              color="var(--shade2)"
            />
          </TagContainer>
        )}
      </NameContainer>
    </a>
  );
};

export default NavProfileItem;
