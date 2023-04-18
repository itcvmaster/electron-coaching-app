import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button, mobile } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import { Body2 } from "@/game-lol/CommonComponents.jsx";
import { IS_APP } from "@/util/dev.mjs";

const DownloadBlitzTitleText = styled("div")`
  max-width: 400px;
  margin: var(--sp-2_5) 0;
  font-weight: 700;
  font-size: var(--sp-7);
  line-height: var(--sp-9);
  display: flex;
  align-items: center;

  ${mobile} {
    box-sizing: border-box;
    font-size: 0.875rem;
    line-height: var(--sp-4);
    max-width: 210px;
  }
`;
const DownloadBlitzBodyText = styled(Body2)`
  display: flex;
  color: var(--shade1);

  ${mobile} {
    text-align: center;
    width: 100%;
    max-width: none;
    display: none;
  }
`;

const DownloadBlitzTextContainer = styled("div")`
  z-index: 2;
  font-size: var(--sp-4);
  margin-bottom: 0px;
`;
const DownloadBlitzBtnContainer = styled("div")`
  z-index: 2;
`;

const DownloadBlitzHorizontalContainer = styled("div")`
  display: flex;
  flex-direction: row;
  position: relative;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  color: var(--shade0);
  border-left: 4px solid var(--red);
  box-sizing: border-box;
  z-index: 1;

  > * {
    position: relative;
  }

  ${mobile} {
    min-height: unset;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("${appURLs.CDN}/blitz/dl/champ/matchup_counter.png")
      no-repeat right;
    background-size: cover;
    filter: saturate(0);
    opacity: 0.5;
  }

  ${DownloadBlitzTextContainer} {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    padding-top: var(--sp-3);
    padding-bottom: var(--sp-3);
    padding-left: 1.875rem;

    ${DownloadBlitzBodyText} {
      width: 312px;
    }

    ${mobile} {
      min-height: 60px;
      padding-top: 0px;
      padding-bottom: 0px;
      padding-left: 15px;
      justify-content: center;
      flex-shrink: 1;
      align-items: flex-start;
      width: 50%;
    }
  }
  ${DownloadBlitzBtnContainer} {
    min-width: 200px;
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: var(--sp-5);
    padding-bottom: var(--sp-5);
    flex-shrink: 0;
    ${mobile} {
      min-width: unset;
      justify-content: center;
      align-items: center;
      padding: 10px 0px;
    }
  }
`;

const DownloadBlitzBlockContainer = styled("div")`
  width: 100%;
  padding: 20px var(--sp-2_5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  border-radius: var(--br);
  overflow: hidden;
  background-image: url("${appURLs.CDN}/blitz/dl/champ/block.png");
  background-color: var(--shade7);
  background-position: right center;
  background-repeat: no-repeat;
  ${DownloadBlitzTitleText} {
    width: 100%;
    font-style: normal;
    font-weight: bold;
    font-size: var(--sp-4);
    line-height: var(--sp-6);
    text-align: center;
    margin-bottom: var(--sp-2_5);
  }
  ${mobile} {
    flex-direction: row;
    padding: 15px var(--sp-5);
    background-color: rgba(0, 0, 0, 0.5);
    ${DownloadBlitzTextContainer} {
      width: 100%;
      padding-right: 40px;
    }
    ${DownloadBlitzBtnContainer} {
    }

    ${DownloadBlitzTitleText} {
      font-size: 0.875rem;
      line-height: var(--sp-4);
      text-align: left;
      margin-bottom: 0px;
    }
  }
`;

/**
 * DownloadBlitzHorizontal component.
 *  2 kinda looks. whether isHorizontal is true or false
 * @param {*} isHorizontal: if true, big component used in Recommended build of Champion overview page.
 *                          otherwise, small component used in Promatches list of Champion overview page.
 */
const DownloadBlitzHorizontal = ({ title, body, buttonText, isHorizontal }) => {
  const { t } = useTranslation();

  if (IS_APP) return null;

  const titleTranslated =
    title || isHorizontal
      ? t("lol:ads.getThisBuild", "Get this build directly in your client.")
      : t(
          "lol:ads.matchupAndCounter",
          "Get matchup and counter information in Drafting"
        );
  const bodyTranslated =
    isHorizontal &&
    (body ||
      t(
        "lol:ads.saveFiveMinutes",
        "Save 5 minutes of searching, setting runes, and shifting between tabs."
      ));
  const buttonTextTranslated =
    buttonText || isHorizontal
      ? t("lol:ads.downloadApp", "Download the Blitz App")
      : t("lol:ads.download", "Download");

  const DownloadBlitzContainer = isHorizontal
    ? DownloadBlitzHorizontalContainer
    : DownloadBlitzBlockContainer;

  return (
    <DownloadBlitzContainer>
      <DownloadBlitzTextContainer>
        <DownloadBlitzTitleText>{titleTranslated}</DownloadBlitzTitleText>
        {bodyTranslated && (
          <DownloadBlitzBodyText>{bodyTranslated}</DownloadBlitzBodyText>
        )}
      </DownloadBlitzTextContainer>
      <DownloadBlitzBtnContainer>
        <Button
          text={buttonTextTranslated}
          bgColor="var(--primary)"
          textColor="var(--white)"
          bgColorHover="var(--primary)"
          textColorHover="var(--white)"
        />
      </DownloadBlitzBtnContainer>
    </DownloadBlitzContainer>
  );
};

export default DownloadBlitzHorizontal;
