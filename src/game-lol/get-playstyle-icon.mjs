import * as BestPlayer from "@/inline-assets/lol-playstyle-best-player.svg";
import * as Fan from "@/inline-assets/lol-playstyle-fan.svg";
import * as GanksBot from "@/inline-assets/lol-playstyle-ganks-bot.svg";
import * as GanksMid from "@/inline-assets/lol-playstyle-ganks-mid.svg";
import * as GanksTop from "@/inline-assets/lol-playstyle-ganks-top.svg";
import * as HighVisibilityScore from "@/inline-assets/lol-playstyle-high-vs.svg";
import * as JungleInvader from "@/inline-assets/lol-playstyle-jungle-invader.svg";
import * as LosesEarly from "@/inline-assets/lol-playstyle-loses-early.svg";
import * as LossStreak from "@/inline-assets/lol-playstyle-loss-streak.svg";
import * as Lover from "@/inline-assets/lol-playstyle-lover.svg";
import * as Otp from "@/inline-assets/lol-playstyle-otp.svg";
import * as Duo from "@/inline-assets/lol-playstyle-premade-duo.svg";
import * as Penta from "@/inline-assets/lol-playstyle-premade-penta.svg";
import * as Quad from "@/inline-assets/lol-playstyle-premade-quad.svg";
import * as Trio from "@/inline-assets/lol-playstyle-premade-trio.svg";
import * as Rusty from "@/inline-assets/lol-playstyle-rusty.svg";
import * as LanerSafe from "@/inline-assets/lol-playstyle-safe-laner.svg";
import * as Streak from "@/inline-assets/lol-playstyle-streak.svg";
import * as LanerUnsafe from "@/inline-assets/lol-playstyle-vulnerable-laner.svg";
import * as WarderActive from "@/inline-assets/lol-playstyle-warder-active.svg";
import * as WarderBad from "@/inline-assets/lol-playstyle-warder-bad.svg";
import * as WarderLate from "@/inline-assets/lol-playstyle-warder-late.svg";
import * as WarmingUp from "@/inline-assets/lol-playstyle-warming-up.svg";
import * as LanerWorst from "@/inline-assets/lol-playstyle-worst-laner.svg";

function formatExport(Component, isHtml) {
  return isHtml ? Component.svg : Component.default;
}

export default function (icon, isHtml = false) {
  if (typeof icon === "string") icon = icon?.toLowerCase();
  switch (icon) {
    case "fan":
      return formatExport(Fan, isHtml);
    case "lover":
      return formatExport(Lover, isHtml);
    case "loss-streak":
      return formatExport(LossStreak, isHtml);
    case "otp":
      return formatExport(Otp, isHtml);
    case "duo":
      return formatExport(Duo, isHtml);
    case "trio":
      return formatExport(Trio, isHtml);
    case "quad":
      return formatExport(Quad, isHtml);
    case "penta":
      return formatExport(Penta, isHtml);
    case "rusty":
      return formatExport(Rusty, isHtml);
    case "streak":
      return formatExport(Streak, isHtml);
    case "warming-up":
      return formatExport(WarmingUp, isHtml);
    case "laner-worst":
      return formatExport(LanerWorst, isHtml);
    case "best-player":
      return formatExport(BestPlayer, isHtml);
    case "ganks-bot":
      return formatExport(GanksBot, isHtml);
    case "ganks-mid":
      return formatExport(GanksMid, isHtml);
    case "ganks-top":
      return formatExport(GanksTop, isHtml);
    case "high-visibility-score":
      return formatExport(HighVisibilityScore, isHtml);
    case "jungle-invader":
      return formatExport(JungleInvader, isHtml);
    case "loses-early":
      return formatExport(LosesEarly, isHtml);
    case "laner-safe":
      return formatExport(LanerSafe, isHtml);
    case "laner-unsafe":
      return formatExport(LanerUnsafe, isHtml);
    case "warder-active":
      return formatExport(WarderActive, isHtml);
    case "warder-bad":
      return formatExport(WarderBad, isHtml);
    case "warder-late":
      return formatExport(WarderLate, isHtml);
    default:
      return null;
  }
}
