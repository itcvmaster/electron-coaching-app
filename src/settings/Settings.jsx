import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { Transition } from "@headlessui/react";

import { settingsTabs } from "@/routes/settings.mjs";
import GeneralSettings from "@/settings/GeneralSettings.jsx";
import LoLSettings from "@/settings/LoLSettings.jsx";
import SettingsTabs from "@/settings/SettingsTabs.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

export const Container = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  padding: 0 0 var(--sp-12) 0;
  margin: 0 auto var(--sp-12) auto;
  max-width: var(--sp-container);

  & {
    .transition {
      position: relative;
      transition-property: opacity, transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    .transition-enter {
      transition-duration: 1000ms;
      z-index: 10;
    }
    .transition-enter-from {
      opacity: 0;
      transform: translateX(-10px);
    }
    .transition-enter-to {
      opacity: 100;
      transform: translateX(0px);
    }
    .transition-leave {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transition-duration: 150ms;
      z-index: 0;
    }
    .transition-leave-from {
      opacity: 100;
      transform: translateX(0px);
    }
    .transition-leave-to {
      opacity: 0;
      transform: translateX(-10px);
    }
  }
`;

const TabContent = styled("div")`
  position: relative;
`;

const transitionProps = {
  className: "transition",
  enter: "transition-enter",
  enterFrom: "transition-enter-from",
  enterTo: "transition-enter-to",
  leave: "transition-leave",
  leaveFrom: "transition-leave-from",
  leaveTo: "transition-leave-to",
};

function Settings() {
  const { t } = useTranslation();
  const {
    parameters: [activeTab],
  } = useRoute();

  return (
    <Container>
      <PageHeader title={t("common:settings.settings", "Settings")} />
      <SettingsTabs activeTab={activeTab} />
      <TabContent>
        <Transition
          show={activeTab === settingsTabs.GENERAL}
          {...transitionProps}
        >
          <GeneralSettings />
        </Transition>
        <Transition show={activeTab === settingsTabs.LOL} {...transitionProps}>
          <LoLSettings />
        </Transition>
      </TabContent>
    </Container>
  );
}

export function meta() {
  return {
    title: ["common:settings.settings", "Settings"],
    description: [],
  };
}

export default Settings;
