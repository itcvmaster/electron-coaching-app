import { appURLs } from "@/app/constants.mjs";

export const getProfileIcon = (iconUrl) => {
  if (!iconUrl) iconUrl = "/blitz/val/assets/generic-profile-icon.png";
  return `${appURLs.CDN}${iconUrl}`;
};
