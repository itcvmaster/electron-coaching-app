import React from "react";
import { styled } from "goober";

import { useRoute } from "@/util/router-hooks.mjs";

const TabNavigation = ({ tabs, tabKey }) => {
  const { currentPath } = useRoute();

  return (
    <Container>
      {tabs.map((tab, index) => (
        <TabItem
          key={index}
          href={currentPath.replace(`/${tabKey}`, `/${tab.key}`)}
        >
          <TabTitle className="type-form--tab" $selected={tab.key === tabKey}>
            {tab.title}
          </TabTitle>
          <TabIndicator $selected={tab.key === tabKey} />
        </TabItem>
      ))}
    </Container>
  );
};

export default TabNavigation;

const Container = styled("div")`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: var(--sp-11);
  border-bottom: 1px solid var(--shade6);
`;

const TabItem = styled("a")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: var(--sp-6);
  cursor: pointer;
`;

const TabIndicator = styled("div")`
  width: var(--sp-6);
  height: var(--br-sm);
  background: ${({ $selected }) =>
    $selected ? "var(--primary)" : "transparent"};
  border-radius: var(--br-sm) var(--br-sm) 0px 0px;
`;

const TabTitle = styled("div")`
  text-align: center;
  color: ${({ $selected }) => ($selected ? "var(--shade0)" : "var(--shade2)")};
  margin-bottom: var(--sp-3);
`;
