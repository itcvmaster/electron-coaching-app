import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import { appURLs } from "@/app/constants.mjs";
import { Container, fadeIn } from "@/feature-china-web/common-styles.mjs";
import TextBlock from "@/feature-china-web/TextBlockComponent.jsx";

const Wrap = styled("div")`
  background-color: var(--primary);
  padding: 272px 0 183px 0;
  position: relative;

  ${Container} {
    position: static;
  }

  .players-img-frame {
    overflow: hidden;
    width: 887px;
    height: 546px;

    img {
      width: 100%;
      height: 546px;
      transform: translate(-158px, 0);
    }
  }
  .parallax-players {
    position: absolute;
    left: calc(50% + 40px);
    width: calc(50% - 40px);
    overflow: hidden;
    bottom: -50px;
  }
  .parallax-player {
    position: absolute;
    left: calc(50% + 140px);
    width: 230px;
  }

  ${HD} {
    padding: 338px 0 146px 0;

    .players-img-frame {
      width: 1079px;
      height: 710px;

      img {
        width: 100%;
        height: 733px;
        transform: translate(-180px, -50px);
      }
    }
    .parallax-players {
      left: calc(50% + 40px);
      bottom: -75px;
    }
    .parallax-player {
      width: 345px;
      left: calc(50% + 140px);
      bottom: -220px;
    }
  }
  ${tablet} {
    padding: 160px 0 400px 0;

    .parallax-players {
      left: auto;
      right: -267px;
      bottom: -180px;
    }
    .players-img-frame {
      width: 819px;
      height: 547px;

      img {
        height: 628px;
        width: 100%;
        transform: translate(-210px, -40px);
      }
    }
    .parallax-player {
      left: auto;
      right: 100px;
      bottom: -240px;
      width: 230px;
    }
  }
  ${mobile} {
    padding: 142px 0 244px 0;

    .players-img-frame {
      width: 371px;
      height: 233px;

      img {
        width: 100%;
        height: 278px;
        transform: translate(-92px, -23px);
      }
    }
    .parallax-players {
      right: -110px;
      bottom: calc(var(--sp-8) * -1);
    }
    .parallax-player {
      right: var(--sp-6);
      bottom: -100px;
      width: 127px;
    }
  }
`;

const Img = styled("img")`
  width: 100%;
  animation: ${fadeIn} 1s ease;
`;

const Community = () => {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Container>
        <TextBlock
          title={t(
            "home:partnerships.community.title",
            "Built with the Community"
          )}
          text={t(
            "home:partnerships.community.description",
            "我们每天都与电竞领域的顶尖人士交流，以求不断改进我们设计的功能"
          )}
        />
        <div className="parallax-players">
          <div className="players-img-frame">
            <Img
              src={`${appURLs.CDN_PLAIN}/blitz/cn-partnerships/community-players.png`}
              alt="community-players"
            />
          </div>
        </div>
        <div className="parallax-player">
          <Img
            src={`${appURLs.CDN_PLAIN}/blitz/cn-partnerships/community-player.png`}
            alt="community-player"
          />
        </div>
      </Container>
    </Wrap>
  );
};

export default Community;
