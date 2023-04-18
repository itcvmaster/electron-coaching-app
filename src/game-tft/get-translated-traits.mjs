export default function getTranslatedTraits(t, value) {
  switch (value?.toLowerCase().replace(/[\s-]+/g, "")) {
    case "alltraits":
      return t("tft:traits.allTraits", "All Traits");
    case "allclasses":
      return t("tft:traits.allClasses", "All Classes");
    case "allorigins":
      return t("tft:traits.allOrigins", "All Origins");
    case "flex":
      return t("tft:flex", "Flex");
    case "assassin":
      return t("tft:traits.assassin", "Assassin");
    case "blademaster":
      return t("tft:traits.blademaster", "Blademaster");
    case "brawler":
      return t("tft:traits.brawler", "Brawler");
    case "elementalist":
      return t("tft:traits.elementalist", "Elementalist");
    case "guardian":
      return t("tft:traits.guardian", "Guardian");
    case "gunslinger":
      return t("tft:traits.gunslinger", "Gunslinger");
    case "knight":
      return t("tft:traits.knight", "Knight");
    case "ranger":
      return t("tft:traits.ranger", "Ranger");
    case "shapeshifter":
      return t("tft:traits.shapeshifter", "Shapeshifter");
    case "sorcerer":
      return t("tft:traits.sorcerer", "Sorcerer");
    case "demon":
      return t("tft:traits.demon", "Demon");
    case "dragon":
      return t("tft:traits.dragon", "Dragon");
    case "exile":
      return t("tft:traits.exile", "Exile");
    case "glacial":
      return t("tft:traits.glacial", "Glacial");
    case "hextech":
      return t("tft:traits.hextech", "Hextech");
    case "imperial":
      return t("tft:traits.imperial", "Imperial");
    case "noble":
      return t("tft:traits.noble", "Noble");
    case "ninja":
      return t("tft:traits.ninja", "Ninja");
    case "pirate":
      return t("tft:traits.pirate", "Pirate");
    case "phantom":
      return t("tft:traits.phantom", "Phantom");
    case "robot":
      return t("tft:traits.robot", "Robot");
    case "void":
      return t("tft:traits.void", "Void");
    case "wild":
      return t("tft:traits.wild", "Wild");
    case "yordle":
      return t("tft:traits.yordle", "Yordle");
    case "yordlelord":
      return t("tft:traits.yordlelord", "Yordle-Lord");
    case "alchemist":
      return t("tft:traits.alchemist", "Alchemist");
    case "avatar":
      return t("tft:traits.avatar", "Avatar");
    case "berserker":
      return t("tft:traits.berserker", "Berserker");
    case "cloud":
      return t("tft:traits.cloud", "Cloud");
    case "crystal":
      return t("tft:traits.crystal", "Crystal");
    case "desert":
      return t("tft:traits.desert", "Desert");
    case "druid":
      return t("tft:traits.druid", "Druid");
    case "electric":
      return t("tft:traits.electric", "Electric");
    case "inferno":
      return t("tft:traits.inferno", "Inferno");
    case "light":
      return t("tft:traits.light", "Light");
    case "lunar":
      return t("tft:traits.lunar", "Lunar");
    case "mage":
      return t("tft:traits.mage", "Mage");
    case "steel":
      return t("tft:traits.steel", "Steel");
    case "mountain":
      return t("tft:traits.mountain", "Mountain");
    case "mystic":
      return t("tft:traits.mystic", "Mystic");
    case "ocean":
      return t("tft:traits.ocean", "Ocean");
    case "poison":
      return t("tft:traits.poison", "Poison");
    case "predator":
      return t("tft:traits.predator", "Predator");
    case "shadow":
      return t("tft:traits.shadow", "Shadow");
    case "soulbound":
      return t("tft:traits.soulbound", "Soulbound");
    case "summoner":
      return t("tft:traits.summoner", "Summoner");
    case "warden":
      return t("tft:traits.warden", "Warden");
    case "woodland":
      return t("tft:traits.woodland", "Woodland");
    case "astro":
      return t("tft:traits.astro", "Astro");
    case "battlecast":
      return t("tft:traits.battlecast", "Battlecast");
    case "blaster":
      return t("tft:traits.blaster", "Blaster");
    case "celestial":
      return t("tft:traits.celestial", "Celestial");
    case "chrono":
      return t("tft:traits.chrono", "Chrono");
    case "cybernetic":
      return t("tft:traits.cybernetic", "Cybernetic");
    case "darkstar":
      return t("tft:traits.darkstar", "Dark Star");
    case "demolitionist":
      return t("tft:traits.demolitionist", "Demolitionist");
    case "infiltrator":
      return t("tft:traits.infiltrator", "Infiltrator");
    case "manareaver":
      return t("tft:traits.manareaver", "Mana-Reaver");
    case "mechpilot":
      return t("tft:traits.mechpilot", "Mech-Pilot");
    case "mercenary":
      return t("tft:traits.mercenary", "Mercenary");
    case "paragon":
      return t("tft:traits.paragon", "Paragon");
    case "protector":
      return t("tft:traits.protector", "Protector");
    case "rebel":
      return t("tft:traits.rebel", "Rebel");
    case "sniper":
      return t("tft:traits.sniper", "Sniper");
    case "spacepirate":
      return t("tft:traits.spacepirate", "Space Pirate");
    case "starguardian":
      return t("tft:traits.starguardian", "Star Guardian");
    case "starship":
      return t("tft:traits.starship", "Starship");
    case "valkyrie":
      return t("tft:traits.valkyrie", "Valkyrie");
    case "vanguard":
      return t("tft:traits.vanguard", "Vanguard");
    case "adept":
    case "master":
      return t("tft:traits.adept", "Adept");
    case "cultist":
      return t("tft:traits.cultist", "Cultist");
    case "dazzler":
      return t("tft:traits.dazzler", "Dazzler");
    case "divine":
      return t("tft:traits.divine", "Divine");
    case "duelist":
      return t("tft:traits.duelist", "Duelist");
    case "dusk":
      return t("tft:traits.dusk", "Dusk");
    case "elderwood":
      return t("tft:traits.wilderness", "Elderwood");
    case "emperor":
      return t("tft:traits.emperor", "Emperor");
    case "enlightened":
      return t("tft:traits.enlightened", "Enlightened");
    case "fortune":
      return t("tft:traits.fortune", "Fortune");
    case "hunter":
      return t("tft:traits.hunter", "Hunter");
    case "keeper":
      return t("tft:traits.keeper", "Keeper");
    case "moonlight":
      return t("tft:traits.moonlight", "Moonlight");
    case "shade":
      return t("tft:traits.shade", "Shade");
    case "sharpshooter":
      return t("tft:traits.sharpshooter", "Sharpshooter");
    case "spirit":
      return t("tft:traits.spirit", "Spirit");
    case "theboss":
      return t("tft:traits.theboss", "The Boss");
    case "tormented":
      return t("tft:traits.tormented", "Tormented");
    case "warlord":
      return t("tft:traits.warlord", "Warlord");
    case "blacksmith":
      return t("tft:traits.blacksmith", "Blacksmith");
    case "daredevil":
      return t("tft:traits.daredevil", "Daredevil");
    case "dragonsoul":
      return t("tft:traits.dragonsoul", "Dragonsoul");
    case "executioner":
      return t("tft:traits.executioner", "Executioner");
    case "fabled":
      return t("tft:traits.fabled", "Fabled");
    case "slayer":
      return t("tft:traits.slayer", "Slayer");
    case "syphoner":
      return t("tft:traits.syphoner", "Syphoner");
    case "abomination":
      return t("tft:traits.abomination", "Abomination");
    case "caretaker":
      return t("tft:traits.caretaker", "Caretaker");
    case "cavalier":
      return t("tft:traits.cavalier", "Cavalier");
    case "coven":
      return t("tft:traits.coven", "Coven");
    case "cruel":
      return t("tft:traits.cruel", "Cruel");
    case "dawnbringer":
      return t("tft:traits.dawnbringer", "Dawnbringer");
    case "draconic":
      return t("tft:traits.draconic", "Draconic");
    case "dragonslayer":
      return t("tft:traits.dragonslayer", "Dragonslayer");
    case "eternal":
      return t("tft:traits.eternal", "Eternal");
    case "forgotten":
      return t("tft:traits.forgotten", "Forgotten");
    case "godking":
      return t("tft:traits.godKing", "God-King");
    case "hellion":
      return t("tft:traits.hellion", "Hellion");
    case "invoker":
      return t("tft:traits.invoker", "Invoker");
    case "ironclad":
      return t("tft:traits.ironclad", "Ironclad");
    case "legionnaire":
      return t("tft:traits.legionnaire", "Legionnaire");
    case "nightbringer":
      return t("tft:traits.nightbringer", "Nightbringer");
    case "redeemed":
      return t("tft:traits.redeemed", "Redeemed");
    case "revenant":
      return t("tft:traits.revenant", "Revenant");
    case "renewer":
      return t("tft:traits.renewer", "Renewer");
    case "skirmisher":
      return t("tft:traits.skirmisher", "Skirmisher");
    case "spellweaver":
      return t("tft:traits.spellweaver", "Spellweaver");
    case "verdant":
      return t("tft:traits.verdant", "Verdant");
    case "cannoneer":
      return t("tft:traits.cannoneer", "Cannoneer");
    case "inanimate":
      return t("tft:traits.inanimate", "Inanimate");
    case "sentinel":
      return t("tft:traits.sentinel", "Sentinel");
    case "victorious":
      return t("tft:traits.victorious", "Victorious");
    case "academy":
      return t("tft:traits.academy", "Academy");
    case "arcanist":
      return t("tft:traits.arcanist", "Arcanist");
    case "bodyguard":
      return t("tft:traits.bodyguard", "Bodyguard");
    case "bruiser":
      return t("tft:traits.bruiser", "Bruiser");
    case "challenger":
      return t("tft:traits.challenger", "Challenger");
    case "chemtech":
      return t("tft:traits.chemtech", "Chemtech");
    case "clockwork":
      return t("tft:traits.clockwork", "Clockwork");
    case "colossus":
      return t("tft:traits.colossus", "Colossus");
    case "cuddly":
      return t("tft:traits.cuddly", "Cuddly");
    case "enchanter":
      return t("tft:traits.enchanter", "Enchanter");
    case "enforcer":
      return t("tft:traits.enforcer", "Enforcer");
    case "glutton":
      return t("tft:traits.glutton", "Glutton");
    case "innovator":
      return t("tft:traits.innovator", "Innovator");
    case "mutant":
      return t("tft:traits.mutant", "Mutant");
    case "scholar":
      return t("tft:traits.scholar", "Scholar");
    case "scrap":
      return t("tft:traits.scrap", "Scrap");
    case "sister":
      return t("tft:traits.sister", "Sister");
    case "socialite":
      return t("tft:traits.socialite", "Socialite");
    case "syndicate":
      return t("tft:traits.syndicate", "Syndicate");
    case "transformer":
      return t("tft:traits.transformer", "Transformer");
    case "twinshot":
      return t("tft:traits.twinshot", "Twinshot");
    case "debonair":
      return t("tft:traits.debonair", "Debonair");
    case "mastermind":
      return t("tft:traits.mastermind", "Mastermind");
    case "rival":
      return t("tft:traits.rival", "Rival");
    case "striker":
      return t("tft:traits.striker", "Striker");
    default:
      return value;
  }
}
