import React from "react";
import { Trans } from "react-i18next";
import { styled } from "goober";

import { formatDuration } from "@/app/util.mjs";
import { CaptionBold, Overline } from "@/game-lol/CommonComponents.jsx";
import { QUEUE_SYMBOLS, ROLE_SYMBOLS } from "@/game-lol/constants.mjs";
import Static from "@/game-lol/static.mjs";
import {
  getChampion,
  isRemakeGame,
  isSameAccount,
  laneHumanize,
  laneNormalize,
  mapRoleToSymbol,
} from "@/game-lol/util.mjs";
import All_Seeing_Icon from "@/inline-assets/Badge_All_Seeing_Icon.svg";
import All_Seeing_Icon_Pure from "@/inline-assets/Badge_All_Seeing_Icon_Pure.svg";
import Comeback_Icon from "@/inline-assets/Badge_Comeback_Icon.svg";
import Comeback_Icon_Pure from "@/inline-assets/Badge_Comeback_Icon_Pure.svg";
import Completionist_Icon from "@/inline-assets/Badge_Completionist_Icon.svg";
import Completionist_Icon_Pure from "@/inline-assets/Badge_Completionist_Icon_Pure.svg";
import CS_God_Icon from "@/inline-assets/Badge_CS_God_Icon.svg";
import CS_God_Icon_Pure from "@/inline-assets/Badge_CS_God_Icon_Pure.svg";
import DMG_God_Icon from "@/inline-assets/Badge_DMG_God_Icon.svg";
import DMG_God_Icon_Pure from "@/inline-assets/Badge_DMG_God_Icon_Pure.svg";
import Early_Game_Carry_Icon from "@/inline-assets/Badge_Early_Game_Carry_Icon.svg";
import Early_Game_Carry_Icon_Pure from "@/inline-assets/Badge_Early_Game_Carry_Icon_Pure.svg";
import Filthy_Rich_Icon from "@/inline-assets/Badge_Filthy_Rich_Icon.svg";
import Filthy_Rich_Icon_Pure from "@/inline-assets/Badge_Filthy_Rich_Icon_Pure.svg";
import First_Blood_Icon from "@/inline-assets/Badge_First_Blood_Icon.svg";
import First_Blood_Icon_Pure from "@/inline-assets/Badge_First_Blood_Icon_Pure.svg";
import Flame_Horizon_Icon from "@/inline-assets/Badge_Flame_Horizon_Icon.svg";
import Flame_Horizon_Icon_Pure from "@/inline-assets/Badge_Flame_Horizon_Icon_Pure.svg";
// Import all badges for usages
import KP_God_Icon from "@/inline-assets/Badge_KP_God_Icon.svg";
// Import all pure badges for usages
import KP_God_Icon_Pure from "@/inline-assets/Badge_KP_God_Icon_Pure.svg";
import Master_Duelist_Icon from "@/inline-assets/Badge_Master_Duelist_Icon.svg";
import Master_Duelist_Icon_Pure from "@/inline-assets/Badge_Master_Duelist_Icon_Pure.svg";
import Solo_Killer_Icon from "@/inline-assets/Badge_Solo_Killer_Icon.svg";
import Solo_Killer_Icon_Pure from "@/inline-assets/Badge_Solo_Killer_Icon_Pure.svg";
import Thicc_Icon from "@/inline-assets/Badge_Thicc_Icon.svg";
import Thicc_Icon_Pure from "@/inline-assets/Badge_Thicc_Icon_Pure.svg";
import Top_Lane_Camper_Icon from "@/inline-assets/Badge_Top_Lane_Camper_Icon.svg";
import Top_Lane_Camper_Icon_Pure from "@/inline-assets/Badge_Top_Lane_Camper_Icon_Pure.svg";
import True_Support_Icon from "@/inline-assets/Badge_True_Support_Icon.svg";
import True_Support_Icon_Pure from "@/inline-assets/Badge_True_Support_Icon_Pure.svg";
import Turret_Destroyer_Icon from "@/inline-assets/Badge_Turret_Destroyer_Icon.svg";
import Turret_Destroyer_Icon_Pure from "@/inline-assets/Badge_Turret_Destroyer_Icon_Pure.svg";
import Unkillable_Icon from "@/inline-assets/Badge_Unkillable_Icon.svg";
import Unkillable_Icon_Pure from "@/inline-assets/Badge_Unkillable_Icon_Pure.svg";
import AccoladeAfk from "@/inline-assets/hextech-accolade-afk.svg";
import AccoladeAllSeeing from "@/inline-assets/hextech-accolade-all-seeing.svg";
import AccoladeBackToBackDeaths from "@/inline-assets/hextech-accolade-back-to-back-deaths.svg";
import AccoladeBadPositioning from "@/inline-assets/hextech-accolade-bad-positioning.svg";
import AccoladeBeginnerBot from "@/inline-assets/hextech-accolade-beginner-bot.svg";
import AccoladeCamper from "@/inline-assets/hextech-accolade-camper.svg";
import AccoladeCcBot from "@/inline-assets/hextech-accolade-cc-bot.svg";
import AccoladeComeback from "@/inline-assets/hextech-accolade-come-back.svg";
import AccoladeCompletionist from "@/inline-assets/hextech-accolade-completionist.svg";
import AccoladeCsGod from "@/inline-assets/hextech-accolade-cs-god.svg";
import AccoladeCsPerMinLost from "@/inline-assets/hextech-accolade-cs-per-min-lost.svg";
import AccoladeCsPerMinWin from "@/inline-assets/hextech-accolade-cs-per-min-win.svg";
import AccoladeDamageDealt from "@/inline-assets/hextech-accolade-damage-dealt.svg";
import AccoladeDefensiveItemization from "@/inline-assets/hextech-accolade-defensive-itemization.svg";
import AccoladeDiedBefore2 from "@/inline-assets/hextech-accolade-died-before2.svg";
import AccoladeDmgKing from "@/inline-assets/hextech-accolade-dmg-king.svg";
import AccoladeDmgMia from "@/inline-assets/hextech-accolade-dmg-mia.svg";
import AccoladeDuelist from "@/inline-assets/hextech-accolade-duelist.svg";
import AccoladeEarlyGame from "@/inline-assets/hextech-accolade-early-game.svg";
import AccoladeEarlySolokill from "@/inline-assets/hextech-accolade-early-solo-kill.svg";
import AccoladeFilthyRich from "@/inline-assets/hextech-accolade-filthy-rich.svg";
import AccoladeFirstBlood from "@/inline-assets/hextech-accolade-first-blood.svg";
import AccoladeFlameHorizon from "@/inline-assets/hextech-accolade-flame-horizon.svg";
import AccoladeGoldPerMinLost from "@/inline-assets/hextech-accolade-gold-per-min-lost.svg";
import AccoladeGoldPerMinWin from "@/inline-assets/hextech-accolade-gold-per-min-win.svg";
import AccoladeGotCamped from "@/inline-assets/hextech-accolade-got-camped.svg";
import AccoladeHoarder from "@/inline-assets/hextech-accolade-hoarder.svg";
import AccoladeKpGod from "@/inline-assets/hextech-accolade-kp-god.svg";
import AccoladeLateFirstWard from "@/inline-assets/hextech-accolade-late-first-ward.svg";
import AccoladeLowVision from "@/inline-assets/hextech-accolade-low-vision.svg";
import AccoladeMvp from "@/inline-assets/hextech-accolade-mvp.svg";
import AccoladePentaKill from "@/inline-assets/hextech-accolade-penta-kill.svg";
import AccoladePoorDude from "@/inline-assets/hextech-accolade-poor-dude.svg";
import AccoladeProneGank from "@/inline-assets/hextech-accolade-prone-gank.svg";
import AccoladeRoamingGod from "@/inline-assets/hextech-accolade-roaming-god.svg";
import AccoladeSoloKilled from "@/inline-assets/hextech-accolade-solo-killed.svg";
import AccoladeStomp from "@/inline-assets/hextech-accolade-stomp.svg";
import AccoladeTeamPlayer from "@/inline-assets/hextech-accolade-team-player.svg";
import AccoladeTooTanky from "@/inline-assets/hextech-accolade-too-tanky.svg";
import AccoladeTripleKill from "@/inline-assets/hextech-accolade-triple-kill.svg";
import AccoladeTurretDestroyer from "@/inline-assets/hextech-accolade-turret-destroyer.svg";
import AccoladeUnkillable from "@/inline-assets/hextech-accolade-unkillable.svg";
import AccoladeUnlucky from "@/inline-assets/hextech-accolade-unlucky.svg";
import AccoladeUseYourWards from "@/inline-assets/hextech-accolade-use-your-wards.svg";
import AccoladeWardPls from "@/inline-assets/hextech-accolade-ward-pls.svg";
import AccoladeWonLane from "@/inline-assets/hextech-accolade-won-lane.svg";
import HextechStatArmor from "@/inline-assets/hextech-stat-armor.svg";
import HextechStatMagicResist from "@/inline-assets/hextech-stat-magic-resist.svg";
import get from "@/util/get.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";
import invoke from "@/util/invoke.mjs";
import isEmpty from "@/util/is-empty.mjs";
import meanBy from "@/util/mean-by.mjs";
import orderBy from "@/util/order-array-by.mjs";
import reduce from "@/util/reduce.mjs";

const ToolTipItem = styled("div")`
  display: flex;
  align-items: center;
  width: 100px;
  flex-wrap: wrap;
`;
const InlineIcon = styled("span")`
  display: inline;

  svg {
    display: inline;
    transform: translateY(2px);
  }
`;

const EARLYGAME = 660000; // 11 minutes
const EARLYMIDGAME = 1020000; // 17 min
// const MIDGAME = 1200000; // 20 min
// const MIDLATEGAME = 1620000; // 27 min
const LATEGAME = 2100000; // 35 min

