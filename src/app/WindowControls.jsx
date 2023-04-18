import React, { useCallback } from "react";
import { styled } from "goober";

import blitzMessage, { EVENTS } from "@/__main__/ipc-core.mjs";
import CloseIcon from "@/inline-assets/close.svg";
import MaximizeIcon from "@/inline-assets/maximize.svg";
import MinimizeIcon from "@/inline-assets/minimize.svg";
import { IS_APP } from "@/util/dev.mjs";
import getOsType from "@/util/get-os-type.mjs";

const Wrapper = styled("div")`
  position: fixed;
  display: flex;
  width: var(--toolbar-width);
  pointer-events: all;
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  top: 0;
  right: 0;
  z-index: 30;
`;
const Item = styled("button")`
  --bg: transparent;
  --svg: var(--shade2);
  flex: 1;
  display: grid;
  place-content: center;
  padding: 0;
  height: var(--sp-8);
  border: none;
  background: var(--bg);
  cursor: pointer;

  &:hover {
    --bg: var(--shade1-15);
    --svg: var(--shade0);

    &.close {
      --bg: var(--primary);
    }
  }

  &.maximize svg {
    fill: none;
    stroke-width: 1px;
  }

  svg {
    stroke: var(--svg);
    fill: var(--svg);
    width: var(--sp-4_5);
    height: var(--sp-4_5);
  }
`;

const Controls = () => {
  const platform = getOsType();
  const execute = useCallback((type) => {
    blitzMessage(type, null);
  }, []);
  if (!IS_APP || platform !== "win32") return null;
  return (
    <Wrapper>
      <Item className="minimize" onClick={() => execute(EVENTS.APP_MINIMIZE)}>
        <MinimizeIcon />
      </Item>
      <Item className="maximize" onClick={() => execute(EVENTS.APP_MAXIMIZE)}>
        <MaximizeIcon />
      </Item>
      <Item className="close" onClick={() => execute(EVENTS.APP_CLOSE)}>
        <CloseIcon />
      </Item>
    </Wrapper>
  );
};

export default Controls;
