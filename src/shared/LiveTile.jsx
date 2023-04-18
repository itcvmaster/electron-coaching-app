import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { formatDuration } from "@/app/util.mjs";
import { ProfileMatch } from "@/shared/ProfileMatch.jsx";

export const LiveGradient = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  background: linear-gradient(
    to right,
    hsla(var(--turq-hsl) / 0.15) 0%,
    transparent 100%
  );
  border-top-left-radius: var(--br);
  border-bottom-left-radius: var(--br);
  z-index: -1;
`;

const LiveTeams = styled("div")`
  display: flex;
  align-items: center;
`;
const Team = styled("div")`
  display: flex;

  /* Border colors for players */
  .teammate {
    border: 2px solid var(--turq);
  }
  .enemy {
    border: 2px solid var(--red);
  }
  .user {
    border: 2px solid var(--yellow);
  }
`;

const Vs = styled("div")`
  margin: 0 1em;
  text-transform: uppercase;
  color: var(--shade5);
`;

const Player = styled("div")`
  display: flex;
  flex-direction: column;
  margin-left: -4px;
  align-items: center;
  justify-content: center;

  &:first-of-type {
    margin: 0;
  }

  img {
    border-radius: 50%;
    height: 26px;
    width: 26px;
  }
  svg {
    height: var(--sp-4);
    width: var(--sp-4);
    margin-top: var(--sp-1);
  }
`;

const MatchSubstat = styled("div")`
  color: var(--shade2);
`;

const LiveTile = ({
  title,
  queueType,
  startTime,
  myTeam,
  otherTeam,
  image,
}) => {
  const { t } = useTranslation();
  const [timepassed, setTimePassed] = useState(
    formatDuration(Date.now() - startTime * 1000, "mm:ss")
  );

  useEffect(() => {
    const setTime = () => {
      setTimeout(() => {
        setTimePassed(formatDuration(Date.now() - startTime * 1000, "mm:ss"));
        setTime();
      }, 1000);
    };
    setTime();
  }, [startTime]);

  return (
    <ProfileMatch image={image}>
      <LiveGradient />
      <div>
        <div style={{ color: "var(--turq)" }}>{title}</div>
        <MatchSubstat>
          {queueType ? (
            <span style={{ marginRight: `var(--sp-2)` }}>{queueType}</span>
          ) : null}
          {timepassed ? <span>{timepassed}</span> : null}
        </MatchSubstat>
      </div>
      {myTeam?.length ? (
        <LiveTeams>
          <Team>
            {myTeam.map((entry) => {
              const { id, ImgComponent, RankComponent } = entry;
              return (
                <Player key={id}>
                  {ImgComponent}
                  {RankComponent}
                </Player>
              );
            })}
          </Team>
          {otherTeam?.length ? (
            <>
              <Vs>{t("common:vs", "vs")}</Vs>
              <Team>
                {otherTeam.map((entry) => {
                  const { id, ImgComponent, RankComponent } = entry;
                  return (
                    <Player key={id}>
                      {ImgComponent}
                      {RankComponent}
                    </Player>
                  );
                })}
              </Team>
            </>
          ) : null}
        </LiveTeams>
      ) : null}
    </ProfileMatch>
  );
};

export default LiveTile;
