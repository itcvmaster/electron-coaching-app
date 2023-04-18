import React from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_TFT } from "@/app/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import Container from "@/shared/ContentContainer.jsx";
import GameBadge from "@/shared/GameBadge.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SharedProfile, { UnknownPlayerHeader } from "@/shared/Profile.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function Profile() {
  const { t } = useTranslation();
  const {
    parameters: [region, name],
  } = useRoute();
  const state = useSnapshot(readState);
  const profile = state.tft.summoners?.[getDerivedId(region, name)];
  const matchlist = state.tft.matchlists?.[getDerivedId(region, name)];
  const profileError = profile instanceof Error ? profile : null;
  const matchlistError = matchlist instanceof Error ? matchlist : null;

  return (
    <>
      {!profileError ? (
        <PageHeader
          title={name}
          image={Static.getProfileIcon(profile?.profileiconid)}
          accentText={profile?.summonerLevel}
          underTitle={<GameBadge game={GAME_SYMBOL_TFT} withName />}
          links={[
            {
              url: `/tft/profile/${region}/${name}`,
              text: t("lol:championsPage.tabs.overview", "Overview"),
            },
          ]}
        />
      ) : (
        <UnknownPlayerHeader />
      )}
      <Container>
        <SharedProfile
          profileError={profileError}
          matchlistError={matchlistError}
          playerIcon={Static.getProfileIcon(profile?.profileiconid)}
          displayName={name}
          playerLevel={profile?.summonerlevel}
          matchlist={matchlist}
        />
      </Container>
    </>
  );
}

export function meta(params) {
  const userName = params[1];
  return {
    title: [
      "tft:profile",
      "{{name}} - TFT Post-Game Analysis & Stats - Blitz TFT",
      { name: userName },
    ],
    description: [
      "tft:profile",
      "{{name}}'s Teamfight Tactics (TFT) end-game stats, full comps, round by round timeline, in-depth profiles analysis, and more on Blitz TFT.",
      { name: userName },
    ],
  };
}

export default Profile;
