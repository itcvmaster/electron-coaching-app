import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import { Container } from "@/feature-china-web/common-styles.mjs";
import Sentinel from "@/shared/Sentinel.jsx";
import { showProgress } from "@/shared/Styles.jsx";

const Wrap = styled("div")`
  position: relative;
  z-index: 1;

  ${Container} {
    background-color: var(--primary);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 50px;
    box-sizing: border-box;
  }

  .block {
    box-sizing: border-box;
    margin: 20px var(--sp-2_5);
    width: 200px;
    font-size: var(--sp-5);

    &__number {
      font-weight: bold;
      font-size: var(--sp-15);

      sup {
        line-height: 0;
      }
    }
  }

  ${HD} {
    ${Container} {
      padding: 78px 92px;
    }
    .block {
      width: 267px;
      font-size: var(--sp-5);

      &__number {
        font-size: var(--sp-50);
      }
    }
  }
  ${tablet} {
    background-color: var(--primary);

    ${Container} {
      padding: 36px 0;
    }

    .block {
      width: 160px;
      font-size: var(--sp-4);

      &__number {
        font-size: var(--sp-10);
      }
    }
  }
  ${mobile} {
    ${Container} {
      flex-direction: column;
      align-items: flex-start;

      .block {
        font-size: var(--sp-4);
        width: auto;

        br {
          display: none;
        }
      }
    }
  }
`;

const Progress = styled("div")`
  width: 154px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 20px 0 34px 0;

  &:before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    transform-origin: center left;
    background-color: var(--white);
    animation-name: ${showProgress};
    animation-fill-mode: forwards;
    animation-duration: 1.5s;
    animation-timing-function: ease-in-out;
    animation-play-state: ${({ $active }) => ($active ? "running" : "paused")};
  }

  ${tablet} {
    width: 142px;
  }
  ${mobile} {
    margin: 0 0 22px 0;
  }
`;

const Stats = () => {
  const { t } = useTranslation();
  const [isStats1Visible, setIsStats1Visible] = useState(false);
  const [isStats2Visible, setIsStats2Visible] = useState(false);
  const [isStats3Visible, setIsStats3Visible] = useState(false);
  const [isStats4Visible, setIsStats4Visible] = useState(false);

  const handleVisible1 = useCallback((visibility) => {
    if (visibility) {
      setIsStats1Visible(visibility);
    }
  }, []);

  const handleVisible2 = useCallback((visibility) => {
    if (visibility) {
      setIsStats2Visible(visibility);
    }
  }, []);

  const handleVisible3 = useCallback((visibility) => {
    if (visibility) {
      setIsStats3Visible(visibility);
    }
  }, []);

  const handleVisible4 = useCallback((visibility) => {
    if (visibility) {
      setIsStats4Visible(visibility);
    }
  }, []);

  /* eslint-disable i18next/no-literal-string */
  return (
    <Wrap>
      <Container>
        <div className="block">
          <div className="block__number">
            190<sup>+</sup>
          </div>
          <Sentinel key="sentinel1" onVisible={handleVisible1} />
          <Progress progress={76} $active={isStats1Visible} />
          <p>
            {t(
              "home:partnerships.stats.countries",
              "Countries reached, including Garena"
            )}
          </p>
        </div>
        <div className="block">
          <div className="block__number">
            800M<sup>+</sup>
          </div>
          <Sentinel key="sentinel1" onVisible={handleVisible2} />
          <Progress progress={50} $active={isStats2Visible} />
          <p>
            <Trans i18nKey="home:partnerships.stats.views">
              Monthly <br />
              page views
            </Trans>
          </p>
        </div>
        <div className="block">
          <div className="block__number">
            3M<sup>+</sup>
          </div>
          <Sentinel key="sentinel1" onVisible={handleVisible3} />
          <Progress progress={79} $active={isStats3Visible} />
          <p>
            <Trans i18nKey="home:partnerships.stats.users">
              Active <br />
              Blitz users
            </Trans>
          </p>
        </div>
        <div className="block">
          <div className="block__number">
            4M<sup>+</sup>
          </div>
          <Sentinel key="sentinel1" onVisible={handleVisible4} />
          <Progress progress={69} $active={isStats4Visible} />
          <p>
            <Trans i18nKey="home:partnerships.stats.games">
              Games <br />
              played a day
            </Trans>
          </p>
        </div>
      </Container>
    </Wrap>
  );
};

export default Stats;
