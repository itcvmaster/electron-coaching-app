import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import { Body2, Link } from "@/game-lol/CommonComponents.jsx";
import { IS_APP } from "@/util/dev.mjs";

const DownloadBlitzContainer = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--shade10);
  padding: var(--sp-3) var(--sp-4);

  > * {
    position: relative;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("${appURLs.CDN}/blitz/dl/champ/block.png");
    filter: saturate(0.25);
    opacity: 0.5;
  }
`;

/**
 * DownloadBlitz component.
 *  Just one row component
 *  Used in champion probuilds page.
 */
const DownloadBlitz = ({
  adTitle,
  buttonStyles,
  buttonText,
  onClick,
  className,
  ...buttonProps
}) => {
  const { t } = useTranslation();

  if (IS_APP) return null;

  const btnInner = (
    <DownloadBlitzContainer className={className}>
      <Body2>{adTitle}</Body2>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          ...buttonStyles,
        }}
      >
        <Button
          type="link"
          text={
            buttonText || t("lol:ads.downloadApp", "Download the Blitz App")
          }
          bgColor="var(--primary)"
          textColor="var(--white)"
          bgColorHover="var(--primary)"
          textColorHover="var(--white)"
          {...buttonProps}
        />
      </div>
    </DownloadBlitzContainer>
  );
  if (onClick) return btnInner;

  return (
    <Link style={{ display: "block" }} href={"/download"}>
      {btnInner}
    </Link>
  );
};

export default DownloadBlitz;
