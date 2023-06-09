import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import useSetByMatch from "@/game-tft/use-set-by-match.mjs";

export default function useTraits() {
  const state = useSnapshot(readState);
  const selectedSet = useSetByMatch();
  const classes = state.tft.classes;
  const origins = state.tft.origins;
  const setClasses = classes[selectedSet];
  const setOrigins = origins[selectedSet];
  return useMemo(
    () => ({ ...setClasses, ...setOrigins }),
    [setClasses, setOrigins]
  );
}

export function translateTraits(t, value) {
  value = value?.toLowerCase().replace(/[\s-]+/g, "");
  return (
    {
      alltraits: t("tft:traits.allTraits", "All Traits"),
      allclasses: t("tft:traits.allClasses", "All Classes"),
      allorigins: t("tft:traits.allOrigins", "All Origins"),
      flex: t("tft:flex", "Flex"),
      assassin: t("tft:traits.assassin", "Assassin"),
      blademaster: t("tft:traits.blademaster", "Blademaster"),
      brawler: t("tft:traits.brawler", "Brawler"),
      elementalist: t("tft:traits.elementalist", "Elementalist"),
      guardian: t("tft:traits.guardian", "Guardian"),
      gunslinger: t("tft:traits.gunslinger", "Gunslinger"),
      knight: t("tft:traits.knight", "Knight"),
      ranger: t("tft:traits.ranger", "Ranger"),
      shapeshifter: t("tft:traits.shapeshifter", "Shapeshifter"),
      sorcerer: t("tft:traits.sorcerer", "Sorcerer"),
      demon: t("tft:traits.demon", "Demon"),
      dragon: t("tft:traits.dragon", "Dragon"),
      exile: t("tft:traits.exile", "Exile"),
      glacial: t("tft:traits.glacial", "Glacial"),
      hextech: t("tft:traits.hextech", "Hextech"),
      imperial: t("tft:traits.imperial", "Imperial"),
      noble: t("tft:traits.noble", "Noble"),
      ninja: t("tft:traits.ninja", "Ninja"),
      pirate: t("tft:traits.pirate", "Pirate"),
      phantom: t("tft:traits.phantom", "Phantom"),
      robot: t("tft:traits.robot", "Robot"),
      void: t("tft:traits.void", "Void"),
      wild: t("tft:traits.wild", "Wild"),
      yordle: t("tft:traits.yordle", "Yordle"),
      yordlelord: t("tft:traits.yordlelord", "Yordle-Lord"),
      alchemist: t("tft:traits.alchemist", "Alchemist"),
      avatar: t("tft:traits.avatar", "Avatar"),
      berserker: t("tft:traits.berserker", "Berserker"),
      cloud: t("tft:traits.cloud", "Cloud"),
      crystal: t("tft:traits.crystal", "Crystal"),
      desert: t("tft:traits.desert", "Desert"),
      druid: t("tft:traits.druid", "Druid"),
      electric: t("tft:traits.electric", "Electric"),
      inferno: t("tft:traits.inferno", "Inferno"),
      light: t("tft:traits.light", "Light"),
      lunar: t("tft:traits.lunar", "Lunar"),
      mage: t("tft:traits.mage", "Mage"),
      steel: t("tft:traits.steel", "Steel"),
      mountain: t("tft:traits.mountain", "Mountain"),
      mystic: t("tft:traits.mystic", "Mystic"),
      ocean: t("tft:traits.ocean", "Ocean"),
      poison: t("tft:traits.poison", "Poison"),
      predator: t("tft:traits.predator", "Predator"),
      shadow: t("tft:traits.shadow", "Shadow"),
      soulbound: t("tft:traits.soulbound", "Soulbound"),
      summoner: t("tft:traits.summoner", "Summoner"),
      warden: t("tft:traits.warden", "Warden"),
      woodland: t("tft:traits.woodland", "Woodland"),
      astro: t("tft:traits.astro", "Astro"),
      battlecast: t("tft:traits.battlecast", "Battlecast"),
      blaster: t("tft:traits.blaster", "Blaster"),
      celestial: t("tft:traits.celestial", "Celestial"),
      chrono: t("tft:traits.chrono", "Chrono"),
      cybernetic: t("tft:traits.cybernetic", "Cybernetic"),
      darkstar: t("tft:traits.darkstar", "Dark Star"),
      demolitionist: t("tft:traits.demolitionist", "Demolitionist"),
      infiltrator: t("tft:traits.infiltrator", "Infiltrator"),
      manareaver: t("tft:traits.manareaver", "Mana-Reaver"),
      mechpilot: t("tft:traits.mechpilot", "Mech-Pilot"),
      mercenary: t("tft:traits.mercenary", "Mercenary"),
      paragon: t("tft:traits.paragon", "Paragon"),
      protector: t("tft:traits.protector", "Protector"),
      rebel: t("tft:traits.rebel", "Rebel"),
      sniper: t("tft:traits.sniper", "Sniper"),
      spacepirate: t("tft:traits.spacepirate", "Space Pirate"),
      starguardian: t("tft:traits.starguardian", "Star Guardian"),
      starship: t("tft:traits.starship", "Starship"),
      valkyrie: t("tft:traits.valkyrie", "Valkyrie"),
      vanguard: t("tft:traits.vanguard", "Vanguard"),
      adept: t("tft:traits.adept", "Adept"),
      master: t("tft:traits.adept", "Adept"),
      cultist: t("tft:traits.cultist", "Cultist"),
      dazzler: t("tft:traits.dazzler", "Dazzler"),
      divine: t("tft:traits.divine", "Divine"),
      duelist: t("tft:traits.duelist", "Duelist"),
      dusk: t("tft:traits.dusk", "Dusk"),
      elderwood: t("tft:traits.wilderness", "Elderwood"),
      emperor: t("tft:traits.emperor", "Emperor"),
      enlightened: t("tft:traits.enlightened", "Enlightened"),
      fortune: t("tft:traits.fortune", "Fortune"),
      hunter: t("tft:traits.hunter", "Hunter"),
      keeper: t("tft:traits.keeper", "Keeper"),
      moonlight: t("tft:traits.moonlight", "Moonlight"),
      shade: t("tft:traits.shade", "Shade"),
      sharpshooter: t("tft:traits.sharpshooter", "Sharpshooter"),
      spirit: t("tft:traits.spirit", "Spirit"),
      theboss: t("tft:traits.theboss", "The Boss"),
      tormented: t("tft:traits.tormented", "Tormented"),
      warlord: t("tft:traits.warlord", "Warlord"),
      blacksmith: t("tft:traits.blacksmith", "Blacksmith"),
      daredevil: t("tft:traits.daredevil", "Daredevil"),
      dragonsoul: t("tft:traits.dragonsoul", "Dragonsoul"),
      executioner: t("tft:traits.executioner", "Executioner"),
      fabled: t("tft:traits.fabled", "Fabled"),
      slayer: t("tft:traits.slayer", "Slayer"),
      syphoner: t("tft:traits.syphoner", "Syphoner"),
      abomination: t("tft:traits.abomination", "Abomination"),
      caretaker: t("tft:traits.caretaker", "Caretaker"),
      cavalier: t("tft:traits.cavalier", "Cavalier"),
      coven: t("tft:traits.coven", "Coven"),
      cruel: t("tft:traits.cruel", "Cruel"),
      dawnbringer: t("tft:traits.dawnbringer", "Dawnbringer"),
      draconic: t("tft:traits.draconic", "Draconic"),
      dragonslayer: t("tft:traits.dragonslayer", "Dragonslayer"),
      eternal: t("tft:traits.eternal", "Eternal"),
      forgotten: t("tft:traits.forgotten", "Forgotten"),
      godking: t("tft:traits.godKing", "God-King"),
      hellion: t("tft:traits.hellion", "Hellion"),
      invoker: t("tft:traits.invoker", "Invoker"),
      ironclad: t("tft:traits.ironclad", "Ironclad"),
      legionnaire: t("tft:traits.legionnaire", "Legionnaire"),
      nightbringer: t("tft:traits.nightbringer", "Nightbringer"),
      redeemed: t("tft:traits.redeemed", "Redeemed"),
      revenant: t("tft:traits.revenant", "Revenant"),
      renewer: t("tft:traits.renewer", "Renewer"),
      skirmisher: t("tft:traits.skirmisher", "Skirmisher"),
      spellweaver: t("tft:traits.spellweaver", "Spellweaver"),
      verdant: t("tft:traits.verdant", "Verdant"),
      cannoneer: t("tft:traits.cannoneer", "Cannoneer"),
      inanimate: t("tft:traits.inanimate", "Inanimate"),
      sentinel: t("tft:traits.sentinel", "Sentinel"),
      victorious: t("tft:traits.victorious", "Victorious"),
      academy: t("tft:traits.academy", "Academy"),
      arcanist: t("tft:traits.arcanist", "Arcanist"),
      bodyguard: t("tft:traits.bodyguard", "Bodyguard"),
      bruiser: t("tft:traits.bruiser", "Bruiser"),
      challenger: t("tft:traits.challenger", "Challenger"),
      chemtech: t("tft:traits.chemtech", "Chemtech"),
      clockwork: t("tft:traits.clockwork", "Clockwork"),
      colossus: t("tft:traits.colossus", "Colossus"),
      cuddly: t("tft:traits.cuddly", "Cuddly"),
      enchanter: t("tft:traits.enchanter", "Enchanter"),
      enforcer: t("tft:traits.enforcer", "Enforcer"),
      glutton: t("tft:traits.glutton", "Glutton"),
      innovator: t("tft:traits.innovator", "Innovator"),
      mutant: t("tft:traits.mutant", "Mutant"),
      scholar: t("tft:traits.scholar", "Scholar"),
      scrap: t("tft:traits.scrap", "Scrap"),
      sister: t("tft:traits.sister", "Sister"),
      socialite: t("tft:traits.socialite", "Socialite"),
      syndicate: t("tft:traits.syndicate", "Syndicate"),
      transformer: t("tft:traits.transformer", "Transformer"),
      twinshot: t("tft:traits.twinshot", "Twinshot"),
      debonair: t("tft:traits.debonair", "Debonair"),
      mastermind: t("tft:traits.mastermind", "Mastermind"),
      rival: t("tft:traits.rival", "Rival"),
      striker: t("tft:traits.striker", "Striker"),
    }[value] || value
  );
}
