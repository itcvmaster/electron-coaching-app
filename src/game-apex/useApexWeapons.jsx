import { useMemo } from "react";
import { useSnapshot } from "valtio";

import { readState } from "@/__main__/app-state.mjs";
import orderArrayBy from "@/util/order-array-by.mjs";

function useApexWeapons({
  season,
  mode,
  profileId,
  type,
  // isAllStats,
  // skip,
}) {
  const state = useSnapshot(readState);

  const weaponsObj =
    state.apex?.playerStats?.[profileId]?.[season]?.[mode]?.weapons;
  const weaponsList = state.apex.meta.weapons;

  const weapons = useMemo(() => {
    return weaponsObj
      ? orderArrayBy(
          Object.entries(weaponsObj)
            .map(([weaponId, value]) => ({
              ...value,
              weaponId,
            }))
            .filter((w) => w.shots)
            .map((w) => ({
              ...w,
              accuracy:
                w.hits /
                (weaponsList?.[w.weaponId]?.hitsPerShot || 1) /
                (w.shots || 1),
              headshotPercentage: w.headshots / (w.hits || 1),
              allShots: {
                bodyshots: w.hits ? w.hits - w.headshots : 0,
                headshots: w.headshots,
              },
            })),
          [type || "kills"],
          "desc"
        )
      : [];
  }, [weaponsList, type, weaponsObj]);

  return {
    weapons,
    // loading: isLoading,
    // error: error,
  };
}

export default useApexWeapons;
