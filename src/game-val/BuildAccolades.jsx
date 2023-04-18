import React from "react";
import { Trans } from "react-i18next";
import { styled } from "goober";

// import { styled } from "goober";
// import { ValDeath, ValWeapon, Caption } from "@solomid/ui";
// import { getQueueNameForMatch } from "client/val/utils/helpers";
// import { AccoladeStatLine } from "client/app/postmatch/";
// import DivisionHeadshots from "client/val/Postmatch/Accolades/components/DivisionHeadshots";
// import CompareHeadshots from "client/val/Postmatch/Accolades/components/CompareHeadshots";
import {
  getKillsFromRoundResults,
  getWeaponDamageHits,
  //   QUEUES,
} from "@/game-val/postmatch-helpers.mjs";
import { calcHeadshotPercent } from "@/game-val/utils.mjs";
import Val_1v4 from "@/inline-assets/Badge_Val_1v4.svg";
import Val_1v4_Pure from "@/inline-assets/Badge_Val_1v4_Pure.svg";
import Val_Ace from "@/inline-assets/Badge_Val_Ace.svg";
import Val_Ace_Pure from "@/inline-assets/Badge_Val_Ace_Pure.svg";
import Val_Assassin from "@/inline-assets/Badge_Val_Assassin.svg";
import Val_Assassin_Pure from "@/inline-assets/Badge_Val_Assassin_Pure.svg";
import Val_Big_Spender from "@/inline-assets/Badge_Val_Big_Spender.svg";
import Val_Big_Spender_Pure from "@/inline-assets/Badge_Val_Big_Spender_Pure.svg";
import Val_Bomb_Specialist from "@/inline-assets/Badge_Val_Bomb_Specialist.svg";
import Val_Bomb_Specialist_Pure from "@/inline-assets/Badge_Val_Bomb_Specialist_Pure.svg";
import Val_Bomb_Technician from "@/inline-assets/Badge_Val_Bomb_Technician.svg";
import Val_Bomb_Technician_Pure from "@/inline-assets/Badge_Val_Bomb_Technician_Pure.svg";
import Val_Clutch from "@/inline-assets/Badge_Val_Clutch.svg";
import Val_Clutch_Pure from "@/inline-assets/Badge_Val_Clutch_Pure.svg";
import Val_Duelist from "@/inline-assets/Badge_Val_Duelist.svg";
import Val_Duelist_Pure from "@/inline-assets/Badge_Val_Duelist_Pure.svg";
import Val_First_Blood from "@/inline-assets/Badge_Val_First_Blood.svg";
import Val_First_Blood_Pure from "@/inline-assets/Badge_Val_First_Blood_Pure.svg";
import Val_Frugal from "@/inline-assets/Badge_Val_Frugal.svg";
import Val_Frugal_Pure from "@/inline-assets/Badge_Val_Frugal_Pure.svg";
import Val_Hard_to_Kill from "@/inline-assets/Badge_Val_Hard_to_Kill.svg";
import Val_Hard_to_Kill_Pure from "@/inline-assets/Badge_Val_Hard_to_Kill_Pure.svg";
import Val_Kills_with_Skills from "@/inline-assets/Badge_Val_Kills_with_Skills.svg";
import Val_Kills_with_Skills_Pure from "@/inline-assets/Badge_Val_Kills_with_Skills_Pure.svg";
import Val_MVP from "@/inline-assets/Badge_Val_MVP.svg";
import Val_MVP_Pure from "@/inline-assets/Badge_Val_MVP_Pure.svg";
import Val_Precise from "@/inline-assets/Badge_Val_Precise.svg";
import Val_Precise_Pure from "@/inline-assets/Badge_Val_Precise_Pure.svg";
import Val_Spray_and_Pray from "@/inline-assets/Badge_Val_Spray_and_Pray.svg";
import Val_Spray_and_Pray_Pure from "@/inline-assets/Badge_Val_Spray_and_Pray_Pure.svg";
import Val_Team_Player from "@/inline-assets/Badge_Val_Team_Player.svg";
import Val_Team_Player_Pure from "@/inline-assets/Badge_Val_Team_Player_Pure.svg";
import Spike from "@/inline-assets/val-spike.svg";
import { displayRate } from "@/util/helpers.mjs";
import orderBy from "@/util/order-array-by.mjs";
// import { showAsPercent } from "common/utils/format";

