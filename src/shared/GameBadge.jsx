import React from "react";
import { useTranslation } from "react-i18next";

import { GAME_COLORS, GAME_ICON_SHAPES } from "@/app/constants.mjs";
import { translateGameNames } from "@/app/translate-game-names.mjs";
import { Badge, BadgeTitle } from "@/shared/GameBadge.style.jsx";

const GameBadge = ({ game, withName }) => {
  const { t } = useTranslation();
  const Icon = GAME_ICON_SHAPES[game];

  if (!Icon) return null;

  if (withName) {
    return (
      <div className="flex align-center gap-sp-2">
        <Badge style={{ background: GAME_COLORS[game] }}>
          <Icon />
        </Badge>
        <BadgeTitle className="type-body2-form--active">
          {translateGameNames(t, game)}
        </BadgeTitle>
      </div>
    );
  }

  return (
    <Badge style={{ background: GAME_COLORS[game] }}>
      <Icon />
    </Badge>
  );
};

export default GameBadge;
