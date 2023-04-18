import React, { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { companionDirectoryReplace } from "@/game-tft/constants.mjs";
import getUnitsFromBoardPieces from "@/game-tft/get-units-from-board-pieces.mjs";
import ProBuildsMatchUnits from "@/game-tft/ProBuildsMatchUnits.jsx";
import ProBuildsTile from "@/game-tft/ProBuildsTile.jsx";
import StaticTFT from "@/game-tft/static.mjs";
import Traits from "@/game-tft/Traits.jsx";

export default function ProBuildsMatch({ summoner, player, game }) {
  const state = useSnapshot(readState);
  const matchSet = StaticTFT.getMatchSetByDate(game.createdAt);
  const latestSet = StaticTFT.getMatchSetByDate(new Date().toString());
  const isOutOfDate = matchSet !== latestSet;
  const { createdAt, queueId, matchid, patch } = game;
  const { name, region, leagues, profileiconid: profileIconId } = summoner;
  const { companion, placement, boardPieces, rank } = player;
  const { wins, losses } = leagues[0] || {};

  // Memos
  const champions = state.tft.champions;
  const companions = useMemo(
    () => state.tft.companions || [],
    [state.tft.companions]
  );
  const { traits, units } = useMemo(() => {
    if (player.traits && player.units) {
      return {
        traits: player.traits,
        units: player.units,
      };
    }
    return getUnitsFromBoardPieces(boardPieces, champions, matchSet);
  }, [boardPieces, champions, matchSet, player.traits, player.units]);
  const image = useMemo(() => {
    const result =
      companions.find((i) => i.contentId === companion.content_ID) || {};
    return companionDirectoryReplace(result.loadoutsIcon || companion.icon);
  }, [companion.content_ID, companion.icon, companions]);

  return (
    <ProBuildsTile
      matchid={matchid}
      placement={placement || rank}
      name={name}
      region={region}
      leagues={leagues}
      wins={wins}
      losses={losses}
      profileIconId={profileIconId}
      queueId={queueId}
      patch={patch}
      createdAt={createdAt}
      companionImage={image}
      isOutOfDate={isOutOfDate}
      viewMode="desktop" // Todo: viewmode for desktop, tablet, mobile
      traitsListFull={
        <Traits traits={traits} isOutOfDate={isOutOfDate} set={matchSet} />
      }
      traitsList={<Traits traits={traits} set={matchSet} onlyTraitsList />}
      buildDetails={<Traits traits={traits} set={matchSet} onlyBuildDetails />}
    >
      <ProBuildsMatchUnits
        traits={traits}
        units={units}
        set={matchSet}
        viewMode="desktop" // Todo: viewmode for desktop, tablet, mobile
      />
    </ProBuildsTile>
  );
}