const TooltipFrame = styled("div")`
  max-width: calc(var(--sp-1) * 17);
`;

const showAsPercent = (num) => {
  return displayRate(num, 100);
};
const checkIfEligbleFor1v4 = (victimsRoundWise) => {
  const resultAfterDeathOf4TeamMembers =
    victimsRoundWise &&
    Object.entries(victimsRoundWise).reduce((result, victims) => {
      let teamMembersFallen = 0;
      if (victims && victims[1] && victims[1].length) {
        for (let i = 0; i < victims[1].length; i++) {
          if (victims[1][i] === "team") {
            teamMembersFallen += 1;
          }
          if (teamMembersFallen === 4) {
            result = [...result, victims[1].slice(i)];
            break;
          }
        }
      }
      return result;
    }, []);

  const eligibiltyScope =
    resultAfterDeathOf4TeamMembers &&
    resultAfterDeathOf4TeamMembers.length &&
    resultAfterDeathOf4TeamMembers.reduce((ans, killResult) => {
      if (killResult && killResult.length >= 4) {
        let enemyTeamMembersfallen = 0;
        for (let i = 0; i < killResult.length; i++) {
          if (killResult[i] === "enemy") enemyTeamMembersfallen += 1;
          if (enemyTeamMembersfallen === 4) {
            ans = [...ans, "Yes"];
            break;
          }
        }
      }
      return ans;
    }, []);
  return eligibiltyScope;
};

const getStatsRoundWise = (option, allKills, teamsPlayers) =>
  allKills &&
  allKills.length &&
  allKills.reduce((result, kill) => {
    if (kill) {
      const roundNumber = kill.round;
      if (result[roundNumber]) {
        result[roundNumber].push(teamsPlayers[kill[option]]);
      } else {
        result[roundNumber] = [teamsPlayers[kill[option]]];
      }
    }
    return result;
  }, {});

