import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { Button, HD, mobile, mobileSmall, tablet } from "clutch";

import {
  brandColors,
  logotypes,
  lottie1Options,
  lottiePattern0Options,
  lottiePattern2Options,
  lottiePattern3Options,
  tabs,
} from "@/feature-china-web/brand-assets-data.mjs";
import {
  Container,
  LottieBgContainer,
  Root as _Root,
  View,
} from "@/feature-china-web/common-styles.mjs";
import ContentHeader from "@/feature-china-web/ContentHeader.jsx";
import Footer from "@/feature-china-web/Footer.jsx";
import BlitzTypeTabs from "@/feature-china-web/Tabs.jsx";
import DownloadIcon from "@/inline-assets/recording-download.svg";
import Sentinel from "@/shared/Sentinel.jsx";
import Lottie from "@/vendor/Lottie.jsx";

const BrandAssets = () => {
  const { t } = useTranslation();
  const [activeLogoTab, setActiveLogoTab] = useState(tabs[0].value);
  const [activeColorsTab, setActiveColorsTab] = useState(tabs[0].value);
  const [isBlock1Visible, setIsBlock1Visible] = useState(false);
  const [isPattern3Visible, setIsPattern3Visible] = useState(false);
  const [isPattern0Visible, setIsPattern0Visible] = useState(false);
  const [isPattern2Visible, setIsPattern2Visible] = useState(false);
  const handleVisible1 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock1Visible(visibility);
    }
  }, []);
  const handlePattern0Visible = useCallback((visibility) => {
    if (visibility) {
      setIsPattern0Visible(visibility);
    }
  }, []);
  const handlePattern2Visible = useCallback((visibility) => {
    if (visibility) {
      setIsPattern2Visible(visibility);
    }
  }, []);
  const handlePattern3Visible = useCallback((visibility) => {
    if (visibility) {
      setIsPattern3Visible(visibility);
    }
  }, []);
  /* eslint-disable i18next/no-literal-string */
  return (
    <Root>
      <ContentHeader />
      <MainView>
        <Container>
          <div className="text-block">
            <p>{t("home:brandAssets.title", "Blitz Brand Assets")}</p>
            <p>
              {t(
                "home:brandAssets.subTitle",
                "Blitz is a gaming brand with strong and vibrant visual language."
              )}
            </p>
          </div>
          <Sentinel onVisible={handleVisible1} />
          {isBlock1Visible && (
            <LottieBgContainer>
              <Lottie {...lottie1Options} />
            </LottieBgContainer>
          )}
        </Container>
      </MainView>
      <section className="section-1">
        <Sentinel onVisible={handlePattern0Visible} />
        {isPattern0Visible && (
          <LottieBgContainer>
            <Lottie {...lottiePattern0Options} />
          </LottieBgContainer>
        )}
        <Container>
          <h2 className="main-caption">
            {t("home:brandAssets.section1.caption", "Logotypes")}
          </h2>
          <BlitzTypeTabs
            tabs={tabs}
            onChangeTab={setActiveLogoTab}
            activeTab={activeLogoTab}
          />
          <div className="logotypes-container">
            {logotypes
              .filter((e) => e.type === activeLogoTab)
              .map((l, i) => (
                <div key={i} className="logotype">
                  <div
                    className="logotype__logo logotype__logo_color-light"
                    style={{ background: l.background }}
                  >
                    <img src={l.logo} alt="" />
                  </div>
                  <div className="logotype__footer">
                    <span>{t(...l.title)}</span>
                    <div>
                      <a
                        className="logotype__download-button"
                        href={l.download.svg}
                        download={l.title}
                      >
                        <DownloadIcon /> SVG
                      </a>
                      <a
                        className="logotype__download-button"
                        href={l.download.png}
                        download={l.title}
                      >
                        <DownloadIcon /> PNG
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Container>
      </section>
      <section className="section-2">
        <Sentinel onVisible={handlePattern2Visible} />
        {isPattern2Visible && (
          <LottieBgContainer>
            <Lottie {...lottiePattern2Options} />
          </LottieBgContainer>
        )}
        <Container>
          <h2 className="main-caption">
            {t("home:brandAssets.section2.caption", "Colors")}
          </h2>
          <BlitzTypeTabs
            tabs={tabs}
            onChangeTab={setActiveColorsTab}
            activeTab={activeColorsTab}
          />
          <div className="brand-colors-container">
            {brandColors
              .filter((e) => e.type === activeColorsTab)
              .map((c, i) => (
                <BrandColor key={i} background={c.color}>
                  <p>{t(...c.title)}</p>
                  <p>{c.hsl.toUpperCase()}</p>
                </BrandColor>
              ))}
          </div>
        </Container>
      </section>
      <section className="section-3">
        <Container>
          <div className="font-bg">Inter</div>
          <h2 className="main-caption">
            {t("home:brandAssets.section3.caption", "Fonts")}
          </h2>
          <div className="font-block">
            <p>Inter</p>
            <h3 className="main-caption">
              {t(
                "home:brandAssets.font.description",
                "Good Readable Comfort Humanistic Grotesque"
              )}
            </h3>
          </div>
        </Container>
      </section>
      <section className="section-5" style={{ display: "none" }}>
        <Container>
          <Sentinel onVisible={handlePattern3Visible} />
          {isPattern3Visible && (
            <LottieBgContainer>
              <Lottie {...lottiePattern3Options} />
            </LottieBgContainer>
          )}

          <div className="section-5__content-wrap">
            <p>{t("home:brandAssets.section5.subTitle", "Need more?")}</p>
            <h2 className="main-caption">
              {t(
                "home:brandAssets.section5.title",
                "Download the Blitz media kit"
              )}
            </h2>
            <Button
              inverted
              text={t("home:brandAssets.section5.download", "Great!")}
            />
          </div>
        </Container>
      </section>
      <Footer />
    </Root>
  );
  /* eslint-enable i18next/no-literal-string */
};

export function meta() {
  return {
    title: [null, "Blitz 品牌资料"],
    description: [
      null,
      "Blitz是一个具有功能强大而充满活力的视觉语言的游戏产品。",
    ],
  };
}

export default BrandAssets;

const Root = styled(_Root)`
  color: var(--white);

  ${LottieBgContainer} {
    filter: brightness(1.5);
  }
  ${Container} {
    z-index: 1;
  }
  .download-all-button {
    cursor: pointer;
    background: transparent;
    border: none;
    flex-grow: 2;
    text-align: end;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    color: var(--primary);
    font-size: var(--sp-4);
    line-height: var(--sp-5);
    margin: 0 auto;
    svg {
      path {
        fill: var(--primary);
        &:last-child {
          stroke: var(--primary);
        }
      }
    }
  }
  .main-caption {
    font-size: var(--sp-11);
    line-height: 58px;
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
      line-height: 42px;
    }
  }

  .section-1 {
    margin-bottom: 150px;
    position: relative;

    ${mobile} {
      margin-bottom: 120px;
    }

    ${LottieBgContainer} {
      top: auto;
      bottom: -345px;
      left: 50%;
      transform: translate(-50%);
      min-height: 0;
      height: 800px;
      max-width: 1920px;
      ${tablet} {
        height: 600px;
        bottom: -320px;
      }
      ${mobile} {
        height: 100vw;
        bottom: -170px;
      }
    }
    ${Container} {
      z-index: 1;
    }
    .logotypes-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      ${mobile} {
        flex-direction: column;
        align-items: center;
      }
    }
    .logotype {
      width: calc(50% - 15px);
      margin-bottom: 40px;
      transition: var(--transition-long);

      ${mobile} {
        width: 100%;
      }

      &__logo {
        height: 244px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--br);
        margin-bottom: var(--sp-5);

        ${HD} {
          height: 354px;
          margin-bottom: var(--sp-6);
        }
        ${mobile} {
          height: 154px;
        }

        img {
          ${HD} {
            height: 60px;
          }
          ${mobileSmall} {
            height: var(--sp-9);
          }
        }
      }
      &__footer {
        font-size: var(--sp-4);
        line-height: 0.875rem;
        color: var(--shade1);
        padding: 0 6px 0 2px;

        ${HD} {
          font-size: var(--sp-5);
          line-height: var(--sp-4);
        }
        ${mobile} {
          font-size: 0.875rem;
          line-height: var(--sp-2_5);
          padding: 0 2px;
        }
        &,
        > div {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .logotype__download-button {
          cursor: pointer;
          background: transparent;
          border: none;
          display: flex;
          align-items: flex-end;
          color: var(--shade1);
          font-weight: bold;
          transition: var(--transition);

          &:hover {
            color: var(--shade0);
            svg path {
              color: var(--shade0);
              &:last-child {
                stroke: var(--shade0);
              }
            }
          }
          &:first-child {
            margin-right: var(--sp-5);
          }
          svg {
            margin-right: 4px;
            path {
              transition: var(--transition);
            }
          }
        }
      }
    }
    .download-all-button {
      padding-bottom: 8px;
    }
    ${Container} > .download-all-button {
      margin-top: var(--sp-2_5);
      display: flex;
    }
  }

  .section-2 {
    position: relative;
    max-width: 1920px;
    margin: 0 auto 200px auto;

    ${HD} {
      margin-bottom: 300px;
    }
    ${mobile} {
      background-position-x: 65%;
      margin-bottom: 120px;
    }
    ${LottieBgContainer} {
      top: auto;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 80%);
      min-height: 0;
      height: 800px;
      max-width: 1920px;
      ${HD} {
        transform: translate(-50%, 100%);
      }
      ${tablet} {
        height: 600px;
      }
      ${mobile} {
        height: 100vw;
      }
    }
    ${Container} {
      z-index: 1;
      padding-bottom: var(--sp-5);
      ${HD} {
        padding-bottom: 60px;
      }
      ${mobile} {
        padding-top: 40px;
        padding-bottom: 60px;
      }
    }
    .brand-colors-container {
      display: grid;
      gap: var(--sp-4);
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 10rem);
      grid-template-areas:
      "color1 color2 color3"
      "color1 color2 color4";
    }
  }

  .section-3 {
    margin-bottom: 140px;
    ${tablet} {
      margin-bottom: 90px;
    }
    ${Container} {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      ${mobile} {
        flex-direction: column;
      }
    }
    .font-bg {
      position: absolute;
      bottom: 0;
      left: calc(var(--sp-4) * -1);
      font-weight: bold;
      font-size: 240px;
      line-height: 220px;
      letter-spacing: -0.03em;
      color: var(--shade8);

      ${mobile} {
        bottom: auto;
        top: 50px;
        font-size: 80px;
        line-height: 85px;
        left: -5px;
      }
    }
    .font-block {
      box-sizing: border-box;
      padding: 20px 0 76px 90px;
      position: relative;
      z-index: 1;
      width: 600px;
      height: 540px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      ${HD} {
        width: 900px;
        height: 640px;
        padding-left: 130px;
      }
      ${tablet} {
        width: 500px;
      }
      ${mobile} {
        padding: 50px 0 50px 70px;
        margin-top: 140px;
        width: 100%;
        height: auto;
      }

      &:after {
        content: '';
        display: block;
        width: calc(100% + 9vw);
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: var(--primary);
      }
      > * {
        position: relative;
        z-index: 1;
      }
      p {
        margin-bottom: 65px;
        ${tablet} {
          margin-bottom: 50px;
        }
        ${mobile} {
          font-size: 0.875rem;
          margin-bottom: var(--sp-9);
        }
      }
      .main-caption {
        max-width: 400px;
        ${HD} {
          font-size: var(--sp-11);
          line-height: 64px;
        }
        ${tablet} {
          max-width: 260px;
        }
        ${mobile} {
          max-width: 200px;
        }
      }
    }
  }

  .section-4 {
    margin-bottom: 190px;
    background-color: var(--shade8);
    ${HD} {
      margin-bottom: 250px;
    }
    ${mobile} {
      margin-bottom: 240px;
    }

    ${Container} {
      display: flex;
      justify-content: space-between;
      padding: 80px 0 0;
      transform: translateY(70px);
      ${HD} {
        padding: 80px 0 40px;
      }
      ${tablet} {
        padding: 20px 0 50px;
      }
      ${mobile} {
        flex-direction: column;
      }
      ${mobile} {
        transform: none;
        padding: 60px 0;
      }
    }
    &__info {
      min-width: 500px;
      ${HD} {
        min-width: 650px;
      }
      ${tablet} {
        min-width: 350px;
      }
      p {
        font-size: var(--sp-5);
        ${HD} {
          font-size: var(--sp-6);
        }
        ${mobile} {
          font-size: var(--sp-4);
        }
      }
    }
    .main-caption {
      margin-bottom: 40px;
      ${mobile} {
        margin-bottom: 1.875rem;
      }
    }
    .download-all-button {
      margin: 20px 0 100px;
      ${mobile} {
        margin: 12px 0 1.875rem;
      }
    }
    .controls-wrap {
      margin-bottom: 40px;
    }
    .slider {
      margin-top: calc(var(--sp-2_5) * -1);
      margin-right: calc(var(--sp-5) * -1);
      width: 60%;
      ${HD} {
        transform: translateY(30px);
      }
      ${tablet} {
        width: 100%;
        transform: translateY(30px);
      }
      ${mobile} {
        width: 100%;
        margin: auto;
        margin-top: var(--sp-5);
        padding:
        margin-bottom: -187px;
        transform: none;
      }
      img {
        width: 100%;
        height: auto;
        ${tablet} {
          width: 100%;
        }
        ${mobile} {
          width: 100%;
        }
      }
    }
  }

  .section-5 {
    margin-bottom: 160px;

    ${HD} {
      margin-bottom: 180px;
    }
    ${tablet} {
      margin-bottom: 230px;
    }
    ${mobile} {
      margin-bottom: 100px;
    }
    ${LottieBgContainer} {
      width: 100vw;
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
    &__content-wrap {
      position: relative;
      z-index: 1;
      margin: 0 auto;
      box-sizing: border-box;
      background-color: var(--primary);
      text-align: center;
      max-width: 848px;
      padding: 70px 90px;

      ${HD} {
        padding: 100px 90px;
        max-width: 1224px;
      }
      ${tablet} {
        max-width: 672px;
      }
      ${mobile} {
        padding: 60px 1.875rem;
        max-width: 440px;
      }
      p {
        ${mobile} {
          font-size: 0.875rem;
        }
      }
      .main-caption {
        margin: 5px 0 var(--sp-6);
      }
      button,
      a {
        width: 216px;
        margin: 0 auto;
      }
    }
  }
`;

const BrandColor = styled("div")`
  box-sizing: border-box;
  padding: var(--sp-7);
  border-radius: var(--br);
  background: ${({ background }) => background};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: ${({ background }) =>
    background.toLowerCase() === "var(--shade0)"
      ? "var(--shade10)"
      : "var(--shade0)"};

  &:nth-child(1) {
    grid-area: color1;
  }
  &:nth-child(2) {
    grid-area: color2;
  }
  &:nth-child(3) {
    grid-area: color3;
  }
  &:nth-child(4) {
    grid-area: color4;
    border: var(--sp-px) solid var(--shade6);
  }
`;

const MainView = styled(View)`
  min-height: auto;
  padding: 180px 0 164px;
  box-sizing: border-box;
  z-index: 9;
  ${HD} {
    padding: 246px 0 300px;
  }
  ${tablet} {
    padding: 180px 0 140px;
  }
  ${mobile} {
    padding: 125px 0 65px;
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
    width: 560px;
    height: 560px;
    min-height: 0;
    top: -150px;
    transform: translate(10%);
    left: 42%;

    ${HD} {
      width: 800px;
      height: 800px;
      top: -200px;
    }
    ${tablet} {
      height: 400px;
      width: 400px;
      top: -90px;
    }
    ${mobile} {
      display: none;
    }
  }
`;
