import React, { memo } from "react";
import { css } from "goober";

import { Body2 } from "@/game-lol/CommonComponents.jsx";
import StaticLOL from "@/game-lol/static.mjs";
import {
  PlayerInfoContainer,
  ProBuildsPlayerDetails,
  ProBuildsProfileImage,
} from "@/game-tft/CommonComponents.jsx";
import ProBuildsRank from "@/game-tft/ProBuildsRank.jsx";
import ProBuildsRegion from "@/game-tft/ProBuildsRegion.jsx";

function ProBuildsPlayerInfo({ profileIconId, summonerName, region, leagues }) {
  const league = leagues && leagues[0];
  return (
    <PlayerInfoContainer>
      <ProBuildsProfileImage
        height="36"
        width="36"
        src={StaticLOL.getProfileIcon(profileIconId)}
      />
      <ProBuildsPlayerDetails>
        <Body2>{summonerName}</Body2>
        <div
          className={css`
            display: flex;
            align-items: center;
          `}
        >
          <ProBuildsRegion region={region} />
          {league ? <ProBuildsRank league={league} /> : null}
        </div>
      </ProBuildsPlayerDetails>
    </PlayerInfoContainer>
  );
}

export default memo(ProBuildsPlayerInfo);
