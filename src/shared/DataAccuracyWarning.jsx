import React from "react";
import { styled } from "goober";

import Help from "@/inline-assets/help.svg";

const WARNING_TYPES = {
  warning: {
    value: "warning",
    icon: Help,
  },
  alert: {
    value: "alert",
    icon: Help,
  },
};

/**
 * Data Accuracy Warning bar in postmatch page
 * @param {*} type: = ['alert', 'warning']
 * @param {*} content: warning text to show
 * @returns
 */
const DataAccuracyWarning = (props) => {
  const { type, content } = props;

  const typeInfo =
    Object.values(WARNING_TYPES).find((info) => info.value === type) ||
    WARNING_TYPES.warning;
  const Icon = typeInfo.icon;

  return (
    <WarningWrapper>
      <WarningIcon>
        <Icon />
      </WarningIcon>
      {content}
    </WarningWrapper>
  );
};

export default DataAccuracyWarning;

const WarningWrapper = styled("div")`
  background: var(--shade10);
  padding-top: var(--sp-3);
  padding-bottom: var(--sp-3);
  border-radius: var(--br);
  margin-bottom: var(--sp-4);
  display: flex;
`;

const WarningIcon = styled("div")`
  position: relative;
  margin-left: var(--sp-4);
  margin-right: var(--sp-2);
  svg {
    height: var(--sp-6);
    width: var(--sp-8);
  }
`;
