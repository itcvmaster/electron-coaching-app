import BlitzTier1 from "@/inline-assets/tier-1.svg";
import BlitzTier2 from "@/inline-assets/tier-2.svg";
import BlitzTier3 from "@/inline-assets/tier-3.svg";
import BlitzTier4 from "@/inline-assets/tier-4.svg";
import BlitzTier5 from "@/inline-assets/tier-5.svg";
import BlitzTierNone from "@/inline-assets/tier-none.svg";

export function getTierIcon(tier) {
  const tierInt = parseInt(tier);
  switch (tierInt) {
    case 1:
      return BlitzTier1;
    case 2:
      return BlitzTier2;
    case 3:
      return BlitzTier3;
    case 4:
      return BlitzTier4;
    case 5:
      return BlitzTier5;
    case "none":
    default:
      return BlitzTierNone;
  }
}
