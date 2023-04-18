/*eslint-disable i18next/no-literal-string*/
import React from "react";

import ExclamationIcon from "@/inline-assets/exclamation-mark.svg";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import {
  ErrorIconContainer,
  MatchLink,
  MatchTileEmptyContainer,
} from "@/shared/Match.style.jsx";

export function MatchLoading() {
  return (
    <MatchTileEmptyContainer>
      <LoadingSpinner />
    </MatchTileEmptyContainer>
  );
}

export function MatchError() {
  return (
    <ErrorIconContainer>
      <ExclamationIcon width={40} height={40} />
    </ErrorIconContainer>
  );
}

function Match({ children, match, matchRoute }) {
  const matchError = match instanceof Error ? match : null;

  return (
    <>
      {matchRoute ? <MatchLink href={matchRoute} /> : null}
      {matchError ? <MatchError /> : !match ? <MatchLoading /> : children}
    </>
  );
}

export default Match;
