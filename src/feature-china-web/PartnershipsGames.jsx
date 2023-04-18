import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import { Container, View } from "@/feature-china-web/common-styles.mjs";

const MainView = styled(View)`
  min-height: auto;
  padding: 164px 0 140px;
  box-sizing: border-box;
  transition: background 0.6s linear;

  ${Container} {
    z-index: 1;
  }
  &:after {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, transparent 0%, var(--shade9) 100%);
  }
  && p {
    font-weight: 300;
    font-size: var(--sp-5);
    opacity: 0.6;
    text-align: center;
    margin-top: var(--sp-4);
    margin-bottom: 50px;
  }

  ${HD} {
    margin: 0 auto;
    padding: 190px 0;

    && p {
      font-size: var(--sp-5);
      margin-top: var(--sp-5);
      margin-bottom: 1.875rem;
    }
  }

  ${tablet} {
    justify-content: flex-start;
    padding: 172px 0 90px;

    && p {
      font-size: var(--sp-4);
      margin-top: var(--sp-2_5);
      margin-bottom: 65px;
    }
  }

  ${mobile} {
    padding-top: 110px;

    && p {
      font-size: var(--sp-4);
      margin-top: 4px;
      margin-bottom: 1.875rem;
    }
  }
`;

const Games = styled("div")`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: -15px;

  ${tablet} {
    margin: 0 calc((150px - 100% / 3) / 2);
    justify-content: space-between;
  }
  ${mobile} {
    margin: 0;
  }
`;

const Game = styled("div")`
  width: 33%;
  margin-bottom: auto;
  margin-top: auto;
  box-sizing: border-box;

  img {
    margin: auto;
    display: block;
    height: auto;
    max-width: 50%;
    margin-top: 50px;
    margin-bottom: 50px;
    opacity: 0.6;
  }

  ${HD} {
    img {
      height: auto;
      max-width: 50%;
      margin-top: 50px;
      margin-bottom: 50px;
    }
  }
  ${tablet} {
    height: auto;
    max-width: 50%;
    margin: 0 calc((100% / 3 - 150px) / 2);
  }
  ${mobile} {
    width: 50%;
    margin: 0;

    img {
      height: auto;
      max-width: 50%;
    }
  }
`;

const Partnership = () => {
  const { t } = useTranslation();

  return (
    <MainView
      $imgSrc={`${appURLs.CDN_PLAIN}/blitz/cn-partnerships/league-of-legends-bg.png`}
    >
      <Container>
        <h1>{t("home:partnerships.games.title", "Ad Partnerships")}</h1>
        <p>
          {t("home:partnerships.games.description", "Blitz是顶级游戏工具")}:
        </p>
        <Games>
          <Game>
            <img
              src={`${appURLs.CDN_PLAIN}/blitz/cn-partnerships/lol.webp`}
              alt="lol"
            />
          </Game>
        </Games>
      </Container>
    </MainView>
  );
};

export default Partnership;
