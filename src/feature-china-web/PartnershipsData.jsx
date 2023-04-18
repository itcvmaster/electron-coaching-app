import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import TextBlock from "@/feature-china-web/TextBlockComponent.jsx";
import Sentinel from "@/shared/Sentinel.jsx";
import Lottie from "@/vendor/Lottie.jsx";
import animationData from "@/vendor/lottie-data.json";

const Wrap = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  margin-bottom: -80px;

  div[aria-label="animation"] {
    overflow: unset !important;
  }
  .parallax {
    min-width: 606px;
    width: 60%;
    box-sizing: border-box;
    margin-left: -8%;
  }

  ${HD} {
    margin-bottom: -165px;

    .parallax {
      min-width: 916px;
    }
  }
  ${tablet} {
    margin-bottom: -155px;

    .parallax {
      margin-left: -200px;
    }
  }
  ${mobile} {
    flex-direction: column-reverse;
    align-items: flex-start;

    .parallax {
      min-width: 400px;
      margin-left: 0;
      margin-right: 6px;
      align-self: flex-end;
    }
  }
`;

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData,
};

const Data = () => {
  const { t } = useTranslation();
  const [isBlock1Visible, setIsBlock1Visible] = useState(false);

  const handleVisible1 = useCallback((visibility) => {
    if (visibility) {
      setIsBlock1Visible(visibility);
    }
  }, []);

  return (
    <Wrap>
      <div className="parallax">
        <Sentinel key="sentinel1" onVisible={handleVisible1} />
        {isBlock1Visible && <Lottie {...defaultOptions} />}
      </div>
      <TextBlock
        title={t("home:partnerships.data.title", "Comprehensive Data")}
        text={t(
          "home:partnerships.data.description",
          "Blitz is the only tool that provides real-time analytics to players automatically."
        )}
      />
    </Wrap>
  );
};

export default Data;
