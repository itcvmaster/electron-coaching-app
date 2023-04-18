import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import StaticLOL from "@/game-lol/static.mjs";
import { getCurrentPatchForStaticData } from "@/game-lol/util.mjs";
import PostMatchScoreboardScore from "@/game-tft/PostMatchScoreboardScore.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import useMatch from "@/game-tft/use-match.mjs";
import useTraits from "@/game-tft/use-traits.mjs";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import getOrdinal from "@/util/get-ordinal.mjs";
import isEmpty from "@/util/is-empty.mjs";
import orderBy from "@/util/order-array-by.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

/**
 * Team Fight Tactic's post-match scoreboard
 * @returns {JSX.Element}
 * @constructor
 */
function PostMatchScoreboard() {
  // Hooks
  const { t } = useTranslation();
  const {
    parameters: [, name],
  } = useRoute();
  const players = useData();
  // Vars
  const columns = [
    t("tft:placement", "Placement"),
    t("tft:common.units", "Units"),
    t("tft:common.traits", "Traits"),
    t("tft:stat.goldRemaining", "Gold Remaining"),
    t("tft:stat.playersEstimated", "Players Estimated"),
    t("tft:stat.playersDamage", "Players Damage"),
    t("tft:stat.roundEstimated", "Round Estimated"),
  ];
  let gridCSS = new Array(columns.length).fill("1fr");
  gridCSS[0] = "2fr"; // Placement
  gridCSS[1] = "3fr"; // Units
  gridCSS = gridCSS.join(" ");
  // Render
  return (
    <div>
      {players.length ? (
        <div>
          <TFTScoreboardHeader>
            <Grid
              className={css`
                grid-template-columns: ${gridCSS};
              `}
            >
              {columns.map((column, idx) => (
                <Center key={idx}>{column}</Center>
              ))}
            </Grid>
          </TFTScoreboardHeader>
          <TFTScoreboard>
            {players.map((player) => (
              <PostMatchScoreboardScore
                key={player.id}
                playerName={name}
                placement={player.placement}
                avatar={player.avatar}
                units={player.units}
                summonerName={player.summonerName}
                summonerRegion={player.summonerRegion}
                traits={player.traits}
                matchSet={player.matchSet}
                playerDamage={player.playerDamage}
                roundEliminated={player.roundEliminated}
                leagues={player.leagues}
                playersEliminated={player.playersEliminated}
                goldRemaining={player.goldRemaining}
              />
            ))}
          </TFTScoreboard>
        </div>
      ) : (
        <ErrorComponent />
      )}
    </div>
  );
}

export default PostMatchScoreboard;

/**
 * A utility function to convert the legacy scoreboard data into the new scoreboard ui
 * @returns {(*[]|*|string)[]|*[]}
 */
function useData() {
  const state = useSnapshot(readState);
  const currentMatch = useMatch();
  const { t } = useTranslation();
  const matchSet = useMemo(() => {
    if (currentMatch && !(currentMatch instanceof Error))
      return StaticTFT.getMatchSetByDate(currentMatch.data.createdAt);
    return StaticTFT.getMatchSetByDate();
  }, [currentMatch]);
  const summoners = state.tft.summoners;
  const unitsStaticData = state.tft.champions;
  const latestPatch = getCurrentPatchForStaticData();
  const traitsStaticData = useTraits();
  const results = [];
  // Guards
  if (!currentMatch || currentMatch instanceof Error) return results;
  // Sort
  const sorted = orderBy(currentMatch.data.data, "placement", "asc");
  // Transform the data
  for (let i = 0; i < sorted.length; i += 1) {
    // Validate summoner
    const player = sorted[i];
    let summoner;
    for (const key in summoners) {
      if (Reflect.get(summoners, key).puuid === player.puuid) {
        summoner = summoners[key];
        break;
      }
    }
    if (isEmpty(summoner)) continue;
    // If validated summoner, compute results
    const traits =
      Array.isArray(player?.traits) && player?.traits.length
        ? player.traits
        : StaticTFT.inferTraitsFromUnits({
            units: player?.units || [],
            traitsStaticData,
            unitsStaticData,
            matchSet,
          });
    // Push results
    results.push({
      id: player.puuid,
      placement: t("tft:ordinal", getOrdinal(player.placement)),
      units: player?.units || [],
      traits,
      summonerName: summoner.name,
      summonerRegion: summoner.region.toString(),
      playerDamage: player.total_damage_to_players,
      roundEliminated: player.last_round,
      leagues: summoner.leagues,
      playersEliminated: player.players_eliminated,
      goldRemaining: player.gold_left,
      avatar: StaticLOL.getProfileIcon(
        summoner.profileiconid || 29,
        latestPatch
      ),
      matchSet,
    });
  }
  return results;
}

// Styles
const TFTScoreboardHeader = styled("div")({
  padding: "var(--sp-2) var(--sp-0)",
  color: "var(--shade1)",
  fontSize: "var(--sp-3)",
});

const TFTScoreboard = styled("div")({
  "& > *:nth-child(odd)": {
    background: "var(--shade8)",
  },
  "& > *:nth-child(even)": {
    background: "var(--shade7)",
  },
  "& > *:first-child": {
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
  "& > *:last-child": {
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
  },
});

const Center = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
});

const Grid = styled("div")({
  display: "grid",
  width: "100%",
  paddingLeft: "16px",
  boxSizing: "border-box",
  gap: "4px",
});
