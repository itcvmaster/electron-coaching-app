import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import TooltipContainer from "@/game-val/TooltipContainer.jsx";
import Help from "@/inline-assets/help.svg";

const HeadShotHelpIcon = () => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const onMouseOut = () => {
    setShowTooltip(false);
  };
  const onMouseOver = () => {
    setShowTooltip(true);
  };
  return (
    <span
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      style={{ paddingLeft: "var(--sp-2_5)" }}
    >
      <Help />
      {showTooltip && (
        <TooltipContainer>
          <p className="stat-name">
            {t(
              "val:headshotHelp",
              "This excludes Shorty, Bucky, Judge, and Operator"
            )}
          </p>
        </TooltipContainer>
      )}
    </span>
  );
};
export default HeadShotHelpIcon;
