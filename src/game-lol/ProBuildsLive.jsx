import React from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import ChampionImage from "@/game-lol/ChampionImg.jsx";
import { QUEUE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import { PlaceholderContainer } from "@/game-lol/ProBuildsHistory.jsx";
import {
  BrandImage,
  Container,
  Grid,
  LowerBox,
  TeamImage,
} from "@/game-lol/ProBuildsLive.style.jsx";
import Static from "@/game-lol/static.mjs";
import { getChampion, mapQueueToSymbol } from "@/game-lol/util.mjs";
import ExclamationIcon from "@/inline-assets/exclamation-mark.svg";
import ContentContainer from "@/shared/ContentContainer.jsx";
import { useIsLoaded } from "@/util/router-hooks.mjs";

const Live = () => {
  const { t } = useTranslation();
  const isLoaded = useIsLoaded();
  const state = useSnapshot(readState);
  const { proBuildTeams, proBuildPros } = state.lol;

  if (!isLoaded) {
    return (
      <ContentContainer>
        <Grid>
          {[...Array(10)].map((_, i) => (
            <Container key={i} className="loading" />
          ))}
        </Grid>
      </ContentContainer>
    );
  }

  if (isLoaded instanceof Error) {
    return (
      <ContentContainer>
        <PlaceholderContainer>
          <ExclamationIcon />
        </PlaceholderContainer>
      </ContentContainer>
    );
  }

  const livePros = proBuildPros.filter((p) => p.liveSpectator);
  const teams = proBuildTeams.reduce((acc, team) => {
    acc[team.id] = team;
    return acc;
  }, {});

  const liveMatches = livePros.map((match) => {
    const { name, teamId, profileImageUrl, liveSpectator } = match;
    const player = (liveSpectator.participants || []).find(
      (p) => p.summonerId === liveSpectator.proSummonerId
    );
    const champion = getChampion(player?.championId);
    const queue =
      QUEUE_SYMBOL_TO_STR[mapQueueToSymbol(liveSpectator.gameQueueConfigId)];

    return {
      name,
      champion,
      queue,
      img: profileImageUrl,
      team: teams[teamId],
    };
  });

  return (
    <ContentContainer>
      <Grid>
        {liveMatches
          .filter((m) => m.name)
          .map((match, i) => (
            <Container key={i}>
              <ChampionImage
                round
                championKey={match.champion?.key}
                size={72}
              />
              <div className="title">
                <p className="type-body-1-form--active title--player">
                  {match.name}
                </p>
                <span className="type-caption title--champion">
                  {match.champion?.name}
                </span>
              </div>
              <div className="match-info match-data">
                <div className="match-info">
                  <div className="live-dot" />
                </div>
                <p className="type-caption">
                  {match.queue && t(match.queue.t.name, match.queue.t.fallback)}
                </p>
              </div>
              <LowerBox>
                <div className="match-info">
                  <BrandImage
                    src={match.img}
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                  <div className="footer--pro-info">
                    <p className="type-caption--bold">{match.name}</p>
                    {match.team && (
                      <p className="type-caption">{match.team.name}</p>
                    )}
                  </div>
                </div>
                {match.team && match.team.name !== "Streamers" && (
                  <TeamImage
                    src={Static.getProTeamIamge(match.team.pictureUrl)}
                  />
                )}
              </LowerBox>
            </Container>
          ))}
      </Grid>
    </ContentContainer>
  );
};

export default Live;

export function meta() {
  return {
    title: [
      "lol:helmet.probuilds.title",
      "LoL Probuilds, Best Comps, Items, Summoner Spells, and Runes – Blitz LoL",
    ],
    description: [
      "lol:helmet.probuilds.description",
      "The latest Pro Player Builds, Profiles, Stats, Leaderboards, Ranking, TFT Databases, CheatSheet, Synergies, Builder, Guide, Items, Champion Stats for League of Legends.",
    ],
  };
}
