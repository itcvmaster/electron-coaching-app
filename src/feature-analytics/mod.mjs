import * as baiduAnalytics from "@/feature-analytics/baidu.mjs";
import * as googleAnalytics from "@/feature-analytics/google.mjs";
import { IS_CHINA } from "@/feature-analytics/utils.mjs";

const providers = [IS_CHINA ? baiduAnalytics : googleAnalytics];

export const isDeferred = true;

export function setup() {
  return Promise.all(providers.map(({ setup }) => setup()));
}

export function teardown() {
  return Promise.all(providers.map(({ teardown }) => teardown()));
}
