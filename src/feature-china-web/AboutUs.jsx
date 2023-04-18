import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, mobileSmall, tablet } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import {
  Container,
  LottieBgContainer,
  Root as _Root,
  View,
} from "@/feature-china-web/common-styles.mjs";
import ContentHeader from "@/feature-china-web/ContentHeader.jsx";
import Footer from "@/feature-china-web/Footer.jsx";
import GlobeRenderer from "@/feature-china-web/GlobeRenderer.jsx";
import PlanetLinesSvg from "@/inline-assets/planet-lines.svg";
import Sentinel from "@/shared/Sentinel.jsx";
import Lottie from "@/vendor/Lottie.jsx";
import lottiePattern1Data from "@/vendor/lottie-pattern-1.json";
import lottiePattern3Data from "@/vendor/lottie-pattern-3.json";
import lottieData from "@/vendor/lottie-we-blitzy.json";

const lottieOptions = {
  loop: false,
  autoplay: true,
  animationData: lottieData,
};

const lottiePattern1Options = {
  loop: false,
  autoplay: true,
  animationData: lottiePattern1Data,
};
const lottiePattern3Options = {
  loop: false,
  autoplay: true,
  animationData: lottiePattern3Data,
};

export function meta() {
  return {
    title: [null, "Blitz 关于我们"],
    description: [
      null,
      "Blitz是为玩家提供专业的分析数据，帮助他们提高水平、赢得胜利，从而增强他们的游戏体验。",
    ],
  };
}

