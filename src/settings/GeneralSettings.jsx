import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select } from "clutch/src/index.mjs";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { LOCALES } from "@/app/constants.mjs";
import LogoBlitz from "@/inline-assets/blitz-logo.svg";
import Mac from "@/inline-assets/mac.svg";
import ReplayIcon from "@/inline-assets/replay.svg";
import Windows from "@/inline-assets/windows.svg";
import {
  checkForUpdates,
  resetSessionData,
  restartApp,
  setAppForceCloseSetting,
  setHardwareAcceleration,
  setOpenAtLogin,
  updateSetting,
} from "@/settings/actions.mjs";
import {
  PageContainer,
  Panel,
  PanelWell,
  SettingsContent,
  SettingsDescription,
  SettingsLabel,
  SettingsList,
  SettingsListItem,
} from "@/settings/Common.style.jsx";
import {
  BlitzVersion,
  ButtonGroup,
  LanguageSelect,
  PrimaryButton,
  SecondaryButton,
} from "@/settings/GeneralSettings.style.jsx";
import { ToggleSwitch } from "@/settings/ToggleSwitch.jsx";
import { IS_APP } from "@/util/dev.mjs";
import getOSType from "@/util/get-os-type.mjs";
import themes from "@/util/themes.mjs";

function GeneralSettings() {
  const { t } = useTranslation();
  const {
    settings: { selectedLanguage, theme, disableAnimations },
    volatile,
  } = useSnapshot(readState);

  const themeOptions = useMemo(() => {
    return Object.values(themes).map((th) => ({
      text: t(th.nameKey, th.nameFallback),
      value: th.key,
    }));
  }, [t]);

  const applicationSettings = [
    {
      name: "openAtLogin",
      label: t("common:settings.startup", "Run Blitz on Startup"),
      input: (
        <ToggleSwitch
          value={volatile?.loginItemSettings?.openAtLogin}
          onChange={({ value }) => setOpenAtLogin(value)}
        />
      ),
      hidden: !IS_APP,
    },
    {
      name: "theme",
      label: t("common:settings.theme", "Theme"),
      input: (
        <Select
          selected={theme}
          options={themeOptions}
          onChange={(value) => updateSetting("theme", value)}
        />
      ),
    },
    {
      name: "hardwareAcceleration",
      label: t(
        "common:settings.hardwareAccelerationTitle",
        "Enable Hardware Acceleration "
      ),
      description: t(
        "common:settings.hardwareAccelerationSubTitle",
        "Hardware Acceleration uses your GPU to make Blitz run smoother. Turn this off if you are experiencing issues while playing. If you change this option, Blitz will immediately restart."
      ),
      input: (
        <ToggleSwitch
          value={volatile?.hardwareAcceleration?.enabled}
          onChange={({ value }) => setHardwareAcceleration(value)}
        />
      ),
      hidden: !IS_APP,
    },
    {
      name: "disableAnimations",
      label: t("common:settings.disableAnimations", "Disable Animations"),
      input: (
        <ToggleSwitch
          value={disableAnimations}
          onChange={({ value }) => updateSetting("disableAnimations", value)}
        />
      ),
    },
    {
      name: "minimize",
      label: t("common:settings.minimizeTitle", "Minimize Blitz to tray"),
      description: t(
        "common:settings.minimizeSubTitle",
        "Pressing the close button minimizes to the tray rather than closing the app entirely"
      ),
      // invert the value so this behaves as "minimize when toggled on"
      input: (
        <ToggleSwitch
          value={!volatile?.appForceCloseSetting?.enabled}
          onChange={({ value }) => setAppForceCloseSetting(!value)}
        />
      ),
      hidden: !IS_APP,
    },
  ];

  const onChangeSelectedLanguage = useCallback(
    (event) => updateSetting("selectedLanguage", event.target.value),
    []
  );

  const osType = useMemo(() => getOSType(), []);

  const appVersion = useMemo(() => {
    if (volatile?.appVersion?.value) {
      return volatile?.appVersion?.value;
    }

    if (volatile?.latestMacRelease?.value && osType === "darwin") {
      return volatile?.latestMacRelease?.value;
    }

    if (volatile?.latestWindowsRelease?.value && osType === "win32") {
      return volatile?.latestWindowsRelease?.value;
    }

    return "x.x.x";
  }, [
    osType,
    volatile?.appVersion?.value,
    volatile?.latestMacRelease?.value,
    volatile?.latestWindowsRelease?.value,
  ]);

  return (
    <PageContainer>
      <Panel>
        <h5 className="type-article-headline">
          {t("common:settings.application", "Application Settings")}
        </h5>
        <SettingsList>
          {applicationSettings
            .filter(({ hidden }) => !hidden)
            .map(({ name, label, description, input }) => (
              <SettingsListItem key={name}>
                <SettingsContent>
                  <SettingsLabel className="type-form--button">
                    {label}
                  </SettingsLabel>
                  {description && (
                    <SettingsDescription className="type-caption">
                      {description}
                    </SettingsDescription>
                  )}
                </SettingsContent>
                {input}
              </SettingsListItem>
            ))}
        </SettingsList>

        {IS_APP ? (
          <PanelWell>
            <BlitzVersion>
              <h6 className="type-h6 flex gap-sp-2 align-center">
                <LogoBlitz
                  width="16px"
                  height="16px"
                  className="inline-block"
                />
                {`${t("common:blitz", "Blitz")} ${appVersion}`}
              </h6>

              <SettingsDescription className="type-caption">
                {t(
                  "common:settings.checkVersion",
                  "You’re on the latest version. We automatically check for updates but you can check now anyway."
                )}
              </SettingsDescription>
            </BlitzVersion>
            <ButtonGroup>
              <PrimaryButton
                className="type-button-text"
                size="md"
                onClick={checkForUpdates}
              >
                {t("common:settings.updates", "Check for Updates")}
              </PrimaryButton>
              <SecondaryButton
                className="type-button-text"
                iconLeft={<ReplayIcon width="18px" height="18px" />}
                onClick={restartApp}
              >
                {t("common:settings.restart", "Restart the App")}
              </SecondaryButton>
              <Button className="type-button-text" onClick={resetSessionData}>
                {t("common:settings.clearCache", "Reset All Data")}
              </Button>
            </ButtonGroup>
          </PanelWell>
        ) : (
          <PanelWell>
            <BlitzVersion>
              <h6 className="type-h6 flex gap-sp-2 align-center">
                <LogoBlitz
                  width="16px"
                  height="16px"
                  className="inline-block"
                />
                {`${t("common:downloadBlitz", "Download Blitz")} ${appVersion}`}
              </h6>

              <SettingsDescription className="type-caption">
                {t(
                  "common:settings.getLatestVersion",
                  "Get the latest version of the desktop app to gain access to all the features Blitz has to offer!"
                )}
              </SettingsDescription>
            </BlitzVersion>
            <ButtonGroup>
              {osType === "darwin" && (
                <PrimaryButton
                  className="type-button-text"
                  iconLeft={<Mac width="18px" height="18px" />}
                >
                  {t("common:downloadMacOS", "Download for macOS")}
                </PrimaryButton>
              )}
              {osType === "win32" && (
                <PrimaryButton
                  className="type-button-text"
                  iconLeft={<Windows width="18px" height="18px" />}
                >
                  {t("common:downloadWindows", "Download for Windows")}
                </PrimaryButton>
              )}
              <SecondaryButton className="type-button-text">
                {t("common:signup.openInApp", "Open in App")}
              </SecondaryButton>
            </ButtonGroup>
          </PanelWell>
        )}
      </Panel>
      <Panel>
        <h5 className="type-article-headline">
          {t("common:language", "Language")}
        </h5>
        <LanguageSelect>
          {LOCALES.map(([code, name]) => (
            <label key={code} className="type-body2">
              <input
                type="radio"
                value={code}
                checked={code === selectedLanguage}
                onChange={onChangeSelectedLanguage}
              />
              {name}
            </label>
          ))}
        </LanguageSelect>
      </Panel>
    </PageContainer>
  );
}

export default GeneralSettings;
