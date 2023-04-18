import createModel, {
  arbitraryKeys,
  Optional,
} from "@/__main__/data-model.mjs";
import { INGAME_PHASES, ROLE_SYMBOL_TO_STR } from "@/game-lol/constants.mjs";
import { mapRoleToSymbol } from "@/game-lol/util.mjs";

// The data source for this is coming from LCU:
// /lol-champ-select/v1/session

const summoner = {
  assignedPosition: String,
  cellId: Number,
  championId: Number,
  championPickIntent: Number,
  entitledFeatureType: String,
  selectedSkinId: Number,
  spell1Id: Number,
  spell2Id: Number,
  summonerId: Number,
  team: Number,
  wardSkinId: Number,
};

const apiModelValidation = createModel({
  actions: [
    [
      {
        actorCellId: Number,
        championId: Number,
        completed: Boolean,
        id: Number,
        isAllyAction: Boolean,
        isInProgress: Boolean,
        pickTurn: Number,
        type: String,
      },
    ],
  ],
  benchChampionIds: [Number],
  chatDetails: {
    chatRoomName: String,
    chatRoomPassword: String,
  },
  myTeam: [summoner],
  theirTeam: [summoner],
  rerollsRemaining: Number,
  timer: {
    adjustedTimeLeftInPhase: Number,
    internalNowInEpochMs: Number,
    isInfinite: Boolean,
    phase: String,
    totalTimeInPhase: Number,
  },
  trades: [
    {
      cellId: Number,
      id: Number,
      state: String,
    },
  ],
  localPlayerCellId: Number,

  // the following is unused by us.

  // allowBattleBoost: Boolean,
  // allowDuplicatePicks: Boolean,
  // allowLockedEvents: Boolean,
  // allowRerolling: Boolean,
  // allowSkinSelection: Boolean,
  // bans: {
  //   numBans: Number,
  //   myTeamBans: [],
  //   theirTeamBans: [],
  // },

  // benchEnabled: Boolean,
  // boostableSkinCount: Number,
  // counter: Number,
  // entitledFeatureState: {
  //   additionalRerolls: Number,
  //   unlockedSkinIds: [Number],
  // },
  // gameId: Number,
  // hasSimultaneousBans: Boolean,
  // hasSimultaneousPicks: Boolean,
  // isCustomGame: Boolean,
  // isSpectating: Boolean,
  // lockedEventIndex: Number,
  // recoveryCounter: Number,
  // skipChampionSelect: Boolean,
});

const afterTransformModel = {
  localPlayerCellId: Number,
  localPlayerTeam: Number,
  localPlayerRole: String,
  localPlayerBanComplete: Boolean,
  summonersByCellId: {
    [arbitraryKeys]: {
      isInProgress: Boolean,
      championPickIntent: Optional(Number),
      selectedSkinId: Number,
      assignedPosition: String,
      spell1Id: Number,
      spell2Id: Number,
      summonerId: Optional(String),
      championId: Optional(Number),
      team: Number,
      bans: [Number],
      isBot: Optional(Boolean),
    },
  },
  rerollsRemaining: Number,
  benchChampionIds: [Number],
  bannedIds: {
    [arbitraryKeys]: Boolean,
  },
  pickedIds: {
    [arbitraryKeys]: Boolean,
  },
  chatRoomName: String,
  phase: {
    type: String,
    startTime: Number,
    endTime: Number,
    totalTime: Number,
    isInfinite: Boolean,
    remaining: Number,
  },
  trade: Optional({
    championId: Number,
    state: String,
  }),
  actions: [
    [
      {
        actorCellId: Number,
        championId: Number,
        completed: Boolean,
        id: Number,
        isAllyAction: Boolean,
        isInProgress: Boolean,
        pickTurn: Number,
        type: String,
      },
    ],
  ],
};

const afterTransformValidation = createModel(afterTransformModel);