const AboutUs = () => {
  const { t } = useTranslation();
  const [isBlock1Visible, setIsBlock1Visible] = useState(false);
  const [isBlock2Visible, setIsBlock2Visible] = useState(false);
  const [isBlock3Visible, setIsBlock3Visible] = useState(false);

  const handleVisible1 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock1Visible(visibility);
    }
  }, []);

  const handleVisible2 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock2Visible(visibility);
    }
  }, []);

  const handleVisible3 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock3Visible(visibility);
    }
  }, []);

  return (
    <Root>
      <ContentHeader />
      <MainView>
        <Container>
          <div className="text-block">
            <p>{t("home:aboutUs.title", "About Blitz")}</p>
            <p>
              {t(
                "home:aboutUs.subTitle",
                `Our Mission: Enhance gaming experiences by empowering players with expert analytics designed to help them improve and win more.`
              )}
            </p>
          </div>
          <Sentinel onVisible={handleVisible1} />
          {isBlock1Visible && (
            <LottieBgContainer>
              <Lottie {...lottieOptions} />
            </LottieBgContainer>
          )}
        </Container>
      </MainView>

      <Section className="section-1" $noBackground>
        <SectionContainer>
          <div className="text-block">
            <p className="text-block__subtitle">
              {t("home:aboutUs.section1.subTitle", "About Us")}
            </p>
            <p className="text-block__description">
              {t(
                "home:aboutUs.section1.description",
                `Blitz was created by pro players for all players. We intimately understand the pain points gamers struggle with and strive to solve them through expert analytics. We remove the complications of gaming through features and content delivered directly in game, in real time.`
              )}
            </p>
          </div>
          <div className="images-container">
            <img
              className="small-image"
              src={`${appURLs.CDN_PLAIN}/blitz/cn-about-us/about-us-section-1-small.png`}
              alt=""
            />
            <img
              className="main-image"
              src={`${appURLs.CDN_PLAIN}/blitz/cn-about-us/about-us-section-1.png`}
              alt=""
            />
          </div>
        </SectionContainer>
      </Section>

      <Section className="section-2" $textRight $blockBackground>
        <SectionTContainer>
          <img
            className="main-image-section2"
            src={`${appURLs.CDN_PLAIN}/blitz/cn-about-us/community-players.png`}
            alt=""
          />
          <div className="text-block">
            <p className="text-block__subtitle">
              {t("home:aboutUs.section2.subTitle", "The Company")}
            </p>
            <p className="text-block__description">
              {t(
                "home:aboutUs.section2.description",
                `We work hard and play to win. We’re millennials, boomers, zoomers, gaming veterans, young players, casual gamers, and esports fanatics. We’re constantly inspired by the future of gaming, and we’re eager to be a part of it.`
              )}
            </p>
          </div>
        </SectionTContainer>
      </Section>

      <section className="section-3">
        <Sentinel onVisible={handleVisible2} />
        {isBlock2Visible && (
          <LottieBgContainer>
            <Lottie {...lottiePattern1Options} />
          </LottieBgContainer>
        )}

        <Container>
          <div className="reason">
            {/* <img src={Reason1Icon} alt="" /> */}
            <p>
              {t("home:aboutUs.reason1.title", "Improving One Game at a Time")}
            </p>
            <p>
              {t(
                "home:aboutUs.reason1.description",
                "Every project at Blitz begins in an effort to improve the experience of the games we play."
              )}
            </p>
          </div>
          <div className="reason reason_why">
            <h2 className="main-caption">
              {t("home:aboutUs.reason.caption", "Improving One Game at a Time")}
            </h2>
          </div>
          <div className="reason">
            {/* <img src={Reason2Icon} alt="" /> */}
            <p>{t("home:aboutUs.reason2.title", "Being Impactful")}</p>
            <p>
              {t(
                "home:aboutUs.reason2.description",
                "With millions gamers around the world using Blitz every day, we strive to simplify and improve our users’ lives."
              )}
            </p>
          </div>
          <div className="reason">
            {/* <img src={Reason3Icon} alt="" /> */}
            <p>
              {t("home:aboutUs.reason3.title", "Seeking Big Opportunities")}
            </p>
            <p>
              {t(
                "home:aboutUs.reason3.description",
                "Technology changes quickly, and we always want to stay one step ahead. By focusing on the future, we can realize bigger opportunities."
              )}
            </p>
          </div>
          <div className="reason">
            <p>{t("home:aboutUs.reason4.title", "Staying Connected")}</p>
            <p>
              {t(
                "home:aboutUs.reason4.description",
                "We’ve partnered with big names in the esports and game development communities to make sure the content we deliver is approved by the pros."
              )}
            </p>
          </div>
          <div className="reason">
            {/* <img src={Reason5Icon} alt="" /> */}
            <p>{t("home:aboutUs.reason5.title", "Making Magic")}</p>
            {/* {"创造神奇"} */}
            <p>
              {t(
                "home:aboutUs.reason5.description",
                "Every experience should be magical. When people use our apps, we want them to wonder how they ever lived without them."
              )}
            </p>
          </div>
        </Container>
      </section>

      <Section className="section-4">
        <SectionGContainer>
          <div className="text-block">
            <p className="text-block__description main-caption">
              {t(
                "home:aboutUs.section3.description",
                "While our headquarters are in Playa Vista, CA – our team connects every day from all over the world."
              )}
            </p>
          </div>
          <div className="images-container">
            <GlobeRenderer />
          </div>
        </SectionGContainer>
      </Section>
      <section className="section-6">
        <Container>
          <Sentinel onVisible={handleVisible3} />
          {isBlock3Visible && (
            <LottieBgContainer>
              <Lottie {...lottiePattern3Options} />
            </LottieBgContainer>
          )}

          <div className="section-6__content" id="jobs">
            <h2 className="main-caption">
              {t(
                "home:aboutUs.interestedInWorking",
                "Interested in working with us?"
              )}
            </h2>
            <a
              href="https://recruiting.paylocity.com/Recruiting/Jobs/All/123ea6d1-5fa8-4cec-b6a3-d1cc6af2f3c9"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              {t("home:aboutUs.viewAllJobOpenings", "View all job openings")}
            </a>
          </div>
        </Container>
      </section>

      <Footer />
    </Root>
  );
};

export default AboutUs;

export const SectionContainer = styled("div")`
  display: flex;
  position: relative;
  width: 83%;
  max-width: 1920px;
  margin: 0 auto;

  &.narrow {
    max-width: var(--sp-container);
  }

  ${tablet} {
    width: 87%;
  }

  ${mobile} {
    width: 90%;
  }
`;

