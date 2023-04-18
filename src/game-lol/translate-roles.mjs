export function translateRoles(t, role) {
  const roleLowerCase = role?.toLowerCase();
  switch (roleLowerCase) {
    case "all":
      return t("lol:roles.all", "All");
    case "top":
      return t("lol:roles.top", "Top");
    case "jng":
      return t("lol:roles.jng", "JNG");
    case "jungle":
      return t("lol:roles.jungle", "Jungle");
    case "mid":
      return t("lol:roles.mid", "Mid");
    case "middle":
      return t("lol:roles.middle", "Middle");
    case "adc":
      return t("lol:roles.adc", "ADC");
    case "sup":
      return t("lol:roles.sup", "SUP");
    case "support":
      return t("lol:roles.support", "Support");
    case "bot":
      return t("lol:roles.bot", "Bot");
    case "bottom":
      return t("lol:roles.bottom", "Bottom");
    case "solo":
      return t("lol:roles.solo", "Solo");
    default:
      return "";
  }
}
