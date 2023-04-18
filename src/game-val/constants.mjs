import { appURLs } from "@/app/constants.mjs";

export const DEFAULT_PROFILE_ICON = `${appURLs.CDN}/blitz/val/assets/generic-profile-icon.png`;

export const MAP_ARTWORK_IMGS = {
  haven: "/blitz/val/maps/map-art-haven.jpg",
  bind: "/blitz/val/maps/map-art-bind.jpg",
  split: "/blitz/val/maps/map-art-split.jpg",
  ascent: "/blitz/val/maps/map-art-ascent.jpg",
  icebox: "/400x0/blitz/val/maps/icebox/icebox-hero2.png",
  port: "/400x0/blitz/val/maps/icebox/icebox-hero2.png",
  breeze: "/400x0/blitz/val/maps/breeze/breeze-hero.jpg",
  fracture: "/400x0/blitz/val/maps/fracture/fracture-hero.jpg",
};

export const RANK_IMGS = {
  radiant: {
    small: `${appURLs.CDN_PLAIN}/blitz/val/ranks/radiant_small.svg`,
  },
  immortal: {
    small: `${appURLs.CDN_PLAIN}/blitz/val/ranks/immortal_small.svg`,
  },
};

export const GAME_MODES = [
  "overall", //all
  "competitive",
  "custom",
  "spikerush",
  "deathmatch",
  "unrated",
  "snowball",
  "escalation",
  "replication",
  // "ggteam",
  // "newmap",
  // "onefa",
];

export const RANKS = {
  24: {
    key: "radiant",
    title: "Radiant",
    tier: "radiant",
    rank: null,
  },
  23: {
    key: "immortal3",
    title: "Immortal 3",
    short: "I3",
    tier: "immortal",
    rank: 3,
  },
  22: {
    key: "immortal2",
    title: "Immortal 2",
    short: "I2",
    tier: "immortal",
    rank: 2,
  },
  21: {
    key: "immortal1",
    title: "Immortal 1",
    short: "I1",
    tier: "immortal",
    rank: 1,
  },
  20: {
    key: "diamond3",
    title: "Diamond 3",
    short: "D3",
    tier: "diamond",
    rank: 3,
  },
  19: {
    key: "diamond2",
    title: "Diamond 2",
    short: "D2",
    tier: "diamond",
    rank: 2,
  },
  18: {
    key: "diamond1",
    title: "Diamond 1",
    short: "D1",
    tier: "diamond",
    rank: 1,
  },
  17: {
    key: "platinum3",
    title: "Platinum 3",
    short: "P3",
    tier: "platinum",
    rank: 3,
  },
  16: {
    key: "platinum2",
    title: "Platinum 2",
    short: "P2",
    tier: "platinum",
    rank: 2,
  },
  15: {
    key: "platinum1",
    title: "Platinum 1",
    short: "P1",
    tier: "platinum",
    rank: 1,
  },
  14: {
    key: "gold3",
    title: "Gold 3",
    short: "G3",
    tier: "gold",
    rank: 3,
  },
  13: {
    key: "gold2",
    title: "Gold 2",
    short: "G2",
    tier: "gold",
    rank: 2,
  },
  12: {
    key: "gold1",
    title: "Gold 1",
    short: "G1",
    tier: "gold",
    rank: 1,
  },
  11: {
    key: "silver3",
    title: "Silver 3",
    short: "S3",
    tier: "silver",
    rank: 3,
  },
  10: {
    key: "silver2",
    title: "Silver 2",
    short: "S2",
    tier: "silver",
    rank: 2,
  },
  9: {
    key: "silver1",
    title: "Silver 1",
    short: "S1",
    tier: "silver",
    rank: 1,
  },
  8: {
    key: "bronze3",
    title: "Bronze 3",
    short: "B3",
    tier: "bronze",
    rank: 3,
  },
  7: {
    key: "bronze2",
    title: "Bronze 2",
    short: "B2",
    tier: "bronze",
    rank: 2,
  },
  6: {
    key: "bronze1",
    title: "Bronze 1",
    short: "B1",
    tier: "bronze",
    rank: 1,
  },
  5: {
    key: "iron3",
    title: "Iron 3",
    short: "I3",
    tier: "iron",
    rank: 3,
  },
  4: {
    key: "iron2",
    title: "Iron 2",
    short: "I2",
    tier: "iron",
    rank: 2,
  },
  3: {
    key: "iron1",
    title: "Iron 1",
    short: "I1",
    tier: "iron",
    rank: 1,
  },
  0: {
    key: "unrated",
    title: "Unrated",
    tier: "unrated",
    rank: null,
  },
};

