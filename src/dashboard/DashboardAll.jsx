import React from "react";
import { styled } from "goober";

const Container = styled("div")`
  max-width: var(--sp-container);
  margin: var(--sp-6) auto;
  color: var(--shade2);
`;

function DashboardAll() {
  /* eslint-disable i18next/no-literal-string */
  return <Container>Only LoL is implemented for this build.</Container>;
  /* eslint-enable i18next/no-literal-string */
}

export default DashboardAll;
