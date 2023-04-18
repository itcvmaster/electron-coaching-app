import React from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import Container from "@/shared/ContentContainer.jsx";
import PageHeader from "@/shared/PageHeader.jsx";
import SharedProfile, {
  MatchList,
  MatchTile,
  UnknownPlayerHeader,
} from "@/shared/Profile.jsx";
import { ProfileBox, ProfileColumn } from "@/shared/Profile.style.jsx";
import { TimeAgo } from "@/shared/Time.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

const UnknownMatchHeader = styled(ProfileBox)`
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const UnknownMatch = styled("div")`
  display: flex;
  padding: var(--sp-4);
  justify-content: space-between;
  .outcome {
    font-weight: bold;
    &.win {
      color: var(--blue);
    }
    &.loss {
      color: var(--red);
    }
  }
  .time-ago {
    color: var(--shade2);
    font-size: 0.875em;
  }
`;

function Profile() {
  const state = useSnapshot(readState);
  const {
    parameters: [profileId],
  } = useRoute((prev, next) => prev.currentPath === next.currentPath);

  const profile = state.unknown.profiles[profileId];
  const matchList = state.unknown.matchLists[profileId];

  const profileError = profile instanceof Error ? profile : null;

  const displayName = profile?.name || profileId;

  const rankLabel = "Rank";
  const statsLabel = "Stats";

  return (
    <>
      {!profileError ? (
        <PageHeader
          title={displayName}
          image={profile?.icon}
          accentText={98}
          style={{ gridArea: "header" }}
        />
      ) : (
        <UnknownPlayerHeader />
      )}
      <Container>
        <SharedProfile>
          <ProfileColumn className="sidebar">
            <ProfileBox style={{ height: 120 }}>
              <div className="placeholder">{rankLabel}</div>
            </ProfileBox>
            <ProfileBox style={{ height: 320 }}>
              <div className="placeholder">{statsLabel}</div>
            </ProfileBox>
          </ProfileColumn>
          <ProfileColumn className="main">
            <UnknownMatchColumn matchList={matchList} />
          </ProfileColumn>
        </SharedProfile>
      </Container>
    </>
  );
}

function UnknownMatchColumn({ matchList }) {
  const state = useSnapshot(readState);
  const victoryLabel = "Victory";
  const lossLabel = "Loss";
  const matchListLabel = "Matchlist Header";

  return (
    <>
      <UnknownMatchHeader>
        <div className="placeholder">{matchListLabel}</div>
      </UnknownMatchHeader>
      <ProfileBox className="match-list">
        <MatchList matchList={matchList}>
          {(matchList?.matches || []).map((matchlistItem) => {
            const match = state.unknown.matches[matchlistItem.id]; // eslint-disable-line valtio/state-snapshot-rule
            const hasMatch = match && !(match instanceof Error);
            const matchRoute = `/unknown/match/${matchlistItem.id}`;

            return (
              <MatchTile
                height={70}
                id={matchlistItem.id}
                key={matchlistItem.id}
                match={match}
                matchRoute={matchRoute}
              >
                {hasMatch ? (
                  <UnknownMatch>
                    <span
                      className={`outcome ${match.isWinner ? "win" : "loss"}`}
                    >
                      {match.isWinner ? victoryLabel : lossLabel}
                    </span>
                    <span className="time-ago">
                      <TimeAgo date={match.timestamp} />
                    </span>
                  </UnknownMatch>
                ) : null}
              </MatchTile>
            );
          })}
        </MatchList>
      </ProfileBox>
    </>
  );
}

export function meta([name]) {
  return {
    title: ["common:unknownProfile", "{{name}} - unknown profile", { name }],
    description: ["common:unknownProfileDescription", "player stats"],
  };
}

export default Profile;
