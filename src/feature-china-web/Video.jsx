import React, { useState } from "react";
import { keyframes, styled } from "goober";

import { HD, mobile, tablet } from "clutch";

import { Container } from "@/feature-china-web/common-styles.mjs";
import {
  HomeLearning,
  TencentReskin,
  videoBg,
  videoPlayer,
} from "@/feature-china-web/media-assets.mjs";
import VideoModal from "@/feature-china-web/VideoModal.jsx";

/**
 * Animations
 */
export const H4 = styled("h4")`
  font-size: var(--sp-15);
  font-weight: 700;
  line-height: 1.2;

  ${HD} {
    font-size: var(--sp-50);
  }

  ${tablet} {
    font-size: var(--sp-9);
  }

  ${mobile} {
    font-size: var(--sp-7);
  }
`;

const CircleZoomOutSmall = keyframes`
  from {
    opacity: 0;
    width: 0%;
    height: 0%;
  }

  50% {
    width: 50%;
    height: 50%;
    opacity: 0.3;
  }

  to {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

const CircleZoomOutMedium = keyframes`
  from {
    opacity: 0;
    width: 0%;
    height: 0%;
  }

  50% {
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }

  to {
    width: 250%;
    height: 250%;
    opacity: 0.3;
  }
`;

const CircleZoomOutLarge = keyframes`
  from {
    opacity: 0;
    width: 0%;
    height: 0%;
  }

  50% {
    width: 150%;
    height: 150%;
    opacity: 0.3;
  }

  to {
    width: 300%;
    height: 300%;
    opacity: 0.3;
  }
`;

const Root = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight || `724px`};
  max-width: 1920px;
  margin: 0 auto;
  // background: url(${videoBg}) no-repeat top/cover;

  ${mobile} {
    min-height: 724px;
  }

  .video {
    &__content-wrapper {
      height: 100%;
    }

    &__title {
      text-align: center;
      font-size: var(--sp-8);
      color: var(--white);
    }
    &__subtitle {
      text-align: center;
      font-weight: 500;
      font-size: var(--sp-4);
      color: var(--white);
      padding-top: var(--sp-4_5);
    }

    &__button-wrapper {
      display: table;
      padding-top: var(--sp-22);
      margin: 0 auto;
      ${mobile} {
        padding-top: var(--sp-6);
      }
    }

    &__button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 166px;
      height: 166px;
      border: var(--br-sm) solid var(--shade0);
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        &:before {
          width: 146%;
          height: 146%;
        }
      }
    }

    &__play-icon {
      width: var(--sp-12);
      height: var(--sp-12);
      margin-left: var(--sp-3);
    }

    &__circle-small {
      border-radius: 50%;
      position: absolute;
      border: solid var(--sp-px) var(--shade2);
      animation: ${CircleZoomOutSmall} 2s ease-out 0s infinite forwards;
    }
    &__circle-medium {
      border-radius: 50%;
      position: absolute;
      border: solid var(--sp-px) var(--shade2);
      animation: ${CircleZoomOutMedium} 2s ease-out 0s infinite forwards;
    }
    &__circle-large {
      border-radius: 50%;
      position: absolute;
      border: solid var(--sp-px) var(--shade2);
      animation: ${CircleZoomOutLarge} 2s ease-out 0s infinite forwards;
    }
  }
`;

const mockData = {
  seeHowItWorks: "查看如何运行",
  clickPlayVideo: "点击播放视频",
};

function VideoBlock({ minHeight }) {
  const [openModal, SetOpenModal] = useState(false);

  const openVideoModal = () => {
    SetOpenModal(true);
  };

  const handleClose = (value) => {
    SetOpenModal(value);
  };

  return (
    <Root $minHeight={minHeight}>
      <FooterVideoContainer>
        <video
          playsInline
          autoPlay
          loop
          muted // Videos have no sound but this might help force autoplay in Chrome
        >
          <source src={HomeLearning} type="video/webm" />
        </video>
      </FooterVideoContainer>
      <VideoBlockScreenTopBottom />
      <VideoBlockScreenLeftRight />
      <VideoBlockScreenWhole />
      <Container>
        <div className="video__content-wrapper">
          <H4 className="video__title">{mockData.seeHowItWorks}</H4>
          <p className="video__subtitle">{mockData.clickPlayVideo}</p>
          <div className="video__button-wrapper">
            <div className="video__button" onClick={openVideoModal}>
              <img src={videoPlayer} className="video__play-icon" />
              <div className="video__circle-small"></div>
              <div className="video__circle-medium"></div>
              <div className="video__circle-large"></div>
            </div>
          </div>

          {openModal && (
            <ModalContainer>
              <VideoModal
                $vidUrl={TencentReskin}
                onClose={handleClose}
                autoPlay={!!openModal}
              />
            </ModalContainer>
          )}
        </div>
      </Container>
    </Root>
  );
}

export default VideoBlock;

const ModalContainer = styled("div")`
  position: fixed;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  inset: 0px;
  height: 100%;
  width: 100%;
  z-index: 100;
  background: var(--shade10-75);
  backdrop-filter: blur(2px);
`;

const FooterVideoContainer = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin-top: 0;

  video {
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const VideoBlockScreenTopBottom = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin-top: 0;
  background: linear-gradient(
    180deg,
    #0e1015 0%,
    rgba(14, 16, 21, 0.25) 17.86%,
    rgba(14, 16, 21, 0) 54.38%,
    rgba(14, 16, 21, 0.25) 76.45%,
    #0e1015 100%
  );
`;

const VideoBlockScreenLeftRight = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin-top: 0;
  background: radial-gradient(
    88.06% 472.49% at 94.06% 52.76%,
    #0e1015 0%,
    rgba(14, 16, 21, 0.25) 23.73%,
    rgba(14, 16, 21, 0) 48.92%,
    rgba(14, 16, 21, 0) 49.2%,
    rgba(14, 16, 21, 0.25) 75.11%,
    #0e1015 100%
  );
`;

const VideoBlockScreenWhole = styled("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  margin-top: 0;
  background: radial-gradient(
    88.06% 472.49% at 94.06% 52.76%,
    #0e1015 0%,
    rgba(14, 16, 21, 0.25) 23.73%,
    rgba(14, 16, 21, 0) 48.92%,
    rgba(14, 16, 21, 0) 49.2%,
    rgba(14, 16, 21, 0.25) 75.11%,
    #0e1015 100%
  );
`;
