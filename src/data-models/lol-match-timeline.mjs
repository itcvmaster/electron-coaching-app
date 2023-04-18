import createModel, {
  arbitraryKeys,
  isRootModel,
  Optional,
} from "@/__main__/data-model.mjs";

export const model = {
  frameInterval: Number,
  gameId: Number,
  frames: [
    {
      events: [
        {
          levelUpType: Optional(String),
          participantId: Optional(Number),
          skillSlot: Optional(Number),
          timestamp: Number,
          type: String,
        },
      ],
      participantFrames: {
        [arbitraryKeys]: {
          currentGold: Number,
          goldPerSecond: Number,
          jungleMinionsKilled: Number,
          level: Number,
          minionsKilled: Number,
          participantId: Number,
          timeEnemySpentControlled: Number,
          totalGold: Number,
          xp: Number,
          championStats: {
            abilityHaste: Number,
            abilityPower: Number,
            armor: Number,
            armorPen: Number,
            armorPenPercent: Number,
            attackDamage: Number,
            attackSpeed: Number,
            bonusArmorPenPercent: Number,
            bonusMagicPenPercent: Number,
            ccReduction: Number,
            cooldownReduction: Number,
            health: Number,
            healthMax: Number,
            healthRegen: Number,
            lifesteal: Number,
            magicPen: Number,
            magicPenPercent: Number,
            magicResist: Number,
            movementSpeed: Number,
            omnivamp: Number,
            physicalVamp: Number,
            power: Number,
            powerMax: Number,
            powerRegen: Number,
            spellVamp: Number,
          },
          position: {
            x: Number,
            y: Number,
          },
          damageStats: {
            magicDamageDone: Number,
            magicDamageDoneToChampions: Number,
            magicDamageTaken: Number,
            physicalDamageDone: Number,
            physicalDamageDoneToChampions: Number,
            physicalDamageTaken: Number,
            totalDamageDone: Number,
            totalDamageDoneToChampions: Number,
            totalDamageTaken: Number,
            trueDamageDone: Number,
            trueDamageDoneToChampions: Number,
            trueDamageTaken: Number,
          },
        },
      },
      timestamp: Number,
    },
  ],
  participants: [
    {
      participantId: Number,
      puuid: String,
    },
  ],
  [isRootModel]: true,
};

const apiModelValidation = createModel({
  data: {
    timeline: {
      info: model,
    },
  },
});

function transform(data) {
  apiModelValidation(data);
  return data.data.timeline.info;
}

export default transform;
