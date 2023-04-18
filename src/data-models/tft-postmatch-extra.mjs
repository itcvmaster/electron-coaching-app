import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";
import { Distribution } from "@/data-models/unknown-distribution.mjs";

const Last20Avg = Optional({
  top4: Number,
  bot4: Number,
});

const Items = Optional({
  [arbitraryKeys]: Number,
});

const Unit = {
  id: String,
  name: String,
  board: Boolean,
  items: Items,
  stars: Number,
  itemsLength: Number,
};

const Performance = Optional({
  itemScore: {
    ItemEffectiveness: {
      score: Number,
      distribution: Distribution,
      damageDealt: [
        {
          id: String,
          unit: {
            championKey: String,
            items: Items,
          },
          stars: Number,
          userDamageDealt: Number,
          userDamageTaken: Number,
        },
      ],
      recommendedBuilds: [
        {
          id: String,
          unit: {
            championKey: String,
            items: Optional([String]),
          },
          avgDamageTaken: Number,
          avgDamageDealt: Number,
        },
      ],
    },
    ItemsOnBenchEachRound: {
      score: Number,
      distribution: Distribution,
      graph: [
        {
          round: String,
          opponent: String,
          items: Items,
          unitItems: Optional([Number]),
          isWinner: Boolean,
        },
      ],
      last20Avg: Last20Avg,
    },
    ItemTier: {
      score: Number,
      items: Optional([Number]),
      distribution: Distribution,
    },
    score: Number,
    last20Avg: Last20Avg,
  },
  goldOnDeath: {
    distribution: Distribution,
    goldOnDeath: Number,
    graph: [
      {
        gold: Number,
        isWinner: Boolean,
        round: String,
        username: String,
      },
    ],
    last20Avg: Last20Avg,
  },
});
const Timeline = Optional({
  roundResultTimeLine: [
    {
      round: String,
      currentHealth: Number,
      username: String,
      enemy: String,
      isWinner: Boolean,
    },
  ],
  goldTimeLine: [
    {
      round: String,
      gold: Number,
    },
  ],
  hpTimeline: [
    {
      round: String,
      hp: Number,
      isWinner: Boolean,
    },
  ],
  itemsTimeLine: [
    {
      round: String,
      opponent: String,
      items: Optional([Number]),
      isWinner: Boolean,
    },
  ],
  goldInterest: Number,
});
const RoundBreakDown = Optional([
  {
    round: String,
    player: {
      username: String,
      level: Number,
      isWinner: Boolean,
      winStreak: Number,
      room: Number,
      hp: Number,
      goldCurrent: Number,
      goldPassive: Number,
      goldInterest: Number,
      goldStreak: Number,
      units: [Unit],
      benchUnits: [Unit],
      benchItems: Items,
    },
    enemy: String,
    opponents: [
      {
        username: String,
        level: Number,
        hp: Number,
        room: Number,
        winStreak: Number,
        units: [Unit],
        benchUnits: [Unit],
        benchItems: Items,
      },
    ],
  },
]);

const model = {
  Performance,
  Timeline,
  RoundBreakDown,
  processing: Optional(Boolean),
};

const transform = createModel(model);

export default transform;
