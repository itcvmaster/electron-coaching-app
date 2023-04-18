import React from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import SharedMatch from "@/shared/Match.jsx";
import { useRoute } from "@/util/router-hooks.mjs";

function Match() {
  const state = useSnapshot(readState);
  const {
    parameters: [matchId],
  } = useRoute();

  const match = state.unknown.matches[matchId];

  const matchError = match instanceof Error ? match : null;

  return (
    <SharedMatch match={match}>
      {match && !matchError ? (
        <>
          <p>{match.id}</p>
          <p>{match.isWinner.toString()}</p>
          <p>{match.timestamp}</p>
        </>
      ) : null}
    </SharedMatch>
  );
}

export function meta([id]) {
  return {
    title: ["common:unknownMatch", "unknown match {{id}}", { id }],
    description: ["common:unknownMatchDescription", "unknown match"],
  };
}

export default Match;
