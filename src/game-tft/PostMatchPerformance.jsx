import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css, styled } from "goober";

import PostMatchPerformanceCoin from "@/game-tft/PostMatchPerformanceCoin.jsx";
import PostMatchPerformanceItemScore from "@/game-tft/PostMatchPerformanceItemScore.jsx";
import PostMatchProNoData from "@/game-tft/PostMatchProNoData.jsx";
import useMatch from "@/game-tft/use-match.mjs";
import LoadingSpinner from "@/inline-assets/loading-spinner-red.svg";
import ErrorComponent from "@/shared/ErrorComponent.jsx";
import {
  LoadingContainer,
  TabContainer,
} from "@/shared/InfiniteTable.style.jsx";

// Enums
const TAB_NAVIGATION = {
  item: "item",
  gold: "gold",
};

function PostMatchPerformance() {
  // Hooks
  const { t } = useTranslation();
  const currentMatch = useMatch();
  const [tab, setTab] = useState(TAB_NAVIGATION.item);
  const SelectedComponent = useMemo(() => {
    return (
      {
        [TAB_NAVIGATION.item]: PostMatchPerformanceItemScore,
        [TAB_NAVIGATION.gold]: PostMatchPerformanceCoin,
      }[tab] || null
    );
  }, [tab]);
  if (!currentMatch) {
    return (
      <TabContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </TabContainer>
    );
  }
  if (currentMatch instanceof Error) return <ErrorComponent />;
  const performance = currentMatch.extra.Performance;
  const itemScore = performance.itemScore.score;
  if (itemScore === 0) {
    return <PostMatchProNoData />;
  }
  const goldOnDeath = performance.goldOnDeath.goldOnDeath;
  const tabs = [
    {
      key: TAB_NAVIGATION.item,
      title: t("tft:postmatchInsights.itemScore", "Item Score"),
      value: Math.round(itemScore),
    },
    {
      key: TAB_NAVIGATION.gold,
      title: t("tft:postmatchInsights.goldOnDeath", "Gold on Death"),
      value: Math.floor(goldOnDeath),
    },
  ];
  const handleOnSelectTab = (tab) => () => {
    setTab(tab);
  };
  return (
    <div>
      <PerformanceTabs>
        {tabs.map(({ key, title, value }) => (
          <button
            key={key}
            className={tab === key ? SelectedTab : Tab}
            onClick={handleOnSelectTab(key)}
          >
            <h2>{value}</h2>
            <span>{title}</span>
          </button>
        ))}
      </PerformanceTabs>
      <SelectedComponent />
    </div>
  );
}

export default PostMatchPerformance;

const SelectedTab = css`
  background: linear-gradient(
    to bottom,
    hsla(var(--turq-hsl) / 0.15),
    var(--shade8)
  );
`;

const Tab = css`
  background: var(--shade8);
`;

const PerformanceTabs = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  button {
    height: 8rem;
    padding: 0 2rem;
    border-radius: var(--br-xl) var(--br-xl) 0 0;
    text-align: left;
  }

  h2 {
    font-size: var(--sp-9);
  }

  button span {
    color: var(--shade1);
    font-size: var(--sp-4);
    font-weight: bold;
  }

  button:hover:not(${SelectedTab}) {
    background: var(--shade7);
  }
`;
