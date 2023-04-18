import React from "react";
import { css, styled } from "goober";

import PostMatchScoreboardMatchTraitList from "@/game-tft/PostMatchScoreboardMatchTraitList.jsx";
import PostMatchScoreboardMatchUnitList from "@/game-tft/PostMatchScoreboardMatchUnitList.jsx";
import PostMatchScoreboardRank from "@/game-tft/PostMatchScoreboardRank.jsx";
import PlayerDamageIcon from "@/inline-assets/tft-player-damage.svg";
import PlayerEliminationIcon from "@/inline-assets/tft-player-elimination.svg";
import PlayerGoldRemainingIcon from "@/inline-assets/tft-player-gold-remaining.svg";
import RoundEliminationIcon from "@/inline-assets/tft-round-elimination.svg";

function PostMatchScoreboardScore({
  playerName,
  placement,
  avatar = "",
  summonerName,
  summonerRegion,
  leagues,
  units,
  traits,
  matchSet,
  goldRemaining,
  playersEliminated,
  playerDamage,
  roundEliminated,
}) {
  return (
    <TFTScoreContainer
      role="button"
      className={playerName === summonerName && currentProfilePlayer}
      href={`/tft/profile/${summonerRegion}/${summonerName}`}
    >
      <TFTScoreLeftBorder />
      <TFTScoreHighlight />
      <Grid>
        <TFTScoreProfile>
          <TFTScorePlacement>{placement}</TFTScorePlacement>
          <TFTScoreProfile>
            <TFTScoreAvatar url={avatar} />
            <TFTUser>
              <TFTScoreUsername>{summonerName}</TFTScoreUsername>
              {leagues ? (
                <TFTScoreRank>
                  <PostMatchScoreboardRank leagues={leagues} />
                </TFTScoreRank>
              ) : null}
            </TFTUser>
          </TFTScoreProfile>
        </TFTScoreProfile>
        <TFTScoreUnits>
          <PostMatchScoreboardMatchUnitList
            units={units}
            unitSize={26}
            set={matchSet}
          />
        </TFTScoreUnits>
        <TFTScoreTraits>
          <PostMatchScoreboardMatchTraitList
            traits={traits.slice(0, 9)}
            set={matchSet}
          />
        </TFTScoreTraits>
        <TFTIconWithText>
          <PlayerGoldRemainingIcon />
          <span>{goldRemaining}</span>
        </TFTIconWithText>
        <TFTIconWithText>
          <PlayerEliminationIcon />
          <span>{playersEliminated}</span>
        </TFTIconWithText>
        <TFTIconWithText>
          <PlayerDamageIcon />
          <span>{playerDamage}</span>
        </TFTIconWithText>
        <TFTIconWithText>
          <RoundEliminationIcon />
          <span>{roundEliminated}</span>
        </TFTIconWithText>
      </Grid>
    </TFTScoreContainer>
  );
}

export default PostMatchScoreboardScore;

export const TFTScoreboard = styled("div")({
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

const TFTScoreLeftBorder = styled("div")({
  background: "var(--yellow)",
  width: "4px",
  height: "100%",
  position: "absolute",
  opacity: 0,
  top: 0,
  left: 0,
});

const TFTScoreHighlight = styled("div")({
  background:
    "linear-gradient(270deg, rgba(239, 191, 108, 0) 0%, #EFBF6C 100%)",
  height: "100%",
  maxWidth: "479px",
  width: "100%",
  position: "absolute",
  opacity: 0,
  top: 0,
  left: 0,
  zIndex: 0,
});

const TFTScoreAvatar = styled("div")(({ url }) => ({
  backgroundImage: `url(${url})`,
  backgroundColor: "var(--shade7)",
  backgroundSize: "cover",
  width: "38px",
  height: "38px",
  borderRadius: "100%",
  flexShrink: 0,
  border: "2px solid var(--shade5)",
}));

const TFTScorePlacement = styled("p")({
  fontSize: "var(--sp-3)",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
});

const TFTScoreUsername = styled("p")({
  fontSize: "var(--sp-3_5)",
  fontWeight: "bold",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const currentProfilePlayer = css`
  ${TFTScoreLeftBorder} {
    opacity: 1;
  }
  ${TFTScoreHighlight} {
    opacity: 0.15;
  }
  ${TFTScoreAvatar} {
    border: 2px solid var(--yellow);
  }
  ${TFTScorePlacement} {
    color: var(--yellow);
  }
  ${TFTScoreUsername} {
    color: var(--yellow);
  }
`;

const TFTScoreContainer = styled("a")`
  height: 68px;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  &:not(${currentProfilePlayer}):hover {
    ${TFTScoreUsername} {
      color: var(--shade2);
    }
    ${TFTScorePlacement} {
      color: var(--shade2);
    }
    ${TFTScoreAvatar} {
      border-color: var(--shade2);
    }
  }
`;

const TFTIconWithText = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--sp-1)",
});

const TFTScoreProfile = styled("div")({
  display: "flex",
  gap: "var(--sp-2)",
  alignItems: "center",
  color: "var(--shade3)",
  width: "100%",
  overflow: "hidden",
});

const TFTScoreRank = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "var(--sp-1)",
  fontSize: "var(--sp-1)",
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  svg: {
    flexShrink: 0,
    fontSize: "var(--sp-3)",
  },
});

const TFTScoreUnits = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--sp-1)",
});

const TFTScoreTraits = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
});

const TFTUser = styled("div")({
  overflow: "hidden",
});

const Grid = styled("div")`
  width: 100%;
  gap: 4px;
  padding-left: 16px;
  z-index: 1;
  display: grid;
  grid-template-columns: ${[
    "2fr",
    "3fr",
    "1fr",
    "1fr",
    "1fr",
    "1fr",
    "1fr",
  ].join(" ")};
`;
