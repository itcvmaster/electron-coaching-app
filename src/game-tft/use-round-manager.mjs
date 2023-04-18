import { appURLs } from "@/app/constants.mjs";

const roundKeys = {
  carousel: "Carousel",
  minion: "Minion",
  krugs: "Krugs",
  murkWolves: "Murk Wolves",
  raptor: "Raptor",
  infernalDrake: "Infernal Drake",
  riftHerald: "Rift Herald",
  elderDragon: "Elder Dragon",
};
const roundKeyToUrl = {
  carousel: "Round_Carousel.png",
  minion: "Round_Minion.png",
  krugs: "Round_Krugs.png",
  murkWolves: "Round_Wolves.png",
  raptor: "Round_Raptors.png",
  infernalDrake: "Round_Dragon.png",
  riftHerald: "Round_Herald.png",
  elderDragon: "Round_ElderDragon.png",
};
const emptyRound = `${appURLs.CDN}/blitz/lol/profileicon/29.webp`;

// Stage templates
const stages_standard = [
  ["carousel", "minion", "minion", "minion"],
  ["user", "user", "user", "carousel", "user", "user", "krugs"],
  ["user", "user", "user", "carousel", "user", "user", "murkWolves"],
  ["user", "user", "user", "carousel", "user", "user", "raptor"],
  ["user", "user", "user", "carousel", "user", "user", "infernalDrake"],
  ["user", "user", "user", "carousel", "user", "user", "riftHerald"],
  ["user", "user", "user", "carousel", "user", "user", "elderDragon"],
];
const stages_hyperroll = [
  ["carousel", "minion"],
  ["minion"],
  ["user", "user"],
  ["user", "user"],
  ["krugs", "user"],
  ["murkWolves", "user", "user"],
  ["raptor", "user", "user"],
  ["infernalDrake", "user", "user"],
  ["riftHerald", "user", "user", "user", "user", "user"],
];

// Queue types
const queueTypeToStages = {
  // Add new stages here
  1130: stages_hyperroll,
};

/**
 * Team Fight Tactic's hook for general round structure
 * @param {boolean} isDefaultPlaceholder - Return a default cdn placeholder image or an empty string
 * @param {number} queueType - Queue type id
 * @returns {{
 *  getRoundUrlByTarget: ((function(*): (*|undefined))|*),
 *  getStagesAvatars: (function(): string[][]),
 *  roundKeys: {},
 *  getStages: (function(): string[][]),
 *  getRoundUrlByKey: ((function(*): (string|string))|*)}
 * }
 */
function useRoundManager({ isDefaultPlaceholder = true, queueType }) {
  if (typeof isDefaultPlaceholder !== "boolean") isDefaultPlaceholder = true;

  const ref = {
    init: false,
    stagesWithRoundUrls: [],
  };

  function init() {
    if (ref.init) return;
    ref.init = true;
    const stages = queueTypeToStages[queueType] || stages_standard;
    ref.stagesWithRoundUrls = stages.map((_, stageIdx) => {
      return stages[stageIdx].map((rKey) => {
        let result = isDefaultPlaceholder ? emptyRound : "";
        if (
          typeof roundKeys[rKey] !== "undefined" &&
          typeof roundKeyToUrl[rKey] !== "undefined"
        ) {
          result = `${appURLs.CDN_WEB}/${roundKeyToUrl[rKey]}`;
        }
        return result;
      });
    });
  }

  /**
   * Finds a url image with a matching key from roundKeys
   * Recommended: The entire hook exposes roundKeys for usage with this function
   * @param key
   * @returns {string}
   */
  function getRoundUrlByKey(key) {
    if (
      typeof roundKeys[key] === "undefined" ||
      typeof roundKeyToUrl[key] === "undefined"
    ) {
      if (isDefaultPlaceholder) return emptyRound;
      return "";
    }
    return `${appURLs.CDN_WEB}/${roundKeyToUrl[key]}`;
  }

  /**
   * Finds a url image by using a string structure
   * String structure: Eg. '2_5', 2 represents the stage, 5 represents the round
   * @param str
   * @returns {string}
   */
  function getRoundUrlByTarget(str) {
    const defaultValue = isDefaultPlaceholder ? emptyRound : "";
    init();
    try {
      const [stageIdx, roundIdx] = str.split("_");
      return (
        ref.stagesWithRoundUrls[stageIdx - 1][roundIdx - 1] || defaultValue
      );
    } catch {
      return defaultValue;
    }
  }

  function getRoundNameByTarget(str) {
    if (!str) return;
    const [stageIdx, roundIdx] = str.split("_");
    const stageType = queueTypeToStages[queueType] || stages_standard;
    const key = stageType?.[stageIdx - 1]?.[roundIdx - 1];
    return roundKeys?.[key];
  }

  /**
   * Returns stage data of keys (in order)
   * Note: user key is provided but we don't use it in this hook. We only give
   * user key to tell API consumers that it would typically be a round where you
   * fight another user
   * @returns {string[][]}
   */
  function getStages() {
    return queueTypeToStages[queueType] || stages_standard;
  }

  /**
   * Returns stage data of url images only (in order)
   * @returns {string[][]}
   */
  function getStagesAvatars() {
    init();
    return ref.stagesWithRoundUrls;
  }
  return {
    getStages,
    getStagesAvatars,
    getRoundUrlByKey,
    getRoundUrlByTarget,
    getRoundNameByTarget,
    roundKeys, // Expose for usage
  };
}

export default useRoundManager;