//given an icon we need to tell which accolade tag it is
const ACCOLADES = reduce(
  {
    AccoladeAfk,
    AccoladeAllSeeing,
    AccoladeBackToBackDeaths,
    AccoladeBadPositioning,
    AccoladeBeginnerBot,
    AccoladeCamper,
    AccoladeCcBot,
    AccoladeComeback,
    AccoladeCompletionist,
    AccoladeCsGod,
    AccoladeCsPerMinLost,
    AccoladeCsPerMinWin,
    AccoladeDamageDealt,
    AccoladeDefensiveItemization,
    AccoladeDiedBefore2,
    AccoladeDmgKing,
    AccoladeDmgMia,
    AccoladeDuelist,
    AccoladeEarlyGame,
    AccoladeEarlySolokill,
    AccoladeFilthyRich,
    AccoladeFirstBlood,
    AccoladeFlameHorizon,
    AccoladeGoldPerMinLost,
    AccoladeGoldPerMinWin,
    AccoladeGotCamped,
    AccoladeHoarder,
    AccoladeKpGod,
    AccoladeLateFirstWard,
    AccoladeLowVision,
    AccoladeMvp,
    AccoladePentaKill,
    AccoladePoorDude,
    AccoladeProneGank,
    AccoladeRoamingGod,
    AccoladeSoloKilled,
    AccoladeStomp,
    AccoladeTeamPlayer,
    AccoladeTooTanky,
    AccoladeTripleKill,
    AccoladeTurretDestroyer,
    AccoladeUnkillable,
    AccoladeUnlucky,
    AccoladeUseYourWards,
    AccoladeWardPls,
    AccoladeWonLane,
  },

  (acc, val, key) => {
    acc.set(val, key);
    return acc;
  },
  new Map()
);

//adds extra info to a tag to send as analytic: english title and accolade
const TagArray = function () {
  const _tags = [];
  return {
    push: (tag) => {
      // if (!ACCOLADES.has(tag.icon)) {
      //     throw new Error(
      //         `Icon ${tag.title} not in ACCOLADES list -- please add to list`
      //     );
      // }
      if (Array.isArray(tag.title)) {
        const [title, englishTag] = tag.title;
        if (isEmpty(englishTag)) {
          throw new Error(
            `t function missing english translation param for ${title}`
          );
        }
        tag.title = title;
        tag.altTitle = englishTag;
      } else if (!tag.altTitle) {
        throw new Error(
          `Tag ${tag.title} is missing altTitle -- simplified english title`
        );
      }
      tag.accolade = ACCOLADES.get(tag.icon);
      _tags.push(tag);
    },
    tags: () => _tags,
  };
};

function isJungler(participant) {
  if (
    participant &&
    (participant.summoner1Id === 11 || participant.summoner2Id === 11)
  ) {
    return true;
  }
  return false;
}

function highestKP({ t, match, myId, myTeam, enemyTeam }) {
  const myParticipant = match.participants[myId - 1];
  const totalKillsMyTeam = myTeam
    .map((participant) => participant.kills)
    .reduce((a, b) => {
      return a + b;
    }, 0);
  const totalKillsEnemyTeam = enemyTeam
    .map((participant) => participant.kills)
    .reduce((a, b) => {
      return a + b;
    }, 0);
  const sortedPlayers = match.participants.slice().sort((p1, p2) => {
    const p1totalKills =
      myParticipant.teamId === p1.teamId
        ? totalKillsMyTeam
        : totalKillsEnemyTeam;
    const p2totalKills =
      myParticipant.teamId === p2.teamId
        ? totalKillsMyTeam
        : totalKillsEnemyTeam;
    const p1kp =
      (p1.kills + p1.assists) / (p1totalKills > 0 ? p1totalKills : 1);
    const p2kp =
      (p2.kills + p2.assists) / (p2totalKills > 0 ? p2totalKills : 1);
    return p2kp - p1kp;
  });
  if (sortedPlayers[0] && sortedPlayers[0].participantId === myId) {
    const kp =
      (sortedPlayers[0].kills + sortedPlayers[0].assists) /
      (totalKillsMyTeam > 0 ? totalKillsMyTeam : 1);
    if (kp < 0.2) return null;
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestKP", "KP God"),
      description: t(
        "lol:vanityTags.tips.highestKPInGame",
        `Highest kill participation ({{killParticipation}}%) in this game.`,
        {
          killParticipation: kp.toFixed(2),
        }
      ),
      icon: AccoladeKpGod,
      fancyIcon: KP_God_Icon,
      fancyIconPure: KP_God_Icon_Pure,
      flare: "Gold",
      fancyTag: {
        description: (
          <Trans i18nKey="lol:vanityTags.tips.highestKPInGameFancy">
            Nice! You had a KP of{" "}
            <b>{{ killParticipation: `${(kp * 100).toFixed(0)}%` }}</b>, the
            highest in this game!
          </Trans>
        ),
        src: "//blitz-cdn.blitz.gg/blitz/ui/img/badges/kp_god_fancy.png",
      },
    };
  }
  myTeam.sort((p1, p2) => {
    const p1kp =
      (p1.kills + p1.assists) / (totalKillsMyTeam > 0 ? totalKillsMyTeam : 1);
    const p2kp =
      (p2.kills + p2.assists) / (totalKillsMyTeam > 0 ? totalKillsMyTeam : 1);
    return p2kp - p1kp;
  });
  if (myTeam[0] && myTeam[0].participantId === myId) {
    const kp =
      (myTeam[0].kills + myTeam[0].assists) /
      (totalKillsMyTeam > 0 ? totalKillsMyTeam : 1);
    if (kp < 0.2) return null;
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestKP", "KP God"),
      description: t(
        "lol:vanityTags.tips.highestKP",
        `Highest kill participation ({{killParticipation}}%) on your team.`,
        {
          killParticipation: (kp * 100).toFixed(0),
        }
      ),
      icon: AccoladeKpGod,
    };
  }

  return null;
}

function highestKDA({ t, match, myId, myTeam }) {
  const sortedPlayers = match.participants.slice().sort((p1, p2) => {
    const p1kda = (p1.kills + p1.assists) / (p1.deaths > 0 ? p1.deaths : 1);
    const p2kda = (p2.kills + p2.assists) / (p2.deaths > 0 ? p2.deaths : 1);
    return p2kda - p1kda;
  });
  if (sortedPlayers[0] && sortedPlayers[0].participantId === myId) {
    const kda =
      (sortedPlayers[0].kills + sortedPlayers[0].assists) /
      (sortedPlayers[0].deaths > 0 ? sortedPlayers[0].deaths : 1);
    if (kda < 3.5) return null;
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestKDA", "KDA God"),
      description: t(
        "lol:vanityTags.tips.highestKDAInGame",
        `Highest KDA ({{kda}}) in this game.`,
        {
          kda: kda.toFixed(1),
        }
      ),
      icon: AccoladeDuelist,
      fancyTag: {
        description: (
          <Trans i18nKey="lol:vanityTags.tips.highestKDAInGameFancy">
            Nice! You had a KDA of <b>{{ kda: kda.toFixed(1) }}</b>, the highest
            in this game!
          </Trans>
        ),
        src: "//blitz-cdn.blitz.gg/blitz/ui/img/badges/duelist_fancy.png",
      },
    };
  }
  myTeam.sort((p1, p2) => {
    const p1kda = (p1.kills + p1.assists) / (p1.deaths > 0 ? p1.deaths : 1);
    const p2kda = (p2.kills + p2.assists) / (p2.deaths > 0 ? p2.deaths : 1);
    return p2kda - p1kda;
  });
  if (myTeam[0] && myTeam[0].participantId === myId) {
    const kda =
      (myTeam[0].kills + myTeam[0].assists) /
      (myTeam[0].deaths > 0 ? myTeam[0].deaths : 1);
    if (kda < 3.5) return null;
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestKDA", "KDA God"),
      description: t(
        "lol:vanityTags.tips.highestKDA",
        `Highest KDA ({{kda}}) on your team.`,
        {
          kda: kda.toFixed(1),
        }
      ),
      icon: AccoladeKpGod,
    };
  }

  return null;
}

function highestDamage({ t, match, myId, myTeam }) {
  const sortedPlayers = match.participants?.slice().sort((p1, p2) => {
    return p2.totalDamageDealtToChampions - p1.totalDamageDealtToChampions;
  });
  if (sortedPlayers[0] && sortedPlayers[0].participantId === myId) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestDamage", "DMG King"),
      description: t(
        "lol:vanityTags.tips.highestDamageInGame",
        `You dealt the most damage ({{damageYouDealt}}k) in this game.`,
        {
          damageYouDealt: (
            sortedPlayers[0].totalDamageDealtToChampions / 1000.0
          ).toFixed(1),
        }
      ),
      icon: AccoladeDmgKing,
      fancyIcon: DMG_God_Icon,
      fancyIconPure: DMG_God_Icon_Pure,
      flare: "Gold",
      fancyTag: {
        description: (
          <Trans i18nKey="lol:vanityTags.tips.highestDamageInGameFancy">
            Nice! You dealt{" "}
            <b>
              {{
                damageYouDealt:
                  sortedPlayers[0].totalDamageDealtToChampions.toLocaleString(
                    getLocale()
                  ),
              }}
            </b>{" "}
            damage, the most in this game!
          </Trans>
        ),
        src: "//blitz-cdn.blitz.gg/blitz/ui/img/badges/dmg_king_fancy.png",
      },
    };
  }
  myTeam.sort((p1, p2) => {
    return p2.totalDamageDealtToChampions - p1.totalDamageDealtToChampions;
  });
  if (myTeam[0] && myTeam[0].participantId === myId) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.highestDamage", "DMG King"),
      description: t(
        "lol:vanityTags.tips.highestDamage",
        `You dealt the most damage ({{damageYouDealt}}k) on your team.`,
        {
          damageYouDealt: (
            myTeam[0].totalDamageDealtToChampions / 1000.0
          ).toFixed(1),
        }
      ),
      icon: AccoladeDmgKing,
    };
  }

  return null;
}

function richest({ t, myId, myTeam, enemyTeam }) {
  myTeam.sort((p1, p2) => {
    return p2.goldEarned - p1.goldEarned;
  });
  enemyTeam.sort((p1, p2) => {
    return p2.goldEarned - p1.goldEarned;
  });
  if (
    myTeam[0] &&
    myTeam[0].participantId === myId &&
    enemyTeam.length > 0 &&
    myTeam[0].goldEarned > enemyTeam[0].goldEarned
  ) {
    return {
      category: "income",
      title: t("lol:vanityTags.tags.richest", "Filthy Rich"),
      description: t(
        "lol:vanityTags.tips.richest",
        `Richest person ({{gold}}}k gold) in the game! Don't spend it all on bitcoin.`,
        {
          gold: (myTeam[0].goldEarned / 1000.0).toFixed(1),
        }
      ),
      icon: AccoladeFilthyRich,
      fancyIcon: Filthy_Rich_Icon,
      fancyIconPure: Filthy_Rich_Icon_Pure,
      flare: "Gold",
    };
  }
  return null;
}

