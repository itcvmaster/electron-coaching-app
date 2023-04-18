import { appURLs } from "@/app/constants.mjs";
import { fetchRef } from "@/game-lol/in-game-external-api.mjs";

/**
 * In case of web, we need to use SSR for getting
 * Wechat data because web has CORS issue.
 */
export async function getWechatQRCode(params) {
  const url = `${appURLs.BLITZ_CN_AUTHURL}/api/wechat/qrconnect`;

  const response = await getWechatInfo(url, params);
  if (response.ok) {
    const resText = await response.text();
    return resText;
  }
  return null;
}

export async function getWechatQRState(params) {
  // const {
  //   uuid,
  // } = params;
  const url = `${appURLs.BLITZ_CN_AUTHURL}/api/wechat/wechat_qrcode_status`;
  const response = await getWechatInfo(url, params);
  if (response.ok) {
    const resText = await response.text();
    return resText;
  }
  return null;
}

export async function getWechatAccessToken(params) {
  // const {
  //   code,
  //   grant_type = 'authorization_code',
  // } = params;
  const url = `${appURLs.BLITZ_CN_AUTHURL}/api/wechat/access_token`;
  const response = await getWechatInfo(url, params);
  if (response.ok) {
    const resText = await response.json();
    return resText;
  }
  return null;
}

export async function getWechatUserInfo(params) {
  // const {
  //   access_token,
  //   openid,
  // } = params;
  const url = `${appURLs.BLITZ_CN_AUTHURL}/api/wechat/wechat_user_info`;
  const response = await getWechatInfo(url, params);
  if (response.ok) {
    const resText = await response.json();
    return resText;
  }
  return null;
}

export async function saveWechatUserInfo(params) {
  const url = `${appURLs.BLITZ_CN_AUTHURL}/api/wechat/login`;

  const response = await saveWechatInfo(url, params);
  if (response.ok) {
    const resText = await response.json();
    return resText;
  }
  return null;
}

async function getWechatInfo(url, params) {
  const { fetch } = fetchRef;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    timeout: 6e4,
  };
  const response = await fetch(url, options);
  return response;
}
async function saveWechatInfo(url, params) {
  const { fetch } = fetchRef;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  const response = await fetch(url, options);
  return response;
}

// Common Functions and Constants
export const QR_STATES = {
  wait: { key: "wait" },
  scanned: { key: "scanned" },
  cancelled: { key: "cancelled" },
  agreed: { key: "agreed" },
  emailSuccessed: { key: "emailSuccessed" },
  emailFailed: { key: "emailFailed" },
};

const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
const allNumbers = [..."0123456789"];

export const generatorBase64ID = (len) => {
  const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
  return [...Array(len)]
    .map(() => base[(Math.random() * base.length) | 0])
    .join("");
};
