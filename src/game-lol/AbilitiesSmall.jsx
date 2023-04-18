import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "goober";

import { tablet, tabletMedium } from "clutch";

import SkillOrder from "@/game-lol/SkillOrder.jsx";
import SkillOrderTree from "@/game-lol/SkillOrderTree.jsx";

const ProbuildContainer = styled("div")`
  display: flex;
  flex-direction: column;

  ${tablet} {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  ${tabletMedium} {
    flex-direction: column;
    justify-content: flex-start;
  }

  .skill-order-container {
    margin-bottom: var(--sp-4);
    ${tablet} {
      flex-direction: column;
      margin-bottom: 0;
    }

    ${tabletMedium} {
      margin-bottom: var(--sp-4);
      display: block;
    }
  }

  .skill-order-content {
    width: 40%;
    ${tablet} {
      width: 100%;
    }
  }
`;

const SkillOrderTreeContainer = styled("div")`
  display: flex;
  flex-direction: row;
  margin-right: ${(props) => (props.$hasMargin ? "var(--sp-6)" : "0")};

  ${tabletMedium} {
    position: relative;
    margin-right: 0;
    height: 96px;

    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SkillOrderContainer = styled("div")`
  display: flex;
  flex-direction: row;
  margin-top: ${(props) => (props.$isLiveGame ? "16px" : "0px")};

  ${tablet} {
    margin-bottom: var(--sp-2);
    flex-direction: column-reverse;
  }
`;

const AbilityContainer = styled("div")`
  display: flex;
  flex-wrap: unset;
  flex-direction: ${(props) => (props.$isLiveGame ? "column" : "row")};

  ${tablet} {
    flex-wrap: ${(props) => (props.$isLiveGame ? "wrap-reverse" : "unset")};
    flex-direction: ${(props) =>
      props.$isLiveGame ? "column" : "column-reverse"};
  }
`;

export const Abilities = ({
  champion,
  skills,
  championStats,
  showSkillOrder,
  isLiveGame,
  probuildsTab,
  ...restProps
}) => {
  const { t } = useTranslation();

  // Sanity check
  if (!champion?.id || !champion?.name || !champion?.spells) return null;

  let evolutionOrder = null;
  while (skills.length < 18) skills.push(0);
  // blitzMessage(messages.SET_GAME_SKILL, [champion.name, skills]);

  // Kha"Zix & Viktor
  if (
    championStats?.stats?.evolutions?.build &&
    (champion.id === 112 || champion.id === 121)
  ) {
    evolutionOrder = championStats.stats.evolutions.build.slice().splice(0, 3);
  }

  // Aphelios
  const isAphelios = champion.id === 523;

  if (probuildsTab) {
    return (
      <ProbuildContainer>
        <div className="flex skill-order-container">
          <div className="flex skill-order-content">
            <SkillOrder
              order={skills}
              title={t("lol:builds.skillOrder", "Skill Order")}
            />
            {evolutionOrder && (
              <SkillOrder
                order={evolutionOrder}
                title={
                  champion.id === 112
                    ? `${t("lol:abilities.upgradeOrder", "Upgrade Order")}`
                    : `${t("lol:abilities.evolutionOrder", "Evolution Order")}`
                }
              />
            )}
          </div>
        </div>

        <SkillOrderTreeContainer $hasMargin={true}>
          <SkillOrderTree champion={champion} skills={skills} />
        </SkillOrderTreeContainer>
      </ProbuildContainer>
    );
  }
  return (
    <AbilityContainer $isLiveGame={!!isLiveGame} {...restProps}>
      <SkillOrderTreeContainer $hasMargin={showSkillOrder || evolutionOrder}>
        <SkillOrderTree champion={champion} skills={skills} />
      </SkillOrderTreeContainer>
      {(showSkillOrder || evolutionOrder) && (
        <SkillOrderContainer $isLiveGame={isLiveGame}>
          {showSkillOrder && !isAphelios && (
            <SkillOrder
              order={skills}
              title={t("lol:builds.skillOrder", "Skill Order")}
            />
          )}
          {evolutionOrder && !isAphelios && (
            <SkillOrder
              order={evolutionOrder}
              title={
                champion.id === 112
                  ? `${t("lol:abilities.upgradeOrder", "Upgrade Order")}`
                  : `${t("lol:abilities.evolutionOrder", "Evolution Order")}`
              }
            />
          )}
        </SkillOrderContainer>
      )}
    </AbilityContainer>
  );
};

export default memo(Abilities);
