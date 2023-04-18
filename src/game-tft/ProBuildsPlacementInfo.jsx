import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "goober";

import { GameRecord, PlacementTitle } from "@/game-tft/CommonComponents.jsx";
import { FLEX_SIZES } from "@/game-tft/constants.mjs";
import getOrdinal from "@/util/get-ordinal.mjs";

function ProBuildsPlacementInfo({ placement, wins, losses }) {
  const { t } = useTranslation();
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: center;
        flex: ${FLEX_SIZES.PLACEMENT};
      `}
    >
      <PlacementTitle place={placement}>
        {t("tft:place", `${getOrdinal(placement)} Place`, {
          place: getOrdinal(placement),
        })}
      </PlacementTitle>
      {wins !== undefined && losses !== undefined ? (
        <GameRecord>
          {t("tft:winsAndLosses", "{{wins}}W - {{losses}}L", {
            wins,
            losses,
          })}
        </GameRecord>
      ) : null}
    </div>
  );
}

export default memo(ProBuildsPlacementInfo);