function poorest({ t, match, myId, myTeam }) {
  const myParticipant = match.participants[myId - 1];
  myTeam.sort((p1, p2) => {
    return p1.goldEarned - p2.goldEarned;
  });

  if (
    myParticipant &&
    myTeam[0] &&
    mapRoleToSymbol(myParticipant.individualPosition) &&
    mapRoleToSymbol(myParticipant.individualPosition) !==
      ROLE_SYMBOLS.support &&
    myTeam[0].participantId === myId &&
    myTeam[0].goldEarned < 6000 &&
    !myParticipant.win
  ) {
    return {
      category: "income",
      title: t("lol:vanityTags.tags.poorest", "Broke"),
      description: t(
        "lol:vanityTags.tips.poorest",
        "Should've bought Heart of Gold. You earned less than your support."
      ),
      icon: AccoladePoorDude,
    };
  }
  return null;
}

function bestCSer({ t, match, myId, myTeam }) {
  const durationInMinutes = match.gameDuration / 60000;
  const myParticipant = match.participants[myId - 1];
  myTeam.sort((p1, p2) => {
    return (
      p2.totalMinionsKilled +
      p2.neutralMinionsKilled -
      (p1.totalMinionsKilled + p1.neutralMinionsKilled)
    );
  });
  const myCS =
    (myParticipant.totalMinionsKilled + myParticipant.neutralMinionsKilled) /
    durationInMinutes;

  if (myTeam[0] && myTeam[0].participantId === myId && myCS > 8) {
    return {
      category: "income",
      title: t("lol:vanityTags.tags.bestCSer", "CS God"),
      description: t(
        "lol:vanityTags.tips.bestCSer",
        `Nice PvEing. Highest CS/min (${myCS.toFixed(1)}) on the team.`,
        {
          myCS: myCS.toFixed(1),
        }
      ),
      icon: AccoladeCsGod,
      fancyIcon: CS_God_Icon,
      fancyIconPure: CS_God_Icon_Pure,
      flare: "Gold",
    };
  }
  return null;
}

function unkillable({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  if (myParticipant.deaths === 0) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.unkillable", "Unkillable"),
      description: t(
        "lol:vanityTags.tips.unkillable",
        "Not even a single death!"
      ),
      icon: AccoladeUnkillable,
    };
  }
  if (myParticipant.deaths < 4) {
    const sortedPlayers = match.participants.slice().sort((p1, p2) => {
      return p1.deaths - p2.deaths;
    });
    if (sortedPlayers[0] && sortedPlayers[0].participantId === myId) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.lowestDeaths", "Lowest Deaths"),
        description: t(
          "lol:vanityTags.tips.lowestDeaths",
          `You had the lowest deaths ({{deaths}}) in this game.`,
          { deaths: myParticipant.deaths }
        ),
        icon: AccoladeUnkillable,
        fancyIcon: Unkillable_Icon,
        fancyIconPure: Unkillable_Icon_Pure,
        flare: "Gold",
        fancyTag: {
          description: (
            <Trans i18nKey="lol:vanityTags.tips.lowestDeathsFancy">
              Nice! You only had <b>{{ deaths: myParticipant.deaths }}</b>{" "}
              deaths, the lowest in this game!
            </Trans>
          ),
          src: "//blitz-cdn.blitz.gg/blitz/ui/img/badges/unkillable_fancy.png",
        },
      };
    }
  }

  return null;
}

function wonLane({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  const myKDA =
    (myParticipant.kills + myParticipant.assists) /
    (myParticipant.deaths > 0 ? myParticipant.deaths : 1);

  if (
    myParticipant &&
    myParticipant.timeline &&
    myKDA > 2.5 &&
    !isJungler(myParticipant) &&
    ((myParticipant.timeline.xpDiffPerMinDeltas &&
      myParticipant.timeline.xpDiffPerMinDeltas["0-10"] >= 80) ||
      (myParticipant.timeline.csDiffPerMinDeltas &&
        myParticipant.timeline.csDiffPerMinDeltas["0-10"] >= 1))
  ) {
    return {
      category: "combat",
      title: myParticipant.win
        ? t("lol:vanityTags.tags.wonLane", "Win Lane, Win Game")
        : t("lol:wonLane", "Won Lane"),
      description: t(
        "lol:vanityTags.tips.wonLane",
        "Kicked your lane opponent's butt (Higher CSD and XPD @ 10)."
      ),
      icon: AccoladeWonLane,
    };
  }
  return null;
}

function unlucky({ t, match, myId, myTeam }) {
  // teammate sucked but you did well
  const totalKills = myTeam
    .map((participant) => participant.kills)
    .reduce((a, b) => {
      return a + b;
    }, 0);
  const myParticipant = match.participants[myId - 1];
  const myKP =
    (myParticipant.kills + myParticipant.assists) /
    (totalKills > 0 ? totalKills : 1);
  const myKDA =
    (myParticipant.kills + myParticipant.assists) /
    (myParticipant.deaths > 0 ? myParticipant.deaths : 1);
  if ((myKDA > 3.0 || (myKP >= 0.67 && myKDA > 2.0)) && !myParticipant.win) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.unlucky", "Unlucky"),
      description: t(
        "lol:vanityTags.tips.unlucky",
        "Nice try, you performed admirably. Better luck next time."
      ),
      icon: AccoladeUnlucky,
    };
  }
  return null;
}

function highObjectives({ t, match, myId }) {
  // got a bunch of objectives
  const myParticipant = match.participants[myId - 1];
  const totalObjective =
    myParticipant.turretKills + myParticipant.inhibitorKills;

  if (totalObjective > 3) {
    return {
      category: "income",
      title: t("lol:vanityTags.tags.highObjectives", "Turret Destroyer"),
      description: t(
        "lol:vanityTags.tips.highObjectives",
        `You helped take down ${totalObjective} structures.`,
        {
          totalObjective,
        }
      ),
      icon: AccoladeTurretDestroyer,
      fancyIcon: Turret_Destroyer_Icon,
      fancyIconPure: Turret_Destroyer_Icon_Pure,
      flare: "Silver",
    };
  }

  return null;
}

function visionScore({ t, match, myId }) {
  const durationInMinutes = match.gameDuration / 60000;
  const myParticipant = match.participants[myId - 1];
  if (myParticipant.visionScore > durationInMinutes * 1.5) {
    return {
      category: "vision",
      title: t("lol:vanityTags.tags.visionScore", "All-Seeing"),
      description: t(
        "lol:vanityTags.tips.visionScore",
        `Great vision control! Your vision score was {{visionScore}}. The target was {{durationInMinutes}}. (1.5x game length)`,
        {
          visionScore: myParticipant.visionScore,
          durationInMinutes: (durationInMinutes * 1.5).toFixed(0),
        }
      ),
      icon: AccoladeAllSeeing,
      fancyIcon: All_Seeing_Icon,
      fancyIconPure: All_Seeing_Icon_Pure,
      flare: "Silver",
    };
  }
  return null;
}

function goodSupportTeamPlayer({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  const myKDA =
    (myParticipant.kills + myParticipant.assists) /
    (myParticipant.deaths > 0 ? myParticipant.deaths : 1);
  if (
    get(myParticipant, "role") === "SUPPORT" &&
    myParticipant.assists > myParticipant.kills * 2 &&
    myKDA > 3.5
  ) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.goodSupportTeamPlayer", "True Support"),
      description: t(
        "lol:vanityTags.tips.goodSupportTeamPlayer",
        `Good supporting there. Nice assists (${
          myParticipant.assists
        }) and KDA (${myKDA.toFixed(1)}).`,
        {
          assists: myParticipant.assists,
          kda: myKDA.toFixed(1),
        }
      ),
      icon: AccoladeTeamPlayer,
      fancyIcon: True_Support_Icon,
      fancyIconPure: True_Support_Icon_Pure,
      flare: "Silver",
    };
  }
  return null;
}

function tooTanky({ t, match, myId, myTeam, enemyTeam }) {
  const myParticipant = match.participants[myId - 1];
  const myKDA =
    (myParticipant.kills + myParticipant.assists) /
    (myParticipant.deaths > 0 ? myParticipant.deaths : 1);
  myTeam.sort((p1, p2) => {
    return (
      p2.damageSelfMitigated +
      p2.totalDamageTaken -
      (p1.damageSelfMitigated + p1.totalDamageTaken)
    );
  });
  enemyTeam.sort((p1, p2) => {
    return (
      p2.damageSelfMitigated +
      p2.totalDamageTaken -
      (p1.damageSelfMitigated + p1.totalDamageTaken)
    );
  });
  if (
    myTeam[0] &&
    myTeam[0].participantId === myId &&
    enemyTeam.length > 0 &&
    myTeam[0].damageSelfMitigated + myTeam[0].totalDamageTaken >
      enemyTeam[0].damageSelfMitigated + enemyTeam[0].totalDamageTaken &&
    myKDA > 2.0
  ) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.tooTanky", "THICC"),
      description: t(
        "lol:vanityTags.tips.tooTanky",
        "Tanked the most damage in game: {{damage}}k",
        {
          damage: (
            (myTeam[0].damageSelfMitigated + myTeam[0].totalDamageTaken) /
            1000.0
          ).toFixed(1),
        }
      ),
      icon: AccoladeTooTanky,
      fancyIcon: Thicc_Icon,
      fancyIconPure: Thicc_Icon_Pure,
      flare: "Silver",
    };
  }
  return null;
}

function gotFirstBlood({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  if (myParticipant.firstBloodKill) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.gotFirstBlood", "First Blood"),
      description: t(
        "lol:vanityTags.tips.gotFirstBlood",
        "Ayy, you got the first kill."
      ),
      icon: AccoladeFirstBlood,
      fancyIcon: First_Blood_Icon,
      fancyIconPure: First_Blood_Icon_Pure,
      flare: "Silver",
    };
  }
}

