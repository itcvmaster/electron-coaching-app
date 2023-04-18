import { appURLs } from "@/app/constants.mjs";
import Bronze from "@/inline-assets/apex-bronze.svg";
import BronzeLg from "@/inline-assets/apex-bronze-lg.svg";
import Diamond from "@/inline-assets/apex-diamond.svg";
import DiamondLg from "@/inline-assets/apex-diamond-lg.svg";
import Gold from "@/inline-assets/apex-gold.svg";
import GoldLg from "@/inline-assets/apex-gold-lg.svg";
import Master from "@/inline-assets/apex-master.svg";
import MasterLg from "@/inline-assets/apex-master-lg.svg";
import Platinum from "@/inline-assets/apex-platinum.svg";
import PlatinumLg from "@/inline-assets/apex-platinum-lg.svg";
import Silver from "@/inline-assets/apex-silver.svg";
import SilverLg from "@/inline-assets/apex-silver-lg.svg";

// import Predator from "@/inline-assets/apex-predator.svg";

// import PredatorLg from "@/inline-assets/apex-predator-lg.svg";

export const APEX_SEASONS = [
  // {
  //   name: '1',
  //   id: 'said01769158912',
  //   startTime: moment('20190304').startOf('day').unix(),
  //   endTime: moment('20190618').endOf('day').unix(),
  // },
  {
    name: "2",
    id: "said01774506873",
    rankedPeriod: "said00747315762",
  },
  {
    name: "3",
    id: "said00724938940",
    rankedPeriod: "said00091805734",
  },
  {
    name: "4",
    id: "said01092263930",
    rankedPeriod: "said00609587000",
  },
  {
    name: "5",
    id: "said00835358768",
    rankedPeriod: "said00638209737",
  },
  {
    name: "6",
    id: "said00049860047",
    rankedPeriod: "said01826354644",
  },
  {
    name: "7",
    id: "said00777894692",
    rankedPeriod: "said00461784517",
  },
  {
    name: "8",
    id: "said00831495238",
    rankedPeriod: "said01162744308",
  },
  {
    name: "9",
    id: "said01080534582",
    rankedPeriod: "said01649072598",
  },
  {
    name: "10",
    id: "said01783977028",
    rankedPeriod: "said01091892544",
    arenaRankedPeriod: "said00926519318",
  },
  {
    name: "11",
    id: "said00048930450",
    rankedPeriod: "said01007141711",
    arenaRankedPeriod: "said00781342567",
  },
  {
    name: "12",
    id: "said00479992436",
    rankedPeriod: "said01547807959",
    arenaRankedPeriod: "said00170407135",
  },
  {
    name: "all",
  },
];

export const SEASONS_OBJ = APEX_SEASONS.reduce((obj, season) => {
  if (season.id) obj[season.id] = season;
  return obj;
}, {});

export const CURRENT_SEASON = APEX_SEASONS.slice()
  .reverse()
  .find((s) => new Date() > s.startTime * 1000);

export const GAME_MODES = {
  all: {
    t: "common:allModes",
    label: "All Modes",
    key: "all",
  },
  trios: {
    t: "apex:modes.trios",
    label: "Trios",
    key: "trios",
    hidden: true,
  },
  duos: {
    t: "apex:modes.duos",
    label: "Duos",
    key: "duos",
    hidden: true,
  },
  ranked: {
    t: "apex:modes.rankedLeagues",
    label: "Ranked Leagues",
    key: "ranked",
  },
  arenas: {
    t: "apex:modes.arenas",
    label: "Arenas",
    key: "arenas",
    noPlacement: true,
  },
  rankedArenas: {
    t: "apex:modes.rankedArenas",
    label: "Ranked Arenas",
    key: "rankedArenas",
    noPlacement: true,
  },
  control: {
    t: "apex:modes.control",
    label: "Control",
    key: "control",
    noPlacement: true,
  },
};

export const DIVISIONS = [
  {
    key: "master",
    tDefault: "Master",
    tKey: "apex:rank.master",
    minRp: 10000,
    tiers: [10000],
    icon: Master,
    iconlg: MasterLg,
  },
  {
    key: "diamond",
    tDefault: "Diamond {{tier}}",
    tKey: "apex:rank.diamond",
    minRp: 7200,
    tiers: [9300, 8600, 7900, 7200],
    icon: Diamond,
    iconLg: DiamondLg,
  },
  {
    key: "platinum",
    tDefault: "Platinum {{tier}}",
    tKey: "apex:rank.platinum",
    minRp: 4800,
    tiers: [6600, 6000, 5400, 4800],
    icon: Platinum,
    iconLg: PlatinumLg,
  },
  {
    key: "gold",
    tDefault: "Gold {{tier}}",
    tKey: "apex:rank.gold",
    minRp: 2800,
    tiers: [4300, 3800, 3300, 2800],
    icon: Gold,
    iconLg: GoldLg,
  },
  {
    key: "silver",
    tDefault: "Silver {{tier}}",
    tKey: "apex:rank.silver",
    minRp: 1200,
    tiers: [2400, 2000, 1600, 1200],
    icon: Silver,
    iconLg: SilverLg,
  },
  {
    key: "bronze",
    tDefault: "Bronze {{tier}}",
    tKey: "apex:rank.bronze",
    minRp: 0,
    tiers: [900, 600, 300, 0],
    icon: Bronze,
    iconLg: BronzeLg,
  },
];