export const DEFAULT_RANK = 17;
export const HIGHEST_RANK = 24;

export const GAME_VAL_RANK_COLORS = {
  unrated: {
    fill: "var(--shade6)",
    text: "var(--shade3)",
    gradiant: {
      start: "var(--shade5)",
      end: "var(--shade6)",
    },
  },
  iron: {
    fill: "#586062",
    text: "#586062",
    gradiant: {
      start: "#586062",
      end: "#586062",
    },
  },
  bronze: {
    fill: "#A78260",
    text: "#A78260",
    gradiant: {
      start: "#A78260",
      end: "#A78260",
    },
  },
  silver: {
    fill: "#BAC7C8",
    text: "#BAC7C8",
    gradiant: {
      start: "#BAC7C8",
      end: "#BAC7C8",
    },
  },
  gold: {
    fill: "#CDA353",
    text: "#CDA353",
    gradiant: {
      start: "#CDA353",
      end: "#CDA353",
    },
  },
  platinum: {
    fill: "#4CACB9",
    text: "#4CACB9",
    gradiant: {
      start: "#4CACB9",
      end: "#4CACB9",
    },
  },
  diamond: {
    fill: "#9655E7",
    text: "#9655E7",
    gradiant: {
      start: "#9655E7",
      end: "#9655E7",
    },
  },
  immortal: {
    fill: "#C2264C",
    text: "#C2264C",
    gradiant: {
      start: "#C2264C",
      end: "#C2264C",
    },
  },
  radiant: {
    fill: "#E1EEEA",
    text: "#E1EEEA",
    gradiant: {
      start: "var(--white)",
      end: "var(--white)",
    },
  },
};

