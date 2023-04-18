import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_VAL } from "@/app/constants.mjs";
import CoachingOverview from "@/game-val/CoachingOverview.jsx";
import ProfileOverview from "@/game-val/ProfileOverview.jsx";
import { getProfileIcon } from "@/game-val/static.mjs";
import Container from "@/shared/ContentContainer.jsx";
import GameBadge from "@/shared/GameBadge.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SharedProfile, { UnknownPlayerHeader } from "@/shared/Profile.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function Profile() {
  const { t } = useTranslation();
  const state = useSnapshot(readState);
  const route = useRoute((prev, next) => {
    const prevAct = prev.searchParams.get("actName");
    const nextAct = next.searchParams.get("actName");
    return prev.currentPath === next.currentPath && prevAct === nextAct;
  });
  const {
    parameters: [profileId, selectedTab],
  } = route;
  const actName = route.searchParams.get("actName");
  const queue = route.searchParams.get("queue");

  const tabs = useMemo(() => {
    return [
      {
        name: `${t("val:navigation.overview", "Overview")}`,
        id: "overview",
        url: `/valorant/profile/${profileId}`,
        isNew: false,
      },
      // {
      //   name: `${t("val:navigation.agents", "Agents")}`,
      //   id: "agents",
      //   url: `/valorant/profile/${profileId}/agents`,
      //   isNew: false,
      // },
      // {
      //   name: `${t("val:navigation.weapons", "Weapons")}`,
      //   id: "weapons",
      //   url: `/valorant/profile/${profileId}/weapons`,
      //   isNew: false,
      // },
      {
        name: `${t("val:navigation.performance", "Coaching")}`,
        id: "coaching",
        url: `/valorant/profile/${profileId}/coaching`,
        isNew: true,
      },
    ];
  }, [profileId, t]);

  const lowercaseName = profileId.toLowerCase();
  const profile = state.val?.profiles?.[lowercaseName];
  const profileError = profile instanceof Error ? profile : null;
  const { name, tag, level } = profile || {};
  const profileIconURL = undefined;
  const displayName = `${name}#${tag}`;

  return (
    <>
      {!profileError ? (
        <PageHeader
          title={displayName}
          image={getProfileIcon(profileIconURL)}
          accentText={level}
          style={{ gridArea: "header" }}
          underTitle={<GameBadge game={GAME_SYMBOL_VAL} withName />}
          links={tabs.map((tab) => ({
            url: tab.url,
            text: tab.name,
          }))}
        />
      ) : (
        <UnknownPlayerHeader />
      )}
      <Container>
        <SharedProfile>
          {!selectedTab ? (
            <ProfileOverview
              actName={actName}
              season={queue}
              profileId={profileId}
            />
          ) : null}

          {selectedTab === "coaching" ? (
            <CoachingOverview profileId={profileId} />
          ) : null}
        </SharedProfile>
      </Container>
    </>
  );
}

export function meta(params) {
  const user = params[0];
  return {
    title: [
      "valorant:profile",
      "{{user}} Player Profile - Valorant – Blitz Valorant",
      { user: user },
    ],
    description: [
      `valorant:profile`,
      "Player {{user}}'s Valorant match history and profile, advanced performance and best agents, kda, dmg/min.",
      { user: user },
    ],
  };
}

export default Profile;
