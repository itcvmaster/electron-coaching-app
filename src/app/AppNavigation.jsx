import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { toggleIsManualExpanded } from "@/app/actions.mjs";
import {
  Divider,
  InnerContainer,
  LogoContainer,
  NavigationBar,
} from "@/app/AppNavigation.style.jsx";
import ContextMenu from "@/app/ContextMenu.jsx";
import Logo from "@/app/Logo.jsx";
import MainNav from "@/app/MainNav.jsx";
import NavCollapse from "@/app/NavCollapse.jsx";
import NavProfiles from "@/app/NavProfiles.jsx";
import NavSearch from "@/app/NavSearch.jsx";
import NavSettings from "@/app/NavSettings.jsx";
import DisableAutoExpandIcon from "@/inline-assets/disable-auto-expand.svg";
import EnableAutoExpandIcon from "@/inline-assets/enable-auto-expand.svg";
import SettingsIcon from "@/inline-assets/settings.svg";
import { useShouldShowAppNavigation } from "@/util/app-route.mjs";
import { appContainer } from "@/util/constants.mjs";
import { OBSERVE_CLASS } from "@/util/exit-transitions.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const AppNavigation = () => {
  const navRef = useRef(null);

  // This is mainly used to trigger a re-render.
  const route = useRoute((prev, next) => {
    return prev?.currentPath === next?.currentPath && !next?.state?.isUpdate;
  });

  const shouldRender = useShouldShowAppNavigation();
  const state = useSnapshot(readState);
  const { isManualExpanded } = state.settings;
  const [forceAutoHide, setForceAutoHide] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    /* eslint-disable no-restricted-properties */
    const listener = () => {
      const contentContainerRoot = document.querySelector(`.${OBSERVE_CLASS}`);
      if (!contentContainerRoot?.children[0]) {
        if (!forceAutoHide) setForceAutoHide(true);
        return;
      }
      const contentContainer = contentContainerRoot.children[0];
      if (
        appContainer.getBoundingClientRect &&
        (appContainer.getBoundingClientRect().width -
          contentContainer.getBoundingClientRect().width) /
          2 <
          240
      ) {
        if (!forceAutoHide) setForceAutoHide(true);
      } else if (forceAutoHide) setForceAutoHide(false);
    };
    window.addEventListener("resize", listener);
    listener();
    return () => {
      window.removeEventListener("resize", listener);
    };
    /* eslint-enable no-restricted-properties */
  }, [forceAutoHide, route]);

  const toggleAutoManual = useCallback(() => {
    toggleIsManualExpanded(!isManualExpanded);
  }, [isManualExpanded]);
  const contextMenuItems = useMemo(() => {
    const expanded = isManualExpanded && !forceAutoHide;
    return [
      {
        icon: expanded ? <DisableAutoExpandIcon /> : <EnableAutoExpandIcon />,
        text: !expanded
          ? t("common:navigation.disableAutoExpand", "Disable Auto-Expand")
          : t("common:navigation.enableAutoExpand", "Enable Auto-Expand"),
        onClick: toggleAutoManual,
        disabled: forceAutoHide,
      },
      {
        icon: <SettingsIcon />,
        text: t("common:navigation.settings", "Settings"),
        href: "/settings",
      },
    ];
  }, [forceAutoHide, isManualExpanded, t, toggleAutoManual]);
  if (!shouldRender) return null;
  return (
    <NavigationBar
      ref={navRef}
      className={isManualExpanded && !forceAutoHide ? "expanded" : ""}
    >
      <ContextMenu parentRef={navRef} items={contextMenuItems} />
      <InnerContainer>
        <LogoContainer>
          <a href="/">
            <Logo />
          </a>
        </LogoContainer>
        <NavSearch />
        <MainNav />
        <Divider />
        <NavProfiles />
        {!forceAutoHide ? <NavCollapse /> : null}
        <NavSettings />
      </InnerContainer>
    </NavigationBar>
  );
};

export default memo(AppNavigation);