export const COACHING_IMAGES = {
  OverallBodyImg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_cross_overall.png`,
  ShortBodyImg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_cross_short.png`,
  MediumBodyImg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_cross_medium.png`,
  LongRangeBodyImg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_cross_long.png`,

  SprayControlBg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_overview_spray.png`,
  CrosshairPlacementBg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_overview_crosshair.png`,
  AccuracyBg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/bg_overview_accuracy.png`,

  HelpImg: `${appURLs.CDN}/blitz/val/assets/coaching/crosshair/help.png`,

  BodyImg: `${appURLs.CDN}/blitz/val/assets/coaching/postmatch/bg_graph.png`,

  yellow_lock: `${appURLs.CDN}/blitz/val/assets/coaching/yellow_lock.png`,

  CrosshairImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/crosshair.svg`,
  SprayControlImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/spraycontrol.svg`,
  AccuracyImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/headshot.svg`,
  info: `${appURLs.CDN_PLAIN}/blitz/val/coaching/info.svg`,

  PlusImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/plus.svg`,
  MinusImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/minus.svg`,
  DividerImg: `${appURLs.CDN_PLAIN}/blitz/val/coaching/divider.svg`,

  AccuracySkillVideo: `${appURLs.CDN_VIDEOS}/valorant/coaching/accuracy.webm`,
  CrosshairSkillVideo: `${appURLs.CDN_VIDEOS}/valorant/coaching/crosshair-placement.webm`,
  SpraySkillVideo: `${appURLs.CDN_VIDEOS}/valorant/coaching/spray-control.webm`,
};
export const AGENT_ABILITY_CASTS = {
  astra: {
    ability1Casts: "novapulse", // q
    ability2Casts: "nebula", // e
    grenadeCasts: "gravitywell", // c
    ultimateCasts: "cosmicdivide", // r
  },
  breach: {
    ability1Casts: "flashpoint", // q
    ability2Casts: "faultline", // e
    grenadeCasts: "aftershock", // c
    ultimateCasts: "rollingthunder", // r
  },
  brimstone: {
    ability1Casts: "incendiary", // q
    ability2Casts: "skysmoke", // e
    grenadeCasts: "stimbeacon", // c
    ultimateCasts: "orbitalstrike", // r
  },
  chamber: {
    ability1Casts: "headhunter", // q
    ability2Casts: "rendezvous", // e
    grenadeCasts: "trademark", // c
    ultimateCasts: "tourdeforce", // r
  },
  cypher: {
    ability1Casts: "cybercage", // q
    ability2Casts: "spycam", // e
    grenadeCasts: "trapwire", // c
    ultimateCasts: "neuraltheft", // r
  },
  jett: {
    ability1Casts: "updraft", // q
    ability2Casts: "tailwind", // e
    grenadeCasts: "cloudburst", // c
    ultimateCasts: "bladestorm", // r
  },
  kayo: {
    ability1Casts: "flashdrive", // q
    ability2Casts: "zeropoint", // e
    grenadeCasts: "fragment", // c
    ultimateCasts: "nullcmd", // r
  },
  killjoy: {
    ability1Casts: "alarmbot", // q
    ability2Casts: "turret", // e
    grenadeCasts: "nanoswarm", // c
    ultimateCasts: "lockdown", // r
  },
  neon: {
    ability1Casts: "relaybolt", // q
    ability2Casts: "highgear", // e
    grenadeCasts: "fastlane", // c
    ultimateCasts: "overdrive", // r
  },
  omen: {
    ability1Casts: "paranoia", // q
    ability2Casts: "darkcover", // e
    grenadeCasts: "shroudedstep", // c
    ultimateCasts: "fromtheshadows", // r
  },
  phoenix: {
    ability1Casts: "curveball", // q
    ability2Casts: "hothands", // e
    grenadeCasts: "blaze", // c
    ultimateCasts: "runitback", // r
  },
  raze: {
    ability1Casts: "blastpack", // q
    ability2Casts: "paintshells", // e
    grenadeCasts: "boombot", // c
    ultimateCasts: "showstopper", // r
  },
  reyna: {
    ability1Casts: "devour", // q
    ability2Casts: "dismiss", // e
    grenadeCasts: "leer", // c
    ultimateCasts: "empress", // r
  },
  sage: {
    ability1Casts: "sloworb", // q
    ability2Casts: "healingorb", // e
    grenadeCasts: "barrierorb", // c
    ultimateCasts: "resurrection", // r
  },
  skye: {
    ability1Casts: "trailblazer", // q
    ability2Casts: "guidinglight", // e
    grenadeCasts: "regrowth", // c
    ultimateCasts: "seekers", // r
  },
  sova: {
    ability1Casts: "shockbolt", // q
    ability2Casts: "reconbolt", // e
    grenadeCasts: "owldrone", // c
    ultimateCasts: "huntersfury", // r
  },
  viper: {
    ability1Casts: "poisoncloud", // q
    ability2Casts: "toxicscreen", // e
    grenadeCasts: "snakebite", // c
    ultimateCasts: "viperspit", // r
  },
  yoru: {
    ability1Casts: "blindside", // q
    ability2Casts: "gatecrash", // e
    grenadeCasts: "fakeout", // c
    ultimateCasts: "dimensionaldrift", // r
  },
};

export const VAL_REGIONS = [
  {
    text: "NA",
    value: "na",
  },
  {
    text: "AP",
    value: "ap",
  },
  {
    text: "BR",
    value: "br",
  },
  {
    text: "EU",
    value: "eu",
  },
  {
    text: "KR",
    value: "kr",
  },
  {
    text: "LATAM",
    value: "latam",
  },
];