function expertCSer({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  if (
    myParticipant &&
    myParticipant.timeline &&
    myParticipant.timeline.creepsPerMinDeltas &&
    myParticipant.timeline.creepsPerMinDeltas["0-10"] &&
    myParticipant.timeline.creepsPerMinDeltas["0-10"] >= 7.6
  ) {
    return {
      category: "income",
      title: t("lol:vanityTags.tags.expertCSer", "Expert Farmer"),
      description: t(
        "lol:vanityTags.tips.expertCSer",
        "{{cs}} CS at 10 minutes. Perfect CS is 107 at 10:05.",
        {
          cs: Math.floor(
            myParticipant.timeline.creepsPerMinDeltas["0-10"] * 10
          ),
        }
      ),
      icon: AccoladeCsGod,
    };
  }
}

function areYouAFK({ t, match, myId, myTeam }) {
  const myParticipant = match.participants[myId - 1];
  const totalKills = myTeam
    .map((participant) => participant.kills)
    .reduce((a, b) => {
      return a + b;
    }, 0);

  const myKP =
    (myParticipant.kills + myParticipant.assists) /
    (totalKills > 0 ? totalKills : 1);
  const myKDA =
    (myParticipant.kills + myParticipant.assists) /
    (myParticipant.deaths > 0 ? myParticipant.deaths : 1);
  if (
    myParticipant.win &&
    totalKills > 0 &&
    myKP < 0.4 &&
    myParticipant.turretKills + myParticipant.inhibitorKills < 2 &&
    myParticipant.visionScore < 20 &&
    myKDA < 2.0 &&
    myParticipant.totalDamageDealtToChampions < 5000 // this should change to % of damage.
  ) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.areYouAFK", "Moral Support"),
      description: t(
        "lol:vanityTags.tips.areYouAFK",
        "Better honor your teammates. Low KP, DMG, KDA, vision score, and objectives."
      ),
      icon: AccoladeBeginnerBot,
    };
  }
}

function T_earlyGameMonster({ t, myId, reducedTimeline }) {
  if (reducedTimeline) {
    let myTeamKills = 0;
    let myKillsOrAssists = 0;
    for (const frame of reducedTimeline) {
      if (frame.timestamp < EARLYGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          myTeamKills += 1;
          if (
            myId === killEvent.killerId ||
            killEvent?.assistingParticipantIds?.includes(myId)
          ) {
            myKillsOrAssists += 1;
          }
        }
      }
    }

    if (
      myTeamKills > 0 &&
      (myKillsOrAssists > 5 ||
        (myKillsOrAssists / myTeamKills >= 0.6 && myKillsOrAssists > 2))
    ) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.T_earlyGameMonster", "Early Game Carry"),
        description: t(
          "lol:vanityTags.tips.T_earlyGameMonster",
          `Part of {{earlyTeamKills}}% of team kills early game!`,
          {
            earlyTeamKills: ((myKillsOrAssists / myTeamKills) * 100).toFixed(0),
          }
        ),
        icon: AccoladeEarlyGame,
        fancyIcon: Early_Game_Carry_Icon,
        fancyIconPure: Early_Game_Carry_Icon_Pure,
        flare: "Silver",
      };
    }
  }
  return null;
}

function T_jungleKillsInAllLanes({ t, match, myId, reducedTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (reducedTimeline && isJungler(myParticipant)) {
    const myVictims = [];
    for (const frame of reducedTimeline) {
      if (frame.timestamp < EARLYMIDGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            (myId === killEvent.killerId ||
              killEvent.assistingParticipantIds?.includes(myId)) &&
            !myVictims.includes(killEvent.victimId)
          ) {
            myVictims.push(killEvent.victimId);
          }
        }
      }
    }
    const allLanes = ["TOP", "MIDDLE", "BOTTOM"];
    for (const victimId of myVictims) {
      const victim = match.participants[victimId - 1];
      const victimLane = laneNormalize(get(victim, "individualPosition"));
      const index = allLanes.indexOf(victimLane);
      if (index >= 0) {
        allLanes.splice(index, 1);
      }
    }
    if (allLanes.length === 0) {
      return {
        category: "combat",
        title: t(
          "lol:vanityTags.tags.T_jungleKillsInAllLanes",
          "Completionist"
        ),
        description: t(
          "lol:vanityTags.tips.T_jungleKillsInAllLanes",
          "As Jungler, you got kills in all 3 lanes."
        ),
        icon: AccoladeCompletionist,
        fancyIcon: Completionist_Icon,
        fancyIconPure: Completionist_Icon_Pure,
        flare: "Silver",
      };
    }
  }
  return null;
}

function T_manyKillsInOtherLanes({ t, match, myId, reducedTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (reducedTimeline && !isJungler(myParticipant)) {
    const myVictims = [];
    for (const frame of reducedTimeline) {
      if (frame.timestamp < EARLYMIDGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            myId === killEvent.killerId ||
            killEvent.assistingParticipantIds?.includes(myId)
          ) {
            myVictims.push(killEvent.victimId);
          }
        }
      }
    }

    let killsInOtherLanes = 0;
    for (const victimId of myVictims) {
      const victim = match.participants[victimId - 1];
      const victimLane = laneNormalize(get(victim, "individualPosition"));
      if (
        victimLane !== laneNormalize(get(myParticipant, "individualPosition"))
      ) {
        killsInOtherLanes += 1;
      }
    }
    if (killsInOtherLanes > 4) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.T_manyKillsInOtherLanes", "Roaming King"),
        description: t(
          "lol:vanityTags.tips.T_manyKillsInOtherLanes",
          `You exerted a lot of map pressure. Multiple kills/assists (${killsInOtherLanes}) in other lanes.`,
          {
            killsInOtherLanes,
          }
        ),
        icon: AccoladeRoamingGod,
      };
    }
  }
  return null;
}

// top/mid/bot camper/tenter: if jungle, kept getting kills in 1 lane
function T_jungleLaneCamper({ t, match, myId, reducedTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (reducedTimeline && isJungler(myParticipant)) {
    const myVictims = {
      TOP: 0,
      MIDDLE: 0,
      BOTTOM: 0,
    };
    for (const frame of reducedTimeline) {
      if (frame.timestamp < EARLYMIDGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            myId === killEvent.killerId ||
            killEvent.assistingParticipantIds?.includes(myId)
          ) {
            const victim = get(
              match,
              `participants[${killEvent.victimId - 1}]`
            );
            if (
              victim &&
              Object.keys(myVictims).includes(
                laneNormalize(victim.individualPosition)
              )
            ) {
              myVictims[laneNormalize(victim.individualPosition)] += 1;
            }
          }
        }
      }
    }
    const totalKills = Object.values(myVictims).reduce((a, b) => a + b, 0);
    let mostKilledLane = null;
    let mostkilledLaneKillCount = 0;
    if (totalKills > 0) {
      for (const lane of Object.keys(myVictims)) {
        if (
          myVictims[lane] > mostkilledLaneKillCount &&
          myVictims[lane] / totalKills > 0.4
        ) {
          mostKilledLane = lane;
          mostkilledLaneKillCount = myVictims[lane];
        }
      }
    }
    if (mostKilledLane && mostkilledLaneKillCount > 2) {
      return {
        category: "combat",
        title: t(
          "lol:vanityTags.tags.T_jungleLaneCamper",
          `${laneHumanize(mostKilledLane)} Lane Camper`,
          {
            mostKilledLane: laneHumanize(mostKilledLane),
          }
        ),
        description: t(
          "lol:vanityTags.tips.T_jungleLaneCamper",
          `Did you set up a tent in ${laneHumanize(
            mostKilledLane
          )}? ${mostkilledLaneKillCount}+ kills there.`,
          {
            mostKilledLane: laneHumanize(mostKilledLane),
            mostkilledLaneKillCount,
          }
        ),
        icon: AccoladeCamper,
        fancyIcon: Top_Lane_Camper_Icon,
        fancyIconPure: Top_Lane_Camper_Icon_Pure,
        flare: "Bronze",
      };
    }
  }
  return null;
}

function T_gotCamped({ t, match, myId, enemyTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (
    myParticipant &&
    myParticipant.timeline &&
    enemyTimeline &&
    !isJungler(myParticipant) &&
    mapRoleToSymbol(myParticipant.individualPosition)
  ) {
    let deathsToGanks = 0;
    for (const frame of enemyTimeline) {
      if (frame.timestamp < EARLYMIDGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            myId === killEvent.victimId &&
            killEvent.assistingParticipantIds
          ) {
            const assistingParticipantIds =
              killEvent.assistingParticipantIds || [];
            const killers = [
              ...assistingParticipantIds.map(
                (id) => match.participants[id - 1]
              ),
              get(match, `participants[${killEvent.killerId - 1}]`),
            ];
            const killerLanes = Array.from(
              new Set(
                killers
                  .filter((_) => _)
                  .map((participant) =>
                    laneNormalize(participant.individualPosition)
                  )
              )
            );
            if (
              killerLanes.includes(
                laneNormalize(myParticipant.individualPosition)
              ) &&
              killerLanes.length > 1
            ) {
              deathsToGanks += 1;
            }
          }
        }
      }
    }
    if (deathsToGanks > 2) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.T_gotCamped", "Got Camped"),
        description: t(
          "lol:vanityTags.tips.T_gotCamped",
          "That's pretty unlucky."
        ),
        icon: AccoladeGotCamped,
      };
    }
  }
  return null;
}

function T_flameHorizon({ t, match, myId, enemyTeam, timeline }) {
  const myParticipant = match.participants[myId - 1];
  if (
    myParticipant &&
    timeline &&
    mapRoleToSymbol(myParticipant.individualPosition)
  ) {
    const enemy = enemyTeam.find(
      (participant) =>
        participant &&
        participant.participantId &&
        mapRoleToSymbol(myParticipant.individualPosition) ===
          mapRoleToSymbol(participant.individualPosition)
    );
    const enemyId = enemy?.participantId;
    if (enemyId) {
      let highestCSD = 0;
      for (const frame of timeline.frames) {
        if (frame.timestamp < LATEGAME) {
          const { participantFrames } = frame;
          const myFrame = Object.values(participantFrames).find(
            (part) => part.participantId === myId
          );
          const enemyFrame = Object.values(participantFrames).find(
            (part) => part.participantId === enemyId
          );
          const csd =
            myFrame.minionsKilled +
            myFrame.jungleMinionsKilled -
            (enemyFrame.minionsKilled + enemyFrame.jungleMinionsKilled);
          if (csd > highestCSD) {
            highestCSD = csd;
          }
        }
      }
      if (highestCSD >= 100) {
        return {
          category: "income",
          title: t("lol:vanityTags.tags.T_flameHorizon", "Flame Horizon"),
          description: t(
            "lol:vanityTags.tips.T_flameHorizon",
            "You had 100 CS over your lane opponent at one point."
          ),
          icon: AccoladeFlameHorizon,
          fancyIcon: Flame_Horizon_Icon,
          fancyIconPure: Flame_Horizon_Icon_Pure,
          flare: "Gold",
        };
      }
    }
  }
  return null;
}

