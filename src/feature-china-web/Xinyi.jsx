import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, mobileSmall } from "clutch";

import { Container, View } from "@/feature-china-web/common-styles.mjs";
import ContentHeader from "@/feature-china-web/ContentHeader.jsx";
import Footer from "@/feature-china-web/Footer.jsx";
import {
  backgroundImg,
  leftImg,
  rightImg,
  TencentReskin,
} from "@/feature-china-web/media-assets.mjs";
import ScrollToTop from "@/feature-china-web/ScrollToTop.jsx";
import SplashSlider from "@/feature-china-web/SplashSlider.jsx";
import VideoBlock from "@/feature-china-web/Video.jsx";
import DownloadBlitz from "@/game-lol/DownloadBlitz.jsx";
import BlitzWindowsIcon from "@/inline-assets/blitz-win-icon.svg";
import TencentIcon from "@/inline-assets/tencent-icon.svg";

const Xinyi = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Navigation Header */}
      <ContentHeader />

      <MainView>
        <ScrollToTop />

        {/* Intro Section */}
        <FirstSection>
          <BackgroundImage src={backgroundImg} />
          <LeftImage src={leftImg} />
          <RightImage src={rightImg} />
          <IntroductionContainer>
            <h1>{t("home:sudaoshi", "速到师——你的LOL教练")}</h1>
            <h4>{t("home:withXinyi", "马上下载，跟 Xinyi 排位飞升")}</h4>
            <DownloadBlitz
              className={"china-download"}
              iconLeft={<BlitzWindowsIcon />}
              buttonText={t("home:downloadPCVersion", "PC版下载")}
            />
            <TencentIconContainer>
              <TencentIcon />
              <div className="vert-bar"></div>
              <p>{t("lol:tencentCode", "守则")}</p>
            </TencentIconContainer>
          </IntroductionContainer>
        </FirstSection>

        {/* Slider Features */}
        <SplashSlider />

        {/* Video Section */}
        <VideoBlock
          eventCategory={"blitzLolHomepage-lolVideo"}
          minHeight={`1100px`}
          url={TencentReskin}
        />
      </MainView>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function meta() {
  return {
    title: ["home:sudaoshi", "速到师——你的LOL教练"],
    description: ["home:withXinyi", "马上下载，跟 Xinyi 排位飞升"],
  };
}

export default Xinyi;

const TencentIconContainer = styled("div")`
  display: flex;
  margin-top: var(--sp-8);
  align-items: center;
  p {
    font-size: var(--sp-3_5);
    line-hegith: var(--sp-6);
  }
  .vert-bar {
    width: 1px;
    height: var(--sp-3_5);
    background: var(--white);
    margin: auto var(--sp-4);
  }

  ${mobileSmall} {
    margin-top: var(--sp-4);
  }
`;

const IntroductionContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;

  h1 {
    font-weight: 900;
    font-size: var(--sp-18);
    line-height: 120px;
  }

  h4 {
    font-weight: bold;
    font-size: var(--sp-7);
    line-height: var(--sp-10);
    padding-top: var(--sp-2_5);
  }

  .horizon-bar {
    margin-top: auto;
    margin-bottom: auto;
    width: var(--sp-15);
    height: var(--sp-1);
    background: var(--white);
  }
  ${mobile} {
    h1 {
      max-width: 430px !important;
    }
  }
  ${mobileSmall} {
    h1 {
      font-size: var(--sp-15);
      line-height: var(--sp-18);
    }
    h4 {
      font-size: var(--sp-4);
      line-height: var(--sp-6);
      padding-top: var(--sp-6);
    }
  }

  .china-download {
    margin-top: var(--sp-10);
    background-color: transparent;
    ${HD} {
      margin-top: var(--sp-8);
    }
    &::before {
      background-image: none;
    }
    button {
      width: 291px;
      height: var(--sp-11);

      ${mobile} {
        width: 256px;
      }
    }
  }
`;

const LeftImage = styled("img")`
  position: absolute;
  left: 0;
  top: 0;
  height: 768px;
  ${mobileSmall} {
    height: 568px;
  }
`;

const RightImage = styled("img")`
  position: absolute;
  right: 0;
  top: 0;
  height: 768px;
  ${mobile} {
    display: none;
  }
`;

const BackgroundImage = styled("img")`
  width: 100%;
  height: 768px;
  position: absolute;
  left: 0;
  top: 0;
  ${mobileSmall} {
    height: 568px;
  }
`;

const MainView = styled(View)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  background-size: contain;
  color: var(--white);

  ${HD} {
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FirstSection = styled("div")`
  height: 768px;
  ${mobileSmall} {
    height: 568px;
  }
`;
