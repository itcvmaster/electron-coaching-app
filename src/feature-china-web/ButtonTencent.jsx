import React from "react";
import { css } from "goober";

import { Button } from "clutch";

import TencentIcon from "@/inline-assets/tencent-icon-with-vertical-bar.svg";

const stringData = {
  msg: "守则",
};

const BtnStyle = css`
  width: 100%;
  height: var(--sp-11);
  box-shadow: inset 0px 1px 0px rgb(227 229 234 / 25%);
  .icon-left > svg {
    width: var(--sp-26);

    > path {
      stroke-width: 1;
    }
  }
`;

const TencentButton = ({ onClick, text }) => {
  return (
    <Button
      className={BtnStyle}
      onClick={onClick}
      text={text || stringData.msg}
      iconLeft={<TencentIcon />}
      bgColor="var(--shade3)"
      bgColorHover="var(--shade3)"
      textColor="var(--shade0)"
      textColorHover="var(--shade0)"
    />
  );
};

export default TencentButton;
