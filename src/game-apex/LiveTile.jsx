import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { GAME_MODES } from "@/game-apex/constants.mjs";
import {
  getLegendFromModelName,
  getPlayerStatsByMatch,
} from "@/game-apex/utils.mjs";
import LiveTile from "@/shared/LiveTile.jsx";

const ApexLiveTile = ({ match, profileId }) => {
  const { t } = useTranslation();
  const { gameStartedAt, mode, playerMatchChampionStats } = match;
  const modeObj = GAME_MODES[mode];

  const { image, myTeam } = useMemo(() => {
    const myPlayer = getPlayerStatsByMatch(match, profileId);
    if (!myPlayer || !playerMatchChampionStats) return {};
    let image;
    const myTeam = playerMatchChampionStats
      .filter((p) => p.team.teamId === myPlayer.team.teamId)
      .map((p) => {
        const legend = getLegendFromModelName(p.modelName);
        const isMe = p.apex_id === myPlayer.apex_id;
        if (isMe) image = legend?.imageUrl;
        return {
          id: p.apex_id,
          ImgComponent: (
            <img
              src={legend?.imageUrl}
              className={isMe ? "user" : "teammate"}
            />
          ),
        };
      });
    return {
      image,
      myTeam,
    };
  }, [match, playerMatchChampionStats, profileId]);
  return (
    <LiveTile
      title={t("common:liveGame", "Live Game")}
      queueType={modeObj ? t(modeObj.t, modeObj.label) : null}
      startTime={gameStartedAt}
      myTeam={myTeam}
      image={image}
    />
  );
};

export default ApexLiveTile;
