import { ROLE_SYMBOLS } from "@/game-lol/constants.mjs";
import * as All from "@/inline-assets/lol-role-all.svg";
import * as Bot from "@/inline-assets/lol-role-bot.svg";
import * as Jungle from "@/inline-assets/lol-role-jungle.svg";
import * as Mid from "@/inline-assets/lol-role-mid.svg";
import * as Support from "@/inline-assets/lol-role-support.svg";
import * as Top from "@/inline-assets/lol-role-top.svg";

function formatExport(Component, isHtml) {
  return isHtml ? Component.svg : Component.default;
}

export default function (role, isHtml = false) {
  if (!role) return formatExport(All, isHtml);
  if (typeof role === "string") role = role?.toLowerCase();
  switch (role) {
    case "top":
    case ROLE_SYMBOLS.top:
      return formatExport(Top, isHtml);
    case "jungle":
    case ROLE_SYMBOLS.jungle:
      return formatExport(Jungle, isHtml);
    case "mid":
    case "middle":
    case ROLE_SYMBOLS.mid:
      return formatExport(Mid, isHtml);
    case "bot":
    case "bottom":
    case "adc":
    case ROLE_SYMBOLS.adc:
      return formatExport(Bot, isHtml);
    case "support":
    case "utility":
    case ROLE_SYMBOLS.support:
      return formatExport(Support, isHtml);
    case "specialist":
    case "all":
    case ROLE_SYMBOLS.all:
    default:
      return formatExport(All, isHtml);
  }
}
