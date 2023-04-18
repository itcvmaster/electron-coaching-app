import React, { useEffect, useState } from "react";
import { styled } from "goober";
import i18n from "i18next";

import { Button } from "clutch";

import { readState } from "@/__main__/app-state.mjs";
import * as AuthActions from "@/feature-auth/auth-actions.mjs";
import { AuthClient } from "@/feature-auth/auth-client.mjs";
import { authTokenHandler } from "@/feature-auth/auth-token-handler.mjs";
import BlitzLogo from "@/inline-assets/blitz-logo.svg";
import { migrateSettings } from "@/settings/actions.mjs";
import { devWarn } from "@/util/dev.mjs";
import adjectives from "@/vendor/adjectives.json";
import animals from "@/vendor/animals.json";

const AUTH_STATES = Object.freeze({
  INITIAL: 0,
  WAITING_FOR_CONFIRMATION: 1,
  CONFIRMED: 2,
  ERROR: 3,
});

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

export default function Auth() {
  const [authState, setAuthState] = useState(AUTH_STATES.INITIAL);
  const [secretCode, setSecretCode] = useState("");
  const emailRef = React.createRef();

  useEffect(() => {
    (async () => {
      if ((await authTokenHandler.getToken()) && readState.user) {
        setAuthState(AUTH_STATES.CONFIRMED);
      }
    })();
  }, []);

  const sendAuthEmail = () => {
    const sharedSecret = [adjectives, animals]
      .map((list) => {
        return list[Math.floor(Math.random() * list.length)];
      })
      .join(" ");
    setSecretCode(sharedSecret);
    const authClient = new AuthClient();
    authClient
      .startAuthProcess(emailRef.current.value, i18n.language, sharedSecret)
      .then((result) => onSuccessfulAuth(result.data.sendAuthEmail))
      .catch((error) => onFailedAuth(error));
    setAuthState(AUTH_STATES.WAITING_FOR_CONFIRMATION);
    return null;
  };

  const logout = async () => {
    AuthClient.invalidateToken(await authTokenHandler.getToken());
    authTokenHandler.unsetToken();
    setAuthState(AUTH_STATES.INITIAL);
  };

  const onSuccessfulAuth = ({ authToken, authTokenExpiry, user }) => {
    // set settings based on the user specific settings
    if (user.persistence) {
      migrateSettings(user);
    }

    AuthActions.setUserAction(user);
    authTokenHandler.setToken(authToken, authTokenExpiry);

    setAuthState(AUTH_STATES.CONFIRMED);
  };

  const onFailedAuth = (error) => {
    if (error) {
      devWarn(error);
      setAuthState(AUTH_STATES.ERROR);
    } else {
      // was aborted
      setAuthState(AUTH_STATES.INITIAL);
    }
  };

  /* eslint-disable i18next/no-literal-string */
  return (
    <Container>
      {authState === AUTH_STATES.INITIAL && (
        <Content>
          <BlitzLogo />
          <p>Type your email adress to receive an authentication mail</p>
          <p>Email Adress</p>
          <input
            type="text"
            ref={emailRef}
            placeholder="my.email@adress.com"
            style={{ color: "#000", width: "500px" }}
          ></input>
          &nbsp;
          <Button
            onClick={sendAuthEmail}
            //TODO: use translation
            text={"Send auth mail"}
          />
        </Content>
      )}

      {authState === AUTH_STATES.WAITING_FOR_CONFIRMATION && (
        <Content>
          <BlitzLogo />
          <p>Check your mail, Waiting for confirmation</p>
          <p>
            Secret: <b>{secretCode}</b>
          </p>
        </Content>
      )}

      {authState === AUTH_STATES.CONFIRMED && (
        <Content>
          <BlitzLogo />
          <p>Logged in as {readState.user.email}!</p>
          <Button
            onClick={logout}
            //TODO: use translation
            text={"logout"}
          />
        </Content>
      )}

      {authState === AUTH_STATES.ERROR && (
        <Content>
          <BlitzLogo />
          <p>Error!</p>
          <p>Check the dev logs</p>
        </Content>
      )}
    </Container>
  );
  /* eslint-enable i18next/no-literal-string */
}
