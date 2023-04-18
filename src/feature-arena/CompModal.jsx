import React from "react";
import { styled } from "goober";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import { hideModal } from "@/feature-arena/m-actions.mjs";

export const Modal = () => {
  const { arena } = useSnapshot(readState);
  if (!arena) return null;
  const { visible, renderContent, options } = arena.modal;
  const { backdrop, onClickBackground, className } = options || {};

  const onClickBack = () => {
    if (backdrop) hideModal();
    onClickBackground?.();
  };

  const onClickChild = (e) => e.stopPropagation();

  if (!visible || !renderContent || typeof renderContent !== "function")
    return null;

  return (
    <Container onClick={onClickBack} className={className}>
      <div onClick={onClickChild}>{renderContent()}</div>
    </Container>
  );
};

const Container = styled("div")`
  position: fixed;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  inset: 0px;
  height: 100%;
  width: 100%;
  z-index: 999;
  background: var(--shade10-75);
  backdrop-filter: blur(2px);
`;
