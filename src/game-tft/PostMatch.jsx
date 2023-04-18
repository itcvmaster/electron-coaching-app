import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_TFT } from "@/app/constants.mjs";
import Static from "@/game-lol/static.mjs";
import { getDerivedId } from "@/game-lol/util.mjs";
import Performance from "@/game-tft/PostMatchPerformance.jsx";
import Round from "@/game-tft/PostMatchRound.jsx";
import Scoreboard from "@/game-tft/PostMatchScoreboard.jsx";
import Timeline from "@/game-tft/PostMatchTimeline.jsx";
import Container from "@/shared/ContentContainer.jsx";
import GameBadge from "@/shared/GameBadge.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const TABS = {
  performance: {
    component: Performance,
    url: "performance",
    title: {
      key: "tft:matchtabs.performance",
      value: "Performance",
    },
  },
  scoreboard: {
    component: Scoreboard,
    url: "scoreboard",
    title: {
      key: "tft:matchtabs.scoreboard",
      value: "Scoreboard",
    },
  },
  timeline: {
    component: Timeline,
    url: "timeline",
    title: {
      key: "tft:matchtabs.timeline",
      value: "Timeline",
    },
  },
  rounds: {
    component: Round,
    url: "rounds",
    title: {
      key: "tft:matchtabs.rounds",
      value: "Round Breakdown",
    },
  },
};

function PostMatch() {
  const { t } = useTranslation();
  const {
    parameters: [region, name, matchId, tab],
  } = useRoute();
  const state = useSnapshot(readState);
  const profile = state.tft.profiles[getDerivedId(region, name)];

  const Component = useMemo(() => {
    if (TABS[tab]) return TABS[tab].component;
    return TABS.performance.component;
  }, [tab]);

  return (
    <>
      <PageHeader
        title={name}
        image={Static.getProfileIcon(profile?.profileiconid)}
        accentText={profile?.summonerLevel}
        underTitle={<GameBadge game={GAME_SYMBOL_TFT} withName />}
        links={Object.values(TABS).map((tab) => ({
          url: `/tft/match/${region}/${name}/${matchId}/${tab.url}`,
          text: t(tab.title.key, tab.title.value),
        }))}
      />
      <Container>
        <Component />
      </Container>
    </>
  );
}

export function meta() {
  return {
    title: [
      "tft:helmet.postmatch.title",
      "TFT Post-Game Analysis & Stats - Blitz TFT",
    ],
    description: [
      "tft:helmet.postmatch.description",
      "Teamfight Tactics (TFT) end-game stats, full comps,  round by round timeline, in-depth profiles analysis, and more on Blitz TFT.",
    ],
  };
}

export default memo(PostMatch);
