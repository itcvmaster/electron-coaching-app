import React from "react";
import { css } from "goober";

import { appURLs } from "@/app/constants.mjs";

export default function TftHexPrismatic() {
  return (
    <img
      alt="prismatic"
      className={css`
        filter: drop-shadow(0px 0px 6px rgba(226, 244, 254, 0.6));
      `}
      src={`${appURLs.CDN}/blitz/tft/Primatic.png`}
    />
  );
}
