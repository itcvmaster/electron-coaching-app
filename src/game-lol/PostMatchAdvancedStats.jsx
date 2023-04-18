import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { mobile } from "clutch";

import ChampionImg from "@/game-lol/ChampionImg.jsx";
import PostMatchAdvancedStatsList from "@/game-lol/PostMatchAdvancedStatsList.jsx";
import { isSameAccount, kFormatter } from "@/game-lol/util.mjs";

const ChampRow = styled("div")`
  display: flex;
  margin-right: var(--sp-4);
  margin-bottom: calc(var(--sp-11) * -1);
  padding: var(--sp-2) 0;
  position: sticky;
  top: 0;
  z-index: 1;

  .fill {
    margin-left: var(--sp-4);
    width: 130px;
  }

  ${mobile} {
    width: 196%;
  }
`;

const TeamContainer = styled("div")`
  display: flex;
  flex-grow: 1;
  justify-content: space-around;
  position: relative;

  &::before {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: block;
    content: "";
    width: 90%;
    height: 2px;
    background: ${(props) =>
      props.$isUserTeam ? "var(--blue)" : "var(--red)"};
  }
`;

const Champ = styled(ChampionImg)`
  position: relative;
  display: block;
  border: 2px solid;

  &.user {
    border-color: var(--yellow);
  }
  &.teammate {
    border-color: var(--blue);
  }
  &.enemy {
    border-color: var(--red);
  }
`;

function HeaderImages(participants, myTeam, yourIndex) {
  const isUserTeam = participants[0] && participants[0].teamId === myTeam;

  return (
    <TeamContainer $isUserTeam={isUserTeam}>
      {participants.map((participant, i) => {
        if (!participant) return null;

        const isUser = participant.teamId === myTeam && i === yourIndex;
        return (
          <Champ
            key={`${participant.championId}-${participant.participantId}`}
            size={24}
            championId={participant.championId}
            isUser={isUser}
            isUserTeam={isUserTeam}
            className={isUser ? "user" : isUserTeam ? "teammate" : "enemy"}
          />
        );
      })}
    </TeamContainer>
  );
}

