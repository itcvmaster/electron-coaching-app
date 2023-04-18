import React from "react";
import { styled } from "goober";

import { mobileSmall } from "clutch";

import { Tabs } from "@/feature-china-web/common-styles.mjs";

const Wrap = styled("div")`
  margin: 25px 0 var(--sp-9);
  .download-all-button {
    justify-content: flex-end;
    align-self: flex-end;
  }
  .tab-button {
    ${mobileSmall} {
      &:nth-child(2) {
        width: 30%;
      }
      &:nth-child(3) {
        text-align: start;
      }
    }
  }
`;

const BlitzTypeTabs = ({ tabs, onChangeTab, activeTab, children }) => {
  return (
    <Wrap>
      <Tabs $left>
        {tabs.map((t, i) => (
          <button
            key={`${t.value}_${i}`}
            className={"tab-button" + (activeTab === t.value ? " active" : "")}
            onClick={() => onChangeTab(t.value)}
          >
            {t.label}
          </button>
        ))}
        {children}
      </Tabs>
    </Wrap>
  );
};

export default BlitzTypeTabs;