export const ARENA_DIVISIONS = [
  {
    key: "master",
    tDefault: "Master",
    tKey: "apex:rank.master",
    minRp: 8000,
    tiers: [8000],
    icon: Master,
    iconlg: MasterLg,
  },
  {
    key: "diamond",
    tDefault: "Diamond {{tier}}",
    tKey: "apex:rank.diamond",
    minRp: 6400,
    tiers: [7600, 7200, 6800, 6400],
    icon: Diamond,
    iconLg: DiamondLg,
  },
  {
    key: "platinum",
    tDefault: "Platinum {{tier}}",
    tKey: "apex:rank.platinum",
    minRp: 4800,
    tiers: [6000, 5600, 5200, 4800],
    icon: Platinum,
    iconLg: PlatinumLg,
  },
  {
    key: "gold",
    tDefault: "Gold {{tier}}",
    tKey: "apex:rank.gold",
    minRp: 3200,
    tiers: [4400, 4000, 3600, 3200],
    icon: Gold,
    iconLg: GoldLg,
  },
  {
    key: "silver",
    tDefault: "Silver {{tier}}",
    tKey: "apex:rank.silver",
    minRp: 1600,
    tiers: [2800, 2400, 2000, 1600],
    icon: Silver,
    iconLg: SilverLg,
  },
  {
    key: "bronze",
    tDefault: "Bronze {{tier}}",
    tKey: "apex:rank.bronze",
    minRp: 0,
    tiers: [1200, 800, 400, 0],
    icon: Bronze,
    iconLg: BronzeLg,
  },
];

export const LEGENDS = {
  said01399802246: {
    apexId: "said01399802246",
    name: "Seer",
    modelNames: ["seer"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Seer.png`,
  },
  said00088599337: {
    apexId: "said00088599337",
    name: "Horizon",
    modelNames: ["horizon", "nova"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Horizon.png`,
  },
  said00182221730: {
    apexId: "said00182221730",
    name: "Gibraltar",
    modelNames: ["gibraltar"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Gibraltar.png`,
  },
  said00898565421: {
    apexId: "said00898565421",
    name: "Bloodhound",
    modelNames: ["bloodhound"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Bloodhound.png`,
  },
  said01409694078: {
    apexId: "said01409694078",
    name: "Lifeline",
    modelNames: ["lifeline", "support"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Lifeline.png`,
  },
  said01464849662: {
    apexId: "said01464849662",
    name: "Pathfinder",
    modelNames: ["pathfinder"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Pathfinder.png`,
  },
  said00827049897: {
    apexId: "said00827049897",
    name: "Wraith",
    modelNames: ["wraith"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Wraith.png`,
  },
  said00725342087: {
    apexId: "said00725342087",
    name: "Bangalore",
    modelNames: ["bangalore"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Bangalore.png`,
  },
  said01111853120: {
    apexId: "said01111853120",
    name: "Caustic",
    modelNames: ["caustic"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Bloodhound.png`,
  },
  said02045656322: {
    apexId: "said02045656322",
    name: "Mirage",
    modelNames: ["mirage", "holo"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Mirage.png`,
  },
  said00843405508: {
    apexId: "said00843405508",
    name: "Octane",
    modelNames: ["stim"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Octane.png`,
  },
  said00187386164: {
    apexId: "said00187386164",
    name: "Wattson",
    modelNames: ["wattson"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Wattson.png`,
  },
  said00435256162: {
    apexId: "said00435256162",
    name: "Valkyrie",
    modelNames: ["valkyrie"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Valkyrie.png`,
  },
  said00216194192: {
    apexId: "said00216194192",
    name: "Ash",
    modelNames: ["ash"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Ash.png`,
  },
  said00064207844: {
    apexId: "said00064207844",
    name: "Revenant",
    modelNames: ["revenant"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Revenant.png`,
  },
  said00496516687: {
    apexId: "said00496516687",
    name: "Mad Maggie",
    modelNames: ["madmaggie"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Madmaggie.png`,
  },
  said02105222312: {
    apexId: "said02105222312",
    name: "Rampart",
    modelNames: ["rampart"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Rampart.png`,
  },
  said00080232848: {
    apexId: "said00080232848",
    name: "Crypto",
    modelNames: ["crypto"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Crypto.png`,
  },
  said00405279270: {
    apexId: "said00405279270",
    name: "Fuse",
    modelNames: ["fuse"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Fuse.png`,
  },
  said01579967516: {
    apexId: "said01579967516",
    name: "Loba",
    modelNames: ["loba"],
    imageUrl: `${appURLs.CDN}/blitz/apex/legends/Loba.png`,
  },
};
