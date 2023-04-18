import React from "react";

import { UnitList } from "@/game-tft/CommonComponents.jsx";
import ProBuildsMatchUnits from "@/game-tft/ProBuildsMatchUnits.jsx";
import Traits from "@/game-tft/Traits.jsx";

const Stats = ({ traits, units, set, isOutOfDate, viewMode }) => {
  return (
    <>
      {viewMode !== "tablet" && viewMode !== "mobile" && (
        <Traits traits={traits} set={set} isOutOfDate={isOutOfDate} />
      )}
      <UnitList>
        <ProBuildsMatchUnits
          units={units}
          unitSize={viewMode === "mobile" ? 30 : 32}
          set={set}
        />
      </UnitList>
    </>
  );
};

export default Stats;
