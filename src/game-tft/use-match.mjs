import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import isEmpty from "@/util/is-empty.mjs";
import { useRoute } from "@/util/router-hooks.mjs";

const stateRequirement = ["data", "extra"];

export default function useMatch() {
  const {
    parameters: [, , matchId],
  } = useRoute();
  const state = useSnapshot(readState);
  const matches = state.tft.matches;
  const match = useMemo(() => matches[matchId] || {}, [matchId, matches]);
  return useMemo(() => {
    const result = Object.create(null);
    if (!isEmpty(match)) {
      for (const key in match) {
        if (
          key === "data" &&
          typeof match[key] === "object" &&
          Array.isArray(match.data)
        ) {
          const data = match.data.find((i) => i.matchid === matchId);
          if (typeof data === "object") result[key] = data;
          continue;
        }
        result[key] = match[key];
      }
    }
    if (stateRequirement.some((i) => result[i] instanceof Error))
      return new Error();
    return stateRequirement.every((i) => !isEmpty(result[i])) ? result : null;
  }, [match, matchId]);
}
