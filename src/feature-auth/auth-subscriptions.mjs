import { subscribeKey } from "valtio/utils";

import { setConfigBlitzAppAction } from "@/feature-auth/auth-actions.mjs";

/**
 * Add state subscriptions for auth here
 */
export function registerAuthSubscriptions(readState) {
  subscribeKey(readState, "settings", setConfigBlitzAppAction);
}
