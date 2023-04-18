import Role3v3 from "@/inline-assets/lol-role-3v3.svg";
import RoleAll from "@/inline-assets/lol-role-all.svg";
import RoleARAM from "@/inline-assets/lol-role-aram.svg";
import RoleBot from "@/inline-assets/lol-role-bot.svg";
import RoleJungle from "@/inline-assets/lol-role-jungle.svg";
import RoleMid from "@/inline-assets/lol-role-mid.svg";
import RoleSupport from "@/inline-assets/lol-role-support.svg";
import RoleTop from "@/inline-assets/lol-role-top.svg";

const getHextechRoleIcon = (role) => {
  switch (role?.toLowerCase()) {
    case "bot":
    case "adc":
      return RoleBot;
    case "jungle":
      return RoleJungle;
    case "mid":
      return RoleMid;
    case "specialist":
      return RoleAll;
    case "support":
      return RoleSupport;
    case "top":
      return RoleTop;
    case "3v3":
      return Role3v3;
    case "aram":
      return RoleARAM;
    default:
      return RoleAll;
  }
};

export default getHextechRoleIcon;
