import React from "react";
import { css } from "goober";

import { Button } from "clutch";

import HeaderPcIcon from "@/inline-assets/blitz-win-icon.svg";

const stringData = {
  pcMsg: "PC版下载",
};

const BtnStyle = css`
  width: 100%;
  height: var(--sp-11);
`;

const DownloadButton = ({ onClick, text }) => {
  return (
    <Button
      onClick={onClick}
      text={text || stringData.pcMsg}
      iconLeft={<HeaderPcIcon />}
      bgColor="var(--primary)"
      bgColorHover="var(--primary)"
      textColor="var(--shade0)"
      textColorHover="var(--shade0)"
      className={BtnStyle}
    />
  );
};

export default DownloadButton;
