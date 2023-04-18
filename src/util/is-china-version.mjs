import globals from "@/util/global-whitelist.mjs";

function isChinaVersion() {
  return (
    globals.location?.hostname === "blitz.cn" ||
    globals.document?.querySelector(`meta[itemprop="china"]`) ||
    typeof __BLITZ_CN__ !== "undefined"
  );
}

export default isChinaVersion;
