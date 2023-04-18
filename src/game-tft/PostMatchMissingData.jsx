import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

const MissingData = () => {
  const { t } = useTranslation();

  return (
    <Warn
      data-tip={t(
        "tft:postmatchInsights.missingDataBlitzClosed",
        "Some of the data may be missing because you left the game or Blitz was closed."
      )}
    >
      {/* Todo: WarningIcon */}
    </Warn>
  );
};

export default MissingData;

const Warn = styled("span")`
  color: var(--yellow);
  font-size: 0.875rem;
`;