export const SectionTContainer = styled("div")`
  display: flex;
  position: relative;
  overflow: hidden;

  .main-image-section2 {
    z-index: 9999;
    width: 40%;
    position: absolute;
    bottom: 0;
  }
`;

export const SectionGContainer = styled("div")`
  display: flex;
  align-items: flex-end;
  position: relative;
  width: 83%;
  max-width: 1920px;
  margin: 0 auto;

  &.narrow {
    max-width: var(--sp-container);
  }

  ${tablet} {
    width: 87%;
  }

  ${mobile} {
    width: 90%;
  }
`;

const Root = styled(_Root)`
  color: var(--white);

  p {
    font-weight: 300;
  }

  ${LottieBgContainer} {
    filter: brightness(1.5);
  }
  section {
    .text-block {
      &__subtitle {
        ${mobile} {
          font-size: var(--sp-3);
          margin-bottom: var(--sp-2_5);
        }
      }
      &__description {
        font-size: var(--sp-7);
        line-height: 1.5;

        ${HD} {
          font-size: var(--sp-12);
          line-height: 1.5;
        }
        ${tablet} {
          font-size: var(--sp-6);
          line-height: 1.5;
        }
        ${mobile} {
          font-size: var(--sp-4);
          line-height: 1.5;
        }
      }
    }
  }
  section .main-caption,
  .main-caption {
    font-size: var(--sp-11);
    line-height: 58px;
    font-weight: bold;
    ${HD} {
      font-size: 60px;
      line-height: 84px;
    }
    ${tablet} {
      font-size: var(--sp-9);
      line-height: 50px;
    }
    ${mobile} {
      font-size: var(--sp-7);
      line-height: var(--sp-9);
    }
  }
  .images-container {
    ${mobile} {
      align-self: flex-start;
      margin-left: 25%;
    }
  }

  .section-1 {
    z-index: 2;
    margin-bottom: calc(var(--sp-2_5) * -1);

    ${tablet} {
      margin-bottom: -90px;
    }
    ${mobile} {
      margin-bottom: -60px;
    }
    .text-block {
      ${tablet} {
        padding: 10px 0 60px;
      }
    }
    .images-container {
      margin-left: 60px;

      ${tablet} {
        align-self: flex-start;
        margin-left: 25%;
      }
    }
    .main-image {
      position: absolute;
      height: 504px;
      ${HD} {
        height: 744px;
      }
      ${tablet} {
        height: 432px;
      }
      ${mobile} {
        width: 120%;
        height: auto;
      }
    }
    .parallax_small {
      margin-bottom: -64%;
      margin-left: -60px;

      ${tablet} {
        margin-bottom: -54%;
        margin-top: 0;
      }
      ${mobile} {
        margin-bottom: -70%;
        margin-left: -15%;
      }
    }
    .small-image {
      z-index: 9999;
      height: 453px;
      ${HD} {
        height: 668px;
      }
      ${tablet} {
        height: 388px;
      }
      ${mobile} {
        width: 80%;
        height: auto;
      }
    }
  }

  .section-2 {
    margin-bottom: 200px;
    ${tablet} {
      margin-bottom: 140px;
    }
    .text-block {
      min-height: 640px;
      justify-content: flex-end;
      margin-left: 48%;

      ${HD} {
        min-height: 890px;
      }
      ${tablet} {
        max-width: 100%;
        justify-content: center;
      }
      ${mobile} {
        min-height: 460px;
      }
    }

    .images-container {
      margin-top: 200px;
      ${HD} {
        margin-top: 340px;
      }
      ${tablet} {
        margin-top: -150px;
        margin-left: -40%;
      }
      ${mobile} {
        margin-top: -90px;
        align-self: flex-end;
        margin-left: 0;
        margin-right: 25%;
      }
    }

    .main-image {
      object-fit: cover;
      width: 766px;
      height: 504px;

      ${HD} {
        width: 1019px;
        height: 670px;
      }
      ${tablet} {
        width: 730px;
        height: 480px;
      }
      ${mobile} {
        width: 530px;
        height: 380px;
        object-position: 70% 0;
      }
      ${mobileSmall} {
        width: 288px;
        height: 189px;
        object-position: 70% 0;
      }
    }
  }

  .section-3 {
    position: relative;

    ${Container} {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 120px;
      ${tablet} {
        padding-bottom: 0;
      }
    }
    ${LottieBgContainer} {
      height: auto;
      top: -400px;
      min-height: 0;
      ${HD} {
        top: -600px;
      }
      ${tablet} {
        top: -240px;
      }
      ${mobile} {
        top: -180px;
      }
    }
    .reason {
      width: 40%;
      margin-bottom: 80px;

      ${tablet} {
        width: 100%;
        max-width: 580px;
        margin-bottom: 60px;
      }
      ${mobile} {
        margin-bottom: 40px;
      }

      p:first-of-type {
        margin: 20px 0 var(--sp-5);
        font-size: var(--sp-5);
        ${HD} {
          font-size: var(--sp-7);
        }
        ${mobile} {
          font-size: var(--sp-5);
        }
      }
      p:last-of-type {
        font-size: var(--sp-5);
        color: var(--shade1);

        ${HD} {
          font-size: var(--sp-6);
        }
        ${mobile} {
          font-size: var(--sp-4);
        }
      }
      &_why {
        ${tablet} {
          order: -1;
        }
      }
    }
  }

  .section-4 {
    overflow: hidden;
    margin-bottom: 200px;

    ${HD} {
      margin-bottom: 240px;
    }
    ${tablet} {
      margin-top: 60px;
    }
    ${Container} {
      align-items: flex-end;
      ${tablet} {
        align-items: flex-start;
      }
    }
    .text-block {
      max-width: calc(50% + 60px);
      width: 100%;
      margin-right: 0;

      ${tablet} {
        max-width: 75%;
      }
      ${mobile} {
        max-width: 100%;
      }
      @media screen and (max-width: 500px) {
        margin-top: 50%;
      }
    }

    .images-container {
      z-index: 0;
      width: 672px;
      height: 580px;
      margin-bottom: 150px;
      ${HD} {
        width: 846px;
        height: 734px;
      }
      ${tablet} {
        order: -1;
        width: 548px;
        height: 475px;
        margin-bottom: -50px;
      }
      ${mobile} and (min-width: 501px) {
        margin-left: 0%;
        margin-bottom: -50px;
        width: 548px;
        height: 40vw;
        pointer-events: none;
      }

      @media screen and (max-width: 500px) {
        margin-left: -20%;
        margin-bottom: -50px;
        margin-top: 20%;
        width: 548px;
        position: absolute;
        pointer-events: none;
      }

      > div {
        right: -50%;
        ${HD} {
          right: -18%;
          transform: scale(1.4);
          transform-origin: top center;
        }
        ${mobile} {
          right: -100%;
          canvas {
            width: 70% !important;
            height: 70% !important;
          }
        }
        &:after {
          content: "";
          display: block;
          width: 70%;
          height: 120%;
          background-image: url("${PlanetLinesSvg}");
          position: absolute;
          right: 21%;
          background-size: cover;
          bottom: -20%;
          filter: brightness(2);
        }
      }
    }
  }

  .section-5 {
    margin-bottom: 180px;

    ${Container} {
      z-index: 1;
    }

    ${tablet} {
      margin-bottom: 80px;
    }
    .filters-container {
      display: flex;
      align-items: flex-end;
      margin-bottom: 85px;

      ${tablet} {
        margin-bottom: 1.875rem;
        flex-direction: column;
        align-items: flex-start;
      }
      h2 {
        line-height: 1.875rem;
        ${HD} {
          line-height: 50px;
        }
        ${tablet} {
          margin-bottom: var(--sp-5);
        }
        ${mobile} {
          margin-bottom: var(--sp-3);
        }
      }
    }
    .filters {
      display: flex;
      justify-content: flex-end;
      border-bottom: var(--sp-px) solid var(--shade3);
      margin-left: 40px;
      padding-right: 53px;
      flex-grow: 2;

      ${tablet} {
        width: 100%;
        margin-left: 0;
        padding-right: 0;
        justify-content: flex-start;
      }
      ${mobileSmall} {
        justify-content: space-between;
        margin-left: -5vw;
        width: 90vw;
        padding: 0 5vw;
      }

      button {
        cursor: pointer;
        border: none;
        background: transparent;
        font-size: var(--sp-4);
        color: var(--shade3);
        text-align: center;
        padding: 8px 4px 4px;
        margin: 0 var(--sp-6);
        transition: var(--transition-long);
        border-bottom: 4px solid transparent;

        ${HD} {
          font-size: var(--sp-5);
        }
        ${mobile} {
          margin: 0 var(--sp-3);
          font-size: 0.875rem;
          line-height: var(--sp-5);
        }
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          color: var(--shade1);
        }
        &.active {
          border-color: var(--primary);
          color: var(--shade0);
        }
      }
    }
    .positions {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .position {
      box-sizing: border-box;
      border-radius: var(--br);
      padding: 40px 60px;
      width: calc(50% - 17px);
      background-color: var(--shade9);
      margin-bottom: var(--sp-7);
      transition: var(--transition-long);

      ${tablet} {
        width: 100%;
      }
      ${mobile} {
        padding: 40px;
      }
      &:hover {
        background-color: var(--shade7);
        svg {
          transform: translate(5px);
        }
      }
      svg {
        transition: var(--transition-long);
        margin-left: var(--sp-4);
      }
      p:first-child {
        font-size: 15px;
        color: var(--shade1);
        margin-bottom: var(--sp-3);
      }
      p:last-child {
        font-size: var(--sp-5);
        display: flex;
        align-items: center;
        ${mobile} {
          font-size: var(--sp-5);
        }
      }
    }
    .load-more {
      background: transparent;
      border: none;
      display: block;
      margin: 20px auto 0;
      color: var(--primary);
      text-transform: lowercase;
      cursor: pointer;
    }
  }

  .section-6 {
    margin-bottom: 100px;
    ${HD} {
      margin-bottom: 200px;
    }
    ${tablet} {
      margin-bottom: 150px;
    }
    ${LottieBgContainer} {
      width: 100%;
      max-width: 1920px;
      min-height: 0;
      height: auto;
      top: -250px;
      left: -9vw;
      ${HD} {
        top: -400px;
      }
      ${tablet} {
        top: auto;
        bottom: -70%;
      }
      ${mobile} {
        bottom: -60%;
      }
    }
    &__content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      max-width: 842px;
      padding: 75px 90px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background-color: var(--primary);

      ${HD} {
        max-width: 1242px;
        padding: 75px 135px;
      }
      ${tablet} {
        max-width: 760px;
        padding: 75px 85px;
      }
      ${mobile} {
        max-width: 100%;
        padding: 75px var(--sp-6);
      }
    }

    h2 {
      margin-bottom: 17px;
      ${mobile} {
        font-size: var(--sp-6);
        line-height: var(--sp-8);
        max-width: 400px;
      }
    }
    a {
      font-size: var(--sp-7);
      ${HD} {
        font-size: var(--sp-10);
      }
      ${tablet} {
        font-size: var(--sp-7);
      }
      ${mobile} {
        font-size: var(--sp-5);
      }
    }
  }
`;

