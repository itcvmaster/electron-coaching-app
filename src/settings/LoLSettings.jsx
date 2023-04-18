import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_LOL } from "@/app/constants.mjs";
import { getGameProfileImg } from "@/app/util.mjs";
import {
  FLASH_PLACEMENT_LEFT,
  flashPlacementOptions,
  SERVICES_TO_REGIONS,
} from "@/game-lol/constants.mjs";
import AccountIcon from "@/inline-assets/account2.svg";
import CloseIcon from "@/inline-assets/close.svg";
import { removeLoLProfile, updateLoLSetting } from "@/settings/actions.mjs";
import {
  PageContainer,
  Panel,
  SettingsContent,
  SettingsDescription,
  SettingsLabel,
  SettingsList,
  SettingsListItem,
} from "@/settings/Common.style.jsx";
import {
  AccountLabel,
  AccountsContainer,
  Avatar,
  AvatarBackdrop,
  AvatarContainer,
  CloseButton,
  LinkedAccount,
  LinkedAccountContainer,
  LinkedAccountList,
  ProfileTag,
} from "@/settings/LoLSettings.style.jsx";
import ToggleButton from "@/settings/ToggleButton.jsx";
import { ToggleSwitch } from "@/settings/ToggleSwitch.jsx";

function LoLSettings() {
  const { t } = useTranslation();
  const {
    settings: {
      lol: {
        displayPopup,
        autoImportBuilds,
        autoImportRunes,
        autoImportSpells,
        tiltFreeMode,
        defaultFlashPlacement,
        queuePopup,
        changeLanguage,
      },
      loggedInAccounts: { lol },
    },
  } = useSnapshot(readState);

  const flashOptions = useMemo(() => {
    return flashPlacementOptions.map((value) => ({
      name:
        value === FLASH_PLACEMENT_LEFT
          ? t("common:settings.import.preferredFlashPos.left", "[Left]")
          : t("common:settings.import.preferredFlashPos.right", "[Right]"),
      value,
    }));
  }, [t]);

  const gameSettings = [
    {
      name: "displayPopup",
      label: t(
        "common:settings.autoPop",
        "Automatically pop up during champion selection"
      ),
      description: t(
        "common:settings.autoSub",
        "Once you've locked in a Champion, Blitz will automatically pop up to display builds you can import and other helpful info."
      ),
      input: (
        <ToggleSwitch
          value={displayPopup}
          onChange={({ value }) => updateLoLSetting("displayPopup", value)}
        />
      ),
    },
    {
      name: "autoImportBuilds",
      label: t("common:settings.import.builds", "Auto import builds"),
      description: t(
        "common:settings.import.buildsSubtitle",
        "Import matchup and pro item builds into the in-game item shop."
      ),
      input: (
        <ToggleSwitch
          value={autoImportBuilds}
          onChange={({ value }) => updateLoLSetting("autoImportBuilds", value)}
        />
      ),
    },
    {
      name: "autoImportRunes",
      label: t("common:settings.import.runes", "Auto import runes"),
      description: t(
        "common:settings.import.runesSubtitle",
        "Set runes automatically when entering champion select."
      ),
      input: (
        <ToggleSwitch
          value={autoImportRunes}
          onChange={({ value }) => updateLoLSetting("autoImportRunes", value)}
        />
      ),
    },
    {
      name: "autoImportSpells",
      label: t("common:settings.import.spells", "Auto import summoner spells"),
      description: t(
        "common:settings.import.spellsSubtitle",
        "Set summoner spells automatically when entering champion select."
      ),
      input: (
        <ToggleSwitch
          value={autoImportSpells}
          onChange={({ value }) => updateLoLSetting("autoImportSpells", value)}
        />
      ),
    },
    {
      name: "tiltFreeMode",
      label: t("common:settings.tilt", "Tilt-free mode"),
      description: t(
        "common:settings.hide",
        "Hide all player ranks and info in champion select."
      ),
      input: (
        <ToggleSwitch
          value={tiltFreeMode}
          onChange={({ value }) => updateLoLSetting("tiltFreeMode", value)}
        />
      ),
    },
    {
      name: "queuePopup",
      label: t("common:settings.queuePopup", "Enable Match Found Popup"),
      description: t(
        "common:settings.queuePopupSubTitle",
        "A popup that gives you the option to Accept or Decline when a match has been found (LOL & TFT only)"
      ),
      input: (
        <ToggleSwitch
          value={queuePopup}
          onChange={({ value }) => updateLoLSetting("queuePopup", value)}
        />
      ),
    },
    {
      name: "changeLanguage",
      label: t(
        "common:settings.changeLanguage",
        "Automatically change language on startup"
      ),
      description: t(
        "common:settings.changeDefault",
        "Changes the default language on Blitz to match your LoL client"
      ),
      input: (
        <ToggleSwitch
          value={changeLanguage}
          onChange={({ value }) => updateLoLSetting("changeLanguage", value)}
        />
      ),
    },
    {
      name: "defaultFlashPlacement",
      label: t(
        "common:settings.import.preferredFlash.title",
        "Default Flash placement"
      ),
      description: t(
        "common:settings.import.preferredFlashPos.subtitle",
        "Set the preferred placement of Flash when summoner spells are imported."
      ),
      input: (
        <ToggleButton
          value={defaultFlashPlacement}
          options={flashOptions}
          onChange={(value) => updateLoLSetting("defaultFlashPlacement", value)}
        />
      ),
    },
  ];

  // const [profileQuery, setProfileQuery] = useState("");
  // const profileQueryInvalid = profileQuery === "invalid"; // placeholder for testing

  // const profileInputValidation = useMemo(() => {
  //   return profileQueryInvalid ? "invalid" : profileQuery ? "valid" : "";
  // }, [profileQueryInvalid, profileQuery]);

  // const updateProfileQuery = useCallback((event) => {
  //   setProfileQuery(event.target.value);
  // }, []);

  // const [profiles, setProfiles] = useState([{ name: "Jo E" }]);

  // const addProfile = useCallback(() => {
  //   setProfileQuery("");
  //   setProfiles((profiles) => [...profiles, { name: profileQuery }]);
  // }, [profileQuery]);

  // const removeProfile = useCallback((name) => {
  //   setProfiles((profiles) =>
  //     profiles.filter((profile) => profile.name !== name)
  //   );
  // }, []);

  const profiles = useMemo(() => {
    const profiles = [];
    for (const key in lol) {
      const profile = lol[key];
      profiles.push({
        ...profile,
        key,
        // gotta extract the region from the derivedId
        region: SERVICES_TO_REGIONS[key.match(/^(.*?):/)?.[1]],
        avatar: profile.profileIconId
          ? getGameProfileImg(GAME_SYMBOL_LOL, profile.profileIconId)
          : null,
      });
    }
    return profiles;
  }, [lol]);

  return (
    <PageContainer>
      {profiles.length ? (
        <AccountsContainer>
          {/* <h5 className="type-article-headline">
          {t("common:settings.lol.addProfile", "Add Profile")}
        </h5>
        <div className={`flex ${profileInputValidation}`}>
          <InputGroup>
            <TextInput
              type="text"
              name="profileName"
              placeholder="Profile Name..."
              value={profileQuery}
              onChange={updateProfileQuery}
            />
            <InputTag className="type-form--tab">{`NA`}</InputTag>
          </InputGroup>
          <ProfileAddButton onClick={addProfile}>
            {t("common:add", "Add")}
          </ProfileAddButton>
        </div> */}
          <LinkedAccountContainer>
            <h5 className="type-subtitle1">
              {t("common:settings.linkedAccounts", "Linked accounts")}
            </h5>
            <LinkedAccountList>
              {profiles.map((profile) => (
                <LinkedAccount key={profile.accountId}>
                  <AvatarContainer>
                    <AvatarBackdrop $src={profile.avatar} />
                    <Avatar $src={profile.avatar}>
                      {!profile.avatar ? (
                        <AccountIcon width="40px" height="40px" />
                      ) : null}
                    </Avatar>
                    <CloseButton onClick={() => removeLoLProfile(profile.key)}>
                      <CloseIcon width="18px" height="18px" />
                    </CloseButton>
                  </AvatarContainer>
                  <AccountLabel>
                    <span className="type-subtitle2">
                      {profile.displayName}
                    </span>
                    <ProfileTag className="type-form--tab">
                      {profile.region}
                    </ProfileTag>
                  </AccountLabel>
                </LinkedAccount>
              ))}
            </LinkedAccountList>
          </LinkedAccountContainer>
        </AccountsContainer>
      ) : null}
      <Panel>
        <h5 className="type-article-headline">
          {t("common:settings.gameSettings", "Game Settings")}
        </h5>
        <SettingsList>
          {gameSettings.map(({ name, label, description, input }) => (
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
      </Panel>
    </PageContainer>
  );
}

export default LoLSettings;
