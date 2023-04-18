import { QUEUE_TYPES } from "@/game-lol/constants.mjs";

export function translateQueueType(t, gameId) {
  switch (QUEUE_TYPES[gameId]) {
    case "CUSTOM":
      return t("lol:queueTypes.custom", "Custom");
    case "NORMAL":
      return t("lol:queueTypes.normal", "Normal");
    case "RANKED_SOLO":
      return t("lol:queueTypes.ranked_solo", "Ranked Solo");
    case "RANKED_PREMADE":
      return t("lol:queueTypes.ranked_premade", "Ranked Premade");
    case "CO_OP_VS_AI":
      return t("lol:queueTypes.co_op_vs_ai", "Co-op vs AI");
    case "TWISTED_TREELINE":
      return t("lol:queueTypes.twisted_treeline", "Twisted Treeline");
    case "RANKED_TWISTED_TREELINE":
      return t(
        "lol:queueTypes.ranked_twisted_treeline",
        "Ranked Twisted Treeline"
      );
    case "DRAFT_PICK":
      return t("lol:queueTypes.draft_pick", "Draft Pick");
    case "BLIND_PICK_5V5_DOMINION":
      return t(
        "lol:queueTypes.blind_pick_5v5_dominion",
        "5v5 Dominion Blind Pick"
      );
    case "DRAFT_PICK_5V5_DOMINION":
      return t(
        "lol:queueTypes.draft_pick_5v5_dominion",
        "5v5 Dominion Draft Pick"
      );
    case "DOMINION_CO_OP_VS_AI":
      return t("lol:queueTypes.dominion_co_op_vs_ai", "Dominion Co-op vs AI");
    case "CO_OP_VS_AI_INTRO_BOT":
      return t("lol:queueTypes.co_op_vs_ai_intro_bot", "Co-op vs AI Intro Bot");
    case "CO_OP_VS_AI_BEGINNER_BOT":
      return t(
        "lol:queueTypes.co_op_vs_ai_beginner_bot",
        "Co-op vs AI Beginner Bot"
      );
    case "CO_OP_VS_AI_INTERMEDIATE_BOT":
      return t(
        "lol:queueTypes.co_op_vs_ai_intermediate_bot",
        "Co-op vs AI Intermediate Bot"
      );
    case "RANKED_TEAM_3V3":
      return t("lol:queueTypes.ranked_team_3v3", "3v3 Ranked Team");
    case "RANKED_TEAM_5V5":
      return t("lol:queueTypes.ranked_team_5v5", "5v5 Ranked Team");
    case "TEAM_BUILDER":
      return t("lol:queueTypes.team_builder", "Team Builder");
    case "ARAM":
      return t("lol:queueTypes.aram", "ARAM");
    case "ONE_FOR_ALL":
      return t("lol:queueTypes.one_for_all", "One for All");
    case "SNOWDOWN_SHOWDOWN_1V1":
      return t("lol:queueTypes.snowdown_showdown_1v1", "1v1 Snowdown Showdown");
    case "SNOWDOWN_SHOWDOWN_2V2":
      return t("lol:queueTypes.snowdown_showdown_2v2", "2v2 Snowdown Showdown");
    case "HEXAKILL_6V6":
      return t("lol:queueTypes.hexakill_6v6", "6v6 Hexakill");
    case "ULTRA_RAPID_FIRE":
      return t("lol:queueTypes.ultra_rapid_fire", "Ultra Rapid Fire");
    case "MIRRORED_ONE_FOR_ALL":
      return t("lol:queueTypes.mirrored_one_for_all", "Mirrored One for All");
    case "CO_OP_VS_AI_ULTRA_RAPID_FIRE":
      return t(
        "lol:queueTypes.co_op_vs_ai_ultra_rapid_fire",
        "Co-op vs AI Ultra Rapid Fire"
      );
    case "DOOM_BOTS_RANK_1":
      return t("lol:queueTypes.doom_bots_rank_1", "Doom Bots Rank 1");
    case "DOOM_BOTS_RANK_2":
      return t("lol:queueTypes.doom_bots_rank_2", "Doom Bots Rank 2");
    case "DOOM_BOTS_RANK_5":
      return t("lol:queueTypes.doom_bots_rank_5", "Doom Bots Rank 5");
    case "ASCENSION":
      return t("lol:queueTypes.ascension", "Ascension");
    case "TWISTED_TREELINE_6V6_HEXAKILL":
      return t(
        "lol:queueTypes.twisted_treeline_6v6_hexakill",
        "Twisted Treeline 6v6 Hexakill"
      );
    case "BUTCHERS_BRIDGE_5V5_ARAM":
      return t(
        "lol:queueTypes.butchers_bridge_5v5_aram",
        "Butcher's Bridge 5v5 ARAM"
      );
    case "KING_PORO":
      return t("lol:queueTypes.king_poro", "Poro King");
    case "NEMESIS":
      return t("lol:queueTypes.nemesis", "Nemesis");
    case "BLACK_MARKET_BRAWLERS":
      return t("lol:queueTypes.black_market_brawlers", "Black Market Brawlers");
    case "NEXUS_SIEGE":
      return t("lol:queueTypes.nexus_siege", "Nexus Siege");
    case "DEFINITELY_NOT_DOMINION":
      return t(
        "lol:queueTypes.definitely_not_dominion",
        "Definitely Not Dominion"
      );
    case "ALL_RANDOM_URF":
      return t("lol:queueTypes.all_random_urf", "All Random URF");
    case "ALL_RANDOM":
      return t("lol:queueTypes.all_random", "All Random");
    case "RANKED_DYNAMIC":
      return t("lol:queueTypes.ranked_dynamic", "Ranked Dynamic");
    case "RANKED_FLEX":
      return t("lol:queueTypes.ranked_flex", "Ranked Flex");
    case "BLOOD_HUNT_ASSASSIN":
      return t("lol:queueTypes.blood_hunt_assassin", "Blood Hunt Assassin");
    case "DARK_STAR":
      return t("lol:queueTypes.dark_star", "Dark Star");
    case "CLASH":
      return t("lol:queueTypes.clash", "Clash");
    case "GUARDIAN_INVASION":
      return t("lol:queueTypes.guardian_invasion", "Guardian Invasion");
    case "GUARDIAN_INVASION_ONSLAUGHT":
      return t(
        "lol:queueTypes.guardian_invasion_onslaught",
        "Guardian Invasion: Onslaught"
      );
    case "OVERCHARGED":
      return t("lol:queueTypes.overcharged", "Overcharged");
    case "ODYSSEY_INTRO":
      return t("lol:queueTypes.odyssey_intro", "Odyssey Extraction: Intro");
    case "ODYSSEY_CADET":
      return t("lol:queueTypes.odyssey_cadet", "Odyssey Extraction: Cadet");
    case "ODYSSEY_CREWMEMBER":
      return t(
        "lol:queueTypes.odyssey_crewmember",
        "Odyssey Extraction: Crewmember"
      );
    case "ODYSSEY_CAPTAIN":
      return t("lol:queueTypes.odyssey_captain", "Odyssey Extraction: Captain");
    case "ODYSSEY_ONSLAUGHT":
      return t(
        "lol:queueTypes.odyssey_onslaught",
        "Odyssey Extraction: Onslaught"
      );
    case "NEXUS_BLITZ":
      return t("lol:queueTypes.nexus_blitz", "Nexus Blitz");
    case "ULTIMATE_SPELLBOOK":
      return t("lol:queueTypes.ultimateSpellbook", "Ultimate Spellbook");
    case "URF":
      return t("lol:queueTypes.urf", "URF");
    case "CUSTOM_GAME":
      return t("lol:queueTypes.custom", "Custom");
    case "TEAMFIGHT_TACTICS":
      return t("tft:queues.normal", "Normal");
    case "RANKED_TEAMFIGHT_TACTICS":
      return t("tft:queues.ranked", "Ranked");
    case "TEAMFIGHT_TACTICS_ONE_VS_ZERO":
      return t("tft:queues.oneVsZero", "1v0");
    case "TEAMFIGHT_TACTICS_TWO_VS_ZERO":
      return t("tft:queues.twoVsZero", "2v0");
    case "TEAMFIGHT_TACTICS_TUTORIAL":
      return t("tft:queues.tutorial", "Tutorial");
    case "TEAMFIGHT_TACTICS_SIMULATION":
      return t("tft:queues.simulation", "Simulation");
    case "TEAMFIGHT_TACTICS_HYPER_ROLL":
      return t("tft:queues.hyperRoll", "Hyper Roll");
    default:
      return t("lol:queueTypes.featured", "Featured");
  }
}