const MainView = styled(View)`
  min-height: auto;
  padding: 200px 0 140px;
  box-sizing: border-box;
  z-index: 9;

  ${HD} {
    padding: 246px 0 300px;
  }
  ${tablet} {
    padding-bottom: 80px;
  }
  ${mobile} {
    padding-top: 125px;
    padding-bottom: 65px;
  }
  .text-block {
    max-width: 490px;
    ${HD} {
      max-width: 720px;
    }
    ${tablet} {
      max-width: 400px;
    }
    ${mobile} {
      max-width: 100%;
    }
    p:first-child {
      font-size: var(--sp-7);
      margin-bottom: 45px;
      ${HD} {
        font-size: var(--sp-12);
      }
      ${tablet} {
        font-size: var(--sp-5);
        margin-bottom: var(--sp-5);
      }
      ${mobile} {
        font-size: var(--sp-4);
        margin-bottom: var(--sp-2_5);
      }
    }
    p:last-child {
      font-size: var(--sp-11);
      line-height: 58px;
      font-weight: bold;
      ${HD} {
        font-size: 64px;
        line-height: 84px;
      }
      ${tablet} {
        font-size: var(--sp-9);
        line-height: 50px;
      }
      ${mobile} {
        font-size: var(--sp-7);
        line-height: var(--sp-9);
      }
    }
  }
  ${LottieBgContainer} {
    width: 700px;
    height: 900px;
    top: -200px;
    right: 0;
    left: auto;

    ${HD} {
      width: 1000px;
      height: 1400px;
      top: -400px;
    }
    ${tablet} {
      height: 600px;
      width: 500px;
      top: -150px;
    }
    ${mobile} {
      display: none;
    }
  }
`;

