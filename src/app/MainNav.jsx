// EXEMPT
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import {
  GAME_SYMBOL_LOL,
  GAME_SYMBOL_TFT,
  GAME_SYMBOL_VAL,
} from "@/app/constants.mjs";
import DashboardIcon from "@/inline-assets/nav-dashboard.svg";
import GameGuideIcon from "@/inline-assets/nav-game-guide.svg";
// import CoachingIcon from "@/inline-assets/nav-coaching.svg";
// import OverlaysIcon from "@/inline-assets/nav-overlays.svg";
import ProBuildsIcon from "@/inline-assets/pro-builds-icon.svg";
import Statistics from "@/inline-assets/statistics.svg";
import routes from "@/routes/routes.mjs";
import { useGameSymbol } from "@/util/game-route.mjs";
import { useTransientRoute } from "@/util/router-hooks.mjs";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-3);
`;

export const NAV_MENU_MAP = {
  noSpecificGame: [
    {
      href: "/dashboard",
      icon: DashboardIcon,
      label: ["common:navigation.dashboard", "Dashboard"],
    },
    // {
    //   href: "/coaching",
    //   icon: CoachingIcon,
    //   label: t("common:navigation.coaching", "Coaching"),
    // },
    // {
    //   href: "/game-guide",
    //   icon: GameGuideIcon,
    //   label: t("common:navigation.gameGuide", "Game Guide"),
    // },
    // {
    //   href: "/overlays",
    //   icon: OverlaysIcon,
    //   label: t("common:navigation.overlays", "Overlays"),
    // },
  ],
  [GAME_SYMBOL_LOL]: [
    {
      href: "/lol/champions/overview",
      icon: Statistics,
      label: ["lol:champion_plural", "Champions"],
    },
    {
      href: "/lol/probuilds/history",
      icon: ProBuildsIcon,
      label: ["lol:probuilds", "Pro Builds"],
    },
    {
      href: "/lol/tierlist",
      icon: GameGuideIcon,
      label: ["common:navigation.tierList", "Tier List"],
    },
  ],
  [GAME_SYMBOL_VAL]: [],
  [GAME_SYMBOL_TFT]: [
    {
      href: "/tft/probuilds",
      icon: ProBuildsIcon,
      label: ["common:navigation.proBuilds", "Pro Builds"],
    },
  ],
};

// Find matching routes for each menu item.
export function refreshMenu() {
  for (const key of [
    "noSpecificGame",
    ...Object.getOwnPropertySymbols(NAV_MENU_MAP),
  ]) {
    for (const hash of NAV_MENU_MAP[key]) {
      const { href } = hash;
      hash.routeDefinition = routes.find(
        ({ path, component }) =>
          (path instanceof RegExp ? path.test(href) : path === href) &&
          component
      );
    }
  }
}

// Important: call this at least once.
refreshMenu();

const NavItem = ({ routeDefinition, href, icon: Icon, label }) => {
  const { t } = useTranslation();
  const { currentPath } = useTransientRoute();
  const { path } = routeDefinition;
  const isMatch =
    path instanceof RegExp ? path.test(currentPath) : path === currentPath;

  return (
    <a href={href} className={`nav-item ${isMatch ? "active" : ""}`}>
      <Icon />
      <span className={`nav-item--title type-form--button`}>{t(...label)}</span>
    </a>
  );
};

const MainNav = () => {
  const gameSymbol = useGameSymbol();

  const navItems = NAV_MENU_MAP[gameSymbol] ?? NAV_MENU_MAP.noSpecificGame;

  return (
    <Container>
      {navItems.map((navItem, index) => (
        <NavItem key={index} {...navItem} />
      ))}
    </Container>
  );
};

export default MainNav;
