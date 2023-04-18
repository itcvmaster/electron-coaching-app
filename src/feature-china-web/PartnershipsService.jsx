import React, { Fragment, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import TextBlock, {
  TextWrapper,
} from "@/feature-china-web/TextBlockComponent.jsx";
import Sentinel from "@/shared/Sentinel.jsx";
import Lottie from "@/vendor/Lottie.jsx";
import animationBgData from "@/vendor/lottie-overlays.json";
import animationPlanetData from "@/vendor/lottie-planet.json";

const Wrap = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 100px;
  position: relative;

  .lottie-bg-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: -80px;
    right: 280px;
    transform: scaleX(-1);
  }
  .lottie-planet-wrap {
    min-width: 396px;
    width: 62%;
  }

  ${TextWrapper} {
    margin-right: 68px;
  }

  ${HD} {
    .lottie-planet-wrap {
      min-width: 730px;
    }
  }
  ${tablet} {
  }
  ${mobile} {
    flex-direction: column;
    align-items: flex-start;

    .lottie-planet-wrap {
      align-self: center;
    }
  }
`;

const planetOptions = {
  loop: false,
  autoplay: true,
  animationData: animationPlanetData,
};

const bgOptions = {
  loop: false,
  autoplay: true,
  animationData: animationBgData,
};

const Service = () => {
  const { t } = useTranslation();
  const [isBlock1Visible, setIsBlock1Visible] = useState(false);
  const [isBlock2Visible, setIsBlock2Visible] = useState(false);

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

  return (
    <Wrap>
      <TextBlock
        title={t("home:partnerships.service.title", "Global Service")}
        text={t(
          "home:partnerships.service.description",
          "Blitz reaches more countries than any other League of Legends tool, even countries using Garena servers."
        )}
      />
      <Fragment>
        <div className="lottie-bg-wrap">
          <Sentinel key="sentinel1" onVisible={handleVisible1} />
          {isBlock1Visible && <Lottie {...bgOptions} />}
        </div>
        <div className="lottie-planet-wrap">
          <Sentinel key="sentinel2" onVisible={handleVisible2} />
          {isBlock2Visible && <Lottie {...planetOptions} />}
        </div>
      </Fragment>
    </Wrap>
  );
};

export default Service;