function T_expertDuelist({ t, myId, reducedTimeline }) {
  if (reducedTimeline) {
    let soloKillCount = 0;
    for (const frame of reducedTimeline) {
      if (frame.timestamp < EARLYGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            myId === killEvent.killerId &&
            !killEvent.assistingParticipantIds
          ) {
            soloKillCount += 1;
          }
        }
      }
    }
    if (soloKillCount > 3) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.T_expertDuelist", "Master Duelist"),
        description: t(
          "lol:vanityTags.tips.T_expertDuelist",
          `You 1v1 styled on people ${soloKillCount} times.`,
          {
            soloKillCount,
          }
        ),
        icon: AccoladeDuelist,
        fancyIcon: Master_Duelist_Icon,
        fancyIconPure: Master_Duelist_Icon_Pure,
        flare: "Bronze",
      };
    }
  }
  return null;
}

function T_comeback({ t, match, myId, timeline }) {
  const myParticipant = match.participants[myId - 1];
  if (timeline && myParticipant.win) {
    let greatestGoldDeficit = 0;
    for (const frame of timeline.frames) {
      const { participantFrames } = frame;
      if (Object.keys(participantFrames).length === 10) {
        const blueSum = [1, 2, 3, 4, 5].reduce((sum, key) => {
          return sum + participantFrames[key].totalGold;
        }, 0);
        const redSum = [6, 7, 8, 9, 10].reduce((sum, key) => {
          return sum + participantFrames[key].totalGold;
        }, 0);

        let goldDeficit = 0;
        if (myParticipant.teamId === 100) {
          goldDeficit = redSum - blueSum;
        } else {
          goldDeficit = blueSum - redSum;
        }
        if (goldDeficit > greatestGoldDeficit) {
          greatestGoldDeficit = goldDeficit;
        }
      }
    }
    if (greatestGoldDeficit > 4500) {
      return {
        category: "income",
        title: t("lol:vanityTags.tags.T_comeback", "Comeback"),
        description: t(
          "lol:vanityTags.tips.T_comeback",
          `You guys were behind by {{comeback}}k gold at one point!`,
          {
            comeback: (greatestGoldDeficit / 1000.0).toFixed(1),
          }
        ),
        fancyIcon: Comeback_Icon,
        fancyIconPure: Comeback_Icon_Pure,
        flare: "Gold",
        icon: AccoladeComeback,
      };
    }
  }
  return null;
}

function T_gotSoloKill({ t, match, myId, reducedTimeline, champions }) {
  if (match && reducedTimeline && champions) {
    const soloKills = [];
    reducedTimeline.forEach((frame) => {
      const killEvents = frame.sortedEvents.kills;
      killEvents.forEach((killEvent) => {
        const championId = get(
          match,
          `participants[${killEvent.victimId - 1}].championId`
        );
        const champion = (getChampion(championId) || {}).name;

        if (
          myId === killEvent.killerId &&
          !killEvent.assistingParticipantIds &&
          champion
        ) {
          soloKills.push({
            champion,
            championId,
            timestamp: formatDuration(killEvent.timestamp, "m:ss"),
          });
        }
      });
    });
    if (!soloKills.length) return null;
    let description,
      tooltip = null;
    if (soloKills.length === 1) {
      description = t(
        "lol:vanityTags.tips.T_gotSoloKill",
        `You solo killed {{champion}} at {{timestamp}}.`,
        {
          champion: soloKills[0].champion,
          timestamp: soloKills[0].timestamp,
        }
      );
    } else {
      const instanceOrInstances =
        soloKills.length === 2 ? "instance" : "instances";
      description = t(
        `lol:vanityTags.tips.T_gotSoloKill_instance`,
        `You solo killed {{champion}} at {{timestamp}} and {{counter}} other {{instance}}.`,
        {
          champion: soloKills[0].champion,
          timestamp: soloKills[0].timestamp,
          counter: soloKills.length - 1,
          instance: instanceOrInstances,
        }
      );
      // eslint-disable-next-line react/display-name
      tooltip = () => (
        <div>
          {soloKills.map((kills) => {
            return (
              <ToolTipItem
                style={{ justifyContent: "space-between" }}
                key={kills.timestamp}
              >
                <img
                  css={`
                    width: var(--sp-6);
                    border-radius: 50%;
                    height: var(--sp-6);
                  `}
                  src={Static.getChampionImageById(champions, kills.championId)}
                />{" "}
                <AccoladeEarlySolokill
                  css={`
                    width: var(--sp-6);
                    height: var(--sp-6);
                  `}
                />
                {kills.timestamp}
              </ToolTipItem>
            );
          })}
        </div>
      );
    }
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.T_gotSoloKill", "Solo Killer"),
      description,
      icon: AccoladeEarlySolokill,
      fancyIcon: Solo_Killer_Icon,
      fancyIconPure: Solo_Killer_Icon_Pure,
      flare: "Silver",
      tooltip,
    };
  }
}

// Negatives

function lowestDamage({ t, match, myId, myTeam }) {
  const myParticipant = match.participants[myId - 1];
  myTeam.sort((p1, p2) => {
    return p1.totalDamageDealtToChampions - p2.totalDamageDealtToChampions;
  });

  if (
    myParticipant &&
    myTeam[0] &&
    mapRoleToSymbol(myParticipant.individualPosition) &&
    (mapRoleToSymbol(myParticipant.individualPosition) === ROLE_SYMBOLS.adc ||
      mapRoleToSymbol(myParticipant.individualPosition) === ROLE_SYMBOLS.mid) &&
    myTeam[0].participantId === myId
  ) {
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.lowestDamage", "DMG MIA"),
      description: t(
        "lol:vanityTags.tips.lowestDamage",
        "Your support did more damage than you ):"
      ),
      icon: AccoladeDmgMia,
    };
  }
  return null;
}

function T_lowVisionScore({ t, match, myId }) {
  const durationInMinutes = match.gameDuration / 60000;
  const myParticipant = match.participants[myId - 1];
  if (myParticipant.visionScore < durationInMinutes * 0.6) {
    return {
      category: "vision",
      altTitle: "Low Vision Score",
      title: t(
        "lol:vanityTags.tags.T_lowVisionScore",
        `Low Vision Score: ${myParticipant.visionScore}`,
        {
          visionScore: myParticipant.visionScore,
        }
      ),
      description: t(
        "lol:vanityTags.tips.T_lowVisionScore",
        "Roughly equal to minutes of vision provided or denied. Try to aim for 1.5x game length."
      ),
      icon: AccoladeLowVision,
    };
  }
  return null;
}

function noControlWards({ t, match, myId }) {
  const myParticipant = match.participants[myId - 1];
  if (myParticipant.visionWardsBoughtInGame === 0) {
    return {
      category: "vision",
      title: t("lol:vanityTags.tags.noControlWards", "No Control Wards"),
      description: t(
        "lol:vanityTags.tips.T_noControlWards",
        "They're OP as they grant and deny vision. Pros buy them on every back if possible."
      ),
      icon: AccoladeWardPls,
    };
  }
}

