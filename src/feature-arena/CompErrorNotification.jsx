import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { clearError } from "@/feature-arena/m-actions.mjs";
import { getManagedError } from "@/feature-arena/m-utils.mjs";
import Warning from "@/inline-assets/Warning.svg";

const ErrorNotification = ({ id }) => {
  const state = useSnapshot(readState);
  const { t } = useTranslation();
  const joinResult = state.arena.joinResult?.[id];
  if (!(joinResult instanceof Error)) return null;

  const onConfirm = () => {
    clearError(id);
  };

  const errorMessage = getManagedError(joinResult);

  return (
    <Container>
      <Warning />
      <ErrorText className="type-form--button">{t(...errorMessage)}</ErrorText>
      <ConfirmText onClick={onConfirm}>
        {t("arena:error.got_it", "Ok, got it!")}
      </ConfirmText>
    </Container>
  );
};

export default ErrorNotification;

const Container = styled("div")`
  width: 100%;
  height: var(--sp-12);
  background: var(--primary-15);
  border-radius: var(--br);
  padding: var(--sp-2) var(--sp-3);
  display: flex;
  align-items: center;
  margin-top: var(--sp-6);
`;

const ErrorText = styled("div")`
  color: var(--shade0);
  margin: 0 var(--sp-3);
  flex: 1;
`;

const ConfirmText = styled("div")`
  color: var(--shade1);
  cursor: pointer;
`;
