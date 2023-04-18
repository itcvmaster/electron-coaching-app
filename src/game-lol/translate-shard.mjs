export function translateShardInfo(t, shardId) {
  switch (shardId) {
    case 5001:
      return t("lol:shardInfo.scaling_health", "Scaling Health");
    case 5002:
      return t("lol:shardInfo.armor", "Armor");
    case 5003:
      return t("lol:shardInfo.magic_resist", "Magic Resist");
    case 5005:
      return t("lol:shardInfo.attack_speed", "Attack Speed");
    case 5007:
      return t("lol:shardInfo.ability_haste", "Ability Haste");
    case 5008:
      return t("lol:shardInfo.adaptive_force", "Adaptive Force");
    default:
      return "";
  }
}