function T_diedToGanksAlot({ t, match, myId, enemyTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (
    myParticipant &&
    enemyTimeline &&
    !isJungler(myParticipant) &&
    mapRoleToSymbol(myParticipant.individualPosition)
  ) {
    let deathsToGanks = 0;
    for (const frame of enemyTimeline) {
      if (frame.timestamp < EARLYMIDGAME) {
        const killEvents = frame.sortedEvents.kills;
        for (const killEvent of killEvents) {
          if (
            myId === killEvent.victimId &&
            killEvent.assistingParticipantIds
          ) {
            const assistingParticipantIds =
              killEvent.assistingParticipantIds || [];
            const killers = [
              ...assistingParticipantIds.map(
                (id) => match.participants[id - 1]
              ),
              get(match, `participants[${killEvent.killerId - 1}]`),
            ];
            const hasJungle = killers.some((killer) => isJungler(killer));
            if (hasJungle) {
              deathsToGanks += 1;
            }
          }
        }
      }
    }
    if (deathsToGanks > 2) {
      return {
        category: "combat",
        title: t(
          "lol:vanityTags.tags.T_diedToGanksAlot",
          "Multiple Jungle Deaths"
        ),
        description: t(
          "lol:vanityTags.tips.T_diedToGanksAlot",
          `Died ${deathsToGanks} times to Jungle ganks.`,
          {
            deathsToGanks,
          }
        ),
        icon: AccoladeProneGank,
      };
    }
  }
  return null;
}

function T_lateFirstWard({ t, match, myId, reducedTimeline }) {
  const myParticipant = match.participants[myId - 1];
  if (myParticipant && reducedTimeline) {
    let firstWard;
    for (const frame of reducedTimeline) {
      if (frame.timestamp) {
        const wardEvents = frame.sortedEvents.wardsPlaced;
        for (const wardEvent of wardEvents) {
          if (myId === wardEvent.creatorId && !firstWard) {
            firstWard = wardEvent.timestamp;
          }
        }
      }
    }

    if (firstWard > 270000) {
      // 4.5 miniutes
      return {
        category: "vision",
        title: t("lol:vanityTags.tags.T_lateFirstWard", "Late First Ward"),
        description: t(
          "lol:vanityTags.tips.T_lateFirstWard",
          "Your first ward (post minion spawn) was placed at {{formattedFirstWard}}.",
          {
            formattedFirstWard: formatDuration(firstWard, "m:ss"),
          }
        ),
        icon: AccoladeLateFirstWard,
      };
    }
  }
  return null;
}

function T_deadHoarder({ t, myId, timeline }) {
  if (timeline) {
    const deaths = [];
    timeline.frames.forEach((frame) => {
      const myFrame = Object.values(frame.participantFrames).find(
        (part) => part.participantId === myId
      );
      frame.events.forEach((event) => {
        if (
          event.type === "CHAMPION_KILL" &&
          event.victimId === myId &&
          myFrame.currentGold > 2500 &&
          event.timestamp < LATEGAME
        ) {
          deaths.push({
            gold: myFrame.currentGold,
            time: formatDuration(event.timestamp, "m:ss"),
          });
        }
      });
    });

    if (deaths.length > 0) {
      let goldAndTime = "";
      for (let index = 0; index < deaths.length; index++) {
        if (deaths[index + 1]) {
          goldAndTime += `${deaths[index].gold}G at ${deaths[index].time}, `;
        } else {
          goldAndTime += `${deaths[index].gold}G at ${deaths[index].time}`;
        }
      }
      return {
        category: "income",
        title: t("lol:vanityTags.tags.T_deadHoarder", "Dead Hoarder"),
        description: t(
          "lol:vanityTags.tips.T_deadHoarder",
          `You died with ${goldAndTime}. Pro players buy items during power spikes to increase their advantage and pressure to the map.`,
          {
            goldAndTime,
          }
        ),
        icon: AccoladeHoarder,
      };
    }
  }
  return null;
}

function T_backToBackDeaths({ t, myId, enemyTimeline }) {
  if (enemyTimeline) {
    const deaths = [];
    enemyTimeline.forEach((frame) => {
      const killEvents = frame.sortedEvents.kills;
      killEvents.forEach((killEvent) => {
        if (myId === killEvent.victimId) deaths.push(killEvent.timestamp);
      });
    });

    const b2BD = [];
    let currStreak = [];
    let currStreakTime = [];
    const addTob2BD = () => {
      if (currStreakTime.length >= 2) b2BD.push(currStreakTime);
    };
    for (let index = 0; index < deaths.length; index++) {
      const death = deaths[index];
      if (
        !currStreak.length ||
        death - currStreak[currStreak.length - 1] < 180000
      ) {
        currStreak.push(death);
        currStreakTime.push(formatDuration(death, "m:ss"));
      } else {
        addTob2BD();
        currStreakTime = [];
        currStreak = [];
      }
    }

    addTob2BD();

    if (!b2BD.length) return null;
    let description, tooltip;
    const firstb2BD = b2BD[0].join(" & ");
    if (b2BD.length === 1) {
      description = t(
        "lol:vanityTags.tips.T_backToBackDeaths",
        `You died at {{timestamp}}. Play more cautiously if you are dying back to back. Enemies tend to gank and regank lanes that are weak.`,
        {
          timestamp: firstb2BD,
        }
      );
    } else {
      const periodOrPeriods = b2BD.length === 2 ? "period" : "periods";

      description = t(
        `lol:vanityTags.tips.T_backToBackDeaths_period`,
        `You died at {{timestamp}} and {{deathCounter}} other {{period}}. Play more cautiously if you are dying back to back. Enemies tend to gank and regank lanes that are weak.`,
        {
          timestamp: firstb2BD,
          deathCounter: b2BD.length - 1,
          period: periodOrPeriods,
        }
      );
    }
    if (description) {
      tooltip = b2BD.map((death) => {
        return (
          <ToolTipItem key={death}>
            {death.map((d, i) => {
              return (
                <span key={d}>
                  {d}
                  {death[i + 1] && (
                    // eslint-disable-next-line
                    <span
                      css={`
                        color: var(--shade2);
                        padding: 0px 3px;
                      `}
                    >
                      &
                    </span>
                  )}
                </span>
              );
            })}
          </ToolTipItem>
        );
      });
      return {
        category: "combat",
        title: t(
          "lol:vanityTags.tags.T_backToBackDeaths",
          "Back to back deaths"
        ),
        description,
        icon: AccoladeBackToBackDeaths,
        tooltip,
      };
    }
  }
}

function T_badPositioning({ t, match, myId, timeline }) {
  if (!timeline) return;
  const myParticipant = match.participants[myId - 1];
  if (
    mapRoleToSymbol(myParticipant.individualPosition) !== ROLE_SYMBOLS.adc &&
    mapRoleToSymbol(myParticipant.individualPosition) !== ROLE_SYMBOLS.mid
  )
    return;
  let deaths = [];
  const myDeaths = [];
  let myDeath;

  const addToMyDeaths = () => {
    if (myDeath && myDeath.number <= 2 && deaths.length) {
      myDeaths.push(formatDuration(myDeath.t, "m:ss"));
    }
  };
  timeline.frames.slice(11, timeline.frames.length).forEach((frame) => {
    frame.events.forEach((event) => {
      if (event.type !== "CHAMPION_KILL") return;
      if (
        !deaths.length ||
        event.timestamp - deaths[deaths.length - 1] < 20000
      ) {
        deaths.push(event.timestamp);
        if (event.victimId === myId) {
          myDeath = { t: event.timestamp, number: deaths.length };
        }
      } else {
        addToMyDeaths();
        myDeath = null;
        deaths = [event.timestamp];
      }
    });
  });
  addToMyDeaths();

  if (!myDeaths.length) return null;
  let description = null;
  if (myDeaths.length === 1) {
    description = t(
      "lol:vanityTags.tips.T_badPositioning",
      `You died early in the/these teamfights at {{timestamp}}. Your job as a carry is to deal damage. Position better and stay back. Try to get as many spell rotations and auto attacks as possible.`,
      {
        timestamp: myDeaths[0],
      }
    );
  } else {
    const instanceOrInstances =
      myDeaths.length === 2 ? "instance" : "instances";

    description = t(
      `lol:vanityTags.tips.T_badPositioning_instance`,
      `You died early in the/these teamfights at {{timestamp}}. and {{deathCounter}} other {{instance}}. Your job as a carry is to deal damage. Position better and stay back. Try to get as many spell rotations and auto attacks as possible.`,
      {
        timestamp: myDeaths[0],
        deathCounter: myDeaths.length - 1,
        instance: instanceOrInstances,
      }
    );
  }
  return {
    category: "combat",
    title: t(
      "lol:vanityTags.tags.T_badPositioning",
      "Bad teamfight positioning"
    ),
    description,
    icon: AccoladeBadPositioning,
  };
}

function T_useVisionWards({ t, myId, timeline }) {
  if (timeline) {
    let cd;
    let hasWard;
    const wardId = 3340;
    let charge = 1;
    let minutesWithTwoWards = 0;
    const getCd = (participantFrames) => {
      return 240.059 - 7.059 * meanBy(participantFrames, (p) => p.level);
    };
    timeline.frames.forEach((frame) => {
      frame.events.forEach((event) => {
        if (
          event.participantId === myId &&
          event.type === "ITEM_PURCHASED" &&
          event.itemId === wardId
        ) {
          if (charge !== 2)
            cd =
              getCd(Object.values(frame.participantFrames)) +
              (event.timestamp - frame.timestamp) / 1000;
          hasWard = true;
        }
        if (
          event.wardType === "YELLOW_TRINKET" &&
          event.type === "WARD_PLACED" &&
          event.creatorId === myId
        ) {
          charge -= 1;
          if (!cd)
            cd =
              getCd(Object.values(frame.participantFrames)) +
              (event.timestamp - frame.timestamp) / 1000;
          hasWard = true;
        }
        if (
          event.participantId === myId &&
          event.type === "ITEM_DESTROYED" &&
          event.itemId === wardId
        ) {
          hasWard = false;
        }
      });

      if (!hasWard) return;
      if (charge === 2) minutesWithTwoWards += 1;
      if (!cd) return;
      cd -= 60;
      if (cd <= 0) {
        charge += 1;
        cd =
          charge === 2
            ? null
            : getCd(Object.values(frame.participantFrames)) + cd;
      }
    });
    if (minutesWithTwoWards < 1) return null;
    const minuteOrMinutes = minutesWithTwoWards === 1 ? "minute" : "minutes";
    return {
      category: "vision",
      wardsUnused: minutesWithTwoWards,
      title: t("lol:vanityTags.tags.T_useVisionWards", "Use Your Wards"),
      description: t(
        `lol:vanityTags.tips.T_useVisionWards_${minuteOrMinutes}`,
        `You had 2 stacks on your trinket for more than ${minutesWithTwoWards} ${minuteOrMinutes} of the game. You aren't placing free wards!`,
        {
          minutes: minutesWithTwoWards,
        }
      ),
      icon: AccoladeUseYourWards,
    };
  }
}

function T_gotSoloKilled({ t, match, myId, enemyTimeline, champions }) {
  if (match && enemyTimeline && champions) {
    const soloDeaths = [];
    enemyTimeline.forEach((frame) => {
      const killEvents = frame.sortedEvents.kills;
      killEvents.forEach((killEvent) => {
        const championId = get(
          match,
          `participants[${killEvent.killerId - 1}].championId`
        );
        const champion = (getChampion(championId) || {}).name;
        if (
          myId === killEvent.victimId &&
          !killEvent.assistingParticipantIds &&
          champion
        ) {
          soloDeaths.push({
            champion,
            championId,
            timestamp: formatDuration(killEvent.timestamp, "m:ss"),
          });
        }
      });
    });
    if (!soloDeaths.length) return null;
    let description,
      tooltip = null;
    if (soloDeaths.length === 1) {
      description = t(
        "lol:vanityTags.tips.T_gotSoloKilled",
        `You got solo killed by {{champion}} at {{timestamp}}.`,
        {
          champion: soloDeaths[0].champion,
          timestamp: soloDeaths[0].timestamp,
        }
      );
    } else {
      const instanceOrInstances =
        soloDeaths.length === 2 ? "instance" : "instances";
      description = t(
        `lol:vanityTags.tips.T_gotSoloKilled_instance`,
        `You got solo killed by {{champion}} at {{timestamp}} and {{deathCounter}} other {{instance}}.`,
        {
          champion: soloDeaths[0].champion,
          timestamp: soloDeaths[0].timestamp,
          deathCounter: soloDeaths.length - 1,
          instance: instanceOrInstances,
        }
      );
    }
    tooltip = soloDeaths.map((death) => {
      return (
        <ToolTipItem
          style={{ justifyContent: "space-between" }}
          key={death.timestamp}
        >
          <img
            css={`
              width: var(--sp-6);
              border-radius: 50%;
              height: var(--sp-6);
            `}
            src={Static.getChampionImageById(champions, death.championId)}
          />{" "}
          <AccoladeSoloKilled />
          {death.timestamp}
        </ToolTipItem>
      );
    });
    return {
      category: "combat",
      title: t("lol:vanityTags.tags.T_gotSoloKilled", "Got Solo Killed"),
      description,
      icon: AccoladeSoloKilled,
      tooltip,
    };
  }
}

function T_earlyDeath({ t, myId, enemyTimeline }) {
  if (enemyTimeline) {
    let earlyDeath = false;
    enemyTimeline.forEach((frame) => {
      if (frame.timestamp < 120000) {
        const killEvents = frame.sortedEvents.kills;
        killEvents.forEach((killEvent) => {
          if (myId === killEvent.victimId) earlyDeath = true;
        });
      }
    });
    if (earlyDeath) {
      return {
        category: "combat",
        title: t("lol:vanityTags.tags.T_earlyDeath", "Death Before 2:00"),
        description: t(
          "lol:vanityTags.tips.T_earlyDeath",
          "Dying before 2:00 lowers your chances of winning by up to 5%. Focus on not getting caught and position wisely"
        ),
        icon: AccoladeDiedBefore2,
      };
    }
  }
  return null;
}

const statsMap = {
  cs: {
    pre: {
      computeStat: (frame, minute) => {
        return (frame.minionsKilled + frame.jungleMinionsKilled) / minute;
      },
      pos: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_csRatePre15Vs_better",
            "Won in early game CS"
          ),
          description: t(
            "lol:vanityTags.tips.T_csRatePre15Vs_better",
            "Your CS/min ({{myCs}}) was {{csPerMinDiff, percent}} better than {{opponentChampion}} ({{theirCs}}) before the 15 minute mark.",
            tipData
          ),
          icon: AccoladeCsPerMinWin,
        };
      },
      neg: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_csRatePre15Vs_worse",
            "Lost in early game CS"
          ),
          description: t(
            "lol:vanityTags.tips.T_csRatePre15Vs_worse",
            "Your CS/min ({{myCs}}) was {{csPerMinDiff, percent}} worse than {{opponentChampion}} ({{theirCs}}) before the 15 minute mark.",
            tipData
          ),
          // icon: AccoladeCsPerMinLost,
          icon: AccoladeCsPerMinLost,
        };
      },
    },
    post: {
      computeStat: (frame, minute, participant) => {
        const statAt15 = frame.minionsKilled + frame.jungleMinionsKilled;
        const statPost15 =
          participant.totalMinionsKilled +
          participant.neutralMinionsKilled -
          statAt15;
        return statPost15 / minute;
      },
      pos: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_csRatePost15Vs_better",
            "Won in mid-late game CS"
          ),
          description: t(
            "lol:vanityTags.tips.T_csRatePost15Vs_better",
            "Your CS/min ({{myCs}}) was {{csPerMinDiff, percent}} better than {{opponentChampion}} ({{theirCs}}) past the 15 minute mark.",
            tipData
          ),
          icon: AccoladeCsPerMinWin,
        };
      },
      neg: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_csRatePost15Vs_worse",
            "Lost in mid-late game CS"
          ),
          description: t(
            "lol:vanityTags.tips.T_csRatePost15Vs_worse",
            "Your CS/min ({{myCs}}) was {{csPerMinDiff, percent}} worse than {{opponentChampion}} ({{theirCs}}) past the 15 minute mark.",
            tipData
          ),
          // icon: AccoladeCsPerMinLost,
          icon: AccoladeCsPerMinLost,
        };
      },
    },
  },
  gold: {
    pre: {
      computeStat: (frame, minute) => {
        return frame.totalGold / minute;
      },
      pos: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_goldRatePre15Vs_better",
            "Won in early game gold"
          ),
          description: t(
            "lol:vanityTags.tips.T_goldRatePre15Vs_better",
            "Your gold/min was {{goldPerMinDiff, percent}} better than {{opponentChampion}} before the 15 minute mark.",
            tipData
          ),
          icon: AccoladeGoldPerMinWin,
          // icon: AccoladeGoldPerMinLost,
        };
      },
      neg: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_goldRatePre15Vs_worse",
            "Lost in early game gold"
          ),
          description: t(
            "lol:vanityTags.tips.T_goldRatePre15Vs_worse",
            "Your gold/min was {{goldPerMinDiff, percent}} worse than {{opponentChampion}} before the 15 minute mark.",
            tipData
          ),
          icon: AccoladeGoldPerMinLost,
          // icon: AccoladeGoldPerMinLost,
        };
      },
    },
    post: {
      computeStat: (frame, minute, participant) => {
        return (participant.goldEarned - frame.totalGold) / minute;
      },
      pos: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_goldRatePost15Vs_better",
            "Won in mid-late game gold"
          ),
          description: t(
            "lol:vanityTags.tips.T_goldRatePost15Vs_better",
            "Your gold/min was {{goldPerMinDiff, percent}} better than {{opponentChampion}} past the 15 minute mark.",
            tipData
          ),
          icon: AccoladeGoldPerMinWin,
          // icon: AccoladeCsPerMinLost,
        };
      },
      neg: (t, tipData) => {
        return {
          category: "income",
          title: t(
            "lol:vanityTags.tags.T_goldRatePost15Vs_worse",
            "Lost in mid-late game gold"
          ),
          description: t(
            "lol:vanityTags.tips.T_goldRatePost15Vs_worse",
            "Your gold/min was {{goldPerMinDiff, percent}} worse than {{opponentChampion}} past the 15 minute mark.",
            tipData
          ),
          icon: AccoladeGoldPerMinLost,
          // icon: AccoladeCsPerMinLost,
        };
      },
    },
  },
};

