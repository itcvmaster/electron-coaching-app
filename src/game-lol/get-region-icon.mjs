import BR from "@/inline-assets/region-br.svg";
import EUNE from "@/inline-assets/region-eu-ne.svg";
import EUW from "@/inline-assets/region-eu-west.svg";
import JP from "@/inline-assets/region-japan.svg";
import KR from "@/inline-assets/region-korea.svg";
import LAN from "@/inline-assets/region-lan.svg";
import LAS from "@/inline-assets/region-las.svg";
import NA from "@/inline-assets/region-na.svg";
import OCE from "@/inline-assets/region-oce.svg";
import RU from "@/inline-assets/region-ru.svg";
import TR from "@/inline-assets/region-tr.svg";
import World from "@/inline-assets/region-world.svg";

export default function (region) {
  switch (region?.toLowerCase()) {
    case "eun1":
      return EUNE;
    case "na1":
      return NA;
    case "br1":
      return BR;
    case "euw1":
      return EUW;
    case "jp1":
      return JP;
    case "kr":
      return KR;
    case "la1":
      return LAN;
    case "la2":
      return LAS;
    case "oc1":
      return OCE;
    case "tr1":
      return TR;
    case "ru":
      return RU;
    case "world":
    default:
      return World;
  }
}
