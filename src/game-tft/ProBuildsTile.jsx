import React, { memo } from "react";

import {
  MatchBorder,
  MatchContainer,
  MatchMainInfo,
} from "@/game-tft/CommonComponents.jsx";
import MetaData from "@/game-tft/MetaData.jsx";
import ProBuildsPlacementInfo from "@/game-tft/ProBuildsPlacementInfo.jsx";
import ProBuildsPlayerInfo from "@/game-tft/ProBuildsPlayerInfo.jsx";

function Tile({
  matchid,
  placement,
  name,
  region,
  wins,
  losses,
  leagues,
  patch,
  createdAt,
  companionImage,
  children,
  profileIconId,
  isOutOfDate,
  viewMode,
  traitsListFull,
  traitsList,
  buildDetails,
}) {
  return (
    <MatchContainer
      href={`/tft/match/${region}/${name}/${matchid}/performance`}
      companion={companionImage}
      className={isOutOfDate ? "out-of-date" : ""}
    >
      <div className="bg-companion" />
      <MatchMainInfo>
        <MatchBorder placement={placement} />
        {viewMode === "tablet" ? (
          <div className="tablet-container">
            <div className="tablet-content__main">
              <ProBuildsPlayerInfo
                profileIconId={profileIconId}
                summonerName={name}
                region={region}
                leagues={leagues}
              />
              <ProBuildsPlacementInfo
                placement={placement}
                wins={wins}
                losses={losses}
              />
              {traitsListFull}
              <MetaData patch={patch} createdAt={createdAt} />
            </div>
            <div className="tablet-content__units">{children}</div>
          </div>
        ) : viewMode === "mobile" ? (
          <div className="mobile-container">
            <div className="mobile-content__player-info">
              <ProBuildsPlayerInfo
                profileIconId={profileIconId}
                summonerName={name}
                region={region}
                leagues={leagues}
              />
              {traitsList}
            </div>
            <div className="mobile-content__match-stats">
              <ProBuildsPlacementInfo
                placement={placement}
                wins={wins}
                losses={losses}
              />
              {buildDetails}
              <MetaData patch={patch} createdAt={createdAt} />
            </div>
            <div className="mobile-content__units">{children}</div>
          </div>
        ) : (
          <>
            <ProBuildsPlayerInfo
              profileIconId={profileIconId}
              summonerName={name}
              region={region}
              leagues={leagues}
            />
            <ProBuildsPlacementInfo
              placement={placement}
              wins={wins}
              losses={losses}
            />
            {children}
            <MetaData patch={patch} createdAt={createdAt} />
          </>
        )}
      </MatchMainInfo>
    </MatchContainer>
  );
}

export default memo(Tile);