function T_statVs(stat, prePost) {
  return ({ t, match, myId, timeline, isPositive }) => {
    const myParticipant = match.participants[myId - 1];
    if (
      match.queueId === QUEUE_SYMBOLS.aram ||
      (stat === "cs" &&
        mapRoleToSymbol(myParticipant.individualPosition) ===
          ROLE_SYMBOLS.support)
    )
      return;
    const laneOpponent = match.participants.find(
      (part) =>
        part.participantId !== myId &&
        part.individualPosition &&
        part.individualPosition === myParticipant.individualPosition
    );

    let minute;

    if (!laneOpponent || !timeline?.frames) return;
    const opponentChampion = get(getChampion(laneOpponent.championId), "name");

    const lastFramePre15Index =
      timeline.frames.length > 15 ? 15 : timeline.frames.length - 1;
    minute = lastFramePre15Index;

    if (prePost === "post") {
      if (timeline.frames.length < 20) return;
      minute = match.gameDuration / 60000 - 15;
    }

    const lastFramesPre15 = Object.values(
      timeline.frames[lastFramePre15Index].participantFrames
    );

    const myLastFramePre15 = lastFramesPre15.find(
      (part) => part.participantId === myParticipant.participantId
    );

    const theirLastFramePre15 = lastFramesPre15.find(
      (part) => part.participantId === laneOpponent.participantId
    );

    const myStat = myLastFramePre15
      ? invoke(
          statsMap,
          [stat, prePost, "computeStat"],
          myLastFramePre15,
          minute,
          myParticipant
        )
      : 0;
    const theirStat = theirLastFramePre15
      ? invoke(
          statsMap,
          [stat, prePost, "computeStat"],
          theirLastFramePre15,
          minute,
          laneOpponent
        )
      : 0;

    if (
      myStat <= 0 ||
      theirStat <= 0 ||
      (isPositive && myStat <= theirStat) ||
      (!isPositive && myStat >= theirStat)
    )
      return;

    const statDiff = 1 - myStat / theirStat;

    const tipData = {
      [`${stat}PerMinDiff`]: Math.abs(statDiff),
      opponentChampion,
    };

    if (stat === "cs") {
      tipData.myCs = myStat;
      tipData.theirCs = theirStat;
    }

    for (const key in tipData) {
      const value = tipData[key];
      if (typeof value === "number") {
        tipData[key] = value.toLocaleString(getLocale(), {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
      }
    }

    return statsMap[stat][prePost][statDiff < 0 ? "pos" : "neg"](t, tipData);
  };
}

const PlayerContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-2);
  padding-left: var(--sp-3);
  color: ${(props) => props.header && "var(--shade2)"};
  background: var(--shade9-50);
  border-radius: var(--br);

  &:not(:last-child) {
    margin-bottom: var(--sp-0_5);
  }
`;

const PlayerListItem = styled("div")`
  flex: ${(props) => props.flex || 1};
  display: flex;
  text-align: center;
  justify-content: ${(props) => !props.left && "center"};
  color: ${(props) =>
    props.isHighLighted ? "var(--yellow)" : "var(--shade3)"};

  img {
    width: var(--sp-5);
    height: auto;
    border-radius: 50%;
    border: 2px solid var(--red);
  }
`;

const PlayerDmgLine = ({ icon, magicDmg, adDmg, tooMuchArmor, tooMuchMr }) => (
  <PlayerContainer>
    <PlayerListItem flex={1.2} left>
      <img src={icon} />
    </PlayerListItem>{" "}
    <PlayerListItem isHighLighted={magicDmg > adDmg && tooMuchArmor}>
      <CaptionBold>{magicDmg}</CaptionBold>
    </PlayerListItem>{" "}
    <PlayerListItem isHighLighted={adDmg > magicDmg && tooMuchMr}>
      <CaptionBold>{adDmg}</CaptionBold>
    </PlayerListItem>
  </PlayerContainer>
);

const defenseItemization = ({
  t,
  match,
  myId,
  enemyTeam,
  champions,
  itemsThisPatch,
}) => {
  if (!itemsThisPatch) return;
  const myParticipant = match.participants[myId - 1];
  let totalAdDmg = 0;
  let totalApDmg = 0;
  for (const player of enemyTeam) {
    totalAdDmg += player.physicalDamageDealtToChampions;
    totalApDmg += player.magicDamageDealtToChampions;
  }
  const totalDmg = totalAdDmg + totalApDmg;
  const percentAd = ((totalAdDmg * 100) / totalDmg).toFixed(0);
  const percentAp = ((totalApDmg * 100) / totalDmg).toFixed(0);
  let totalArmor = 0;
  let totalMr = 0;
  Array(6)
    .fill(0)
    .forEach((u, i) => {
      const itemId = myParticipant[`item${i}`];
      const item = itemsThisPatch?.[itemId];
      if (item?.stats?.FlatSpellBlockMod) {
        totalMr += item.FlatSpellBlockMod;
      }
      if (item?.stats?.FlatArmorMod) {
        totalArmor += item.FlatArmorMod;
      }
    });
  const tooMuchArmor = totalArmor - totalMr > 50 && percentAp > 55;
  const tooMuchMr = totalMr - totalArmor > 50 && percentAd > 55;

  const sortedEnemyTeam = orderBy(
    enemyTeam,
    (player) =>
      tooMuchMr
        ? player.physicalDamageDealtToChampions
        : player.magicDamageDealtToChampions,
    "desc"
  );

  if (tooMuchArmor || tooMuchMr) {
    return {
      category: "combat",
      title: t(
        "lol:vanityTags.tags.badDefensiveItemization",
        "Bad defensive itemization"
      ),
      description: tooMuchArmor ? (
        <Trans i18nKey="lol:vanityTags.tips.tooMuchArmor">
          You incorrectly prioritized building{" "}
          <InlineIcon>
            <HextechStatArmor />
          </InlineIcon>
          <span>Armor</span> when the enemy team&apos;s damage split was{" "}
          <span> {{ percentAd }}% Physical </span> and{" "}
          <span>{{ percentAp }}% Magic</span>.
        </Trans>
      ) : (
        <Trans i18nKey="lol:vanityTags.tips.tooMuchMagic">
          You incorrectly prioritized building{" "}
          <InlineIcon>
            <HextechStatMagicResist />{" "}
          </InlineIcon>{" "}
          <span>Magic Resist</span> when the enemy team&apos;s damage split was{" "}
          <span> {{ percentAd }}% Physical </span> and{" "}
          <span>{{ percentAp }}% Magic</span>.
        </Trans>
      ),
      // eslint-disable-next-line react/display-name
      summaryComponent: () => (
        <>
          <PlayerContainer header>
            <PlayerListItem flex={1.2} left>
              <Overline>
                <Trans i18nKey="lol:enemy">Enemy</Trans>
              </Overline>
            </PlayerListItem>{" "}
            <PlayerListItem isHighLighted={tooMuchArmor && "yellow"}>
              <Overline>
                <Trans i18nKey="lol:magicDmg">Magic Dmg.</Trans>
              </Overline>
            </PlayerListItem>{" "}
            <PlayerListItem isHighLighted={tooMuchMr && "yellow"}>
              <Overline>
                <Trans i18nKey="lol:physicalDmg">Physical Dmg.</Trans>
              </Overline>
            </PlayerListItem>
          </PlayerContainer>
          {sortedEnemyTeam.map((player) => (
            <PlayerDmgLine
              key={player.participantId}
              icon={Static.getChampionImageById(champions, player.championId)}
              magicDmg={player.magicDamageDealtToChampions}
              adDmg={player.physicalDamageDealtToChampions}
              tooMuchArmor={tooMuchArmor}
              tooMuchMr={tooMuchMr}
            />
          ))}
        </>
      ),
      extraTips: [],
      icon: AccoladeDefensiveItemization,
    };
  }
};

class VanityTagsEngine {
  constructor() {
    this.positiveRuleSet = [
      // damageDealt,
      highestKP,
      highestDamage,
      highestKDA,
      richest,
      bestCSer,
      // wonHard,
      unkillable,
      wonLane,
      unlucky,
      // killingSpree,
      highObjectives,
      visionScore,
      goodSupportTeamPlayer,
      tooTanky,
      // ccBot,
      gotFirstBlood,
      expertCSer,
      T_earlyGameMonster,
      T_jungleKillsInAllLanes,
      // T_manyKillsInOtherLanes,
      T_gotSoloKill,
      T_jungleLaneCamper,
      T_gotCamped,
      T_flameHorizon,
      T_expertDuelist,
      T_comeback,
      // T_csVs,
      // T_csRatePost15,
      T_statVs("cs", "pre"),
      T_statVs("cs", "post"),
      T_statVs("gold", "pre"),
      T_statVs("gold", "post"),
      // badTeamComp,
      // badChampion,
      // goodFarming,
      // fedPoro,
    ];

    this.negativeRuleSet = [
      // damageDealt,
      // ccBot,
      lowestDamage,
      T_diedToGanksAlot,
      T_lowVisionScore,
      T_lateFirstWard,
      noControlWards,
      areYouAFK,
      poorest,
      T_deadHoarder,
      T_backToBackDeaths,
      T_badPositioning,
      T_useVisionWards,
      T_gotSoloKilled,
      // T_couldBuyControlWard,
      T_earlyDeath,
      // T_csVs,
      // T_sharedCs,
      // T_csRatePost15,
      T_statVs("cs", "pre"),
      T_statVs("cs", "post"),
      T_statVs("gold", "pre"),
      T_statVs("gold", "post"),
      defenseItemization,
      // badTeamComp,
      // badChampion,
      // hoardedGold,
      // T_easyTarget,
      // deathsVsAvg,

      // fedPoro,
    ];

    this.ignoreForAram = [
      bestCSer,
      wonLane,
      visionScore,
      highObjectives,
      goodSupportTeamPlayer,
      lowestDamage,
      unlucky,
      T_earlyGameMonster,
      T_gotCamped,
      T_manyKillsInOtherLanes,
      T_flameHorizon,
      expertCSer,
      T_jungleKillsInAllLanes,
      T_expertDuelist,
      T_jungleLaneCamper,
      noControlWards,
      T_gotSoloKilled,
      T_lowVisionScore,
      T_diedToGanksAlot,
      T_lateFirstWard,
      T_deadHoarder,
      T_backToBackDeaths,
      T_badPositioning,
      T_useVisionWards,
      T_gotSoloKill,
      T_gotSoloKilled,
      // T_couldBuyControlWard,
      T_earlyDeath,
      // T_csVs,
      // T_csRatePost15,
      // T_sharedCs,
    ];

    this.aramOnly = [
      defenseItemization,
      // badTeamComp,
      // badChampion,
      // hoardedGold,
      // T_easyTarget,
      // goodFarming,
      // deathsVsAvg,
      // fedPoro,
    ];

    this._team1 = [1, 2, 3, 4, 5];
    this._team2 = [6, 7, 8, 9, 10];

    // Memoizing timeline reducer results.
    // keyed by object (timeline), valued by another WeakMap.
    this._timelineMemo = new WeakMap();
  }

  timelineReducer(timeline, participants) {
    let participantsWeakMap = this._timelineMemo.get(timeline);

    if (participantsWeakMap) {
      const result = participantsWeakMap.get(participants);
      if (result) return result;
    } else {
      participantsWeakMap = new WeakMap();
    }

    this._timelineMemo.set(timeline, participantsWeakMap);

    const result = timeline.frames.map((frame) => {
      const { events, timestamp } = frame;
      const sortedEvents = events.reduce(
        (sortedEvents, event) => {
          if (
            event.type === "CHAMPION_KILL" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              kills: [...sortedEvents.kills, event],
            };
          }
          if (
            event.type === "ELITE_MONSTER_KILL" &&
            event.monsterType === "BARON_NASHOR" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              barons: [...sortedEvents.barons, event],
            };
          }
          if (
            event.type === "WARD_PLACED" &&
            participants.includes(event.creatorId)
          ) {
            return {
              ...sortedEvents,
              wardsPlaced: [...sortedEvents.wardsPlaced, event],
            };
          }
          if (
            event.type === "WARD_DESTROYED" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              wardsDestroyed: [...sortedEvents.wardsDestroyed, event],
            };
          }
          if (
            event.type === "ELITE_MONSTER_KILL" &&
            event.monsterType === "RIFTHERALD" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              riftheralds: [...sortedEvents.riftheralds, event],
            };
          }
          if (
            event.type === "ELITE_MONSTER_KILL" &&
            event.monsterType === "DRAGON" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              dragons: [...sortedEvents.dragons, event],
            };
          }
          if (
            event.type === "BUILDING_KILL" &&
            event.buildingType === "TOWER_BUILDING" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              turrets: [...sortedEvents.turrets, event],
            };
          }
          if (
            event.type === "BUILDING_KILL" &&
            event.buildingType === "TOWER_BUILDING" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              turrets: [...sortedEvents.turrets, event],
            };
          }
          if (
            event.type === "BUILDING_KILL" &&
            event.buildingType === "INHIBITOR_BUILDING" &&
            participants.includes(event.killerId)
          ) {
            return {
              ...sortedEvents,
              inhibitors: [...sortedEvents.inhibitors, event],
            };
          }
          return sortedEvents;
        },
        {
          kills: [],
          dragons: [],
          barons: [],
          turrets: [],
          inhibitors: [],
          riftheralds: [],
          wardsPlaced: [],
          wardsDestroyed: [],
        }
      );
      return {
        timestamp,
        sortedEvents,
      };
    });

    participantsWeakMap.set(participants, result);

    return result;
  }

  getVanityTags(props) {
    const {
      match,
      account,
      timeline,
      isPositive = true,
      summonerNameAsTips,
      champions,
      mvpOnly,
    } = props;
    const t = (namespace, translation, ...args) => {
      return [props.t(namespace, translation, ...args), translation];
    };
    const vanityTags = new TagArray();
    const isAram = match.queueId === QUEUE_SYMBOLS.aram;
    const isRemake = isRemakeGame(match?.gameDuration, true);
    if (!match?.participants || isRemake) return null;

    const myParticipant = match.participants.find((p) =>
      isSameAccount(p, account)
    );

    if (myParticipant) {
      const myId = myParticipant.participantId;

      if (myParticipant.champLevel < 3) {
        if (!isPositive || !champions) {
          vanityTags.push({
            category: "combat",
            title: "AFK",
            icon: AccoladeAfk,
          });
          return vanityTags.tags();
        }
        return null;
      }

      const myTeam = match.participants.filter(
        (p) => p.teamId === myParticipant.teamId
      );
      const enemyTeam = match.participants.filter(
        (p) => p.teamId !== myParticipant.teamId
      );

      let ruleSet = this.positiveRuleSet;
      if (!isPositive) {
        ruleSet = this.negativeRuleSet;
      }
      for (const rule of mvpOnly ? [ruleSet[0]] : ruleSet) {
        if (
          (isAram && !this.ignoreForAram.includes(rule)) ||
          (!isAram && !this.aramOnly.includes(rule))
        ) {
          let reducedTimeline = timeline;
          let enemyReducedTimeline = timeline;
          if (reducedTimeline) {
            reducedTimeline = this.timelineReducer(
              timeline,
              myParticipant.teamId === 100 ? this._team1 : this._team2
            );
            enemyReducedTimeline = this.timelineReducer(
              timeline,
              myParticipant.teamId === 100 ? this._team2 : this._team1
            );
          }

          const tag =
            myTeam && enemyTeam && match && myId
              ? rule({
                  ...props,
                  t: t,
                  isPositive,
                  myId,
                  myTeam: myTeam.slice(),
                  enemyTeam: enemyTeam.slice(),
                  reducedTimeline,
                  enemyReducedTimeline,
                })
              : null;
          if (tag) {
            if (summonerNameAsTips) {
              tag.tip = myParticipant.summonerName;
            }
            vanityTags.push(tag);
          }
        }
      }
    }
    return vanityTags.length === 0 ? null : vanityTags.tags();
  }
}

export default new VanityTagsEngine();