const Section = styled("section")`
  position: relative;

  ${Container} {
    z-index: 1;
    display: flex;
    flex-direction: ${({ $textRight }) => ($textRight ? "row-reverse" : "row")};
    justify-content: space-between;
    align-items: flex-start;

    ${tablet} {
      flex-direction: column;
    }
  }
  .text-block {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    max-width: ${({ $textRight }) =>
      $textRight ? "calc(50% + 100px)" : "50%"};
    width: 50%;
    padding: 90px 0;
    padding-right: 40px;
    ${({ $textRight }) => $textRight && "padding-left: 20px"};
    ${({ $textRight }) =>
      $textRight ? "margin-left: 100px" : "margin-right: 20px"};
    flex-shrink: 0;

    ${HD} {
      ${({ $textRight }) =>
        $textRight ? "margin-left: 170px" : "margin-right: 20px"};
    }
    ${tablet} {
      max-width: 75%;
      width: 75%;
      padding-left: 0;
      margin-right: 0;
      ${({ $textRight }) => $textRight && "margin-left: 25%"};
    }
    ${mobile} {
      max-width: 500px;
      width: 100%;
      padding-left: 0;
      margin-left: 0;
    }

    &__title {
      font-size: var(--sp-11);
      line-height: var(--sp-13);
      margin: 15px 0;

      ${HD} {
        font-size: var(--sp-16);
        line-height: var(--sp-50);
      }
      ${tablet} {
        font-size: var(--sp-9);
        line-height: 46px;
        margin: 10px 0;
      }
      ${mobile} {
        font-size: var(--sp-6);
        line-height: var(--sp-8);
      }
    }
    &__sub-title {
      font-size: var(--sp-4);

      ${HD} {
        font-size: var(--sp-5);
      }
      ${mobile} {
        font-size: var(--sp-3);
      }
    }
    &__description {
      font-size: var(--sp-5);
      margin-top: var(--sp-2_5);

      ${HD} {
        font-size: var(--sp-5);
      }
      ${mobile} {
        margin-top: 0;
        font-size: var(--sp-4);
      }
    }

    > * {
      position: relative;
      z-index: 1;
    }
    &:before {
      content: "";
      display: ${({ $noBackground }) => ($noBackground ? "none" : "block")};
      width: ${({ $blockBackground }) =>
        $blockBackground ? "150vw" : "calc(50vw + 100px)"};
      left: ${({ $blockBackground }) => ($blockBackground ? "-50vw" : "-9vw")};
      height: 100%;
      position: absolute;
      top: 0;
      background-color: var(--primary);

      ${HD} {
        width: ${({ $blockBackground }) =>
          $blockBackground ? "150vw" : "calc(50vw + 280px)"};
      }
      ${tablet} {
        width: ${({ $blockBackground }) =>
          $blockBackground ? "150vw" : "calc(100% + 9vw)"};
      }
      ${mobile} {
        width: ${({ $blockBackground }) =>
          $blockBackground ? "150vw" : "calc(100% + 5vw)"};
        left: -5vw;
      }
    }
  }
  .images-container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: ${({ $textRight }) =>
      $textRight ? "flex-end" : "flex-start"};
    align-self: ${({ $textRight }) => ($textRight ? "flex-start" : "flex-end")};
    text-align: ${({ $textRight }) => ($textRight ? "end" : "start")};
  }
  .parallax_small {
    z-index: 2;
    margin-top: -40px;
  }
  .main-image {
    position: relative;
    z-index: 1;
  }
`;
