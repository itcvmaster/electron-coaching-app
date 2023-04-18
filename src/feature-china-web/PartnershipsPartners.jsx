import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import { Button, HD, mobile, tablet } from "clutch";

import {
  Container,
  LottieBgContainer,
} from "@/feature-china-web/common-styles.mjs";
import { SUPPROT } from "@/feature-china-web/constants.mjs";
import Sentinel from "@/shared/Sentinel.jsx";
import Lottie from "@/vendor/Lottie.jsx";
import animationData from "@/vendor/lottie-main.json";

const Wrap = styled("div")`
  position: relative;
  padding: 250px 0 140px 0;

  .button-wrap {
    max-width: 320px;
    display: block;
    margin: 50px auto 0 auto;
    text-align: center;
    height: var(--sp-16);
  }

  ${HD} {
    padding: 460px 0 182px;
  }
  ${tablet} {
    padding: 380px 0 156px;
  }
  ${mobile} {
    padding: 214px 0 40px 0;

    ${Container} {
      h1 {
        max-width: 260px;
        margin: 0 auto;
      }
    }
    .button-wrap {
      width: 136px;
    }
  }
`;

const ButtonStyle = css`
  width: 100%;
  height: var(--sp-14);
`;

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData,
};

const Partners = () => {
  const { t } = useTranslation();
  const [isBlock1Visible, setIsBlock1Visible] = useState(false);

  const handleVisible1 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock1Visible(visibility);
    }
  }, []);

  return (
    <Wrap>
      <Sentinel key="sentinel1" onVisible={handleVisible1} />
      {isBlock1Visible && (
        <LottieBgContainer>
          <Lottie {...defaultOptions} />
        </LottieBgContainer>
      )}
      <Container>
        <h1>
          {t("home:partnerships.partners.title", "Let’s become partners")}
        </h1>
        <div className="button-wrap">
          <Button
            href={SUPPROT}
            text={t("common:contactUs", "Contact Us")}
            bgColor="var(--primary)"
            bgColorHover="var(--primary)"
            textColor="var(--shade0)"
            textColorHover="var(--shade0)"
            className={ButtonStyle}
          />
        </div>
      </Container>
    </Wrap>
  );
};

export default Partners;
