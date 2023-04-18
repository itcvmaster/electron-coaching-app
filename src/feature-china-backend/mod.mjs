import { appURLs } from "@/app/constants.mjs";

const originalURLs = {};

export function setup() {
  for (const key in appURLs) {
    originalURLs[key] = appURLs[key];
  }

  // For example, swapping out a URL:
  appURLs.RIOT = "https://should-not-be-used";
  appURLs.BLITZ_CN_AUTHURL = "https://auth.blitz.cn";
}

export function teardown() {
  for (const key in originalURLs) {
    appURLs[key] = originalURLs[key];
  }
}