function transform(data) {
  const {
    trades,
    actions,
    myTeam,
    timer,
    theirTeam,
    localPlayerCellId,
    rerollsRemaining,
    benchChampionIds,
    chatDetails: { chatRoomName },
  } = apiModelValidation(data);

  // rito's data structure is really shitty.
  // let's transform it into something more useful.
  // GOAL: do not duplicate data in here, keep one source of truth from multiple data points.
  // In more formal terms, this should be "normalized".
  const result = {
    actions,
    localPlayerCellId,
    localPlayerRole: null,
    localPlayerTeam: null,
    localPlayerBanComplete: false,
    summonersByCellId: {},
    rerollsRemaining,
    benchChampionIds,
    chatRoomName,
    bannedIds: {},
    pickedIds: {},
    phase: {
      type: "NONE",
      startTime: 0,
      endTime: 0,
      totalTime: 0,
      isInfinite: false,
    },
  };

  const localPlayerTeam = myTeam[0]?.team;
  result.localPlayerTeam = localPlayerTeam;

  for (const summoner of [...myTeam, ...theirTeam]) {
    const {
      assignedPosition,
      cellId,
      championPickIntent,
      selectedSkinId,
      spell1Id,
      spell2Id,
      championId,
      summonerId,
      team,
      isInProgress,
    } = summoner;
    const roleSymbol = assignedPosition && mapRoleToSymbol(assignedPosition);
    const roleStr = roleSymbol && ROLE_SYMBOL_TO_STR[roleSymbol]?.internal;
    const isUser = cellId === result.localPlayerCellId;
    const isUserTeammate = team === localPlayerTeam;
    const cell = {
      isInProgress,
      championPickIntent,
      selectedSkinId,
      assignedPosition,
      spell1Id,
      spell2Id,
      summonerId,
      championId,
      team,
      bans: [],
    };
    cell.isUser = isUser;
    cell.isUserTeammate = isUserTeammate;
    cell.championId = championId ?? null;
    cell.championPickIntent = championPickIntent ?? null;
    cell.selectedSkinId = selectedSkinId ?? null;
    cell.spell1Id = spell1Id ?? null;
    cell.spell2Id = spell2Id ?? null;
    cell.role = roleStr ?? null;
    cell.assignedPosition = assignedPosition ?? null;
    result.summonersByCellId[cellId] = cell;

    if (isUser) {
      result.localPlayerRole = roleStr;
    }
  }

  // Bot or enemy assignment
  for (const cellId in result.summonersByCellId) {
    const summoner = result.summonersByCellId[cellId];
    const { team, summonerId } = summoner;
    if (!summonerId) {
      delete summoner.summonerId;
      if (team === localPlayerTeam) {
        summoner.isBot = true;
      }
    }
  }

  // Iterating through actions forward.
  for (const actionGroup of actions) {
    for (const action of actionGroup) {
      const { type, actorCellId, championId, completed, isInProgress } = action;
      const isUser = actorCellId === localPlayerCellId;

      if (result.summonersByCellId[actorCellId]) {
        result.summonersByCellId[actorCellId].isInProgress = isInProgress;
      }

      switch (type) {
        case "pick": {
          if ((completed === undefined || completed) && championId) {
            result.summonersByCellId[actorCellId].championId = championId;
            result.pickedIds[championId] = true;
            delete result.summonersByCellId[actorCellId].championPickIntent;
          }
          if (completed === false || isInProgress) {
            delete result.summonersByCellId[actorCellId].championId;
            if (championId)
              result.summonersByCellId[actorCellId].championPickIntent =
                championId;
          }
          break;
        }
        case "ban": {
          if (championId) {
            result.summonersByCellId[actorCellId].bans.push(championId);

            if (completed === undefined || completed) {
              result.bannedIds[championId] = true;
              if (isUser) result.localPlayerBanComplete = true;
            }
          }
          break;
        }
        // Declaring
        case "vote": {
          result.summonersByCellId[actorCellId].championPickIntent = championId;
          break;
        }
      }
    }
  }

  result.phase = {
    isInfinite: timer.isInfinite,
    totalTime: timer.totalTimeInPhase,
    startTime: timer.internalNowInEpochMs,
    endTime: timer.internalNowInEpochMs + timer.adjustedTimeLeftInPhase,
    remaining: timer.adjustedTimeLeftInPhase,
  };

  switch (timer.phase) {
    case "GAME_STARTING": {
      result.phase.type = INGAME_PHASES[4];
      break;
    }
    case "FINALIZATION": {
      result.phase.type = INGAME_PHASES[3];
      break;
    }
    case "PLANNING": {
      result.phase.type = INGAME_PHASES[0];
      break;
    }
    case "BAN_PICK": {
      const hasPick = (actions || []).find((group) =>
        group.find((action) => action.type === "pick" && action.isInProgress)
      );
      result.phase.type =
        result.localPlayerBanComplete || hasPick
          ? INGAME_PHASES[2]
          : INGAME_PHASES[1];
      break;
    }
    default:
      result.phase.type = INGAME_PHASES[6];
  }

  for (const { cellId, id: championId, state } of trades) {
    result.summonersByCellId[cellId].trade = { championId, state };
  }

  return afterTransformValidation(result);
}

export default transform;
