import React from "react";
import { styled } from "goober";

import BlitzLogo from "@/inline-assets/blitz-logo.svg";

const Container = styled("div")`
  height: calc(var(--content-window-height) - var(--content-header-height));
  display: grid;
  place-content: center;
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

function TemporaryHome() {
  /* eslint-disable i18next/no-literal-string */
  return (
    <Container>
      <Content>
        <BlitzLogo />
        <p>Hi,</p>
        <p>
          You shouldn&apos;t even be seeing this page, it&apos;s reserved for
          marketing / home page, and it&apos;s not done yet. Here&apos;s a cat
          🐱
        </p>
        <p>
          <br />
          &mdash; Blitz.gg staff
        </p>
      </Content>
    </Container>
  );
  /* eslint-enable i18next/no-literal-string */
}

export function meta() {
  return {
    title: ["common:blitz", "Blitz App - Your personal gaming coach"],
    description: ["home:downloadLanding.description", "Play smart."],
  };
}

export default TemporaryHome;
