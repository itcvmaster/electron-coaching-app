import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { Card } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_APEX } from "@/app/constants.mjs";
import LegendsTable from "@/game-apex/LegendsTable.jsx";
import ProfileOverview from "@/game-apex/ProfileOverview.jsx";
import WeaponsTable from "@/game-apex/WeaponsTable.jsx";
import Container from "@/shared/ContentContainer.jsx";
import GameBadge from "@/shared/GameBadge.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SharedProfile, { UnknownPlayerHeader } from "@/shared/Profile.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function Profile() {
  const {
    parameters: [profileId, tab],
  } = useRoute();
  const { t } = useTranslation();

  const state = useSnapshot(readState);
  const profile = state.apex?.profiles?.[profileId];
  const profileError = profile instanceof Error ? profile : null;
  const legends = state.apex.meta?.legends;
  const iconURL = legends?.[profile?.hovered_champion_apex_id]?.imageUrl;

  const { xpProgress, xpTotal, lvl } = useMemo(() => {
    if (!profile) return {};
    let lvl = 1;
    let xpProgress = profile.experience_points;
    let xpToNextLvl = 100;
    while (xpProgress - xpToNextLvl > 0) {
      xpProgress -= xpToNextLvl;
      lvl++;
      if (xpToNextLvl === 100) {
        xpToNextLvl += 2550;
      } else if (xpToNextLvl === 2650) {
        xpToNextLvl += 1250;
      } else if (xpToNextLvl < 5600) {
        xpToNextLvl += 850;
      } else if (xpToNextLvl < 7850) {
        xpToNextLvl += 750;
      } else if (xpToNextLvl < 8150) {
        xpToNextLvl += 300;
      } else if (xpToNextLvl < 12200) {
        xpToNextLvl += 450;
      } else if (xpToNextLvl < 17900) {
        xpToNextLvl += 150;
      } else if (xpToNextLvl < 18000) {
        xpToNextLvl += 100;
      } else if (xpToNextLvl >= 18000) {
        lvl += Math.floor(xpProgress / 18000);
        xpProgress = xpProgress % 18000;
        break;
      }
    }

    return { xpProgress, xpTotal: xpToNextLvl, lvl };
  }, [profile]);

  const tabs = useMemo(() => {
    return [
      {
        name: `${t("apex:navigation.overview", "Overview")}`,
        id: "overview",
        url: `/apex/profile/${profileId}`,
        isNew: false,
      },
      {
        name: `${t("apex:navigation.legends", "Legends")}`,
        id: "legends",
        url: `/apex/profile/${profileId}/legends`,
        isNew: false,
      },
      {
        name: `${t("apex:navigation.weapons", "Weapons")}`,
        id: "weapons",
        url: `/apex/profile/${profileId}/weapons`,
        isNew: false,
      },
    ];
  }, [profileId, t]);

  let InnerComponent;
  switch (tab) {
    case "legends":
      InnerComponent = (
        <Container>
          <Card>
            <LegendsTable />
          </Card>
        </Container>
      );
      break;
    case "weapons":
      InnerComponent = (
        <Container>
          <Card>
            <WeaponsTable />
          </Card>
        </Container>
      );
      break;
    default: {
      InnerComponent = <ProfileOverview />;
    }
  }

  return (
    <Container>
      {!profileError ? (
        <PageHeader
          image={iconURL}
          title={profile?.displayName}
          accentText={lvl}
          underTitle={<GameBadge game={GAME_SYMBOL_APEX} withName />}
          links={tabs.map((tab) => ({
            url: tab.url,
            text: tab.name,
          }))}
          xpProgress={xpProgress}
          xpTotal={xpTotal}
        />
      ) : (
        <UnknownPlayerHeader />
      )}
      <SharedProfile>{InnerComponent}</SharedProfile>
    </Container>
  );
}

export function meta(info) {
  const userName = info[1];
  return {
    title: [
      `apex:profile`,
      `{{userName}}'s Match Stats – Apex – Blitz Apex`,
      { userName: userName },
    ],
    description: [
      `apex:profile`,
      `profile for {{userName}}`,
      { userName: userName },
    ],
  };
}

export default Profile;