export const buildAccolades = ({
  t,
  playerType,
  matchStats = {},
  last20 = {},
  divisionStats = {},
  // allDivisionsStats = {},
  radiantDivisionStats,
  // allRanksStats = {},
  // divisionKey,
  // showDivision,
  queue,
  // map,
  teamStats,
  playerId,
  teamId,
  teamPosition,
  matchData = {},
  isAnyDeathMatch,
  isSpikeRush,
  isEscalation,
}) => {
  // const { matches: last20 } = last20;
  const accolades = {
    good: [],
    bad: [],
    fancy: [],
  };

  const showDivision = true;

  // const queueName = getQueueNameForMatch(t, queue, map);
  const queueName = queue;
  const teams = {};
  const teamPlayers = { team: [], enemy: [] };

  if (matchData && matchData.player) {
    matchData.players.map((player) =>
      player.teamId === teamId
        ? teamPlayers.team.push(player.subject)
        : teamPlayers.enemy.push(player.subject)
    );

    matchData.players.map((player) =>
      player.teamId === teamId
        ? (teams[player.subject] = "team")
        : (teams[player.subject] = "enemy")
    );
  }

  let roundsWith5Kills = 0;
  let roundsWith4Kills = 0;
  let roundsLastToDie = 0;
  let killsWithAbilities = 0;
  let killsWithMelee = 0;
  let wonByPlant, wonByDefuse;
  let hasClutch;
  let isEligibleFor1v4;
  let victimsRoundWise;

  const { roundResults } = matchData;

  if (roundResults) {
    const allKills = getKillsFromRoundResults(roundResults);
    victimsRoundWise = getStatsRoundWise("victim", allKills, teams);
    isEligibleFor1v4 = checkIfEligbleFor1v4(victimsRoundWise);
    for (const roundResult of roundResults) {
      const { playerStats } = roundResult;

      const playerRoundResult = playerStats.find((p) => p.subject === playerId);

      if (playerRoundResult) {
        const { kills } = playerRoundResult;
        if (kills.length === 5) roundsWith5Kills += 1;
        if (kills.length === 4) roundsWith4Kills += 1;
      }
    }

    let roundKills = { Team: {}, Enemy: {} };
    for (const [i, kill] of allKills.entries()) {
      const nextKill = allKills[i + 1];
      const isLastKillOfRound = !nextKill || kill.round !== nextKill.round;
      if (isLastKillOfRound && !roundKills["Team"][playerId])
        roundsLastToDie += 1;

      const victim = teamStats.allPlayers.find(
        (p) => p.subject === kill.victim
      );
      if (victim)
        roundKills[victim.teamId === teamId ? "Team" : "Enemy"][
          kill.victim
        ] = 1;
      if (
        !hasClutch &&
        !roundKills["Team"][playerId] &&
        roundResults[kill.round].winningTeam === teamId &&
        Object.keys(roundKills.Team).length === 4 &&
        Object.keys(roundKills.Enemy).length <= 3
      )
        hasClutch = true;

      if (isLastKillOfRound) roundKills = { Team: {}, Enemy: {} };

      if (kill.killer === playerId) {
        if (kill.finishingDamage.damageType === "Ability") killsWithAbilities++;
        if (kill.finishingDamage.damageType === "Melee") killsWithMelee++;
      }
    }

    const lastRound = roundResults[roundResults.length - 1];
    if (lastRound && lastRound.winningTeam === teamId) {
      if (
        lastRound.roundResultCode === "Detonate" &&
        lastRound.bombPlanter === playerId
      )
        wonByPlant = true;
      if (
        lastRound.roundResultCode === "Defuse" &&
        lastRound.bombDefuser === playerId
      )
        wonByDefuse = true;
    }
  }

  const {
    duelStats: { duelsPlayed, duelsWon } = {},
    roundsPlayed,
    firstBloodsTaken,
  } = matchStats;
  const duelWr = duelsWon / duelsPlayed;

  // Headshot accolade
  const matchWeaponHits = matchStats.weaponDamageStats;
  const last20WeaponHits = last20.weaponDamageStats;
  const divisionWeaponHits = divisionStats.weaponDamageStats;

  if (!matchWeaponHits || !last20WeaponHits || !divisionWeaponHits) {
    return accolades;
  }

  const matchHSPercent = calcHeadshotPercent(
    getWeaponDamageHits(matchWeaponHits)
  );
  const avgHSPercent = calcHeadshotPercent(
    getWeaponDamageHits(last20WeaponHits)
  );
  // const divisionHSPercent = calcHeadshotPercent(
  //   getWeaponDamageHits(divisionWeaponHits)
  // );

  const HeadshotTooltip = () => (
    <TooltipFrame>
      {/* <Caption> */}
      <p className="type-caption"></p>
      {t(
        "val:tooltips.headshot",
        "This excludes Shorty, Bucky, Judge, and Operator"
      )}
      {/* </Caption> */}
      <p className="type-caption"></p>
    </TooltipFrame>
  );
  if (matchHSPercent && matchHSPercent > 0) {
    if (avgHSPercent && matchHSPercent === avgHSPercent) {
      // Tied Avg headshot %
      accolades.good.push({
        defaultExpanded: true,
        title: t("val:accolades.headshot.title", "Headshot %"),
        description: (
          <Trans i18nKey="val:accolades.headshot.description.tied">
            You tied your {{ queueName }} headshot hit % average!
          </Trans>
        ),
        // icon: ValWeapon,
        icon: Spike,
      });
    } else if (avgHSPercent && matchHSPercent > avgHSPercent) {
      // Did *better* than Avg headshot %
      const diff = displayRate(
        Math.round((matchHSPercent / avgHSPercent) * 100 - 100)
      );

      // const summaryComponent = () => (
      //   <>
      //     <AccoladeStatLine
      //       color={"var(--blue)"}
      //       statTitle={t("common:thisMatch", "This Match")}
      //       statValue={showAsPercent(matchHSPercent)}
      //       valueColor={"var(--blue)"}
      //       caret="up"
      //       caretColor={"var(--blue)"}
      //     />
      //     <AccoladeStatLine
      //       statTitle={t("common:stats.recentAvg", "Recent Avg.")}
      //       statValue={showAsPercent(avgHSPercent)}
      //     />
      //     <CompareHeadshots
      //       playerDivision={divisionKey}
      //       matchHSPercent={matchHSPercent}
      //       divisionsStats={allDivisionsStats}
      //       ranksStats={allRanksStats}
      //       divisionHSPercent={divisionHSPercent}
      //     />
      //   </>
      // );
      // const distributionComponent = () => (
      //   <DivisionHeadshots
      //     matchHSPercent={matchHSPercent}
      //     playerMatchStats={matchStats}
      //     divisionsStats={allDivisionsStats}
      //     ranksStats={allRanksStats}
      //   />
      // );

      accolades.good.push({
        defaultExpanded: true,
        title: t(
          "val:accolades.increasedHeadshotPercent",
          "Increased Headshot %"
        ),
        description: (
          <Trans i18nKey="val:accolades.headshot.description.better">
            <span>{{ diff }} better</span> than your {{ queueName }} recent 20
            average.
          </Trans>
        ),
        // icon: ValWeapon,
        icon: Spike,
        tooltip: HeadshotTooltip,
        // summaryComponent,
        // distributionComponent,
        subComponentTextBtn: showDivision && {
          false: t("common:viewSummary", "View Summary"),
          true: t("common:viewDistribution", "View Distribution"),
        },
      });
    } else if (matchHSPercent && avgHSPercent) {
      // Did *worse* than Avg headshot %
      const diff = displayRate(
        Math.round((1 - matchHSPercent / avgHSPercent) * 100)
      );
      // const summaryComponent = () => (
      //   <>
      //     <AccoladeStatLine
      //       color={"var(--yellow)"}
      //       statTitle={t("common:thisMatch", "This Match")}
      //       statValue={showAsPercent(matchHSPercent)}
      //       valueColor={"var(--red)"}
      //       caret="down"
      //       caretColor={"var(--red)"}
      //     />
      //     <AccoladeStatLine
      //       statTitle={t("common:stats.recentAvg", "Recent Avg.")}
      //       statValue={showAsPercent(avgHSPercent)}
      //     />
      //     <CompareHeadshots
      //       playerDivision={divisionKey}
      //       matchHSPercent={matchHSPercent}
      //       divisionsStats={allDivisionsStats}
      //       ranksStats={allRanksStats}
      //       divisionHSPercent={divisionHSPercent}
      //     />
      //   </>
      // );
      // const distributionComponent = () => (
      //   <DivisionHeadshots
      //     matchHSPercent={matchHSPercent}
      //     playerMatchStats={matchStats}
      //     divisionsStats={allDivisionsStats}
      //     ranksStats={allRanksStats}
      //   />
      // );

      accolades.bad.push({
        // icon: ValWeapon,
        icon: Spike,
        defaultExpanded: true,
        title: t(
          "val:accolades.decreasedHeadshotPercent",
          "Decreased Headshot %"
        ),
        description: (
          <Trans i18nKey="val:accolades.headshotsWorse.description">
            <span>{{ diff }} worse</span> than your {{ queueName }} recent 20
            average.
          </Trans>
        ),
        tooltip: HeadshotTooltip,
        // summaryComponent,
        // distributionComponent,
        subComponentTextBtn: showDivision && {
          false: t("common:viewSummary", "View Summary"),
          true: t("common:viewDistribution", "View Distribution"),
        },
      });
    } else if (avgHSPercent) {
      accolades.bad.push({
        // icon: ValWeapon,
        icon: Spike,
        title: t("val:stats.headshotPercent", "Headshot %"),
        description: (
          <Trans i18nKey="val:accolades.headshotsNone.description">
            You had no headshots this match!
          </Trans>
        ),
        tooltip: HeadshotTooltip,
      });
    }
  }

  // First Blood Accolade
  const { firstBloodsGiven: matchFB } = matchStats;
  const { firstBloodsGiven: avgFB } = last20;
  const avgFBPerMatch = avgFB / last20;

  if (
    // queue !== QUEUES.deathmatch.queue &&
    // queue !== QUEUES.snowball.queue &&
    // queue !== QUEUES.escalation.queue
    queueName !== "deathmatch" &&
    queueName !== "snowball" &&
    queueName !== "escalation"
  ) {
    if (!matchFB) {
      accolades.good.push({
        // icon: ValDeath,
        icon: Spike,
        title: t("val:accolades.firstToDieNone.title", "First One to Die"),
        description: (
          <Trans i18nKey="val:accolades.firstToDieNone.description">
            Nice job, <span>you never died first.</span> Keep it up!
          </Trans>
        ),
      });
    } else if (avgFBPerMatch && matchFB < avgFBPerMatch) {
      const diff = showAsPercent((1 - matchFB / avgFBPerMatch) * 100);
      // const summaryComponent = () => (
      //   <>
      //     <AccoladeStatLine
      //       color={"var(--blue)"}
      //       statTitle={t("common:thisMatch", "This Match")}
      //       statValue={`${matchFB.toFixed(1)}`}
      //       valueColor={"var(--blue)"}
      //       caretColor={"var(--blue)"}
      //       caret="down"
      //     />
      //     <AccoladeStatLine
      //       statTitle={t("val:stats.recentAvg", "Recent Avg.")}
      //       statValue={`${avgFBPerMatch.toFixed(1)}`}
      //     />
      //   </>
      // );

      accolades.good.push({
        // icon: ValDeath,
        icon: Spike,
        title: t(
          "val:accolades.firstToDieDecreased.title",
          "First to Die Decreased"
        ),
        description: (
          <Trans i18nKey="val:accolades.firstToDieDecreased.description">
            You died first <span>{{ diff }} less</span> than you normally do in{" "}
            {{ queueName }} games.
          </Trans>
        ),
        // summaryComponent,
      });
    } else if (avgFBPerMatch) {
      const diff = showAsPercent((matchFB / avgFBPerMatch) * 100 - 100);
      // const summaryComponent = () => (
      //   <>
      //     <AccoladeStatLine
      //       color={"var(--yellow)"}
      //       statTitle={t("common:thisMatch", "This Match")}
      //       statValue={`${matchFB.toFixed(1)}`}
      //       valueColor={"var(--yellow)"}
      //       caretColor={"var(--red)"}
      //       caret="up"
      //     />
      //     <AccoladeStatLine
      //       statTitle={t("val:stats.recentAvg", "Recent Avg.")}
      //       statValue={`${avgFBPerMatch.toFixed(1)}`}
      //     />
      //   </>
      // );

      accolades.bad.push({
        // icon: ValDeath,
        icon: Spike,
        title: t(
          "val:accolades.firstToDieIncreased.title",
          "First to Die Increased"
        ),
        description: (
          <Trans i18nKey="val:accolades.firstToDieIncreased.description">
            You died first <span>{{ diff }} more</span> than you normally do in{" "}
            {{ queueName }} games.
          </Trans>
        ),
        // summaryComponent,
      });
    }
  }

  //start checks
  if (!isAnyDeathMatch && teamPosition === 1)
    accolades.fancy.push({
      fancyIcon: Val_MVP,
      fancyIconPure: Val_MVP_Pure,
      title: t("val:accolades.mvp.title", "MVP"),
      flare: "Gold",
      description: t(
        "val:accolades.mvp.description",
        "You're the best, all round!"
      ),
    });

  if (!isAnyDeathMatch && roundsWith5Kills > 0)
    accolades.fancy.push({
      fancyIcon: Val_Ace,
      fancyIconPure: Val_Ace_Pure,
      title: t("val:accolades.ace.title", "Ace"),
      flare: "Gold",
      description: t(
        "val:accolades.ace.description",
        "You dominated the enemy team and got an ace!"
      ),
    });

  if (killsWithMelee > 0)
    accolades.fancy.push({
      fancyIcon: Val_Assassin,
      fancyIconPure: Val_Assassin_Pure,
      title: t("val:accolades.assassin.title", "Assassin"),
      flare: "Gold",
      description: t(
        "val:accolades.assassin.description",
        "That's not a knife... this is a knife!"
      ),
    });

  if (!isAnyDeathMatch && hasClutch)
    accolades.fancy.push({
      fancyIcon: Val_Clutch,
      fancyIconPure: Val_Clutch_Pure,
      title: t("val:accolades.clutch.title", "Clutch"),
      flare: "Gold",
      description: t(
        "val:accolades.clutch.description",
        "Luck or skill? It doesn't matter, you humiliated the enemy team anyway!"
      ),
    });

  const radiantHsPercent =
    radiantDivisionStats?.all?.win?.headshotPercent?.mean;

  if (radiantHsPercent && matchHSPercent > radiantHsPercent)
    accolades.fancy.push({
      fancyIcon: Val_Precise,
      fancyIconPure: Val_Precise_Pure,
      title: t("val:accolades.precise.title", "Precise"),
      flare: "Gold",
      description: t(
        "val:accolades.precise.description",
        "You achieved a headshot % higher than radiant!"
      ),
    });

  if (duelWr > 0.6)
    accolades.fancy.push({
      fancyIcon: Val_Duelist,
      fancyIconPure: Val_Duelist_Pure,
      title: t("val:accolades.duelist.title", "Duelist"),
      flare: "Gold",
      description: t(
        "val:accolades.duelist.description",
        "Your enemy fears you! You won more than 60% of all your 1v1s."
      ),
    });

  if (!isAnyDeathMatch && roundsLastToDie > roundsPlayed / 2)
    accolades.fancy.push({
      fancyIcon: Val_Hard_to_Kill,
      fancyIconPure: Val_Hard_to_Kill_Pure,
      title: t("val:accolades.hardToKill.title", "Hard to Kill"),
      flare: "Gold",
      description: t(
        "val:accolades.hardToKill.description",
        "If it bleeds, we can try to kill it.  You were the last to die on more than 50% of your rounds!"
      ),
    });

  if (
    !isAnyDeathMatch &&
    !isSpikeRush &&
    !isEscalation &&
    roundsWith4Kills > 0 &&
    isEligibleFor1v4 &&
    isEligibleFor1v4.length > 0
  )
    accolades.fancy.push({
      fancyIcon: Val_1v4,
      fancyIconPure: Val_1v4_Pure,
      title: t("val:accolades.1v4.title", "1v4"),
      flare: "Silver",
      description: t(
        "val:accolades.1v4.description",
        "You got 1v4 in your last match"
      ),
    });

  const teamWithCalc = (
    isAnyDeathMatch ? teamStats.allPlayers : teamStats.team
  ).map((p) => ({
    ...p,
    headshotPercent:
      p?.stats?.weaponDamageStats &&
      calcHeadshotPercent(getWeaponDamageHits(p.stats.weaponDamageStats)),
    duelWr:
      p?.stats?.duelStats &&
      p.stats.duelStats.duelsWon / p.stats.duelStats.duelsPlayed,
  }));

  const teamByKills = orderBy(teamWithCalc, "stats.kills", "desc");
  const teamByHs = orderBy(teamWithCalc, "headshotPercent", "asc");
  const teamByEcon = orderBy(teamWithCalc, "stats.economy", "asc");
  const teamByAssists = orderBy(teamWithCalc, "stats.assists", "desc");
  const teamByDuelWr = orderBy(teamWithCalc, "duelWr", "desc");

  if (
    !isAnyDeathMatch &&
    teamByKills?.[0]?.[playerType] === playerId &&
    teamByHs?.[0]?.[playerType] === playerId
  ) {
    accolades.fancy.push({
      fancyIcon: Val_Spray_and_Pray,
      fancyIconPure: Val_Spray_and_Pray_Pure,
      title: t("val:accolades.sprayAndPray.title", "Spray and Pray"),
      flare: "Silver",
      description: t(
        "val:accolades.sprayAndPray.description",
        "Got the most kills but the lowest headshot%"
      ),
    });
  }

  if (
    !isSpikeRush &&
    !isAnyDeathMatch &&
    !isEscalation &&
    teamByEcon?.[0]?.[playerType] === playerId
  )
    accolades.fancy.push({
      fancyIcon: Val_Frugal,
      fancyIconPure: Val_Frugal_Pure,
      title: t("val:accolades.frugal.title", "Frugal"),
      flare: "Silver",
      description: t(
        "val:accolades.frugal.description",
        "You spent the least of anyone on your team"
      ),
    });

  if (
    !isAnyDeathMatch &&
    (teamByDuelWr?.[0]?.[playerType] === playerId ||
      teamByAssists?.[0]?.[playerType] === playerId)
  )
    accolades.fancy.push({
      fancyIcon: Val_Team_Player,
      fancyIconPure: Val_Team_Player_Pure,
      title: t("val:accolades.teamPlayer.title", "Team player"),
      flare: "Silver",
      description: t(
        "val:accolades.teamPlayer.description",
        "You got the highest number of assists or trades on your team!"
      ),
    });

  if (!isAnyDeathMatch && firstBloodsTaken / roundsPlayed > 0.3)
    accolades.fancy.push({
      fancyIcon: Val_First_Blood,
      fancyIconPure: Val_First_Blood_Pure,
      title: t("val:accolades.firstBlood.title", "First Blood"),
      flare: "Silver",
      description: t(
        "val:accolades.firstBlood.description",
        "You got First Blood on more than 30% of your rounds!"
      ),
    });

  if (!isAnyDeathMatch && killsWithAbilities >= 3)
    accolades.fancy.push({
      fancyIcon: Val_Kills_with_Skills,
      fancyIconPure: Val_Kills_with_Skills_Pure,
      title: t("val:accolades.killsWithSkills.title", "Kills With Skills"),
      flare: "Bronze",
      description: t(
        "val:accolades.killsWithSkills.description",
        "Who needs guns when you can just use your abilities?"
      ),
    });

  if (
    !isSpikeRush &&
    !isAnyDeathMatch &&
    !isEscalation &&
    teamByEcon?.[teamByEcon.length - 1]?.[playerType] === playerId
  )
    accolades.fancy.push({
      fancyIcon: Val_Big_Spender,
      fancyIconPure: Val_Big_Spender_Pure,
      title: t("val:accolades.bigSpender.title", "Big Spender"),
      flare: "Bronze",
      description: t(
        "val:accolades.bigSpender.description",
        "You spent the most out of anyone on your team!"
      ),
    });

  if (!isAnyDeathMatch && wonByPlant)
    accolades.fancy.push({
      fancyIcon: Val_Bomb_Specialist,
      fancyIconPure: Val_Bomb_Specialist_Pure,
      title: t("val:accolades.bombSpecialist.title", "Bomb Specialist"),
      flare: "Bronze",
      description: t("val:accolades.bombSpecialist.description", "Boom!"),
    });

  if (!isAnyDeathMatch && wonByDefuse)
    accolades.fancy.push({
      fancyIcon: Val_Bomb_Technician,
      fancyIconPure: Val_Bomb_Technician_Pure,
      title: t("val:accolades.bombTechnician.title", "Bomb Technician"),
      flare: "Bronze",
      description: t("val:accolades.bombTechnician.description", "Defused!"),
    });

  return accolades;
};
