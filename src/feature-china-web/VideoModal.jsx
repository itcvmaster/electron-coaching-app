import React from "react";
import { styled } from "goober";

import { mobile, tablet } from "clutch";

import { CN_LANDING_PAGE_VIDEO_URL_IN_BILI } from "@/feature-china-web/constants.mjs";
import BlitzCloseIcon from "@/inline-assets/close-icon.svg";

const VideoModalWrapper = styled("div")`
  width: 70vw;
  border-radius: var(--br);
  overflow: hidden;

  ${tablet} {
    width: 90vw;
    padding-top: 10vh;
  }

  ${mobile} {
    width: 90vw;
    padding-top: 20vh;
  }
`;

const VideoPlayerWrapper = styled("div")`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;

  iframe {
    top: 0;
    left: 0;
    width: 100%;
    height: 756px;
    float: left;
    position: relative;
    z-index: 1;
  }
`;

const Action = styled("div")`
  display: flex;
  float: left;
  height: 30px;
  cursor: pointer;
  position: relative;
  z-index: 2;
  justify-content: flex-end;
  width: 100%;
  svg {
    width: var(--sp-6);
    height: var(--sp-6);
  }
`;

export default function VideoModal(props) {
  const closeVideo = () => {
    props.onClose(false);
  };

  return (
    <>
      <VideoModalWrapper {...props}>
        <Action className="close-icon" onClick={closeVideo}>
          <BlitzCloseIcon />
        </Action>
        <VideoPlayerWrapper>
          <iframe
            title="video-iframe"
            id="ytplayer"
            type="text/html"
            width="1920"
            height="1080"
            allow="autoplay; fullscreen"
            src={props.$vidUrl || CN_LANDING_PAGE_VIDEO_URL_IN_BILI}
            frameBorder="0"
          ></iframe>
        </VideoPlayerWrapper>
      </VideoModalWrapper>
    </>
  );
}
