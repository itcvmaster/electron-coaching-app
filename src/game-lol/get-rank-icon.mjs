import * as Bronze from "@/inline-assets/lol-rank-bronze.svg";
import * as Challenger from "@/inline-assets/lol-rank-challenger.svg";
import * as Diamond from "@/inline-assets/lol-rank-diamond.svg";
import * as Gold from "@/inline-assets/lol-rank-gold.svg";
import * as Grandmaster from "@/inline-assets/lol-rank-grandmaster.svg";
import * as Iron from "@/inline-assets/lol-rank-iron.svg";
import * as Master from "@/inline-assets/lol-rank-master.svg";
import * as None from "@/inline-assets/lol-rank-none.svg";
import * as Platinum from "@/inline-assets/lol-rank-platinum.svg";
import * as PlatPlus from "@/inline-assets/lol-rank-platinum-plus.svg";
import * as Silver from "@/inline-assets/lol-rank-silver.svg";

function formatExport(Component, isHtml) {
  return isHtml ? Component.svg : Component.default;
}

export default function (rank, isHtml = false) {
  switch (rank?.toLowerCase()) {
    case "platinum_plus":
      return formatExport(PlatPlus, isHtml);
    case "challenger":
      return formatExport(Challenger, isHtml);
    case "grandmaster":
      return formatExport(Grandmaster, isHtml);
    case "master":
      return formatExport(Master, isHtml);
    case "diamond":
      return formatExport(Diamond, isHtml);
    case "platinum":
      return formatExport(Platinum, isHtml);
    case "gold":
      return formatExport(Gold, isHtml);
    case "silver":
      return formatExport(Silver, isHtml);
    case "bronze":
      return formatExport(Bronze, isHtml);
    case "iron":
      return formatExport(Iron, isHtml);
    default:
      return formatExport(None, isHtml);
  }
}
