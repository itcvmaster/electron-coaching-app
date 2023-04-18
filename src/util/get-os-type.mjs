import globals from "@/util/global-whitelist.mjs";

export default function getOSType() {
  let osType = "unknown";

  const userAgent = globals.navigator?.userAgent || "";
  if (userAgent.includes("Windows")) osType = "win32";
  if (userAgent.includes("Mac")) osType = "darwin";
  if (userAgent.includes("X11") || userAgent.includes("Linux"))
    osType = "linux";

  return osType;
}
