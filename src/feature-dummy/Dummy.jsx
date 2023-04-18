import React from "react";
import { styled } from "goober";

import BlitzLogo from "@/inline-assets/blitz-logo.svg";
import { useRoute } from "@/util/router-hooks.mjs";

const Container = styled("div")`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled("div")`
  max-width: 40em;
  svg {
    display: block;
    width: 2rem;
    height: 5rem;
  }
  p {
    margin-bottom: 1rem;
    color: var(--shade1);
    &:first-of-type,
    b {
      color: var(--shade0);
    }
  }
`;

function Dummy() {
  const route = useRoute();

  /* eslint-disable i18next/no-literal-string */
  return (
    <Container>
      <Content>
        <BlitzLogo />
        <p>
          This is a dummy route with a dummy component, for testing purposes
          only! It should demonstrate that feature flags can add routes and load
          before initializing the first route.
        </p>
        <p>{route.currentPath}</p>
        <p>
          <a href="/dummy/1">1</a>
          <span> - </span>
          <a href="/dummy/2">2</a>
          <span> - </span>
          <a href="/dummy/3">3</a>
        </p>
      </Content>
    </Container>
  );
  /* eslint-enable i18next/no-literal-string */
}

export function meta() {
  return {
    title: [null, "Dummy"],
    description: [null, "Dummy text."],
  };
}

export default Dummy;
