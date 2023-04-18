import { appURLs } from "@/app/constants.mjs";

const CHINA_SPECIFIC = {
  VIDEO: "https://blitz-video.oss-cn-shanghai.aliyuncs.com",
};

export const leftImg = `${appURLs.CDN}/common/img/china/xinyi-left.png`;
export const rightImg = `${appURLs.CDN}/common/img/china/xinyi-right.png`;
export const videoBg = `${appURLs.CDN}/common/img/china//video-bg.png`;
export const videoPlayer = `${appURLs.CDN}/common/img/china/video-player.png`;
export const Slider1 = `${appURLs.CDN}/common/img/china/feature-slider1.png`;
export const Slider2 = `${appURLs.CDN}/common/img/china/feature-slider2.png`;
export const Slider3 = `${appURLs.CDN}/common/img/china/feature-slider3.png`;
export const Slider4 = `${appURLs.CDN}/common/img/china/feature-slider4.png`;
export const Slider5 = `${appURLs.CDN}/common/img/china/feature-slider5.png`;
export const TencentLogo = `${appURLs.CDN}/common/img/china/tencent-logo-icon.png`;
export const backgroundImg = `${appURLs.CDN}/common/img/china/xinyi-background.png`;
export const Logo = `${appURLs.CDN}/common/img/china/RedLogo.png`;
export const TencentReskin = `${CHINA_SPECIFIC.VIDEO}/tencent_reskin_v4.mp4`;
export const HomeLearning = `${CHINA_SPECIFIC.VIDEO}/home-learning.webm`;

// Small enough to inline.
export const ChinaICPLogo = `data:image/webp;base64,UklGRmAFAABXRUJQVlA4WAoAAAAQAAAALgAALwAAQUxQSK8BAAABkHRrmyHJ2t+v2DbHtm1tbWvFnW3btm3btm3bLMUisiMjvjMRMQH4X3pZkbfMoBaJbBwFh530idCj6bWiGTiiay98GhCWH/c3iyVD2fp/FurvZpcgC9IR0+WAT9gPnusQCc2Dhe6RuvZrOxOjp7JP279ZWkpeEfpfFrHnaHRLmHyV3063x8Lw2xGpAGXk3S3Mb4mAIj1h4MunEnmUwT+HivM0g0ABhVbLfzAIds1BRFIxv+B5LQmyZ6Bg+rOARdI2Lj+snOu4hKqSFH+Vi2jjlDzb2HSFPFCwHRXBbHOU1DnE5nya1N7H5k52qcp7NitjpWKPubzM5ZLQg8uvQpCTV3HxdwiXcjzkIhZHSsnXuHyp6pTSxzIJLXfB0rGDx7YkskLyQw5rnFCMuBA09W+GG8o5TvsNzU2Eenjde4YeT3WoDXznNyQCWQBSmCGMf8sMRULdH6buVCMCZQC4at/zGQh+WZtGsFu+/Zq3QT1fr/ep7YE9wJm1QsdN5z4ofHr058OVie3zRDsALQAoOr1gw05NxvafOHRIn2K5SpfI7IZpAgACQSYQgUAEBwEEAgBWUDggigMAAJAPAJ0BKi8AMAA+fS6UR6SioiE422wAkA+JbACxHw3QFl3+S140qEIzbIeYDzpfQTvCu8ofuR6VWgnbKcjUAHD+MCtblp6RRmzeUNwIoyS4dVnNr8eZz0I3M4Ad31ctjIV7t6w7S3U15sJ2Lvwpl0ofsU/HuTipNrNJsCrW7E/hzpyX4AAA/v51x/9sA9qVwwAuC7/+F69oMHyrcuo8RQY39P/SuFIEjZKLiW6NxCmR8yzFZCcbn6VfxDgs16/ye8SuI8oDHTskyuZPxC/KHgNUq2ak+a3/XDXoEmtKCrqUMnAy1foU7VMeQnHWT+rghqXZ6R7v8apSj0chDfp4rlaySjnZCCq7x/3D3W/YoFWvd2EpQwSBCfLPC6tqzdrLDEgrP6b8fDt2YwXq/UfS/wwBNearyXgLAELFviRijDgb3gYZOjN9XNiXg/QepaSvTpNBCtbaIdAUn1elunxYybaZClPhLCWknx+yl0OPtjrgv6Lzu9l3p2aQCPjZYf5Atg6ePM/F7DJsVraRNAOm5bjywjU7GWypOMX+XG4kFNvUrkVL+dqQHnQ/xfl05tg0xvhCdOn1rGTbC+ztBA9qlhjALlE7sEq3NYxHZOtyC00kbk7A2nIN5hEucb5/0B1780A9tOfmPIFHUyORXHDvtyw3dbRZvpe8woX/cbUuPCKxcMK+LrOnP7c6xF/75Ul9lN76UvNrR5yQpcs8a/zi3bPhhp/u0pKIiep/YN2/U3kWFzYbSbZkPPnzoJCDR3dVVvwn7w4bmvb7JznOC92x20/XjqE3uNQ9WfAL/SDdp9nxWwT/xDL//t6iRpY0y969ZAp0bNbr3QzE98vxHJ+eYQTyyWZnS6XbdlEa6NxUtLetlQ8TEMaBUE5tf1I4shScsYS8X/9ZK/X/eSsDigOPfJEr5QZZL/2uWR42WxgsAsaikbNof5arUJiMp55m5IAe2yE1cHQosGdRkCjkBdALJL0rMPDdydFjU8EY6UDoUe7M0kWETBUgaYMFIUIZtcKOfOb+IScBc6p7UGVwFp3Bc91uozsHRSYSrYwF6iPsPfOP3wequl4klFI8zdzA9b5O/yD7VSkP6zcCJggISLCB2NSjnGWttlFIFlYUpVJoPlBfoC9Fj7ZrUU16UvEnoe7eqOY8jQiiEbJNAXJjtmXPY6/iGt4+7SPfnKwuzNmuWjY2W5B9rvmpmqwAAA==`;
