import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import WarningHandIcon from "@/inline-assets/warning-hand.svg";

const WarningWrapper = styled("div")`
  background: var(--shade10);
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);
  display: flex;

  .hand-container {
    position: relative;
    margin-left: var(--sp-4);
    margin-right: var(--sp-2);
    svg {
      width: var(--sp-8);
    }
  }
`;

const MissingDataBanner = () => {
  const { t } = useTranslation();

  return (
    <WarningWrapper>
      <div className="hand-container">
        <WarningHandIcon />
      </div>
      <p className="type-body2">
        {t(
          "common:missingRiotData",
          "Missing data from the Riot API. Statistics shown may not be complete for this match."
        )}
      </p>
    </WarningWrapper>
  );
};

export default MissingDataBanner;