function PostMatchAdvancedStats(props) {
  const { t1Participants, t2Participants, account, myTeam, gameId } = props;
  const { t } = useTranslation();
  const participants = [...t1Participants, ...t2Participants];
  const yourIndex = participants.findIndex((p) => isSameAccount(p, account));
  const KDAs = [],
    largestKillingSprees = [],
    largestMultiKills = [],
    crowdControlScores = [],
    firstBloodKills = [],
    totalDamageDealtToChampions = [],
    physicalDamageDealtToChampions = [],
    magicDamageDealtToChampions = [],
    trueDamageDealtToChampions = [],
    totalDamageDealts = [],
    physicalDamageDealts = [],
    magicDamageDealts = [],
    trueDamageDealts = [],
    largestCriticalStrikes = [],
    damageDealtToObjectives = [],
    damageDealtToTurrets = [],
    totalHeal = [],
    totalDamageTaken = [],
    physicalDamageTaken = [],
    magicDamageTaken = [],
    trueDamageTaken = [],
    damageSelfMitigated = [],
    visionScore = [],
    wardsPlaced = [],
    wardsKilled = [],
    visionWardsBoughtInGame = [],
    goldEarned = [],
    goldSpent = [],
    totalMinionsKilled = [],
    neutralMinionsKilled = [],
    turretKills = [],
    inhibitorKills = [];
  for (const participant of participants) {
    KDAs.push(
      `${participant.kills}/${participant.deaths}/${participant.assists}`
    );
    largestKillingSprees.push(participant.largestKillingSpree);
    largestMultiKills.push(participant.largestMultiKill);
    crowdControlScores.push(participant.timeCCingOthers);
    firstBloodKills.push(participant.firstBloodKill);
    totalDamageDealtToChampions.push(
      kFormatter(participant.totalDamageDealtToChampions)
    );
    physicalDamageDealtToChampions.push(
      kFormatter(participant.physicalDamageDealtToChampions)
    );
    magicDamageDealtToChampions.push(
      kFormatter(participant.magicDamageDealtToChampions)
    );
    trueDamageDealtToChampions.push(
      kFormatter(participant.trueDamageDealtToChampions)
    );
    totalDamageDealts.push(kFormatter(participant.totalDamageDealt));
    physicalDamageDealts.push(kFormatter(participant.physicalDamageDealt));
    magicDamageDealts.push(kFormatter(participant.magicDamageDealt));
    trueDamageDealts.push(kFormatter(participant.trueDamageDealt));
    largestCriticalStrikes.push(kFormatter(participant.largestCriticalStrike));
    damageDealtToObjectives.push(
      kFormatter(participant.damageDealtToObjectives)
    );
    damageDealtToTurrets.push(kFormatter(participant.damageDealtToTurrets));
    totalHeal.push(kFormatter(participant.totalHeal));
    totalDamageTaken.push(kFormatter(participant.totalDamageTaken));
    physicalDamageTaken.push(kFormatter(participant.physicalDamageTaken));
    magicDamageTaken.push(kFormatter(participant.magicDamageTaken));
    trueDamageTaken.push(kFormatter(participant.trueDamageTaken));
    damageSelfMitigated.push(kFormatter(participant.damageSelfMitigated));
    visionScore.push(kFormatter(participant.visionScore));
    wardsPlaced.push(kFormatter(participant.wardsPlaced));
    wardsKilled.push(kFormatter(participant.wardsKilled));
    visionWardsBoughtInGame.push(
      kFormatter(participant.visionWardsBoughtInGame)
    );
    goldEarned.push(kFormatter(participant.goldEarned));
    goldSpent.push(kFormatter(participant.goldSpent));
    totalMinionsKilled.push(kFormatter(participant.totalMinionsKilled));
    neutralMinionsKilled.push(kFormatter(participant.neutralMinionsKilled));
    turretKills.push(kFormatter(participant.turretKills));
    inhibitorKills.push(kFormatter(participant.inhibitorKills));
  }

  const combat = [
    {
      header: t("common:stats.kda", "KDA"),
      data: KDAs,
      kda: true,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.largestKillingSpree",
        "Largest Killing Spree"
      ),
      data: largestKillingSprees,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.largestMultiKill",
        "Largest Multi Kill"
      ),
      data: largestMultiKills,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.crowdControlScore",
        "Crowd Control Score"
      ),
      data: crowdControlScores,
    },
  ];
  const damage = [
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.totalDmgToChampions",
        "Total Dmg To Champions"
      ),
      data: totalDamageDealtToChampions,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.physicalDmgToChampions",
        "Physical Dmg To Champions"
      ),
      data: physicalDamageDealtToChampions,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.magicDmgToChampions",
        "Magic Dmg To Champions"
      ),
      data: magicDamageDealtToChampions,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.trueDmgToChampions",
        "True Dmg To Champions"
      ),
      data: trueDamageDealtToChampions,
    },
    {
      header: t("lol:postmatch.advancedStatsSubHeaders.totalDmg", "Total Dmg"),
      data: totalDamageDealts,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.physicalDmg",
        "Physical Dmg"
      ),
      data: physicalDamageDealts,
    },
    {
      header: t("lol:postmatch.advancedStatsSubHeaders.magicDmg", "Magic Dmg"),
      data: magicDamageDealts,
    },
    {
      header: t("lol:postmatch.advancedStatsSubHeaders.trueDmg", "True Dmg"),
      data: trueDamageDealts,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.largestCriticalStrike",
        "Largest Critical Strike"
      ),
      data: largestCriticalStrikes,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.totalDmgToObjectives",
        "Total Dmg To Objectives"
      ),
      data: damageDealtToObjectives,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.totalDmgtoTurrets",
        "Total Dmg to Turrets"
      ),
      data: damageDealtToTurrets,
    },
  ];
  const damageTaken = [
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.dmgHealed",
        "Dmg Healed"
      ),
      data: totalHeal,
    },
    {
      header: t("lol:postmatch.advancedStatsSubHeaders.dmgTaken", "Dmg Taken"),
      data: totalDamageTaken,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.physicalDmgTaken",
        "Physical Dmg Taken"
      ),
      data: physicalDamageTaken,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.magicDmgTaken",
        "Magic Dmg Taken"
      ),
      data: magicDamageTaken,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.trueDmgTaken",
        "True Dmg Taken"
      ),
      data: trueDamageTaken,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.selfMitigatedDmg",
        "Self Mitigated Dmg"
      ),
      data: damageSelfMitigated,
    },
  ];
  const vision = [
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.visionScore",
        "Vision Score"
      ),
      data: visionScore,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.wardsPlaced",
        "Wards Placed"
      ),
      data: wardsPlaced,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.wardsDestroyed",
        "Wards Destroyed"
      ),
      data: wardsKilled,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.controlWardsPurchased",
        "Control Wards Purchased"
      ),
      data: visionWardsBoughtInGame,
    },
  ];
  const income = [
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.goldEarned",
        "Gold Earned"
      ),
      data: goldEarned,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.goldSpent",
        "Gold Spent"
      ),
      data: goldSpent,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.minionsKilled",
        "Minions Killed"
      ),
      data: totalMinionsKilled,
    },
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.neutralMinionsKilled",
        "Neutral Minions Killed"
      ),
      data: neutralMinionsKilled,
    },
  ];
  const misc = [
    {
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.towersDestroyed",
        "Towers Destroyed"
      ),
      data: turretKills,
    },
  ];

  /* LCU POST-MATCH DATA DOESN'T HAVE THE SAME DATA WE GET FROM RITO'S API SO WE HIDE THEM */
  if (firstBloodKills.some((player) => player === true)) {
    combat.push({
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.firstBloodKill",
        "First Blood Kill"
      ),
      data: firstBloodKills,
    });
  }
  if (!inhibitorKills.includes(null)) {
    misc.push({
      header: t(
        "lol:postmatch.advancedStatsSubHeaders.inhibitorsDestroyed",
        "Inhibitors Destroyed"
      ),
      data: inhibitorKills,
    });
  }

  return (
    <div id="postmatchGrid" style={{ marginTop: 30 }}>
      <ChampRow>
        <div className="fill" />
        {HeaderImages(t1Participants, myTeam, yourIndex, gameId)}
        {HeaderImages(t2Participants, myTeam, yourIndex, gameId)}
      </ChampRow>
      <PostMatchAdvancedStatsList
        data={combat}
        header={t("lol:postmatch.advancedStatsHeaders.combat", "Combat")}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
      <PostMatchAdvancedStatsList
        data={damage}
        header={t(
          "lol:postmatch.advancedStatsHeaders.damageDealt",
          "Damage Dealt"
        )}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
      <PostMatchAdvancedStatsList
        data={damageTaken}
        header={t(
          "lol:postmatch.advancedStatsHeaders.damageTakenAndHealed",
          "Defensive Damage"
        )}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
      <PostMatchAdvancedStatsList
        data={vision}
        header={t("lol:postmatch.advancedStatsHeaders.vision", "Vision")}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
      <PostMatchAdvancedStatsList
        data={income}
        header={t("lol:postmatch.advancedStatsHeaders.income", "Income")}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
      <PostMatchAdvancedStatsList
        data={misc}
        header={t(
          "lol:postmatch.advancedStatsHeaders.objectives",
          "Objectives"
        )}
        yourIndex={yourIndex}
        numberOfTeamMembers={t1Participants.length}
      />
    </div>
  );
}

PostMatchAdvancedStats.propTypes = {};

export default PostMatchAdvancedStats;
