import React, { useMemo } from "react";
import { styled } from "goober";

import { readState } from "@/__main__/app-state.mjs";
import { GAME_SYMBOL_BY_SHORT_NAME } from "@/app/constants.mjs";
import NavProfileItem from "@/app/NavProfileItem.jsx";

const Container = styled("div")`
  flex: 1;
  display: flex;
  flex-flow: column;
  padding: var(--sp-3);
  gap: var(--sp-1);
`;

const NavProfiles = () => {
  const state = readState;
  const {
    settings: { loggedInAccounts },
    volatile: { currentSummoner },
  } = state;

  const currentAccounts = new Set([currentSummoner]);

  const allProfiles = useMemo(() => {
    const profiles = [];
    for (const gameKey in loggedInAccounts) {
      const gameProfiles = loggedInAccounts[gameKey];
      const symbol = GAME_SYMBOL_BY_SHORT_NAME[gameKey];

      for (const derivedId in gameProfiles) {
        const profile = gameProfiles[derivedId];
        profiles.push({
          ...profile,
          symbol,
          derivedId,
        });
      }
    }

    return profiles;
  }, [loggedInAccounts]);

  return (
    <Container>
      {allProfiles.map((profile) => (
        <NavProfileItem
          key={profile.derivedId}
          profile={profile}
          isCurrentLoggedIn={currentAccounts.has(profile.derivedId)}
        />
      ))}
    </Container>
  );
};

export default NavProfiles;
